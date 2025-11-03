import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MapaComunitarioPage } from './mapa-comunitario.page';

describe('MapaComunitarioPage', () => {
  let component: MapaComunitarioPage;
  let fixture: ComponentFixture<MapaComunitarioPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MapaComunitarioPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
