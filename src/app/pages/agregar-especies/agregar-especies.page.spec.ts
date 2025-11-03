import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AgregarEspeciesPage } from './agregar-especies.page';

describe('AgregarEspeciesPage', () => {
  let component: AgregarEspeciesPage;
  let fixture: ComponentFixture<AgregarEspeciesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AgregarEspeciesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
