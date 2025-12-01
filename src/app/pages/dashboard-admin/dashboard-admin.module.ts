import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { DashboardAdminPage } from './dashboard-admin.page';
import { DashboardAdminPageRoutingModule } from './dashboard-admin-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DashboardAdminPageRoutingModule
  ]
})
export class DashboardAdminPageModule {}
