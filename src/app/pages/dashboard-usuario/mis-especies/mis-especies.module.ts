import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { MisEspeciesPage } from './mis-especies.page';
import { MisEspeciesPageRoutingModule } from './mis-especies-routing.module';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    MisEspeciesPageRoutingModule,
    MisEspeciesPage
  ]
})
export class MisEspeciesPageModule {}
