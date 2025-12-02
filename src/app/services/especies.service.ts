import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage-angular';

export interface Especie {
  id: string;
  nombreComun: string;
  nombreCientifico?: string;
  tipo?: string;
  descripcion?: string;
  estadoConservacion?: string;
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
  private STORAGE_KEY = 'especies';
  private _especies$ = new BehaviorSubject<Especie[]>([]);
  public especies$ = this._especies$.asObservable();
  private _ready = false;

  private API_URL = 'https://api.example.com/especies-nativas'; // Reemplaza por la URL real

  constructor(private storage: Storage, private http: HttpClient) {
    this.init();
  }

  private async init() {
    try {
      await this.storage.create();
      const list = (await this.storage.get(this.STORAGE_KEY)) || [];
      this._especies$.next(list);
      this._ready = true;
    } catch (e) {
      console.error('Error inicializando Storage', e);
    }
  }

  private async persist(list: Especie[]) {
    await this.storage.set(this.STORAGE_KEY, list);
    this._especies$.next(list);
  }


  getAll(): Especie[] { return this._especies$.value; }

  // Nuevo método para consumir especies desde API externa
  getAllFromApi(): Observable<any> {
    return this.http.get<any>(this.API_URL);
  }

  async add(especie: Omit<Especie, 'id'>) {
    const id = Date.now().toString();
    const nuevo: Especie = { id, ...especie, aprobada: false } as Especie;
    const list = [...this._especies$.value, nuevo];
    await this.persist(list);
    return nuevo;
  }

  getById(id: string): Especie | undefined {
    return this._especies$.value.find(e => e.id === id);
  }

  async remove(id: string) {
    const list = this._especies$.value.filter(e => e.id !== id);
    await this.persist(list);
  }

  async update(id: string, cambios: Partial<Especie>) {
    const list = this._especies$.value.map(e => e.id === id ? { ...e, ...cambios } : e);
    await this.persist(list);
  }
}
