import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListaEspeciesUsuarioPage } from './lista-especies-usuario.page';

const routes: Routes = [
  {
    path: '',
    component: ListaEspeciesUsuarioPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListaEspeciesUsuarioPageRoutingModule {}
