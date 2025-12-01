import { Component, Input, OnInit } from '@angular/core';
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
        aprobada: [this.especie?.aprobada || false]
      });
    }
  }

  cerrar() {
    this.modalCtrl.dismiss();
  }

  guardar() {
    if (this.form.valid) {
      this.modalCtrl.dismiss(this.form.value);
    }
  }
}
