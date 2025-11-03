import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AgregarEspeciesPageRoutingModule } from './agregar-especies-routing.module';

import { AgregarEspeciesPage } from './agregar-especies.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    AgregarEspeciesPageRoutingModule
  ],
  declarations: [AgregarEspeciesPage]
})
export class AgregarEspeciesPageModule {}
