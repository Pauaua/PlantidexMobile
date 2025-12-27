import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { EspeciesService, Especie } from '../../services/especies.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-detalle-especies',
  templateUrl: './detalle-especies.page.html',
  styleUrls: ['./detalle-especies.page.scss'],
  standalone: false,
})
export class DetalleEspeciesPage implements OnInit {
  public especie?: Especie;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private alertController: AlertController,
    private especiesService: EspeciesService,
    private authService: AuthService
  ) { }

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      const found = await this.especiesService.getById(id);
      if (found) {
        this.especie = found;
      } else {
        this.cargarEspecie(id); //
      }
    }
  }

  cargarEspecie(id: string) {
    // TODO: Implementar servicio para cargar especie
    // Por ahora, datos de ejemplo
    this.especie = {
      id: id,
      nombreComun: 'Araucaria',
      nombreCientifico: 'Araucaria araucana',
      tipo: 'Árbol',
      descripcion: 'Árbol siempreverde, de copa piramidal o aparasolada...',
      estadoConservacion: 'Vulnerable',
      ubicacion: {
        direccion: 'Parque Nacional Conguillío',
        coordenadas: {
          lat: -38.6471,
          lng: -71.7311
        }
      },
      observaciones: 'Ejemplar adulto en excelente estado',
      reportadoPor: 'Juana Pérez',
      comunidad: 'Temuco',
      fechaAvistamiento: new Date('2025-11-01').toISOString(),
      aprobada: true
    };
  }

  getColorEstado(estado?: string): string {
    if (!estado) return 'medium';
    
    switch (estado.toLowerCase()) {
      case 'extinto':
      case 'extinto en estado silvestre':
        return 'danger';
      case 'en peligro crítico':
      case 'en peligro':
        return 'warning';
      case 'vulnerable':
        return 'tertiary';
      case 'casi amenazado':
        return 'primary';
      case 'preocupación menor':
        return 'success';
      default:
        return 'medium';
    }
  }

  async editarEspecie() {
    const user = this.authService.getCurrentUser();
    if (user && this.especie && this.especie.reportadoPor === user.nombre) {
      // El usuario puede editar su propia especie
      this.router.navigate(['/agregar-especies', this.especie.id]);
    } else if (user?.rol === 'admin') {
      // El admin puede editar cualquier especie
      this.router.navigate(['/agregar-especies', this.especie?.id]);
    } else {
      // El usuario no puede editar esta especie
      const alert = await this.alertController.create({
        header: 'Acceso denegado',
        message: 'Solo puedes editar las especies que tú reportaste.',
        buttons: ['OK']
      });
      await alert.present();
    }
  }

  verEnMapa() {
  if (this.especie?.ubicacion?.coordenadas) {
      this.router.navigate(['/mapa-comunitario'], {
        queryParams: {
          lat: this.especie.ubicacion.coordenadas.lat,
          lng: this.especie.ubicacion.coordenadas.lng
        }
      });
    }
  }
}
