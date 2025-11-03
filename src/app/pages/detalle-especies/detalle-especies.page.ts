import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { EspeciesService, Especie } from '../../services/especies.service';

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
    private especiesService: EspeciesService
  ) { }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      const found = this.especiesService.getById(id);
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
  fechaAvistamiento: new Date('2025-11-01').toISOString()
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
    // TODO: Implementar edición de especie
    const alert = await this.alertController.create({
      header: 'Función en desarrollo',
      message: 'La edición de especies estará disponible próximamente.',
      buttons: ['OK']
    });
    await alert.present();
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
