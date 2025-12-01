import { Component, OnInit } from '@angular/core';
import { EspeciesService, Especie } from 'src/app/services/especies.service';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-lista-especies-usuario',
  templateUrl: './lista-especies-usuario.page.html',
  styleUrls: ['./lista-especies-usuario.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class ListaEspeciesUsuarioPage implements OnInit {
  especies: Especie[] = [];

  constructor(private especiesService: EspeciesService) {}

  ngOnInit() {
    this.especies = this.especiesService.getAll().filter(e => e.aprobada);
  }
}
