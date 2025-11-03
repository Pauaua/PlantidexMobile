import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DetalleEspeciesPage } from './detalle-especies.page';

const routes: Routes = [
  {
    path: '',
    component: DetalleEspeciesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetalleEspeciesPageRoutingModule {}
