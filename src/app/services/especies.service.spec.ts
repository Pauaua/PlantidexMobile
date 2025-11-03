import { TestBed } from '@angular/core/testing';
import { EspeciesService, Especie } from './especies.service';
import { Storage } from '@ionic/storage-angular';

class MockStorage {
  private data: any = {};
  async create() { return this; }
  async get(key: string) { return this.data[key] || null; }
  async set(key: string, value: any) { this.data[key] = value; return; }
}

describe('EspeciesService', () => {
  let service: EspeciesService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        EspeciesService,
        { provide: Storage, useClass: MockStorage }
      ]
    }).compileComponents();

    service = TestBed.inject(EspeciesService);
    
    await new Promise(resolve => setTimeout(resolve, 10));
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add and retrieve an especie', async () => {
    const sample: Omit<Especie, 'id'> = {
      nombreComun: 'Test Tree',
      descripcion: 'Prueba',
      reportadoPor: 'Tester',
      comunidad: 'Test'
    } as any;

    const added = await service.add(sample);
    expect(added.id).toBeDefined();

    const all = service.getAll();
    expect(all.find(e => e.id === added.id)).toBeTruthy();

    const byId = service.getById(added.id);
    expect(byId).toBeTruthy();
    expect(byId?.nombreComun).toBe('Test Tree');
  });

  it('should remove an especie', async () => {
    const sample: Omit<Especie, 'id'> = {
      nombreComun: 'ToRemove',
      descripcion: 'Para borrar',
      reportadoPor: 'Tester',
      comunidad: 'Test'
    } as any;

    const added = await service.add(sample);
    const before = service.getAll().length;
    await service.remove(added.id);
    const after = service.getAll().length;
    expect(after).toBe(before - 1);
    expect(service.getById(added.id)).toBeUndefined();
  });
});
