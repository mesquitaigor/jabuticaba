import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { GroceryListComponent } from './grocery-list.component';
import { GroceryItemService } from '../../data/entities/grocery-items/grocery-item.service';
import { delay, of, throwError } from 'rxjs';
import { createGroceryItemModelMock } from '../../tests/mocks/GroceryItemModel.mock.spec';
import GroceryItemModel from '../../data/entities/grocery-items/grocery-item.model';
import { Component, signal } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MenuItemCommandEvent, MessageService } from 'primeng/api';
import { createMessageServiceMock } from '../../tests/mocks/message.service.mock.spec';
import { ToastModule } from 'primeng/toast';
import { DataTestIdHelper } from '../../tests/helpers/data-testid.helper.spec';
import { DataTestId } from '../../shared/directives/data-testid';
import { Menu } from 'primeng/menu';
import { Button } from 'primeng/button';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'p-toast',
  template: '',
  standalone: true,
})
class MockToastComponent {}

fdescribe(GroceryListComponent.name, () => {
  let component: GroceryListComponent;
  let fixture: ComponentFixture<GroceryListComponent>;
  let mockGroceryItemService: jasmine.SpyObj<GroceryItemService>;
  let mockMessageService: jasmine.SpyObj<MessageService>;
  let mockSignal = signal<GroceryItemModel[]>([]);

  // Helper para executar código dentro do contexto de injeção
  const runInContext = <T>(fn: () => T): T => {
    return TestBed.runInInjectionContext(fn);
  };

  beforeEach(async () => {
    mockSignal = signal<GroceryItemModel[]>([]);

    mockGroceryItemService = jasmine.createSpyObj(GroceryItemService.name, [
      'getAll',
      'getGroceryList',
      'create',
      'updateMissing',
      'delete',
    ]);
    mockGroceryItemService.delete.and.returnValue(of(null));

    mockGroceryItemService.getGroceryList.and.returnValue(mockSignal);
    mockGroceryItemService.getAll.and.returnValue(of([]));
    mockGroceryItemService.create.and.returnValue(
      of(createGroceryItemModelMock()),
    );
    mockGroceryItemService.updateMissing.and.returnValue(
      of(createGroceryItemModelMock()),
    );
    mockMessageService = createMessageServiceMock();

    await TestBed.configureTestingModule({
      imports: [GroceryListComponent, MockToastComponent],
      providers: [
        provideAnimationsAsync(),
        { provide: GroceryItemService, useValue: mockGroceryItemService },
        { provide: MessageService, useValue: mockMessageService },
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
  });
  describe('quando o botão de visibilidade do menu é clicado', () => {
    beforeEach(() => {
      mockGroceryItemService.updateHidden = jasmine
        .createSpy('updateHidden')
        .and.returnValue(of(createGroceryItemModelMock()));
    });

    it('deve chamar updateHidden do service ao clicar no menu', fakeAsync(() => {
      runInContext(() => {
        const mockItem = createGroceryItemModelMock({ hidden: false });
        mockSignal.set([mockItem]);
        mockGroceryItemService.updateHidden.and.returnValue(
          of(createGroceryItemModelMock({ ...mockItem, hidden: true })),
        );
        fixture.detectChanges();
        // Simula clique no botão de visibilidade no menu
        component
          .groceryItems()?.[0]
          .menu()[1]
          .command?.({ item: { label: 'Esconder' } } as MenuItemCommandEvent);
        fixture.detectChanges();
        tick(1);
        expect(mockGroceryItemService.updateHidden).toHaveBeenCalledWith(
          jasmine.objectContaining({ uuid: mockItem.uuid }),
        );
      });
    }));

    it('deve bloquear múltiplas chamadas enquanto está processando', fakeAsync(() => {
      runInContext(() => {
        const mockItem = createGroceryItemModelMock({ hidden: false });
        mockSignal.set([mockItem]);
        mockGroceryItemService.updateHidden.and.returnValue(
          of(createGroceryItemModelMock({ ...mockItem, hidden: true })).pipe(
            delay(100),
          ),
        );
        fixture.detectChanges();
        component
          .groceryItems()?.[0]
          .menu()[1]
          .command?.({ item: { label: 'Esconder' } } as MenuItemCommandEvent);
        fixture.detectChanges();
        // Segunda chamada antes de terminar a primeira
        component
          .groceryItems()?.[0]
          .menu()[1]
          .command?.({ item: { label: 'Esconder' } } as MenuItemCommandEvent);
        tick(100);
        expect(mockGroceryItemService.updateHidden).toHaveBeenCalledTimes(1);
      });
    }));

    it('deve atualizar o atributo hidden do item', fakeAsync(() => {
      runInContext(() => {
        const mockItem = createGroceryItemModelMock({ hidden: false });
        mockSignal.set([mockItem]);
        mockGroceryItemService.updateHidden.and.returnValue(
          of(createGroceryItemModelMock({ ...mockItem, hidden: true })),
        );
        fixture.detectChanges();
        component
          .groceryItems()?.[0]
          .menu()[1]
          .command?.({ item: { label: 'Esconder' } } as MenuItemCommandEvent);
        tick(1);
        expect(component.groceryItems()?.[0].hidden).toBe(true);
      });
    }));

    it('deve exibir label "Mostrar" quando hidden é true e "Esconder" quando hidden é false', () => {
      runInContext(() => {
        const mockItem = createGroceryItemModelMock({ hidden: false });
        mockSignal.set([mockItem]);
        fixture.detectChanges();
        // hidden false
        expect(component.groceryItems()?.[0].menu()[1].label).toBe('Esconder');
        // Simula mudança para hidden true
        const item = component.groceryItems()[0];
        item.hidden = true;
        item['defineVisibilityItem']();
        fixture.detectChanges();
        expect(component.groceryItems()?.[0].menu()[1].label).toBe('Mostrar');
      });
    });
  });
  describe('quando o botão de marcar/desmarcar é clicado', () => {
    it('deve exibir "Marcar" quando missing é false e "Desmarcar" quando missing é true', () => {
      runInContext(() => {
        const mockItem = createGroceryItemModelMock({ missing: false });
        mockSignal.set([mockItem]);
        fixture.detectChanges();
        // missing false
        expect(component.groceryItems()?.[0].menu()[2].label).toBe('Marcar');
        // Simula mudança para missing true
        const item = component.groceryItems()[0];
        item.missing = true;
        item['defineMissingLabel']();
        fixture.detectChanges();
        expect(component.groceryItems()?.[0].menu()[2].label).toBe('Desmarcar');
      });
    });
    it('precisa chamar updateMissing do service ao clicar no menu', fakeAsync(() => {
      runInContext(() => {
        const mockItem = createGroceryItemModelMock({ missing: false });
        mockSignal.set([mockItem]);
        mockGroceryItemService.updateMissing.and.returnValue(
          of(createGroceryItemModelMock({ ...mockItem, missing: true })),
        );
        fixture.detectChanges();
        // Simula clique no botão de editar missing no menu
        component
          .groceryItems()?.[0]
          .menu()[2] // índice do botão 'Marcar' (editar missing)
          .command?.({
            item: { label: 'Marcar' },
          } as MenuItemCommandEvent);
        fixture.detectChanges();
        tick(1);
        expect(mockGroceryItemService.updateMissing).toHaveBeenCalledWith(
          jasmine.objectContaining({ uuid: mockItem.uuid }),
        );
      });
    }));
    it('precisa emitir toast de erro quando updateMissing falhar', fakeAsync(() => {
      runInContext(() => {
        const mockItem = createGroceryItemModelMock({ missing: false });
        mockSignal.set([mockItem]);
        mockGroceryItemService.updateMissing.and.returnValue(
          throwError(() => new Error('Erro ao atualizar')),
        );
        fixture.detectChanges();
        component
          .groceryItems()?.[0]
          .menu()[2]
          .command?.({
            item: { label: 'Marcar' },
          } as MenuItemCommandEvent);
        fixture.detectChanges();
        tick(1);
        expect(mockMessageService.add).toHaveBeenCalledWith(
          jasmine.objectContaining({ severity: 'error' }),
        );
      });
    }));
    it('precisa desabilitar o botão enquanto está atualizando', fakeAsync(() => {
      runInContext(() => {
        const mockItem = createGroceryItemModelMock({ missing: false });
        mockSignal.set([mockItem]);
        mockGroceryItemService.updateMissing.and.returnValue(
          of(createGroceryItemModelMock({ ...mockItem, missing: true })).pipe(
            delay(100),
          ),
        );
        fixture.detectChanges();
        component
          .groceryItems()?.[0]
          .menu()[2]
          .command?.({
            item: { label: 'Marcar' },
          } as MenuItemCommandEvent);
        fixture.detectChanges();
        expect(component.groceryItems()?.[0].menu()[2].disabled).toBe(true);
      });
    }));
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
  describe('ao excluir item', () => {
    it('deve chamar o método delete do service ao clicar em excluir', () => {
      runInContext(() => {
        const mockItem = createGroceryItemModelMock();
        mockSignal.set([mockItem]);
        fixture.detectChanges();

        component
          .groceryItems()?.[0]
          .menu()[3]
          .command?.({
            item: { label: 'Excluir' },
          } as MenuItemCommandEvent);
        fixture.detectChanges();

        expect(mockGroceryItemService.delete).toHaveBeenCalled();
      });
    });

    it('deve impedir múltiplas requisições enquanto está excluindo', fakeAsync(() => {
      runInContext(() => {
        const mockItem = createGroceryItemModelMock();
        mockSignal.set([mockItem]);
        mockGroceryItemService.delete.and.returnValue(
          of(null).pipe(delay(100)),
        );
        fixture.detectChanges();

        component
          .groceryItems()?.[0]
          .menu()[3]
          .command?.({
            item: { label: 'Excluir' },
          } as MenuItemCommandEvent);
        fixture.detectChanges();
        tick(1);

        expect(mockGroceryItemService.delete).toHaveBeenCalledTimes(1);
      });
    }));

    it('deve emitir toast de erro ao falhar', fakeAsync(() => {
      runInContext(() => {
        const mockItem = createGroceryItemModelMock();
        mockSignal.set([mockItem]);
        mockGroceryItemService.delete.and.returnValue(
          throwError(() => new Error('Erro ao excluir')),
        );
        fixture.detectChanges();
        component
          .groceryItems()?.[0]
          .menu()[3]
          .command?.({
            item: { label: 'Excluir' },
          } as MenuItemCommandEvent);
        fixture.detectChanges();
        tick(1);

        expect(mockMessageService.add).toHaveBeenCalledWith(
          jasmine.objectContaining({
            severity: 'error',
          }),
        );
      });
    }));

    it('deve emitir toast de sucesso ao excluir', fakeAsync(() => {
      runInContext(() => {
        const mockItem = createGroceryItemModelMock();
        mockSignal.set([mockItem]);
        mockGroceryItemService.delete.and.returnValue(of(null));
        fixture.detectChanges();
        component
          .groceryItems()?.[0]
          .menu()[3]
          .command?.({
            item: { label: 'Excluir' },
          } as MenuItemCommandEvent);
        fixture.detectChanges();
        tick(1);

        expect(mockMessageService.add).toHaveBeenCalledWith(
          jasmine.objectContaining({
            severity: 'success',
          }),
        );
      });
    }));

    it('deve desabilitar o botão de excluir enquanto está excluindo', fakeAsync(() => {
      runInContext(() => {
        const mockItem = createGroceryItemModelMock();
        mockSignal.set([mockItem]);
        mockGroceryItemService.delete.and.returnValue(
          of(null).pipe(delay(100)),
        );
        fixture.detectChanges();
        component
          .groceryItems()?.[0]
          .menu()[3]
          .command?.({
            item: { label: 'Excluir' },
          } as MenuItemCommandEvent);
        fixture.detectChanges();
        expect(component.groceryItems()?.[0].menu()[3].disabled).toBe(true);
      });
    }));

    it('deve remover o item da listagem ao excluir com sucesso', fakeAsync(() => {
      runInContext(() => {
        const mockItem = createGroceryItemModelMock();
        mockSignal.set([mockItem]);
        mockGroceryItemService.delete.and.returnValue(of(null));
        fixture.detectChanges();

        component
          .groceryItems()?.[0]
          .menu()[3]
          .command?.({
            item: { label: 'Excluir' },
          } as MenuItemCommandEvent);
        fixture.detectChanges();
        tick(1);
        mockGroceryItemService.getGroceryList().set([]);
        fixture.detectChanges();

        const items = DataTestIdHelper.queryAll(
          fixture.debugElement,
          DataTestId.GroceryList.Item,
        );
        expect(items.length).toBe(0);
      });
    }));
  });
  describe('quando o botão de menu do item é clicado', () => {
    it('precisa chamar toggle do menu', () => {
      runInContext(() => {
        // Cria um item na lista
        const mockItem = createGroceryItemModelMock();
        mockSignal.set([mockItem]);
        fixture.detectChanges();
        // Busca o item
        const itemDebug = DataTestIdHelper.query(
          fixture.debugElement,
          DataTestId.GroceryList.Item,
        );
        if (!itemDebug) {
          fail(
            'Teste falhou: precisa implementar busca pelo item usando data-testid',
          );
          return;
        }
        // Busca o botão de menu pelo ícone
        const menuButton = DataTestIdHelper.query(
          itemDebug,
          DataTestId.GroceryList.DetailsItemButton,
        );
        if (!menuButton) {
          fail(
            'Teste falhou: precisa implementar busca pelo botão de menu usando data-testid',
          );
          return;
        }
        // Busca o menu pelo seletor p-menu
        const menuEl = DataTestIdHelper.query(
          itemDebug,
          DataTestId.GroceryList.DetailsMenu,
        );
        if (!menuEl) {
          fail(
            'Teste falhou: precisa implementar busca pelo menu usando data-testid',
          );
          return;
        }
        const menuInstance: Menu = menuEl.componentInstance;
        spyOn(menuInstance, 'toggle');
        // Simula clique no botão de menu
        menuButton.nativeElement.click();
        fixture.detectChanges();
        expect(menuInstance.toggle).toHaveBeenCalled();
      });
    });
  });
  describe('quando o componente é inicializado', () => {
    it('precisa exibir estado vazio quando não há itens', () => {
      runInContext(() => {
        mockSignal.set([]);
        mockGroceryItemService.getAll.and.returnValue(of([]));

        fixture.detectChanges();

        const emptyState = DataTestIdHelper.query(
          fixture.debugElement,
          DataTestId.GroceryList.EmptyState,
        );

        expect(emptyState).toBeTruthy();
      });
    });
    it('deve renderizar o ícone de exibição do item quando ele estiver configurado como escondido', () => {
      runInContext(() => {
        component.showAllItems.set(true);
        const mockItem = createGroceryItemModelMock({ hidden: true });
        mockSignal.set([mockItem]);
        fixture.detectChanges();
        const itemDebug = DataTestIdHelper.queryOrFail(
          fixture.debugElement,
          DataTestId.GroceryList.Item,
        );
        expect(itemDebug).toBeTruthy();
        // Busca o ícone pi-eye-slash
        const icon = itemDebug?.nativeElement.querySelector('i.pi-eye-slash');
        expect(icon).toBeTruthy();
      });
    });
    it('não deve renderizar o ícone de exibição quando item estiver configurado como visível', () => {
      runInContext(() => {
        const mockItem = createGroceryItemModelMock({ hidden: false });
        mockSignal.set([mockItem]);
        fixture.detectChanges();
        const itemDebug = DataTestIdHelper.queryOrFail(
          fixture.debugElement,
          DataTestId.GroceryList.Item,
        );
        const icon = itemDebug?.nativeElement.querySelector('i.pi-eye-slash');
        expect(icon).toBeFalsy();
      });
    });
    it('precisa carregar os itens do serviço', () => {
      runInContext(() => {
        fixture.detectChanges();
        expect(mockGroceryItemService.getAll).toHaveBeenCalled();
      });
    });

    it('precisa listar os itens na interface', () => {
      runInContext(() => {
        const mockItems = [
          createGroceryItemModelMock(),
          createGroceryItemModelMock({ name: 'Item 2' }),
          createGroceryItemModelMock({ name: 'Item 3' }),
        ];
        mockSignal.set(mockItems);

        fixture.detectChanges();

        const items = DataTestIdHelper.queryAll(
          fixture.debugElement,
          DataTestId.GroceryList.Item,
        );

        expect(items.length).toBe(mockItems.length);
      });
    });

    it('precisa renderizar o nome dos itens corretamente', () => {
      runInContext(() => {
        const mockItems = [createGroceryItemModelMock()];
        mockSignal.set(mockItems);

        fixture.detectChanges();

        const itemNames = DataTestIdHelper.queryAll(
          fixture.debugElement,
          DataTestId.GroceryList.ItemName,
        );

        expect(itemNames.length).toBeGreaterThan(0);
        expect(itemNames[0].nativeElement.textContent.trim()).toBe(
          component.groceryItems()[0].name,
        );
      });
    });
  });
  describe('quando ocorre um erro ao carregar os itens', () => {
    it('precisa exibir mensagem de erro', () => {
      runInContext(() => {
        mockGroceryItemService.getAll.and.returnValue(
          throwError(() => new Error('Erro ao carregar')),
        );
        fixture.detectChanges();
        expect(component.hasError).toBe(true);
      });
    });

    it('precisa renderizar o estado de erro na interface', () => {
      runInContext(() => {
        mockGroceryItemService.getAll.and.returnValue(
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
        mockGroceryItemService.getAll.and.returnValue(
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
        mockGroceryItemService.getAll.and.returnValue(of([]).pipe(delay(1000)));
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
        mockGroceryItemService.getAll.and.returnValue(of([]).pipe(delay(1000)));
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
      mockGroceryItemService.getAll.and.returnValue(of(mockItems));

      component.loadItems();
      tick(1);

      expect(component.loading).toBe(false);
    }));
  });
  describe('quando o botão de adicionar é clicado', () => {
    it('precisa abrir o modal de adição de item', () => {
      runInContext(() => {
        fixture.detectChanges();
        component.onAdd();
        fixture.detectChanges();
        expect(component.showRegistryDialog()).toBe(true);
      });
    });
  });
  describe('quando o botão de editar é clicado', () => {
    it('deve abrir o modal de edição', () => {
      runInContext(() => {
        fixture.detectChanges();
        // Simula um item na lista
        const mockItem = createGroceryItemModelMock({ name: 'Item Editável' });
        mockSignal.set([mockItem]);
        fixture.detectChanges();
        // Simula clique no botão de editar (índice 0 do menu)
        component
          .groceryItems()?.[0]
          .menu()[0]
          .command?.({ item: { label: 'Editar' } } as MenuItemCommandEvent);
        fixture.detectChanges();
        expect(component.showRegistryDialog()).toBe(true);
      });
    });
  });
  describe('quando o usuário clica no item da lista', () => {
    it('precisa chamar updateMissing do service com o item correto', fakeAsync(() => {
      runInContext(() => {
        const mockItem = createGroceryItemModelMock({ missing: false });
        mockSignal.set([mockItem]);
        mockGroceryItemService.updateMissing.and.returnValue(
          of(createGroceryItemModelMock({ ...mockItem, missing: true })),
        );

        fixture.detectChanges();

        const itemElement = DataTestIdHelper.queryOrFail(
          fixture.debugElement,
          DataTestId.GroceryList.Item,
        );
        itemElement.nativeElement.click();
        tick(1);

        expect(mockGroceryItemService.updateMissing).toHaveBeenCalled();
      });
    }));

    it('precisa exibir toast de erro quando updateMissing falhar', fakeAsync(() => {
      runInContext(() => {
        const mockItem = createGroceryItemModelMock({ missing: false });
        mockSignal.set([mockItem]);
        mockGroceryItemService.updateMissing.and.returnValue(
          throwError(() => new Error('Erro ao atualizar')),
        );

        fixture.detectChanges();

        const itemElement = DataTestIdHelper.queryOrFail(
          fixture.debugElement,
          DataTestId.GroceryList.Item,
        );
        itemElement.nativeElement.click();
        tick(1);

        expect(mockMessageService.add).toHaveBeenCalled();
      });
    }));

    it('precisa definir estado de loading no item durante a atualização', fakeAsync(() => {
      runInContext(() => {
        const mockItem = createGroceryItemModelMock({ missing: false });
        mockSignal.set([mockItem]);
        mockGroceryItemService.updateMissing.and.returnValue(
          of(createGroceryItemModelMock({ ...mockItem, missing: true })).pipe(
            delay(100),
          ),
        );

        fixture.detectChanges();

        const itemElement = DataTestIdHelper.queryOrFail(
          fixture.debugElement,
          DataTestId.GroceryList.Item,
        );
        itemElement.nativeElement.click();
        fixture.detectChanges();

        const itemInList = component
          .groceryItems()
          .find((item) => item.uuid === mockItem.uuid);

        expect(itemInList?.changingMissing).toBe(true);
      });
    }));

    it('precisa remover estado de loading após atualização com sucesso', fakeAsync(() => {
      runInContext(() => {
        const mockItem = createGroceryItemModelMock({ missing: false });
        mockSignal.set([mockItem]);
        mockGroceryItemService.updateMissing.and.returnValue(
          of(createGroceryItemModelMock({ ...mockItem, missing: true })),
        );

        fixture.detectChanges();

        const itemElement = DataTestIdHelper.queryOrFail(
          fixture.debugElement,
          DataTestId.GroceryList.Item,
        );
        itemElement.nativeElement.click();
        tick(1);

        const itemInList = component
          .groceryItems()
          .find((item) => item.uuid === mockItem.uuid);

        expect(itemInList?.adding).toBe(false);
      });
    }));

    it('precisa alterar o atributo missing antes de chamar o service', fakeAsync(() => {
      runInContext(() => {
        const mockItem = createGroceryItemModelMock({ missing: false });
        mockSignal.set([mockItem]);

        let missingValueWhenServiceCalled: boolean | undefined;
        mockGroceryItemService.updateMissing.and.callFake((item) => {
          missingValueWhenServiceCalled = component
            .groceryItems()
            .find((i) => i.uuid === item.uuid)?.missing;
          return of(
            createGroceryItemModelMock({ ...item, missing: true }),
          ).pipe(delay(50));
        });

        fixture.detectChanges();

        const itemElement = DataTestIdHelper.queryOrFail(
          fixture.debugElement,
          DataTestId.GroceryList.Item,
        );
        itemElement.nativeElement.click();

        expect(missingValueWhenServiceCalled).toBe(true);
      });
    }));

    it('precisa reverter o atributo missing quando a requisição falhar', fakeAsync(() => {
      runInContext(() => {
        const mockItem = createGroceryItemModelMock({ missing: false });
        mockSignal.set([mockItem]);
        mockGroceryItemService.updateMissing.and.returnValue(
          throwError(() => new Error('Erro ao atualizar')),
        );

        fixture.detectChanges();

        const itemElement = DataTestIdHelper.queryOrFail(
          fixture.debugElement,
          DataTestId.GroceryList.Item,
        );
        itemElement.nativeElement.click();
        tick(1);

        const itemInList = component
          .groceryItems()
          .find((item) => item.uuid === mockItem.uuid);

        expect(itemInList?.missing).toBe(false);
      });
    }));

    it('não deve chamar updateMissing se o item já está em processo de atualização', fakeAsync(() => {
      runInContext(() => {
        const mockItem = createGroceryItemModelMock({ missing: false });
        mockSignal.set([mockItem]);
        mockGroceryItemService.updateMissing.and.returnValue(
          of(createGroceryItemModelMock({ ...mockItem, missing: true })).pipe(
            delay(100),
          ),
        );

        fixture.detectChanges();

        const itemElement = DataTestIdHelper.queryOrFail(
          fixture.debugElement,
          DataTestId.GroceryList.Item,
        );
        itemElement.nativeElement.click();
        fixture.detectChanges();

        // Segundo clique enquanto ainda está processando
        itemElement.nativeElement.click();
        tick(100);

        expect(mockGroceryItemService.updateMissing).toHaveBeenCalledTimes(1);
      });
    }));
  });
});
