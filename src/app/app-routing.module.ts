
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomePageModule)
  },
  {
    path: 'agregar-especies',
    loadChildren: () => import('./pages/agregar-especies/agregar-especies.module').then(m => m.AgregarEspeciesPageModule)
  },
  {
    path: 'lista-especies',
    loadChildren: () => import('./pages/lista-especies/lista-especies.module').then(m => m.ListaEspeciesPageModule)
  },
  {
    path: 'detalle-especies',
    loadChildren: () => import('./pages/detalle-especies/detalle-especies.module').then(m => m.DetalleEspeciesPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'registro',
    loadChildren: () => import('./pages/registro/registro.module').then(m => m.RegistroPageModule)
  },
  {
    path: 'mapa-comunitario',
    loadChildren: () => import('./pages/mapa-comunitario/mapa-comunitario.module').then(m => m.MapaComunitarioPageModule)
  },
  {
    path: 'dashboard-admin',
    loadChildren: () => import('./pages/dashboard-admin/dashboard-admin.module').then(m => m.DashboardAdminPageModule)
  },
  {
    path: 'dashboard-usuario',
    loadChildren: () => import('./pages/dashboard-usuario/dashboard-usuario.module').then(m => m.DashboardUsuarioPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
