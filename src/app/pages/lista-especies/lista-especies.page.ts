import { Component, OnInit, OnDestroy } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { EspeciesService, Especie } from '../../services/especies.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-lista-especies',
  templateUrl: './lista-especies.page.html',
  styleUrls: ['./lista-especies.page.scss'],
  standalone: false,
})
export class ListaEspeciesPage implements OnInit, OnDestroy {
  especies: Especie[] = [];
    usuarioActual: any;
  private sub?: Subscription;
  private apiSub?: Subscription;

  constructor(private alertController: AlertController, private especiesService: EspeciesService) { }

  ngOnInit() {
      // Obtener usuario actual
      const usuarioStr = localStorage.getItem('currentUser');
      this.usuarioActual = usuarioStr ? JSON.parse(usuarioStr) : null;
    // Mostrar especies almacenadas localmente y actualizar en tiempo real
      this.sub = this.especiesService.especies$.subscribe(especies => {
        if (this.usuarioActual?.rol === 'admin') {
          this.especies = especies;
        } else {
          this.especies = especies.filter(e => e.aprobada);
        }
    });
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }

  getIconoTipo(tipo?: string): string {
    const t = tipo ? tipo.toLowerCase() : '';
    switch (t) {
      case 'árbol':
        return 'leaf';
      case 'arbusto':
        return 'flower';
      case 'hierba':
        return 'nutrition';
      default:
        return 'leaf';
    }
  }

  getColorEstado(estado?: string): string {
    const e = estado ? estado.toLowerCase() : '';
    switch (e) {
      case 'extinto':
      case 'extinto en estado silvestre':
        return 'danger';
      case 'en peligro':
      case 'en peligro crítico':
        return 'warning';
      case 'vulnerable':
        return 'tertiary';
      case 'casi amenazado':
        return 'primary';
      default:
        return 'success';
    }
  }

  async confirmarEliminacion(id: string, event: Event) {
    event.preventDefault();
    event.stopPropagation();

    const alert = await this.alertController.create({
      header: '¿Eliminar especie?',
      message: '¿Estás seguro de que quieres eliminar esta especie? Esta acción no se puede deshacer.',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: () => {
            this.eliminarEspecie(id);
          }
        }
      ]
    });

    await alert.present();
  }

  eliminarEspecie(id: string) {
    // Llamar al servicio para eliminar
    this.especiesService.remove(id);
  }
}