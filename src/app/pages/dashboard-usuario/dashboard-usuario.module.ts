import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { DashboardUsuarioPageRoutingModule } from './dashboard-usuario-routing.module';
import { DashboardUsuarioPage } from './dashboard-usuario.page';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    DashboardUsuarioPageRoutingModule,
    DashboardUsuarioPage
  ]
})
export class DashboardUsuarioPageModule {}
