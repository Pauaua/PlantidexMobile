import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-dashboard-usuario',
  templateUrl: './dashboard-usuario.page.html',
  styleUrls: ['./dashboard-usuario.page.scss'],
  standalone: true,
  imports: [IonicModule, RouterModule, CommonModule]
})
export class DashboardUsuarioPage {
  nombreUsuario: string = '';

  constructor(public router: Router, private route: ActivatedRoute, private authService: AuthService) {
    const usuario = this.authService.getCurrentUser();
    this.nombreUsuario = usuario?.nombre || '';
  }

  getBackButtonDefaultHref(): string {
    // Si estamos en una subpágina del dashboard de usuario, ir al dashboard
    if (this.router.url.startsWith('/dashboard-usuario') && this.router.url !== '/dashboard-usuario') {
      return '/dashboard-usuario';
    } else {
      // Si estamos directamente en el dashboard de usuario, ir a home
      return '/home';
    }
  }
  
    
  irMisEspecies() {
    this.router.navigate(['mis-especies'], { relativeTo: this.route });
  }

  irListaEspecies() {
    this.router.navigate(['lista-especies']);
  }
  
  irAgregarEspecie() {
    this.router.navigate(['/agregar-especies']);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
