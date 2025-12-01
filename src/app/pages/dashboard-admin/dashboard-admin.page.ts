import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { EspeciesService, Especie } from '../../services/especies.service';

import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard-admin',
  templateUrl: './dashboard-admin.page.html',
  styleUrls: ['./dashboard-admin.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class DashboardAdminPage implements OnInit {
  constructor(
    private especiesService: EspeciesService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {}

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  irAgregarUsuario() {
    this.router.navigate(['/registro']);
  }

  irAgregarEspecie() {
    this.router.navigate(['/agregar-especies']);
  }

  irUsuarios() {
    this.router.navigate(['/dashboard-admin/usuarios']);
  }

  irEspecies() {
    this.router.navigate(['/dashboard-admin/especies']);
  }
}
