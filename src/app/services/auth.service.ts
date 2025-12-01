  // ...existing code...
  // Getter eliminado, usar getCurrentUser()
// ...existing code...
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, tap } from 'rxjs/operators';

export interface User {
  id: string;
  nombre: string;
  email: string;
  comunidad?: string;
  rol: 'usuario' | 'admin';
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  public isLoading$ = this.isLoadingSubject.asObservable();
  private USERS_KEY = 'usuarios';

  constructor() {
    // Recuperar usuario del localStorage si existe
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      this.currentUserSubject.next(JSON.parse(savedUser));
    }
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('currentUser');
  }

  login(email: string, password: string): Observable<User> {
    this.isLoadingSubject.next(true);
    // Buscar usuario en localStorage
    const users = this.getAllUsers();
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) {
      this.isLoadingSubject.next(false);
      return of(null as any).pipe(delay(500));
    }
    localStorage.setItem('currentUser', JSON.stringify(user));
    this.currentUserSubject.next(user);
    this.isLoadingSubject.next(false);
    return of(user).pipe(delay(500));
  }

  getAllUsers(): User[] {
    const users = localStorage.getItem(this.USERS_KEY);
    return users ? JSON.parse(users) : [];
  }

  addUser(user: User): void {
    const users = this.getAllUsers();
    users.push(user);
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
  }

  registro(userData: {
    nombre: string;
    email: string;
    password: string;
    comunidad?: string;
    rol?: 'usuario' | 'admin';
  }): Observable<User> {
    this.isLoadingSubject.next(true);
    
    // Simulación llamada API
    const user: User & { password: string } = {
      id: Date.now().toString(),
      nombre: userData.nombre,
      email: userData.email,
      comunidad: userData.comunidad,
      rol: userData.rol || 'usuario',
      password: userData.password
    };
    return of(user).pipe(
      delay(1500), // Simula latencia de red
      tap(u => {
        localStorage.setItem('currentUser', JSON.stringify(u));
        this.currentUserSubject.next(u);
        this.addUser(u);
        this.isLoadingSubject.next(false);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  isAuthenticated(): boolean {
    return this.currentUserSubject.value !== null;
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }
}