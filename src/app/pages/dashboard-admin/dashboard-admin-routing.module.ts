import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardAdminPage } from './dashboard-admin.page';

const routes: Routes = [
  {
    path: '',
    component: DashboardAdminPage
  },
  {
    path: 'usuarios',
    loadChildren: () => import('./usuarios-admin/usuarios-admin.module').then(m => m.UsuariosAdminPageModule)
  },
  {
    path: 'especies',
    loadChildren: () => import('./especies-admin/especies-admin.module').then(m => m.EspeciesAdminPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardAdminPageRoutingModule {}
