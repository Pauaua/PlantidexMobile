import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MapaComunitarioPageRoutingModule } from './mapa-comunitario-routing.module';

import { MapaComunitarioPage } from './mapa-comunitario.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MapaComunitarioPageRoutingModule
  ],
  declarations: [MapaComunitarioPage]
})
export class MapaComunitarioPageModule {}
