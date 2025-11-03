import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListaEspeciesPage } from './lista-especies.page';

const routes: Routes = [
  {
    path: '',
    component: ListaEspeciesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListaEspeciesPageRoutingModule {}
