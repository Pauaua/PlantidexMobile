import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { collection, doc, getDoc, addDoc, getDocs, updateDoc, deleteDoc, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase.config';

export interface Especie {
  id: string;
  nombreComun: string;
  nombreCientifico?: string;
  tipo?: string;
  descripcion?: string;
  estadoConservacion?: string;
  estacion?: string;
  ubicacion?: { direccion?: string; coordenadas?: { lat: number; lng: number } };
  observaciones?: string;
  reportadoPor?: string;
  comunidad?: string;
  fechaAvistamiento?: string;
  aprobada: boolean;
  foto?: string;
}

@Injectable({ providedIn: 'root' })
export class EspeciesService {
  private _especies$ = new BehaviorSubject<Especie[]>([]);
  public especies$ = this._especies$.asObservable();
  private _ready = false;
  private especiesCollection = collection(db, 'especies');

  private API_URL = 'https://api.example.com/especies-nativas'; // Reemplaza por la URL real

  constructor(private http: HttpClient) {
    this.init();
  }

  private async init() {
    try {
      // Escuchar cambios en tiempo real
      const q = query(this.especiesCollection);
      onSnapshot(q, (querySnapshot) => {
        const especiesList: Especie[] = [];
        querySnapshot.forEach((doc) => {
          especiesList.push({ id: doc.id, ...doc.data() } as Especie);
        });
        this._especies$.next(especiesList);
        this._ready = true;
      });
    } catch (e) {
      console.error('Error inicializando Firestore', e);
    }
  }

  getAll(): Especie[] { return this._especies$.value; }

  // Nuevo método para consumir especies desde API externa
  getAllFromApi(): Observable<any> {
    return this.http.get<any>(this.API_URL);
  }

  async add(especie: Omit<Especie, 'id'>) {
    const especieData = { ...especie, aprobada: false };
    const docRef = await addDoc(this.especiesCollection, especieData);
    return { id: docRef.id, ...especieData } as Especie;
  }

  async getById(id: string): Promise<Especie | undefined> {
    // Para obtener un documento específico de Firestore
    const docRef = doc(db, 'especies', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Especie;
    }
    return undefined;
  }

  async remove(id: string) {
    const docRef = doc(db, 'especies', id);
    await deleteDoc(docRef);
  }

  async update(id: string, cambios: Partial<Especie>) {
    const docRef = doc(db, 'especies', id);
    await updateDoc(docRef, cambios);

    // Actualizar inmediatamente el BehaviorSubject para reflejar el cambio
    const especiesActual = [...this._especies$.value];
    const index = especiesActual.findIndex(e => e.id === id);
    if (index !== -1) {
      especiesActual[index] = { ...especiesActual[index], ...cambios };
      this._especies$.next(especiesActual);
    }
  }

  async updateWithApproval(id: string, cambios: Partial<Especie>, isUserEdit: boolean = false) {
    // Si es una edición por parte del usuario, marcar como no aprobada
    const updatedChanges = isUserEdit ? { ...cambios, aprobada: false } : cambios;
    const docRef = doc(db, 'especies', id);
    await updateDoc(docRef, updatedChanges);

    // Actualizar inmediatamente el BehaviorSubject para reflejar el cambio
    const especiesActual = [...this._especies$.value];
    const index = especiesActual.findIndex(e => e.id === id);
    if (index !== -1) {
      especiesActual[index] = { ...especiesActual[index], ...updatedChanges };
      this._especies$.next(especiesActual);
    }
  }
}
