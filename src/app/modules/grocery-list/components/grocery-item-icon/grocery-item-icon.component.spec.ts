import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroceryItemIconComponent } from './grocery-item-icon.component';

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
        fixture.componentRef.setInput('iconName', 'apple');
        fixture.detectChanges();

        expect(component.iconSrc()).toBe('icons/apple.svg');
      });
    });

    it('precisa renderizar a imagem com src correto', () => {
      TestBed.runInInjectionContext(() => {
        fixture.componentRef.setInput('iconName', 'banana');
        fixture.detectChanges();

        const img = fixture.nativeElement.querySelector('img');
        expect(img.src).toContain('icons/banana.svg');
      });
    });

    it('precisa renderizar a imagem com alt correto', () => {
      TestBed.runInInjectionContext(() => {
        fixture.componentRef.setInput('iconName', 'orange');
        fixture.detectChanges();

        const img = fixture.nativeElement.querySelector('img');
        expect(img.alt).toBe('orange');
      });
    });

    it('precisa aplicar as classes CSS corretas', () => {
      TestBed.runInInjectionContext(() => {
        fixture.componentRef.setInput('iconName', '10');
        fixture.detectChanges();
        expect(fixture.nativeElement.classList.contains('w-10')).toBe(true);
        expect(fixture.nativeElement.classList.contains('h-10')).toBe(true);
      });
    });
  });

  describe('quando iconName está vazio', () => {
    it('precisa computar o caminho com ícone padrão', () => {
      TestBed.runInInjectionContext(() => {
        fixture.componentRef.setInput('iconName', '');
        fixture.detectChanges();

        expect(component.iconSrc()).toBe('icons/default-icon.svg');
      });
    });
  });
});
