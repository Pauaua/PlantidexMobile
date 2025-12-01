import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EspeciesAdminPage } from './especies-admin.page';

const routes: Routes = [
  {
    path: '',
    component: EspeciesAdminPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EspeciesAdminPageRoutingModule {}
