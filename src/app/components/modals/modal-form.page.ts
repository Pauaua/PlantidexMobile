import { Component, Input, OnInit } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { ModalController, IonicModule } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-modal-form',
  templateUrl: './modal-form.page.html',
  styleUrls: ['./modal-form.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    ReactiveFormsModule
  ]
})
export class ModalFormPage implements OnInit {
  @Input() tipo: 'usuario' | 'especie' = 'usuario';
  @Input() usuario: any;
  @Input() especie: any;
  form: FormGroup;

  constructor(private modalCtrl: ModalController, private fb: FormBuilder) {
    this.form = this.fb.group({});
  }

  ngOnInit() {
    if (this.tipo === 'usuario') {
      this.form = this.fb.group({
        nombre: [this.usuario?.nombre || '', Validators.required],
        email: [this.usuario?.email || '', [Validators.required, Validators.email]],
        password: [this.usuario?.password || '', Validators.required],
        rol: [this.usuario?.rol || 'usuario', Validators.required]
      });
    } else {
      this.form = this.fb.group({
        nombreComun: [this.especie?.nombreComun || '', Validators.required],
        reportadoPor: [this.especie?.reportadoPor || '', Validators.required],
        descripcion: [this.especie?.descripcion || '', Validators.required],
        aprobada: [this.especie?.aprobada || false],
        foto: [this.especie?.foto || ''],
        lat: [this.especie?.ubicacion?.coordenadas?.lat ?? null],
        lng: [this.especie?.ubicacion?.coordenadas?.lng ?? null]
      });
    }
  }

  cambiarFoto() {
    Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Prompt
    }).then(image => {
      this.form.get('foto')?.setValue(image.dataUrl);
    }).catch(() => {
      // Manejo de error/cancelación
    });
  }

  cerrar() {
    this.modalCtrl.dismiss();
  }

  guardar() {
    if (this.form.valid) {
      // Construir objeto especie con foto y ubicación
      const value = this.form.value;
      const especieEditada = {
        ...this.especie,
        ...value,
        foto: value.foto,
        ubicacion: {
          ...(this.especie?.ubicacion || {}),
          coordenadas: {
            lat: value.lat,
            lng: value.lng
          }
        }
      };
      this.modalCtrl.dismiss(especieEditada);
    }
  }
}
