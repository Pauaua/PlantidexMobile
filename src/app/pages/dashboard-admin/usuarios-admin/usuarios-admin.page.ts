import { Component, OnInit } from '@angular/core';
import { ModalController, IonicModule } from '@ionic/angular';
import { AuthService, User } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { ModalFormPage } from 'src/app/components/modals/modal-form.page';
import { ModalConfirmPage } from 'src/app/components/modals/modal-confirm.page';
import { Router } from '@angular/router';

@Component({
  selector: 'app-usuarios-admin',
  templateUrl: './usuarios-admin.page.html',
  styleUrls: ['./usuarios-admin.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class UsuariosAdminPage implements OnInit {
  usuarios: User[] = [];

  constructor(private authService: AuthService, private modalCtrl: ModalController, private router: Router) {}
  volverDashboard() {
    this.router.navigate(['/dashboard-admin']);
  }
  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
  ngOnInit() {
    this.cargarUsuarios();
  }

  async cargarUsuarios() {
    this.usuarios = this.authService.getAllUsers();
  }

  async abrirEditarUsuario(usuario: User) {
    const modal = await this.modalCtrl.create({
      component: ModalFormPage,
      componentProps: { tipo: 'usuario', usuario }
    });
    const { data } = await modal.present().then(() => modal.onDidDismiss());
    if (data) {
      // Actualizar usuario
      const idx = this.usuarios.findIndex(u => u.email === usuario.email);
      if (idx > -1) {
        this.usuarios[idx] = { ...this.usuarios[idx], ...data };
        localStorage.setItem('usuarios', JSON.stringify(this.usuarios));
        this.cargarUsuarios();
      }
    }
  }

  async abrirEliminarUsuario(usuario: User) {
    const modal = await this.modalCtrl.create({
      component: ModalConfirmPage,
      componentProps: { mensaje: `¿Eliminar usuario ${usuario.nombre}?`, icono: 'trash' }
    });
    const { data } = await modal.present().then(() => modal.onDidDismiss());
    if (data) {
      // Eliminar usuario
      this.usuarios = this.usuarios.filter(u => u.email !== usuario.email);
      localStorage.setItem('usuarios', JSON.stringify(this.usuarios));
      this.cargarUsuarios();
    }
  }

  async abrirAgregarUsuario() {
    const modal = await this.modalCtrl.create({
      component: ModalFormPage,
      componentProps: { tipo: 'usuario' }
    });
    const { data } = await modal.present().then(() => modal.onDidDismiss());
    if (data) {
      // Añadir usuario
      this.usuarios.push({ ...data, id: Date.now().toString() });
      localStorage.setItem('usuarios', JSON.stringify(this.usuarios));
      this.cargarUsuarios();
    }
  }
}
