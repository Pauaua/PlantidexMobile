import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { LoadingController, ToastController, AlertController } from '@ionic/angular';
import { EspeciesService } from '../../services/especies.service';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Geolocation } from '@capacitor/geolocation';


interface NuevaEspecie {
  nombreComun: string;
  nombreCientifico: string;
  tipo: string;
  descripcion: string;
  estadoConservacion: string;
    ubicacion: {
      direccion: string;
      coordenadas: {
        lat: number;
        lng: number;
      };
    };
  observaciones?: string;
  reportadoPor: string;
  comunidad: string;
  fechaAvistamiento: Date;
}

import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-agregar-especies',
  templateUrl: './agregar-especies.page.html',
  styleUrls: ['./agregar-especies.page.scss'],
  standalone: false,
})
export class AgregarEspeciesPage implements OnInit {
  public especieForm: FormGroup;
  public nombreVacio = false;
  public descripcionVacia = false;
  public ubicacionVacia = false;
  public isLoading = false;
  public isEditMode = false;
  public especieId?: string;

  fotoEspecie?: string;
  ubicacionActual?: { lat: number, lng: number };

  tiposEspecie = [
    'Árbol',
    'Arbusto',
    'Hierba',
    'Enredadera',
    'Suculenta',
    'Helecho',
    'Otro'
  ];

  estadosConservacion = [
    'No evaluado',
    'Datos insuficientes',
    'Preocupación menor',
    'Casi amenazado',
    'Vulnerable',
    'En peligro',
    'En peligro crítico',
    'Extinto en estado silvestre',
    'Extinto',
    'No lo sé'
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,
    private especiesService: EspeciesService,
    private authService: AuthService,
    private route: ActivatedRoute
  ) {
      this.especieForm = this.fb.group({
        nombreComun: ['', [Validators.required, Validators.minLength(3)]],
        nombreCientifico: ['', [Validators.pattern('^[A-Za-zÁÉÍÓÚáéíóúñÑüÜ\\s\\-\\.]+$')]],
        tipo: ['Árbol', [Validators.required]],
        descripcion: ['', [Validators.required, Validators.minLength(10)]],
        estadoConservacion: ['No evaluado', [Validators.required]],
        estacion: [''],
        ubicacion: this.fb.group({
          direccion: ['', [Validators.minLength(5)]],
          coordenadas: this.fb.group({
            lat: [null],
            lng: [null]
          })
        }),
        observaciones: [''],
        reportadoPor: ['Usuario Actual', [Validators.required]],
        comunidad: ['Mi Comunidad', [Validators.required]],
        fechaAvistamiento: [new Date().toISOString()]
      });

    // Si hay un usuario autenticado, poblar campos por defecto
    const user = this.authService.getCurrentUser && this.authService.getCurrentUser();
    if (user) {
      this.especieForm.patchValue({
        reportadoPor: user.nombre || this.especieForm.value.reportadoPor,
        comunidad: user.comunidad || this.especieForm.value.comunidad
      });
    }
  }

  // helper para template
  isInvalid(controlName: string) {
    const c = this.especieForm.get(controlName);
    return !!(c && c.invalid && c.touched);
  }

  // Mensaje dinámico de error para el control
  getValidationMessage(controlPath: string) {
    const control = this.especieForm.get(controlPath);
    if (!control || !control.errors) return '';
    if (control.errors['required']) return 'Este campo es obligatorio';
    if (control.errors['minlength']) {
      const req = control.errors['minlength'].requiredLength;
      return `Mínimo ${req} caracteres`;
    }
    if (control.errors['pattern']) return 'Formato inválido';
    return 'Campo inválido';
  }

  // Datos de prueba (seed)
  async seedData() {
    const sample = {
      nombreComun: 'Peumo de prueba',
      nombreCientifico: 'Cryptocarya alba',
      tipo: 'Árbol',
      descripcion: 'Ejemplo de especie para pruebas',
      estadoConservacion: 'No evaluado',
      ubicacion: {
        direccion: 'Parque de prueba',
        coordenadas: {
          lat: -33.4372,
          lng: -70.6506
        }
      },
      observaciones: 'Muestras de prueba',
      reportadoPor: 'Tester',
      comunidad: 'Comunidad Test',
      fechaAvistamiento: new Date().toISOString(),
      foto: this.fotoEspecie
    } as any;

    const loading = await this.loadingCtrl.create({ message: 'Insertando datos de prueba...' });
    await loading.present();
    await this.especiesService.add(sample);
    await loading.dismiss();

    const toast = await this.toastCtrl.create({ message: 'Datos de prueba añadidos', duration: 1500 });
    await toast.present();
    this.router.navigate(['/lista-especies']);
  }

  async showStorageContents() {
    const list = await this.especiesService.getAll();
    const alert = await this.alertCtrl.create({ header: 'Contenido Storage', message: `<pre style="text-align:left">${JSON.stringify(list, null, 2)}</pre>`, cssClass: 'storage-alert', buttons: ['OK'] });
    await alert.present();
  }

