import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ListaEspeciesUsuarioPage } from './lista-especies-usuario.page';
import { ListaEspeciesUsuarioPageRoutingModule } from './lista-especies-usuario-routing.module';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    ListaEspeciesUsuarioPageRoutingModule,
    ListaEspeciesUsuarioPage
  ]
})
export class ListaEspeciesUsuarioPageModule {}
