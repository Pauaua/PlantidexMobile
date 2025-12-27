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
    this.authService.getAllUsers().subscribe(
      usuarios => this.usuarios = usuarios
    );
  }

  async abrirEditarUsuario(usuario: User) {
    const modal = await this.modalCtrl.create({
      component: ModalFormPage,
      componentProps: { tipo: 'usuario', usuario }
    });
    const { data } = await modal.present().then(() => modal.onDidDismiss());
    if (data) {
      // Actualizar usuario en Firestore
      try {
        // Actualizar en Firestore
        const userUpdates = { ...data };
        // Eliminar el id del objeto de actualización ya que no debe actualizarse
        delete userUpdates.id;

        // Actualizar solo los campos permitidos en Firestore
        const { id, email, ...updateData } = userUpdates;

        // Actualizar el documento de usuario en Firestore
        const { updateDoc, doc } = await import('firebase/firestore');
        const { db } = await import('../../../firebase.config');

        const userDocRef = doc(db, 'users', usuario.id);
        await updateDoc(userDocRef, updateData);

        this.cargarUsuarios();
      } catch (error) {
        console.error('Error actualizando usuario:', error);
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
      // Eliminar usuario de Firestore
      try {
        // Eliminar el documento de usuario en Firestore
        const { deleteDoc, doc } = await import('firebase/firestore');
        const { db } = await import('../../../firebase.config');

        const userDocRef = doc(db, 'users', usuario.id);
        await deleteDoc(userDocRef);

        this.cargarUsuarios();
      } catch (error) {
        console.error('Error eliminando usuario:', error);
      }
    }
  }

  async abrirDetalleUsuario(usuario: User) {
    const modal = await this.modalCtrl.create({
      component: (await import('src/app/components/modals/detalle-modal/detalle-modal.page')).DetalleModalPage,
      componentProps: {
        tipo: 'usuario',
        datosUsuario: usuario
      }
    });
    await modal.present();
  }

  async abrirAgregarUsuario() {
    const modal = await this.modalCtrl.create({
      component: ModalFormPage,
      componentProps: { tipo: 'usuario' }
    });
    const { data } = await modal.present().then(() => modal.onDidDismiss());
    if (data) {
      // Añadir usuario a Firebase
      try {
        // Crear usuario en Firebase Auth y Firestore
        const { createUserWithEmailAndPassword } = await import('firebase/auth');
        const { setDoc, doc } = await import('firebase/firestore');
        const { auth, db } = await import('../../../firebase.config');

        // Crear usuario en Firebase Auth
        const userCredential = await createUserWithEmailAndPassword(auth, data.email, 'tempPassword123');

        // Crear documento de usuario en Firestore
        const userDocRef = doc(db, 'users', userCredential.user.uid);
        const userData = {
          nombre: data.nombre,
          email: data.email,
          rol: data.rol || 'usuario',
          comunidad: data.comunidad || ''
        };

        await setDoc(userDocRef, userData);

        this.cargarUsuarios();
      } catch (error) {
        console.error('Error agregando usuario:', error);
      }
    }
  }
}
