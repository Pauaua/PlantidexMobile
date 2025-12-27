import { Component, OnInit } from '@angular/core';
import { ModalController, IonicModule, ToastController } from '@ionic/angular';
import { EspeciesService, Especie } from '../../../services/especies.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-especies-admin',
  templateUrl: './especies-admin.page.html',
  styleUrls: ['./especies-admin.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class EspeciesAdminPage implements OnInit {
  especies: Especie[] = [];

  constructor(
    private especiesService: EspeciesService,
    private modalCtrl: ModalController,
    private router: Router,
    private authService: AuthService,
    private toastCtrl: ToastController
  ) {}
  volverDashboard() {
    this.router.navigate(['/dashboard-admin']);
  }

  ngOnInit() {
    this.cargarEspecies();
  }

    logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
  async cargarEspecies() {
    this.especies = this.especiesService.getAll();
  }

  async abrirEditarEspecie(especie: Especie) {
    const modal = await this.modalCtrl.create({
      component: (await import('src/app/components/modals/modal-form.page')).ModalFormPage,
      componentProps: { tipo: 'especie', especie }
    });
    const { data } = await modal.present().then(() => modal.onDidDismiss());
    if (data) {
      // Actualizar especie
      await this.especiesService.update(especie.id, data);
      this.cargarEspecies();
    }
  }

  async abrirEliminarEspecie(especie: Especie) {
    const modal = await this.modalCtrl.create({
      component: (await import('src/app/components/modals/modal-confirm.page')).ModalConfirmPage,
      componentProps: { mensaje: `¿Eliminar especie ${especie.nombreComun}?`, icono: 'trash' }
    });
    const { data } = await modal.present().then(() => modal.onDidDismiss());
    if (data) {
      await this.especiesService.remove(especie.id);
      this.cargarEspecies();
    }
  }

  async abrirAprobarEspecie(especie: Especie) {
    const modal = await this.modalCtrl.create({
      component: (await import('src/app/components/modals/modal-confirm.page')).ModalConfirmPage,
      componentProps: { mensaje: `¿Aprobar especie ${especie.nombreComun}?`, icono: 'checkmark' }
    });
    const { data } = await modal.present().then(() => modal.onDidDismiss());
    if (data) {
      try {
        await this.especiesService.update(especie.id, { aprobada: true });
        // No es necesario esperar ni recargar manualmente, gracias a la mejora en el servicio
        this.cargarEspecies();

        // Mostrar mensaje de éxito
        const toast = await this.toastCtrl.create({
          message: 'Especie aprobada exitosamente',
          duration: 2000,
          color: 'success'
        });
        await toast.present();
      } catch (error) {
        console.error('Error al aprobar especie:', error);
        const toast = await this.toastCtrl.create({
          message: 'Error al aprobar la especie',
          duration: 2000,
          color: 'danger'
        });
        await toast.present();
      }
    }
  }

  async abrirDetalleEspecie(especie: Especie) {
    const modal = await this.modalCtrl.create({
      component: (await import('src/app/components/modals/detalle-modal/detalle-modal.page')).DetalleModalPage,
      componentProps: {
        tipo: 'especie',
        datosEspecie: especie
      }
    });
    await modal.present();
  }

  irAgregarEspecie() {
    this.router.navigate(['/agregar-especies']);
  }
}
