import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetalleEspeciesPage } from './detalle-especies.page';

describe('DetalleEspeciesPage', () => {
  let component: DetalleEspeciesPage;
  let fixture: ComponentFixture<DetalleEspeciesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalleEspeciesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
