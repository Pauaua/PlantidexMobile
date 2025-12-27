import { Component, OnInit } from '@angular/core';
import { EspeciesService, Especie } from 'src/app/services/especies.service';
import { AuthService } from 'src/app/services/auth.service';
import { IonicModule, ModalController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mis-especies',
  templateUrl: './mis-especies.page.html',
  styleUrls: ['./mis-especies.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class MisEspeciesPage implements OnInit {
  especies: Especie[] = [];
  usuarioNombre: string = '';

  constructor(
    private especiesService: EspeciesService,
    private authService: AuthService,
    private router: Router,
    private modalCtrl: ModalController
  ) {}

  ngOnInit() {
    const usuario = this.authService.getCurrentUser();
    this.usuarioNombre = usuario?.nombre || '';
    this.especiesService.especies$.subscribe(especies => {
      this.especies = especies.filter(e => e.reportadoPor === this.usuarioNombre);
    });
  }

  editar(especie: Especie) {
    this.router.navigate(['/agregar-especies', especie.id]);
  }

  eliminar(especie: Especie) {
    // Aquí puedes abrir un modal de confirmación y luego eliminar
    this.especiesService.remove(especie.id);
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

  volverDashboard() {
    this.router.navigate(['/dashboard-usuario']);
  }
}
