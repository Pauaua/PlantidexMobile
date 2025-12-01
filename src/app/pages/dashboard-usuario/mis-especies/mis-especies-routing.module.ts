import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MisEspeciesPage } from './mis-especies.page';

const routes: Routes = [
  {
    path: '',
    component: MisEspeciesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MisEspeciesPageRoutingModule {}
