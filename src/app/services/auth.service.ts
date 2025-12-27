import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, from, of } from 'rxjs';
import { map, switchMap, delay, tap } from 'rxjs/operators';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
  getAuth
} from 'firebase/auth';
import {
  collection,
  doc,
  getFirestore,
  getDoc,
  setDoc,
  query,
  where,
  getDocs
} from 'firebase/firestore';
import { auth, db } from '../firebase.config';

export interface User {
  id: string;
  nombre: string;
  email: string;
  comunidad?: string;
  rol: 'usuario' | 'admin';
  password?: string; // No se almacena en Firestore, solo para registro
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
    // Escuchar cambios de autenticación en tiempo real
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // Usuario autenticado, obtener datos adicionales de Firestore
        this.getUserData(user.uid).then(userData => {
          if (userData) {
            this.currentUserSubject.next(userData);
          }
        });
      } else {
        this.currentUserSubject.next(null);
      }
    });
  }

  private async getUserData(userId: string): Promise<User | null> {
    try {
      const userDoc = doc(db, 'users', userId);
      const userSnap = await getDoc(userDoc);
      if (userSnap.exists()) {
        const userData = userSnap.data();
        return { id: userSnap.id, ...userData } as User;
      }
      return null;
    } catch (error) {
      console.error('Error obteniendo datos del usuario:', error);
      return null;
    }
  }

  isLoggedIn(): boolean {
    return this.currentUserSubject.value !== null;
  }

  login(email: string, password: string): Observable<User> {
    this.isLoadingSubject.next(true);

    return from(signInWithEmailAndPassword(auth, email, password)).pipe(
      switchMap(async userCredential => {
        // Obtener datos adicionales del usuario desde Firestore
        const userData = await this.getUserData(userCredential.user.uid);
        if (!userData) {
          throw new Error('Usuario no encontrado en Firestore');
        }
        return userData;
      }),
      tap(user => {
        if (user) {
          this.currentUserSubject.next(user);
        }
        this.isLoadingSubject.next(false);
      })
    );
  }

  getAllUsers(): Observable<User[]> {
    return from(getDocs(query(collection(db, 'users')))).pipe(
      map(querySnapshot => {
        const users: User[] = [];
        querySnapshot.forEach(doc => {
          users.push({ id: doc.id, ...doc.data() } as User);
        });
        return users;
      })
    );
  }

  addUser(userData: Omit<User, 'id'>): Observable<User> {
    return from(createUserWithEmailAndPassword(auth, userData.email, userData.password || 'tempPassword')).pipe(
      switchMap(async userCredential => {
        // Crear documento de usuario en Firestore
        const userDoc = doc(db, 'users', userCredential.user.uid);
        const userToSave = {
          nombre: userData.nombre,
          email: userData.email,
          comunidad: userData.comunidad,
          rol: userData.rol
        };
        await setDoc(userDoc, userToSave);
        return {
          id: userCredential.user.uid,
          ...userToSave
        };
      }),
      tap(user => {
        // Si el usuario recién creado es el que se está autenticando, actualizar el estado
        if (this.currentUserSubject.value?.id === user.id) {
          this.currentUserSubject.next(user);
        }
      })
    );
  }

  registro(userData: {
    nombre: string;
    email: string;
    password: string;
    comunidad?: string;
    rol?: 'usuario' | 'admin';
  }): Observable<User> {
    this.isLoadingSubject.next(true);

    return from(createUserWithEmailAndPassword(auth, userData.email, userData.password)).pipe(
      switchMap(async userCredential => {
        // Crear documento de usuario en Firestore
        const userDoc = doc(db, 'users', userCredential.user.uid);
        const userToSave = {
          nombre: userData.nombre,
          email: userData.email,
          comunidad: userData.comunidad,
          rol: userData.rol || 'usuario'
        };
        await setDoc(userDoc, userToSave);
        return {
          id: userCredential.user.uid,
          ...userToSave
        };
      }),
      tap(user => {
        this.currentUserSubject.next(user);
        this.isLoadingSubject.next(false);
      })
    );
  }

  logout(): Observable<void> {
    this.isLoadingSubject.next(true);
    return from(signOut(auth)).pipe(
      tap(() => {
        this.currentUserSubject.next(null);
        this.isLoadingSubject.next(false);
      })
    );
  }

  isAuthenticated(): boolean {
    return this.currentUserSubject.value !== null;
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }
}