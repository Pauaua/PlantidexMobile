import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'lista-especies',
    loadChildren: () => import('./pages/lista-especies/lista-especies.module').then( m => m.ListaEspeciesPageModule)
  },
  {
    path: 'agregar-especies',
    loadChildren: () => import('./pages/agregar-especies/agregar-especies.module').then( m => m.AgregarEspeciesPageModule)
  },
  {
    path: 'detalle-especies/:id',
    loadChildren: () => import('./pages/detalle-especies/detalle-especies.module').then( m => m.DetalleEspeciesPageModule)
  },
  {
    path: 'mapa-comunitario',
    loadChildren: () => import('./pages/mapa-comunitario/mapa-comunitario.module').then( m => m.MapaComunitarioPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'registro',
    loadChildren: () => import('./pages/registro/registro.module').then( m => m.RegistroPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
