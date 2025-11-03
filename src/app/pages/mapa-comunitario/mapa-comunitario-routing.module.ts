import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MapaComunitarioPage } from './mapa-comunitario.page';

const routes: Routes = [
  {
    path: '',
    component: MapaComunitarioPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MapaComunitarioPageRoutingModule {}
