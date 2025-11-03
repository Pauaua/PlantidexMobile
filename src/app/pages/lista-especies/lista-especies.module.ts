import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListaEspeciesPageRoutingModule } from './lista-especies-routing.module';

import { ListaEspeciesPage } from './lista-especies.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListaEspeciesPageRoutingModule
  ],
  declarations: [ListaEspeciesPage]
})
export class ListaEspeciesPageModule {}
