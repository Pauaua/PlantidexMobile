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
    private authService: AuthService
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
      message: 'Guardando especie...',
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
      const nuevaEspecie: Omit<import('../../services/especies.service').Especie, 'id'> = {
        ...especieFormValue,
        foto: this.fotoEspecie
      } as any;
      const creado = await this.especiesService.add(nuevaEspecie);
      console.log('Nueva especie creada:', creado);

      await loading.dismiss();

      const toast = await this.toastCtrl.create({
        message: '¡Especie plantificada exitosamente!',
        duration: 2000,
        position: 'bottom',
        color: 'success'
      });
      await toast.present();

      this.router.navigate(['/lista-especies']);
    } catch (error) {
      await loading.dismiss();
      const toast = await this.toastCtrl.create({
        message: '¡Oh no! Hubo un error al registrar la especie. Por favor, intenta de nuevo.',
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
            message: 'Permiso de ubicación denegado.',
            duration: 2000,
            color: 'danger'
          });
          await toast.present();
          return;
        }
        const position = await Geolocation.getCurrentPosition();
        this.ubicacionActual = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        // Actualiza el formulario con las coordenadas obtenidas
        this.especieForm.get('ubicacion.coordenadas.lat')?.setValue(position.coords.latitude);
        this.especieForm.get('ubicacion.coordenadas.lng')?.setValue(position.coords.longitude);
        const toast = await this.toastCtrl.create({
          message: 'Ubicación obtenida correctamente.',
          duration: 1500,
          color: 'success'
        });
        await toast.present();
      } catch (error) {
        const toast = await this.toastCtrl.create({
          message: 'No se pudo obtener la ubicación.',
          duration: 2000,
          color: 'warning'
        });
        await toast.present();
      }
    }

    async tomarFoto() {
      try {
        // Solicitar permiso de cámara usando el propio plugin
        const permResult = await Camera.requestPermissions();
        if (permResult.camera !== 'granted') {
          const toast = await this.toastCtrl.create({
            message: 'Permiso de cámara denegado.',
            duration: 2000,
            color: 'danger'
          });
          await toast.present();
          return;
        }
        const image = await Camera.getPhoto({
          quality: 90,
          allowEditing: false,
          resultType: CameraResultType.DataUrl,
          source: CameraSource.Prompt // Permite elegir cámara o galería
        });
        this.fotoEspecie = image.dataUrl;
      } catch (error) {
        const toast = await this.toastCtrl.create({
          message: 'No se pudo obtener la imagen o se canceló.',
          duration: 2000,
          color: 'warning'
        });
        await toast.present();
      }
    }
}
