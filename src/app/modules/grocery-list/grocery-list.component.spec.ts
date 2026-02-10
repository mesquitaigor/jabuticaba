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
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MessageService } from 'primeng/api';

fdescribe(GroceryListComponent.name, () => {
  let component: GroceryListComponent;
  let fixture: ComponentFixture<GroceryListComponent>;
  let mockGroceryItemService: jasmine.SpyObj<GroceryItemService>;
  let mockMessageService: jasmine.SpyObj<MessageService>;
  let mockSignal = signal<GroceryItemModel[]>([]);

  beforeEach(async () => {
    mockSignal = signal<GroceryItemModel[]>([]);

    mockGroceryItemService = jasmine.createSpyObj('GroceryItemService', [
      'getAll',
      'getGroceryList',
      'create',
    ]);
    mockMessageService = jasmine.createSpyObj('MessageService', ['add']);

    mockGroceryItemService.getGroceryList.and.returnValue(
      mockSignal.asReadonly(),
    );
    mockGroceryItemService.getAll.and.returnValue(of([]));
    mockGroceryItemService.create.and.returnValue(
      of(createGroceryItemModelMock()),
    );

    await TestBed.configureTestingModule({
      imports: [GroceryListComponent],
      providers: [
        provideAnimationsAsync(),
        { provide: GroceryItemService, useValue: mockGroceryItemService },
        { provide: MessageService, useValue: mockMessageService },
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
  describe('quando o botão de adicionar é clicado', () => {
    it('precisa abrir o modal de adição de item', () => {
      fixture.detectChanges();

      component.onAdd();
      fixture.detectChanges();

      expect(component.showAddModal).toBe(true);
    });
  });

  describe('quando o modal de adicionar está aberto', () => {
    it('precisa manter o botão de salvar desabilitado quando o input está vazio', () => {
      component.showAddModal = true;
      component.newItemName = '';

      fixture.detectChanges();

      const saveButton = fixture.debugElement.query(
        By.css('[data-testid="save-button"]'),
      );

      expect(saveButton.componentInstance.disabled).toBe(true);
    });

    it('precisa habilitar o botão de salvar quando o usuário digita no input', () => {
      component.showAddModal = true;
      component.newItemName = '';

      fixture.detectChanges();

      component.newItemName = 'Novo Item';
      fixture.detectChanges();

      const saveButton = fixture.debugElement.query(
        By.css('[data-testid="save-button"]'),
      );

      expect(saveButton.componentInstance.disabled).toBe(false);
    });

    fit('precisa desabilitar o botão novamente se o input for esvaziado', () => {
      component.showAddModal = true;
      component.newItemName = 'Novo Item';

      fixture.detectChanges();

      component.newItemName = '';
      fixture.detectChanges();

      const saveButton = fixture.debugElement.query(
        By.css('[data-testid="save-button"]'),
      );

      expect(saveButton.componentInstance.disabled).toBe(true);
    });
  });

  describe('quando salvar um novo item', () => {
    it('precisa chamar o método create do service', () => {
      const itemName = 'Novo Item';
      component.newItemName = itemName;
      fixture.detectChanges();

      component.saveNewItem();

      expect(mockGroceryItemService.create).toHaveBeenCalledWith(itemName);
    });

    it('precisa definir adding como true ao iniciar a criação', () => {
      component.newItemName = 'Novo Item';
      mockGroceryItemService.create.and.returnValue(of(null).pipe(delay(100)));

      component.saveNewItem();

      expect(component.adding).toBe(true);
    });

    it('precisa definir adding como false após criar com sucesso', fakeAsync(() => {
      component.newItemName = 'Novo Item';
      mockGroceryItemService.create.and.returnValue(
        of(createGroceryItemModelMock()),
      );

      component.saveNewItem();
      tick();

      expect(component.adding).toBe(false);
    }));

    it('precisa definir adding como false após erro na criação', fakeAsync(() => {
      component.newItemName = 'Novo Item';
      mockGroceryItemService.create.and.returnValue(
        throwError(() => new Error('Erro ao criar')),
      );

      component.saveNewItem();
      tick();

      expect(component.adding).toBe(false);
    }));

    it('precisa fechar o modal após criar com sucesso', fakeAsync(() => {
      component.newItemName = 'Novo Item';
      component.showAddModal = true;
      mockGroceryItemService.create.and.returnValue(
        of(createGroceryItemModelMock()),
      );

      component.saveNewItem();
      tick();

      expect(component.showAddModal).toBe(false);
    }));

    it('precisa limpar o campo newItemName após criar com sucesso', fakeAsync(() => {
      component.newItemName = 'Novo Item';
      mockGroceryItemService.create.and.returnValue(
        of(createGroceryItemModelMock()),
      );

      component.saveNewItem();
      tick();

      expect(component.newItemName).toBe('');
    }));

    it('não deve chamar o service múltiplas vezes se já está criando', () => {
      component.newItemName = 'Novo Item';
      component.adding = true;

      component.saveNewItem();

      expect(mockGroceryItemService.create).not.toHaveBeenCalled();
    });

    it('precisa desabilitar o botão de salvar durante a criação', fakeAsync(() => {
      component.newItemName = 'Novo Item';
      component.showAddModal = true;
      mockGroceryItemService.create.and.returnValue(of(null).pipe(delay(100)));

      fixture.detectChanges();
      component.saveNewItem();
      fixture.detectChanges();

      const saveButton = fixture.debugElement.query(
        By.css('[data-testid="save-button"]'),
      );
      if (saveButton == null) {
        fail('Botão de salvar não encontrado');
        return;
      }
      expect(saveButton.componentInstance.disabled).toBe(true);
    }));

    it('precisa exibir loading no botão durante a criação', fakeAsync(() => {
      component.newItemName = 'Novo Item';
      component.showAddModal = true;
      mockGroceryItemService.create.and.returnValue(of(null).pipe(delay(100)));

      fixture.detectChanges();
      component.saveNewItem();
      fixture.detectChanges();

      const saveButton = fixture.debugElement.query(
        By.css('[data-testid="save-button"]'),
      );

      expect(saveButton.componentInstance.disabled).toBe(true);
    }));
    it('precisa exibir toast de erro quando a criação falhar', fakeAsync(() => {
      component.newItemName = 'Novo Item';
      mockGroceryItemService.create.and.returnValue(
        throwError(() => new Error('Erro ao criar')),
      );

      component.saveNewItem();
      tick();

      expect(mockMessageService.add).toHaveBeenCalledWith({
        severity: 'error',
        summary: 'Erro',
        detail: 'Não foi possível adicionar o item',
      });
    }));
  });
});
