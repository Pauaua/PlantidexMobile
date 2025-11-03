import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, tap } from 'rxjs/operators';

export interface User {
  id: string;
  nombre: string;
  email: string;
  comunidad?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  public isLoading$ = this.isLoadingSubject.asObservable();

  constructor() {
    // Recuperar usuario del localStorage si existe
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      this.currentUserSubject.next(JSON.parse(savedUser));
    }
  }

  login(email: string, password: string): Observable<User> {
    this.isLoadingSubject.next(true);
    
    // Simulación llamada API
    return of({
      id: '1',
      nombre: 'Usuario Demo',
      email: email
    }).pipe(
      delay(1500), // Simula latencia de red
      tap(user => {
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
        this.isLoadingSubject.next(false);
      })
    );
  }

  registro(userData: {
    nombre: string;
    email: string;
    password: string;
    comunidad?: string;
  }): Observable<User> {
    this.isLoadingSubject.next(true);
    
    // Simulación llamada API
    return of({
      id: Date.now().toString(),
      nombre: userData.nombre,
      email: userData.email,
      comunidad: userData.comunidad
    }).pipe(
      delay(1500), // Simula latencia de red
      tap(user => {
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
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