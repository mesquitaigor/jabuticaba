import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GroceryListComponent } from './grocery-list.component';
import { GroceryItemService } from '../../data/entities/grocery-items/grocery-item.service';
import { of, throwError } from 'rxjs';
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

    fit('precisa renderizar o nome dos itens corretamente', () => {
      const mockItems = [createGroceryItemModelMock()];
      mockSignal.set(mockItems);
      mockGroceryItemService.getAll.and.returnValue(of(mockItems));

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
    it('precisa renderizar o checkbox com estado correspondente ao atributo do item', () => {
      const mockItems = [
        createGroceryItemModelMock({ missing: true }),
        createGroceryItemModelMock({ missing: false }),
      ];
      mockSignal.set(mockItems);
      mockGroceryItemService.getAll.and.returnValue(of(mockItems));

      fixture.detectChanges();

      const checkboxes = fixture.debugElement.queryAll(
        By.css('[data-testid="grocery-item-checkbox"]'),
      );

      expect(checkboxes[0].componentInstance.binary).toBe(true);
      expect(checkboxes[0].componentInstance.ngModel).toBe(
        component.groceryItems()[0].missing,
      );
      expect(checkboxes[1].componentInstance.ngModel).toBe(
        component.groceryItems()[1].missing,
      );
    });

    it('precisa exibir estado vazio quando não há itens', () => {
      mockSignal.set([]);
      mockGroceryItemService.getAll.and.returnValue(of([]));

      fixture.detectChanges();

      const emptyState = fixture.debugElement.query(
        By.css('[data-testid="empty-state"]'),
      );

      expect(emptyState).toBeTruthy();
      expect(emptyState.nativeElement.textContent).toContain(
        'Nenhum item cadastrado',
      );
    });
  });

  describe('quando ocorre um erro ao carregar os itens', () => {
    it('precisa exibir mensagem de erro', () => {
      // const errorMessage = 'Erro ao carregar itens';
      // mockGroceryItemService.getAll.and.returnValue(
      //   throwError(() => new Error(errorMessage)),
      // );
      // fixture.detectChanges();
      // expect(component.hasError).toBe(true);
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

    it('precisa exibir texto de erro adequado', () => {
      mockGroceryItemService.getAll.and.returnValue(
        throwError(() => new Error('Erro ao carregar')),
      );

      fixture.detectChanges();

      const errorState = fixture.debugElement.query(
        By.css('[data-testid="error-state"]'),
      );

      expect(errorState.nativeElement.textContent).toContain(
        'Erro ao carregar os itens',
      );
    });

    it('não precisa exibir a lista de itens quando houver erro', () => {
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
});
