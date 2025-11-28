import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { LoadingController, ToastController, AlertController } from '@ionic/angular';
import { EspeciesService } from '../../services/especies.service';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

interface NuevaEspecie {
  nombreComun: string;
  nombreCientifico: string;
  tipo: string;
  descripcion: string;
  estadoConservacion: string;
  ubicacion: {
    direccion: string;
    coordenadas?: {
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
    'Extinto'
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
        direccion: ['', [Validators.required, Validators.minLength(5)]],
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

  // Llena con datos de prueba (seed)
  async seedData() {
    const sample = {
      nombreComun: 'Peumo de prueba',
      nombreCientifico: 'Cryptocarya alba',
      tipo: 'Árbol',
      descripcion: 'Ejemplo de especie para pruebas',
      estadoConservacion: 'No evaluado',
      ubicacion: { direccion: 'Parque de prueba' },
      observaciones: 'Muestras de prueba',
      reportadoPor: 'Tester',
      comunidad: 'Comunidad Test',
      fechaAvistamiento: new Date().toISOString()
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
      
      const toast = await this.toastCtrl.create({
        message: 'Por favor, completa todos los campos requeridos',
        duration: 2000,
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
        // Guardar usando el servicio, incluyendo la foto
        const nuevaEspecie: Omit<import('../../services/especies.service').Especie, 'id'> = {
          ...this.especieForm.value,
          foto: this.fotoEspecie
        } as any;
        const creado = await this.especiesService.add(nuevaEspecie);
        console.log('Nueva especie creada:', creado);

        await loading.dismiss();

        const toast = await this.toastCtrl.create({
          message: '¡Especie registrada exitosamente!',
          duration: 2000,
          position: 'bottom',
          color: 'success'
        });
        await toast.present();

        this.router.navigate(['/lista-especies']);
    } catch (error) {
      await loading.dismiss();
      
      const toast = await this.toastCtrl.create({
        message: 'Error al registrar la especie. Por favor, intenta de nuevo.',
        duration: 3000,
        position: 'bottom',
        color: 'danger'
      });
      await toast.present();
    }
  }

    async tomarFoto() {
      try {
        const image = await Camera.getPhoto({
          quality: 90,
          allowEditing: false,
          resultType: CameraResultType.DataUrl,
          source: CameraSource.Camera
        });
        this.fotoEspecie = image.dataUrl;
      } catch (error) {
        const toast = await this.toastCtrl.create({
          message: 'No se pudo tomar la foto o se canceló.',
          duration: 2000,
          color: 'warning'
        });
        await toast.present();
      }
    }
}
