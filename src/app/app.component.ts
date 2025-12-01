import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {
  usuarioActual: any = null;
  constructor() {
    const usuarioStr = localStorage.getItem('currentUser');
    this.usuarioActual = usuarioStr ? JSON.parse(usuarioStr) : null;
  }
}

