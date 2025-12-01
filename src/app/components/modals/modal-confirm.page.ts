import { Component, Input } from '@angular/core';
import { ModalController, IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal-confirm',
  templateUrl: './modal-confirm.page.html',
  styleUrls: ['./modal-confirm.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    IonicModule
  ]
})
export class ModalConfirmPage {
  @Input() mensaje: string = '';
  @Input() icono: string = 'alert';

  constructor(private modalCtrl: ModalController) {}

  cerrar() {
    this.modalCtrl.dismiss(false);
  }

  confirmar() {
    this.modalCtrl.dismiss(true);
  }
}
