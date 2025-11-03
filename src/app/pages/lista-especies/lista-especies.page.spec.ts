import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListaEspeciesPage } from './lista-especies.page';

describe('ListaEspeciesPage', () => {
  let component: ListaEspeciesPage;
  let fixture: ComponentFixture<ListaEspeciesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaEspeciesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
