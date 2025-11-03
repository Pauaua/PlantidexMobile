import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetalleEspeciesPageRoutingModule } from './detalle-especies-routing.module';

import { DetalleEspeciesPage } from './detalle-especies.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetalleEspeciesPageRoutingModule
  ],
  declarations: [DetalleEspeciesPage]
})
export class DetalleEspeciesPageModule {}
