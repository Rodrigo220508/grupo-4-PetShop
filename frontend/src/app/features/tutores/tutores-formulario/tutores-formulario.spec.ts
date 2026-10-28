import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TutoresFormulario } from './tutores-formulario';

describe('TutoresFormulario', () => {
  let component: TutoresFormulario;
  let fixture: ComponentFixture<TutoresFormulario>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TutoresFormulario],
    }).compileComponents();

    fixture = TestBed.createComponent(TutoresFormulario);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
