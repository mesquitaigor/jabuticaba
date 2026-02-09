import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GroceryListComponent } from './grocery-list.component';
import { GroceryItemService } from '../../data/entities/grocery-items/grocery-item.service';
import { of, throwError } from 'rxjs';
import { By } from '@angular/platform-browser';
import { createGroceryItemModelMock } from '../../tests/mocks/GroceryItemModel.mock.spec';

describe('GroceryListComponent', () => {
  let component: GroceryListComponent;
  let fixture: ComponentFixture<GroceryListComponent>;
  let mockGroceryItemService: jasmine.SpyObj<GroceryItemService>;

  beforeEach(async () => {
    mockGroceryItemService = jasmine.createSpyObj('GroceryItemService', [
      'getAll',
    ]);

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
      const mockItems = [
        createGroceryItemModelMock(),
        createGroceryItemModelMock({ name: 'Item 2' }),
      ];
      mockGroceryItemService.getAll.and.returnValue(of(mockItems));

      fixture.detectChanges();

      expect(mockGroceryItemService.getAll).toHaveBeenCalled();
    });

    it('precisa listar os itens na interface', () => {
      mockGroceryItemService.getAll.and.returnValue(of([]));

      fixture.detectChanges();

      const items = fixture.debugElement.queryAll(
        By.css('[class*="flex items-center gap-4"]'),
      );

      expect(items.length).toBe(component.groceryItems.length);
    });

    it('precisa renderizar o nome dos itens corretamente', () => {
      mockGroceryItemService.getAll.and.returnValue(of([]));

      fixture.detectChanges();

      const itemNames = fixture.debugElement.queryAll(
        By.css('.flex-1.text-gray-800'),
      );

      expect(itemNames.length).toBeGreaterThan(0);
      expect(itemNames[0].nativeElement.textContent.trim()).toBe(
        component.groceryItems[0].name,
      );
    });
  });

  describe('quando renderiza o componente', () => {
    it('precisa renderizar o checkbox com estado correspondente ao atributo do item', () => {
      component.groceryItems[0].checked = true;
      component.groceryItems[1].checked = false;
      mockGroceryItemService.getAll.and.returnValue(of([]));

      fixture.detectChanges();

      const checkboxes = fixture.debugElement.queryAll(By.css('p-checkbox'));

      expect(checkboxes[0].componentInstance.binary).toBe(true);
      expect(checkboxes[0].componentInstance.ngModel).toBe(
        component.groceryItems[0].checked,
      );
      expect(checkboxes[1].componentInstance.ngModel).toBe(
        component.groceryItems[1].checked,
      );
    });

    it('precisa exibir estado vazio quando não há itens', () => {
      component.groceryItems = [];
      mockGroceryItemService.getAll.and.returnValue(of([]));

      fixture.detectChanges();

      const emptyState = fixture.debugElement.query(
        By.css('[class*="p-8 text-center text-gray-500"]'),
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
        By.css('[class*="flex items-center gap-4"]'),
      );

      expect(items.length).toBe(0);
    });
  });
});
