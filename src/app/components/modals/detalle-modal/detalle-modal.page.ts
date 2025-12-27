import { Component, Input } from '@angular/core';
import { ModalController, IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-detalle-modal',
  template: `
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title>{{ titulo }}</ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="cerrar()">
            <ion-icon name="close"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <div *ngIf="tipo === 'usuario' && datosUsuario" class="detalle-contenido">
        <ion-item>
          <ion-label>
            <h2>Nombre</h2>
            <p>{{ datosUsuario.nombre }}</p>
          </ion-label>
        </ion-item>
        
        <ion-item>
          <ion-label>
            <h2>Email</h2>
            <p>{{ datosUsuario.email }}</p>
          </ion-label>
        </ion-item>
        
        <ion-item>
          <ion-label>
            <h2>Rol</h2>
            <p>{{ datosUsuario.rol }}</p>
          </ion-label>
        </ion-item>
        
        <ion-item *ngIf="datosUsuario.comunidad">
          <ion-label>
            <h2>Comunidad</h2>
            <p>{{ datosUsuario.comunidad }}</p>
          </ion-label>
        </ion-item>
      </div>

      <div *ngIf="tipo === 'especie' && datosEspecie" class="detalle-contenido">
        <ion-item>
          <ion-label>
            <h2>Nombre Común</h2>
            <p>{{ datosEspecie.nombreComun }}</p>
          </ion-label>
        </ion-item>
        
        <ion-item *ngIf="datosEspecie.nombreCientifico">
          <ion-label>
            <h2>Nombre Científico</h2>
            <p>{{ datosEspecie.nombreCientifico }}</p>
          </ion-label>
        </ion-item>
        
        <ion-item *ngIf="datosEspecie.tipo">
          <ion-label>
            <h2>Tipo</h2>
            <p>{{ datosEspecie.tipo }}</p>
          </ion-label>
        </ion-item>
        
        <ion-item *ngIf="datosEspecie.descripcion">
          <ion-label>
            <h2>Descripción</h2>
            <p>{{ datosEspecie.descripcion }}</p>
          </ion-label>
        </ion-item>
        
        <ion-item *ngIf="datosEspecie.estadoConservacion">
          <ion-label>
            <h2>Estado de Conservación</h2>
            <p>{{ datosEspecie.estadoConservacion }}</p>
          </ion-label>
        </ion-item>
        
        <ion-item *ngIf="datosEspecie.estacion">
          <ion-label>
            <h2>Estación</h2>
            <p>{{ datosEspecie.estacion }}</p>
          </ion-label>
        </ion-item>
        
        <ion-item *ngIf="datosEspecie.ubicacion?.direccion">
          <ion-label>
            <h2>Dirección</h2>
            <p>{{ datosEspecie.ubicacion.direccion }}</p>
          </ion-label>
        </ion-item>
        
        <ion-item *ngIf="datosEspecie.ubicacion?.coordenadas?.lat && datosEspecie.ubicacion?.coordenadas?.lng">
          <ion-label>
            <h2>Coordenadas</h2>
            <p>{{ datosEspecie.ubicacion.coordenadas.lat }}, {{ datosEspecie.ubicacion.coordenadas.lng }}</p>
          </ion-label>
        </ion-item>
        
        <ion-item *ngIf="datosEspecie.observaciones">
          <ion-label>
            <h2>Observaciones</h2>
            <p>{{ datosEspecie.observaciones }}</p>
          </ion-label>
        </ion-item>
        
        <ion-item>
          <ion-label>
            <h2>Reportado por</h2>
            <p>{{ datosEspecie.reportadoPor }}</p>
          </ion-label>
        </ion-item>
        
        <ion-item *ngIf="datosEspecie.comunidad">
          <ion-label>
            <h2>Comunidad</h2>
            <p>{{ datosEspecie.comunidad }}</p>
          </ion-label>
        </ion-item>
        
        <ion-item>
          <ion-label>
            <h2>Fecha de Avistamiento</h2>
            <p>{{ datosEspecie.fechaAvistamiento | date }}</p>
          </ion-label>
        </ion-item>
        
        <ion-item>
          <ion-label>
            <h2>Aprobada</h2>
            <p>{{ datosEspecie.aprobada ? 'Sí' : 'No' }}</p>
          </ion-label>
        </ion-item>
      </div>
    </ion-content>
  `,
  styles: [`
    .detalle-contenido {
      padding: 16px 0;
    }
    
    ion-item {
      --padding-start: 0;
      --inner-padding-end: 0;
      margin-bottom: 8px;
    }
    
    ion-label h2 {
      font-weight: bold;
      margin-bottom: 4px;
    }
    
    ion-label p {
      margin: 0;
      color: #666;
    }
  `],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class DetalleModalPage {
  @Input() tipo: 'usuario' | 'especie' = 'usuario';
  @Input() datosUsuario: any;
  @Input() datosEspecie: any;
  
  titulo: string = '';

  constructor(private modalCtrl: ModalController) {
    this.titulo = this.tipo === 'usuario' ? 'Detalles del Usuario' : 'Detalles de la Especie';
  }

  cerrar() {
    this.modalCtrl.dismiss();
  }
}