import { Component, OnInit } from '@angular/core';
import { EspeciesService, Especie } from 'src/app/services/especies.service';
import { AuthService } from 'src/app/services/auth.service';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mis-especies',
  templateUrl: './mis-especies.page.html',
  styleUrls: ['./mis-especies.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class MisEspeciesPage implements OnInit {
  especies: Especie[] = [];
  usuarioNombre: string = '';

  constructor(private especiesService: EspeciesService, private authService: AuthService, private router: Router) {}

  ngOnInit() {
    const usuario = this.authService.getCurrentUser();
    this.usuarioNombre = usuario?.nombre || '';
    this.especiesService.especies$.subscribe(especies => {
      this.especies = especies.filter(e => e.reportadoPor === this.usuarioNombre);
    });
  }

  editar(especie: Especie) {
    // Aquí puedes abrir un modal o navegar a la edición
    // Por ejemplo: this.router.navigate(['/editar-especie', especie.id]);
  }

  eliminar(especie: Especie) {
    // Aquí puedes abrir un modal de confirmación y luego eliminar
    this.especiesService.remove(especie.id);
  }

  irAgregarEspecie() {
    this.router.navigate(['/agregar-especies']);
  }

  volverDashboard() {
    this.router.navigate(['/dashboard-usuario']);
  }
}
