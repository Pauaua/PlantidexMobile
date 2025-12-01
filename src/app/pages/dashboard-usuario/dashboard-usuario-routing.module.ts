import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardUsuarioPage } from './dashboard-usuario.page';
import { AuthGuard } from 'src/app/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: DashboardUsuarioPage,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'mis-especies',
        loadChildren: () => import('./mis-especies/mis-especies.module').then(m => m.MisEspeciesPageModule)
      },
      {
        path: 'lista-especies',
        loadChildren: () => import('./lista-especies-usuario/lista-especies-usuario.module').then(m => m.ListaEspeciesUsuarioPageModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardUsuarioPageRoutingModule {}
