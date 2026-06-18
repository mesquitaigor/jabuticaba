import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { GroceryListComponent } from './grocery-list.component';
import { delay, of, throwError } from 'rxjs';
import { createGroceryItemModelMock } from '../../tests/mocks/GroceryItemModel.mock.spec';
import GroceryItemModel from '../../data/entities/grocery-items/grocery-item.model';
import { Component, signal } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { DataTestIdHelper } from '../../tests/helpers/data-testid.helper.spec';
import { DataTestId } from '../../shared/directives/data-testid';
import { Button } from 'primeng/button';
import { GroceryItemService } from '@models/grocery-items';
import { DialogService } from '@layout/dialog';
import GroceryItemServiceSpy from '../../tests/spys/grocery-item.service.spy.spec';
import { createMessageServiceSpy } from '../../tests/spys/message.service.spy.spec';
import { ShoppingModeDialog } from './components/shopping-mode/shopping-mode.dialog';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'p-toast',
  template: '',
  standalone: true,
})
class MockToastComponent {}

describe(GroceryListComponent.name, () => {
  let component: GroceryListComponent;
  let fixture: ComponentFixture<GroceryListComponent>;
  const groceryItemServiceMocker = new GroceryItemServiceSpy();
  let groceryItemService: jasmine.SpyObj<GroceryItemService>;
  let mockMessageService: jasmine.SpyObj<MessageService>;
  let mockDialogService: jasmine.SpyObj<DialogService>;
  let mockSignal = signal<GroceryItemModel[]>([]);
  let loadDelay = 0;

  // Helper para executar código dentro do contexto de injeção
  const runInContext = <T>(fn: () => T): T => {
    return TestBed.runInInjectionContext(fn);
  };

  beforeEach(async () => {
    mockSignal = signal<GroceryItemModel[]>([]);
    groceryItemServiceMocker.create();
    mockMessageService = createMessageServiceSpy();
    mockDialogService = jasmine.createSpyObj('DialogService', [
      'open',
      'close',
    ]);

    await TestBed.configureTestingModule({
      imports: [GroceryListComponent, MockToastComponent],
      providers: [
        provideAnimationsAsync(),
        groceryItemServiceMocker.getProvider(),
        { provide: MessageService, useValue: mockMessageService },
        { provide: DialogService, useValue: mockDialogService },
      ],
    })
      .overrideComponent(GroceryListComponent, {
        remove: {
          imports: [ToastModule],
        },
        add: {
          imports: [MockToastComponent],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(GroceryListComponent);
    component = fixture.componentInstance;
    loadDelay = component['loadDelay'];
    groceryItemService = groceryItemServiceMocker.getSpy();
  });

  describe('quando botão de visibilidade é clicado', () => {
    it('deve alternar estado de visibilidade dos items da lista', () => {
      runInContext(() => {
        fixture.detectChanges();
        const initial = component.showAllItems();
        const button = DataTestIdHelper.queryOrFail(
          fixture.debugElement,
          DataTestId.GroceryList.VisibilityOffIcon,
        );
        const ngButtonInstance: Button = button.componentInstance;
        ngButtonInstance.onClick.emit();
        fixture.detectChanges();
        expect(component.showAllItems()).toBe(!initial);
      });
    });
  });

  describe('quando o componente é inicializado', () => {
    it('precisa exibir estado vazio quando não há itens', fakeAsync(() => {
      runInContext(() => {
        mockSignal.set([]);
        groceryItemService.getAll.and.returnValue(of([]));

        fixture.detectChanges();
        tick(loadDelay);
        fixture.detectChanges();

        const emptyState = DataTestIdHelper.query(
          fixture.debugElement,
          DataTestId.GroceryList.EmptyState,
        );

        expect(emptyState).toBeTruthy();
      });
    }));

    it('precisa carregar os itens do serviço', () => {
      runInContext(() => {
        fixture.detectChanges();
        expect(groceryItemService.getAll).toHaveBeenCalled();
      });
    });

    it('não precisa exibir estado de loading quando há itens armazenados', () => {
      groceryItemServiceMocker.itemList = [createGroceryItemModelMock()];

      component.loadItems();

      expect(component.loading).toBeFalse();
    });

    it('precisa exibir tarja de atualização quando há itens armazenados', fakeAsync(() => {
      groceryItemServiceMocker.itemList = [createGroceryItemModelMock()];
      groceryItemService.getAll.and.returnValue(of([]));

      fixture.detectChanges();
      fixture.detectChanges();

      const banner = DataTestIdHelper.query(
        fixture.debugElement,
        DataTestId.GroceryList.RefreshingBanner,
      );
      expect(banner).toBeTruthy();

      tick(loadDelay);
      fixture.detectChanges();

      const bannerAfter = DataTestIdHelper.query(
        fixture.debugElement,
        DataTestId.GroceryList.RefreshingBanner,
      );
      expect(bannerAfter).toBeFalsy();
    }));

    it('precisa listar os itens na interface', fakeAsync(() => {
      runInContext(async () => {
        const mockItems = [
          createGroceryItemModelMock(),
          createGroceryItemModelMock({ name: 'Item 2' }),
          createGroceryItemModelMock({ name: 'Item 3' }),
        ];

        tick(loadDelay);
        fixture.detectChanges();
        component.groceryItems.set(mockItems);
        await fixture.whenStable();
        fixture.detectChanges();
        const items = DataTestIdHelper.queryAll(
          fixture.debugElement,
          DataTestId.GroceryList.Item,
        );
        expect(items.length).toBe(mockItems.length);
      });
    }));
  });
  describe('quando ocorre um erro ao carregar os itens', () => {
    it('precisa exibir mensagem de erro', () => {
      runInContext(() => {
        groceryItemService.getAll.and.returnValue(
          throwError(() => new Error('Erro ao carregar')),
        );
        fixture.detectChanges();
        expect(component.hasError).toBe(true);
      });
    });

    it('precisa renderizar o estado de erro na interface', () => {
      runInContext(() => {
        groceryItemService.getAll.and.returnValue(
          throwError(() => new Error('Erro ao carregar')),
        );

        fixture.detectChanges();

        const errorState = DataTestIdHelper.query(
          fixture.debugElement,
          DataTestId.GroceryList.ErrorState,
        );
        expect(errorState).toBeTruthy();
      });
    });

    it('não deve exibir a lista de itens quando houver erro', () => {
      runInContext(() => {
        groceryItemService.getAll.and.returnValue(
          throwError(() => new Error('Erro ao carregar')),
        );

        fixture.detectChanges();

        const items = DataTestIdHelper.queryAll(
          fixture.debugElement,
          DataTestId.GroceryList.Item,
        );

        expect(items.length).toBe(0);
      });
    });
  });
  describe('quando está carregando os itens', () => {
    it('precisa exibir estado de loading', () => {
      runInContext(() => {
        groceryItemService.getAll.and.returnValue(of([]).pipe(delay(1000)));
        component.loading = true;

        fixture.detectChanges();

        const loadingState = DataTestIdHelper.query(
          fixture.debugElement,
          DataTestId.GroceryList.LoadingState,
        );

        expect(loadingState).toBeTruthy();
      });
    });

    it('não deve exibir a lista de itens durante o loading', () => {
      runInContext(() => {
        const mockItems = [createGroceryItemModelMock()];
        mockSignal.set(mockItems);

        fixture.detectChanges();
        component.loading = true;
        fixture.detectChanges();

        const items = DataTestIdHelper.queryAll(
          fixture.debugElement,
          DataTestId.GroceryList.Item,
        );

        expect(items.length).toBe(0);
      });
    });

    it('não deve exibir o estado vazio durante o loading', () => {
      runInContext(() => {
        mockSignal.set([]);
        groceryItemService.getAll.and.returnValue(of([]).pipe(delay(1000)));
        component.loading = true;

        fixture.detectChanges();

        const emptyState = DataTestIdHelper.query(
          fixture.debugElement,
          DataTestId.GroceryList.EmptyState,
        );

        expect(emptyState).toBeFalsy();
      });
    });

    it('precisa definir loading como false após carregar com sucesso', fakeAsync(() => {
      const mockItems = [createGroceryItemModelMock()];
      groceryItemService.getAll.and.returnValue(of(mockItems));

      component.loadItems();
      tick(loadDelay);

      expect(component.loading).toBe(false);
    }));
  });
  describe('quando o botão de adicionar é clicado', () => {
    it('precisa chamar dialogService.open com o componente correto', () => {
      runInContext(() => {
        fixture.detectChanges();
        component.onAdd();
        fixture.detectChanges();
        expect(mockDialogService.open).toHaveBeenCalledWith(
          jasmine.objectContaining({
            header: 'Cadastrar item',
            width: '90%',
          }),
        );
      });
    });
  });

  describe('hasItemsToBuy', () => {
    it('retorna true quando há pelo menos um item com missing=false', () => {
      runInContext(() => {
        fixture.detectChanges();
        component.groceryItems.set([
          createGroceryItemModelMock({ missing: false }),
        ]);
        expect(component.hasItemsToBuy()).toBe(true);
      });
    });

    it('retorna false quando todos os itens têm missing=true', () => {
      runInContext(() => {
        fixture.detectChanges();
        component.groceryItems.set([
          createGroceryItemModelMock({ missing: true }),
        ]);
        expect(component.hasItemsToBuy()).toBe(false);
      });
    });

    it('retorna false quando a lista está vazia', () => {
      runInContext(() => {
        fixture.detectChanges();
        component.groceryItems.set([]);
        expect(component.hasItemsToBuy()).toBe(false);
      });
    });
  });

  describe('botão de modo compras', () => {
    it('precisa ser exibido quando há itens a comprar', () => {
      runInContext(() => {
        fixture.detectChanges();
        component.groceryItems.set([
          createGroceryItemModelMock({ missing: false }),
        ]);
        fixture.detectChanges();

        const button = DataTestIdHelper.query(
          fixture.debugElement,
          DataTestId.GroceryList.ShoppingModeButton,
        );
        expect(button).toBeTruthy();
      });
    });

    it('não deve ser exibido quando todos os itens já foram comprados', () => {
      runInContext(() => {
        fixture.detectChanges();
        component.groceryItems.set([
          createGroceryItemModelMock({ missing: true }),
        ]);
        fixture.detectChanges();

        const button = DataTestIdHelper.query(
          fixture.debugElement,
          DataTestId.GroceryList.ShoppingModeButton,
        );
        expect(button).toBeNull();
      });
    });
  });

  describe('quando o botão de modo compras é clicado', () => {
    it('precisa chamar dialogService.open com o componente e configuração corretos', () => {
      runInContext(() => {
        fixture.detectChanges();
        component.onOpenShoppingMode();
        expect(mockDialogService.open).toHaveBeenCalledWith(
          jasmine.objectContaining({
            component: ShoppingModeDialog,
            header: 'Modo compras',
            width: '90%',
          }),
        );
      });
    });

    it('precisa passar apenas itens com missing=false para o dialog', () => {
      runInContext(() => {
        fixture.detectChanges();
        const missingItem = createGroceryItemModelMock({ missing: true });
        const notMissingItem = createGroceryItemModelMock({
          uuid: 'other-uuid',
          missing: false,
        });
        component.groceryItems.set([missingItem, notMissingItem]);

        component.onOpenShoppingMode();

        expect(mockDialogService.open).toHaveBeenCalledWith(
          jasmine.objectContaining({
            data: { items: [notMissingItem] },
          }),
        );
      });
    });
  });
});
