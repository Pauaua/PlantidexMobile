import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IonInput, LoadingController, ToastController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
  standalone: false,
})
export class RegistroPage implements OnInit {
  @ViewChild('nombre') nombreInput!: IonInput;
  @ViewChild('localidad') localidadInput!: IonInput;
  @ViewChild('email') emailInput!: IonInput;
  @ViewChild('password') passwordInput!: IonInput;
  @ViewChild('confirmPassword') confirmPasswordInput!: IonInput;

  registroForm: FormGroup;
  roles = [
    { label: 'Usuario', value: 'usuario' },
    { label: 'Admin', value: 'admin' }
  ];
  nombreVacio = false;
  localidadVacia = false;
  emailInvalido = false;
  passwordCorto = false;
  passwordsNoCoinciden = false;
  showPassword = false;
  showConfirmPassword = false;
  isLoading = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private fb: FormBuilder
  ) {
    this.registroForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      localidad: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      rol: ['usuario', [Validators.required]]
    }, { validator: this.passwordMatchValidator });
  }

  ngOnInit() {
    // Suscribirse al estado de carga
    this.authService.isLoading$.subscribe(
      isLoading => this.isLoading = isLoading
    );

    // Validación en tiempo real
    this.registroForm.get('nombre')?.valueChanges.subscribe(() => {
      const control = this.registroForm.get('nombre');
      this.nombreVacio = control ? (control.invalid && control.touched) : false;
    });

    this.registroForm.get('localidad')?.valueChanges.subscribe(() => {
      const control = this.registroForm.get('localidad');
      this.localidadVacia = control ? (control.invalid && control.touched) : false;
    });

    this.registroForm.get('email')?.valueChanges.subscribe(() => {
      const control = this.registroForm.get('email');
      this.emailInvalido = control ? (control.invalid && control.touched) : false;
    });

    this.registroForm.get('password')?.valueChanges.subscribe(() => {
      const control = this.registroForm.get('password');
      this.passwordCorto = control ? (control.errors?.['minlength'] && control.touched) : false;
    });

    this.registroForm.valueChanges.subscribe(() => {
      const confirmControl = this.registroForm.get('confirmPassword');
      this.passwordsNoCoinciden = confirmControl ? 
        (this.registroForm.hasError('passwordMismatch') && confirmControl.touched) : false;
    });
  }

  // Mensaje dinámico para cada control
  getValidationMessage(controlName: string) {
    const control = this.registroForm.get(controlName);
    if (!control || !control.errors) return '';
    if (control.errors['required']) return 'Este campo es obligatorio';
    if (control.errors['minlength']) {
      const req = control.errors['minlength'].requiredLength;
      return `Mínimo ${req} caracteres`;
    }
    if (control.errors['email']) return 'Formato de email inválido';
    return 'Campo inválido';
  }

  getConfirmPasswordMessage() {
    const control = this.registroForm.get('confirmPassword');
    if (!control) return '';
    if (control.errors && control.errors['required']) return 'Este campo es obligatorio';
    if (this.registroForm.hasError('passwordMismatch') && control.touched) return 'Las contraseñas no coinciden';
    return '';
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('password')?.value === g.get('confirmPassword')?.value
      ? null : { 'passwordMismatch': true };
  }

  async onRegistro() {
    if (this.registroForm.invalid) {
      this.registroForm.markAllAsTouched();
      console.log('Formulario inválido:', this.registroForm.value);
      const toast = await this.toastCtrl.create({
        message: 'Por favor, corrige los errores en el formulario',
        duration: 2000,
        position: 'bottom',
        color: 'warning'
      });
      await toast.present();
      return;
    }

    const loading = await this.loadingCtrl.create({
      message: 'Creando cuenta...',
      spinner: 'circular',
    });
    await loading.present();

    try {
      const formValue = this.registroForm.value;
      console.log('Enviando registro:', formValue);
      const result = await this.authService.registro({
        nombre: formValue.nombre,
        email: formValue.email,
        password: formValue.password,
        comunidad: formValue.localidad,
        rol: formValue.rol as 'usuario' | 'admin'
      }).toPromise();
      console.log('Resultado registro:', result);
      await loading.dismiss();
      const toast = await this.toastCtrl.create({
        message: '¡Cuenta creada exitosamente!',
        duration: 2000,
        position: 'bottom',
        color: 'success'
      });
      await toast.present();
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Error en registro:', error);
      await loading.dismiss();
      const toast = await this.toastCtrl.create({
        message: 'Error al crear la cuenta. Por favor, intenta de nuevo.',
        duration: 3000,
        position: 'bottom',
        color: 'danger'
      });
      await toast.present();
    }
  }

  togglePassword(field: 'password' | 'confirm') {
    if (field === 'password') {
      this.showPassword = !this.showPassword;
      this.passwordInput.type = this.showPassword ? 'text' : 'password';
    } else {
      this.showConfirmPassword = !this.showConfirmPassword;
      this.confirmPasswordInput.type = this.showConfirmPassword ? 'text' : 'password';
    }
  }
}
