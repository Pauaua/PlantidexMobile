import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IonInput, LoadingController, ToastController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false,
})
export class LoginPage implements OnInit {
  @ViewChild('email') emailInput!: IonInput;
  @ViewChild('password') passwordInput!: IonInput;
  
  loginForm: FormGroup;
  emailInvalido = false;
  passwordVacio = false;
  showPassword = false;
  isLoading = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private fb: FormBuilder
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit() {
    // Suscribirse al estado de carga
    this.authService.isLoading$.subscribe(
      isLoading => this.isLoading = isLoading
    );

    // Validación en tiempo real
    this.loginForm.get('email')?.valueChanges.subscribe(() => {
      const control = this.loginForm.get('email');
      this.emailInvalido = control ? (control.invalid && control.touched) : false;
    });

    this.loginForm.get('password')?.valueChanges.subscribe(() => {
      const control = this.loginForm.get('password');
      this.passwordVacio = control ? (control.invalid && control.touched) : false;
    });
  }

  async onLogin() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const loading = await this.loadingCtrl.create({
      message: 'Iniciando sesión...',
      spinner: 'circular',
    });
    await loading.present();

    try {
      const { email, password } = this.loginForm.value;
      await this.authService.login(email, password).toPromise();
      
      await loading.dismiss();
      
      const toast = await this.toastCtrl.create({
        message: '¡Bienvenido de vuelta!',
        duration: 2000,
        position: 'bottom',
        color: 'success'
      });
      await toast.present();

      this.router.navigate(['/home']);
    } catch (error) {
      await loading.dismiss();
      
      const toast = await this.toastCtrl.create({
        message: 'Error al iniciar sesión. Por favor, intenta de nuevo.',
        duration: 3000,
        position: 'bottom',
        color: 'danger'
      });
      await toast.present();
    }
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
    this.passwordInput.type = this.showPassword ? 'text' : 'password';
  }
}