  ngOnInit() {
    // Verificar si estamos en modo edición
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.isEditMode = true;
        this.especieId = id;
        this.cargarEspecieParaEdicion(id);
      }
    });

    // Validación en tiempo real
    this.especieForm.get('nombreComun')?.valueChanges.subscribe(() => {
      const control = this.especieForm.get('nombreComun');
      this.nombreVacio = control ? (control.invalid && control.touched) : false;
    });

    this.especieForm.get('descripcion')?.valueChanges.subscribe(() => {
      const control = this.especieForm.get('descripcion');
      this.descripcionVacia = control ? (control.invalid && control.touched) : false;
    });
  }

  async cargarEspecieParaEdicion(id: string) {
    const especie = await this.especiesService.getById(id);
    if (especie) {
      this.especieForm.patchValue({
        nombreComun: especie.nombreComun,
        nombreCientifico: especie.nombreCientifico,
        tipo: especie.tipo || 'Árbol',
        descripcion: especie.descripcion,
        estadoConservacion: especie.estadoConservacion || 'No evaluado',
        estacion: especie['estacion'] || '',
        ubicacion: {
          direccion: especie.ubicacion?.direccion || '',
          coordenadas: {
            lat: especie.ubicacion?.coordenadas?.lat || null,
            lng: especie.ubicacion?.coordenadas?.lng || null
          }
        },
        observaciones: especie.observaciones || '',
        reportadoPor: especie.reportadoPor,
        comunidad: especie.comunidad || '',
        fechaAvistamiento: especie.fechaAvistamiento || new Date().toISOString()
      });

      this.fotoEspecie = especie.foto;
    }
  }

  async onSubmit() {
    if (this.especieForm.invalid) {
      this.especieForm.markAllAsTouched();
      let mensaje = 'Por favor, completa los campos obligatorios:';
      if (this.especieForm.get('nombreComun')?.invalid) mensaje += '\n- Nombre común';
      if (this.especieForm.get('tipo')?.invalid) mensaje += '\n- Tipo de especie';
      if (this.especieForm.get('descripcion')?.invalid) mensaje += '\n- Descripción';
      // Opcional: puedes mostrar advertencia si falta ubicación o imagen
      if (!this.fotoEspecie) mensaje += '\n(La imagen es opcional)';
      if (!this.especieForm.get('ubicacion.direccion')?.value || !this.especieForm.get('ubicacion.coordenadas.lat')?.value) mensaje += '\n(La ubicación es opcional)';
      const toast = await this.toastCtrl.create({
        message: mensaje,
        duration: 3000,
        position: 'bottom',
        color: 'warning'
      });
      await toast.present();
      return;
    }

    const loading = await this.loadingCtrl.create({
      message: this.isEditMode ? 'Actualizando especie...' : 'Guardando especie...',
      spinner: 'circular',
    });
    await loading.present();

    try {
      // Asegurar que el nombre del usuario actual se use en reportadoPor
      const user = this.authService.getCurrentUser && this.authService.getCurrentUser();
      const especieFormValue = { ...this.especieForm.value };
      if (user) {
        especieFormValue.reportadoPor = user.nombre;
        especieFormValue.comunidad = user.comunidad || especieFormValue.comunidad;
      }

      if (this.isEditMode && this.especieId) {
        // Modo edición - actualizar la especie existente
        const especieActualizada: Partial<import('../../services/especies.service').Especie> = {
          ...especieFormValue
        };

        // Solo agregar foto si existe
        if (this.fotoEspecie !== undefined) {
          especieActualizada.foto = this.fotoEspecie;
        }

        // Verificar si el usuario actual es el que reportó la especie
        const especieActual = await this.especiesService.getById(this.especieId);
        if (user && especieActual && especieActual.reportadoPor === user.nombre) {
          // Si es el usuario que reportó la especie, marcar como no aprobada (requiere aprobación del admin)
          await this.especiesService.updateWithApproval(this.especieId, especieActualizada, true);
        } else {
          // Si es el admin editando, mantener el estado de aprobación
          await this.especiesService.update(this.especieId, especieActualizada);
        }

        const toast = await this.toastCtrl.create({
          message: '¡Especie actualizada exitosamente! (Requiere aprobación del administrador)',
          duration: 2000,
          position: 'bottom',
          color: 'success'
        });
        await toast.present();

        this.router.navigate(['/dashboard-usuario/mis-especies']);
      } else {
        // Modo creación - agregar nueva especie
        try {
          // Crear objeto de especie sin incluir campos undefined
          const nuevaEspecieData: Omit<import('../../services/especies.service').Especie, 'id'> = {
            ...especieFormValue
          };

          // Solo agregar foto si existe
          if (this.fotoEspecie) {
            nuevaEspecieData.foto = this.fotoEspecie;
          }

          const nuevaEspecie = nuevaEspecieData as any;
          const creado = await this.especiesService.add(nuevaEspecie);
          console.log('Nueva especie creada:', creado);

          const toast = await this.toastCtrl.create({
            message: '¡Especie plantificada exitosamente!',
            duration: 2000,
            position: 'bottom',
            color: 'success'
          });
          await toast.present();

          this.router.navigate(['/lista-especies']);
        } catch (error) {
          console.error('Error al crear especie:', error);
          const toast = await this.toastCtrl.create({
            message: 'Hubo un error al guardar la especie. Inténtalo de nuevo.',
            duration: 3000,
            position: 'bottom',
            color: 'danger'
          });
          await toast.present();
        }
      }

      await loading.dismiss();
    } catch (error) {
      await loading.dismiss();
      console.error('Error general en onSubmit:', error);
      const toast = await this.toastCtrl.create({
        message: '¡Oh no! Hubo un error al procesar la especie. Por favor, intenta de nuevo.',
        duration: 3000,
        position: 'bottom',
        color: 'danger'
      });
      await toast.present();
    }
  }

    async obtenerUbicacion() {
      try {
        // Solicitar permiso de ubicación usando el propio plugin
        const permResult = await Geolocation.requestPermissions();
        if (permResult.location !== 'granted') {
          const toast = await this.toastCtrl.create({
            message: 'Permiso de ubicación denegado. Por favor, habilítelo en la configuración de la app.',
            duration: 3000,
            color: 'danger'
          });
          await toast.present();
          return;
        }

        // Mostrar un loading mientras se obtiene la ubicación
        const loading = await this.loadingCtrl.create({
          message: 'Obteniendo ubicación...',
          spinner: 'circular',
        });
        await loading.present();

        const position = await Geolocation.getCurrentPosition({
          timeout: 10000, // 10 segundos de timeout
          enableHighAccuracy: true
        });

        await loading.dismiss();

        this.ubicacionActual = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        // Actualiza el formulario con las coordenadas obtenidas
        this.especieForm.get('ubicacion.coordenadas.lat')?.setValue(position.coords.latitude);
        this.especieForm.get('ubicacion.coordenadas.lng')?.setValue(position.coords.longitude);

        // Actualiza también la dirección si es posible
        this.especieForm.get('ubicacion.direccion')?.setValue(`${position.coords.latitude}, ${position.coords.longitude}`);

        const toast = await this.toastCtrl.create({
          message: 'Ubicación obtenida correctamente.',
          duration: 1500,
          color: 'success'
        });
        await toast.present();
      } catch (error) {
        console.error('Error obteniendo ubicación:', error);
        const toast = await this.toastCtrl.create({
          message: 'No se pudo obtener la ubicación. Asegúrate que el GPS esté activado.',
          duration: 3000,
          color: 'warning'
        });
        await toast.present();
      }
    }

    async tomarFoto() {
      try {
        // Solicitar permiso de cámara usando el propio plugin
        const permResult = await Camera.requestPermissions();
        console.log('Permisos de cámara:', permResult);

        if (permResult.camera !== 'granted' && permResult.photos !== 'granted') {
          const toast = await this.toastCtrl.create({
            message: 'Permiso de cámara y galería denegado. Por favor, habilítelo en la configuración de la app.',
            duration: 3000,
            color: 'danger'
          });
          await toast.present();
          return;
        }

        // Mostrar un loading mientras se accede a la cámara
        const loading = await this.loadingCtrl.create({
          message: 'Accediendo a la cámara...',
          spinner: 'circular',
        });
        await loading.present();

        const image = await Camera.getPhoto({
          quality: 60, // Reducir calidad para tamaño más pequeño
          allowEditing: false,
          resultType: CameraResultType.DataUrl,
          source: CameraSource.Prompt, // Permite elegir cámara o galería
          saveToGallery: true, // Guardar en galería
          correctOrientation: true // Corregir orientación
        });

        await loading.dismiss();

        this.fotoEspecie = image.dataUrl;

        const toast = await this.toastCtrl.create({
          message: 'Imagen capturada correctamente.',
          duration: 1500,
          color: 'success'
        });
        await toast.present();
      } catch (error) {
        console.error('Error tomando foto:', error);

        // Dismiss loading si está activo
        try {
          await this.loadingCtrl.getTop().then(loading => {
            if (loading) loading.dismiss();
          });
        } catch (e) {
          // No hacer nada si no hay loading activo
        }

        let errorMessage = 'No se pudo capturar la imagen.';
        if (error instanceof Error) {
          if (error.message.includes('User cancelled photos app')) {
            errorMessage = 'Operación cancelada por el usuario.';
          } else if (error.message.includes('No image picked')) {
            errorMessage = 'No se seleccionó ninguna imagen.';
          } else {
            errorMessage = `Error: ${error.message}`;
          }
        }

        const toast = await this.toastCtrl.create({
          message: errorMessage,
          duration: 3000,
          color: 'warning'
        });
        await toast.present();
      }
    }
}
