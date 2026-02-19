import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroceryItemIconComponent } from './grocery-item-icon.component';
import { GroceryItemIconModel } from '@models/grocery-items/grocery-item-icon.model';

describe(GroceryItemIconComponent.name, () => {
  let component: GroceryItemIconComponent;
  let fixture: ComponentFixture<GroceryItemIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GroceryItemIconComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GroceryItemIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('precisa ser criado', () => {
    expect(component).toBeTruthy();
  });

  describe('quando iconName é fornecido', () => {
    it('precisa computar o caminho correto do ícone', () => {
      TestBed.runInInjectionContext(() => {
        fixture.componentRef.setInput(
          'iconName',
          new GroceryItemIconModel('apple'),
        );
        fixture.detectChanges();

        expect(component.iconSrc()).toBe('icons/grocery-items/apple.svg');
      });
    });

    it('precisa renderizar a imagem com src correto', () => {
      TestBed.runInInjectionContext(() => {
        fixture.componentRef.setInput(
          'iconName',
          new GroceryItemIconModel('banana'),
        );
        fixture.detectChanges();

        const img = fixture.nativeElement.querySelector('img');
        expect(img.src).toContain('icons/grocery-items/banana.svg');
      });
    });

    it('precisa renderizar a imagem com alt correto', () => {
      TestBed.runInInjectionContext(() => {
        fixture.componentRef.setInput(
          'iconName',
          new GroceryItemIconModel('orange'),
        );
        fixture.detectChanges();

        const img = fixture.nativeElement.querySelector('img');
        expect(img.alt).toBe('orange');
      });
    });

    it('precisa aplicar as classes CSS corretas', () => {
      TestBed.runInInjectionContext(() => {
        fixture.componentRef.setInput(
          'iconName',
          new GroceryItemIconModel('10'),
        );
        fixture.detectChanges();
        expect(fixture.nativeElement.classList.contains('w-10')).toBe(true);
        expect(fixture.nativeElement.classList.contains('h-10')).toBe(true);
      });
    });
  });

  describe('quando iconName está vazio', () => {
    it('precisa computar o caminho com ícone padrão', () => {
      TestBed.runInInjectionContext(() => {
        fixture.componentRef.setInput('iconName', new GroceryItemIconModel(''));
        fixture.detectChanges();

        expect(component.iconSrc()).toBe(
          'icons/grocery-items/default-icon.svg',
        );
      });
    });
  });
});
