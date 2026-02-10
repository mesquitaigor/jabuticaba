import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { GroceryListComponent } from './grocery-list.component';
import { GroceryItemService } from '../../data/entities/grocery-items/grocery-item.service';
import { delay, of, throwError } from 'rxjs';
import { By } from '@angular/platform-browser';
import { createGroceryItemModelMock } from '../../tests/mocks/GroceryItemModel.mock.spec';
import GroceryItemModel from '../../data/entities/grocery-items/grocery-item.model';
import { signal } from '@angular/core';

fdescribe(GroceryListComponent.name, () => {
  let component: GroceryListComponent;
  let fixture: ComponentFixture<GroceryListComponent>;
  let mockGroceryItemService: jasmine.SpyObj<GroceryItemService>;
  let mockSignal = signal<GroceryItemModel[]>([]);

  beforeEach(async () => {
    mockSignal = signal<GroceryItemModel[]>([]);

    mockGroceryItemService = jasmine.createSpyObj('GroceryItemService', [
      'getAll',
      'getGroceryList',
    ]);

    mockGroceryItemService.getGroceryList.and.returnValue(
      mockSignal.asReadonly(),
    );
    mockGroceryItemService.getAll.and.returnValue(of([]));

    await TestBed.configureTestingModule({
      imports: [GroceryListComponent],
      providers: [
        { provide: GroceryItemService, useValue: mockGroceryItemService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(GroceryListComponent);
    component = fixture.componentInstance;
  });

  describe('quando o componente é inicializado', () => {
    it('precisa carregar os itens do serviço', () => {
      fixture.detectChanges();
      expect(mockGroceryItemService.getAll).toHaveBeenCalled();
    });

    it('precisa listar os itens na interface', () => {
      const mockItems = [
        createGroceryItemModelMock(),
        createGroceryItemModelMock({ name: 'Item 2' }),
        createGroceryItemModelMock({ name: 'Item 3' }),
      ];
      mockSignal.set(mockItems);

      fixture.detectChanges();

      const items = fixture.debugElement.queryAll(
        By.css('[data-testid="grocery-item"]'),
      );

      expect(items.length).toBe(mockItems.length);
    });

    it('precisa renderizar o nome dos itens corretamente', () => {
      const mockItems = [createGroceryItemModelMock()];
      mockSignal.set(mockItems);

      fixture.detectChanges();

      const itemNames = fixture.debugElement.queryAll(
        By.css('[data-testid="grocery-item-name"]'),
      );

      expect(itemNames.length).toBeGreaterThan(0);
      expect(itemNames[0].nativeElement.textContent.trim()).toBe(
        component.groceryItems()[0].name,
      );
    });
  });

  describe('quando renderiza o componente', () => {
    it('precisa renderizar o checkbox com estado correspondente ao atributo do item', fakeAsync(() => {
      const mockItems = [
        createGroceryItemModelMock({ missing: true }),
        createGroceryItemModelMock({ missing: false }),
      ];
      mockSignal.set(mockItems);

      fixture.detectChanges();
      tick();
      const checkboxes = fixture.debugElement.queryAll(
        By.css('[data-testid="grocery-item-checkbox"]'),
      );
      expect(checkboxes[0].componentInstance.checked).toBe(
        component.groceryItems()[0].missing,
      );
      expect(checkboxes[1].componentInstance.checked).toBe(
        component.groceryItems()[1].missing,
      );
    }));

    it('precisa exibir estado vazio quando não há itens', () => {
      mockSignal.set([]);
      mockGroceryItemService.getAll.and.returnValue(of([]));

      fixture.detectChanges();

      const emptyState = fixture.debugElement.query(
        By.css('[data-testid="empty-state"]'),
      );

      expect(emptyState).toBeTruthy();
    });
  });

  describe('quando ocorre um erro ao carregar os itens', () => {
    it('precisa exibir mensagem de erro', () => {
      mockGroceryItemService.getAll.and.returnValue(
        throwError(() => new Error('Erro ao carregar')),
      );
      fixture.detectChanges();
      expect(component.hasError).toBe(true);
    });

    it('precisa renderizar o estado de erro na interface', () => {
      mockGroceryItemService.getAll.and.returnValue(
        throwError(() => new Error('Erro ao carregar')),
      );

      fixture.detectChanges();

      const errorState = fixture.debugElement.query(
        By.css('[data-testid="error-state"]'),
      );

      expect(errorState).toBeTruthy();
    });

    it('não deve exibir a lista de itens quando houver erro', () => {
      mockGroceryItemService.getAll.and.returnValue(
        throwError(() => new Error('Erro ao carregar')),
      );

      fixture.detectChanges();

      const items = fixture.debugElement.queryAll(
        By.css('[data-testid="grocery-item"]'),
      );

      expect(items.length).toBe(0);
    });
  });
  describe('quando está carregando os itens', () => {
    it('precisa exibir estado de loading', () => {
      mockGroceryItemService.getAll.and.returnValue(of([]).pipe(delay(1000)));
      component.loading = true;

      fixture.detectChanges();

      const loadingState = fixture.debugElement.query(
        By.css('[data-testid="loading-state"]'),
      );

      expect(loadingState).toBeTruthy();
    });

    it('não deve exibir a lista de itens durante o loading', () => {
      const mockItems = [createGroceryItemModelMock()];
      mockSignal.set(mockItems);

      fixture.detectChanges();
      component.loading = true;
      fixture.detectChanges();

      const items = fixture.debugElement.queryAll(
        By.css('[data-testid="grocery-item"]'),
      );

      expect(items.length).toBe(0);
    });

    it('não deve exibir o estado vazio durante o loading', () => {
      mockSignal.set([]);
      mockGroceryItemService.getAll.and.returnValue(of([]).pipe(delay(1000)));
      component.loading = true;

      fixture.detectChanges();

      const emptyState = fixture.debugElement.query(
        By.css('[data-testid="empty-state"]'),
      );

      expect(emptyState).toBeFalsy();
    });

    it('precisa definir loading como false após carregar com sucesso', fakeAsync(() => {
      const mockItems = [createGroceryItemModelMock()];
      mockGroceryItemService.getAll.and.returnValue(of(mockItems));

      component.loadItems();
      tick();

      expect(component.loading).toBe(false);
    }));
  });
});
