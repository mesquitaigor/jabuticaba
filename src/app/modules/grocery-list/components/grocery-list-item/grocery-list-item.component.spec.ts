import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';

import { GroceryListItemComponent } from './grocery-list-item.component';
import { createGroceryItemModelMock } from '../../../../tests/mocks/GroceryItemModel.mock.spec';
import { signal } from '@angular/core';
import GroceryItemModel from '@models/grocery-items/grocery-item.model';
import { MenuItemCommandEvent, MessageService } from 'primeng/api';
import {
  GroceryItemIconModel,
  GroceryItemService,
} from '@models/grocery-items';
import { DialogService } from '@layout/dialog';
import { createMessageServiceMock } from '../../../../tests/mocks/message.service.mock.spec';
import { delay, of, throwError } from 'rxjs';
import { DataTestIdHelper } from '../../../../tests/helpers/data-testid.helper.spec';
import { DataTestId } from '@directives/data-testid';
import { Menu } from 'primeng/menu';
import GroceryItemServiceMocker from '../../../../tests/mocks/grocery-item.service.mock.spec';
import { GroceryItemIconComponent } from '../grocery-item-icon/grocery-item-icon.component';
import TemplateGroceryItemMapper from '../../resources/template-grocery-item.mapper';

fdescribe(GroceryListItemComponent.name, () => {
  let component: GroceryListItemComponent;
  let fixture: ComponentFixture<GroceryListItemComponent>;
  let mockSignal = signal<GroceryItemModel[]>([]);
  let mockMessageService: jasmine.SpyObj<MessageService>;
  let mockDialogService: jasmine.SpyObj<DialogService>;

  const groceryItemServiceMocker = new GroceryItemServiceMocker();
  let groceryItemService: jasmine.SpyObj<GroceryItemService>;
  const setInput = {
    item: (overrides?: Partial<GroceryItemModel>): GroceryItemModel => {
      const mockItem = { ...createGroceryItemModelMock(), ...overrides };
      fixture.componentRef.setInput('item', mockItem);
      return mockItem;
    },
  };
  const clickMenu = (index: number, label: string): void => {
    const templateItem = component.templateItem();
    if (templateItem) {
      templateItem.menu()[index].command?.({ item: { label } });
      fixture.detectChanges();
      tick(1);
    }
  };

  beforeEach(async () => {
    mockSignal = signal<GroceryItemModel[]>([]);
    groceryItemServiceMocker.create();
    mockMessageService = createMessageServiceMock();
    mockDialogService = jasmine.createSpyObj('DialogService', [
      'open',
      'close',
    ]);
    await TestBed.configureTestingModule({
      imports: [GroceryListItemComponent],
      providers: [
        groceryItemServiceMocker.getProvider(),
        { provide: MessageService, useValue: mockMessageService },
        { provide: DialogService, useValue: mockDialogService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(GroceryListItemComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput(
      'item',
      TemplateGroceryItemMapper.toTemplateGroceryItem(
        createGroceryItemModelMock(),
        {},
      ),
    );
    groceryItemService = groceryItemServiceMocker.getSpy();
  });

  it('deve ser criado', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
  describe('ao excluir item', () => {
    it('deve chamar o método delete do service ao clicar em excluir', fakeAsync(() => {
      TestBed.runInInjectionContext(() => {
        setInput.item();
        fixture.detectChanges();
        clickMenu(3, 'Excluir');
        expect(groceryItemService.delete).toHaveBeenCalled();
      });
    }));
    it('deve impedir múltiplas requisições enquanto está excluindo', fakeAsync(() => {
      TestBed.runInInjectionContext(() => {
        setInput.item();
        groceryItemService.delete.and.returnValue(of(null).pipe(delay(100)));
        fixture.detectChanges();
        clickMenu(3, 'Excluir');
        expect(groceryItemService.delete).toHaveBeenCalledTimes(1);
      });
    }));

    it('deve emitir toast de erro ao falhar', fakeAsync(() => {
      TestBed.runInInjectionContext(() => {
        setInput.item();
        groceryItemService.delete.and.returnValue(
          throwError(() => new Error('Erro ao excluir')),
        );
        fixture.detectChanges();
        clickMenu(3, 'Excluir');
        expect(mockMessageService.add).toHaveBeenCalledWith(
          jasmine.objectContaining({
            severity: 'error',
          }),
        );
      });
    }));

    it('deve emitir toast de sucesso ao excluir', fakeAsync(() => {
      TestBed.runInInjectionContext(() => {
        setInput.item();
        fixture.detectChanges();
        clickMenu(3, 'Excluir');
        expect(mockMessageService.add).toHaveBeenCalledWith(
          jasmine.objectContaining({
            severity: 'success',
          }),
        );
      });
    }));

    it('deve desabilitar o botão de excluir enquanto está excluindo', fakeAsync(() => {
      TestBed.runInInjectionContext(() => {
        const mockItem = createGroceryItemModelMock();
        fixture.componentRef.setInput('item', mockItem);
        groceryItemService.delete.and.returnValue(of(null).pipe(delay(100)));
        fixture.detectChanges();
        clickMenu(3, 'Excluir');
        const templateItem = component.templateItem();
        expect(templateItem?.menu()[3].disabled).toBe(true);
      });
    }));

    // it('deve remover o item da listagem ao excluir com sucesso', fakeAsync(() => {
    //   TestBed.runInInjectionContext(() => {

    //     groceryItemService.delete.and.returnValue(of(null));
    //     fixture.detectChanges();

    //     clickDelete();
    //     groceryItemService.getGroceryList().set([]);

    //     const items = DataTestIdHelper.queryAll(
    //       fixture.debugElement,
    //       DataTestId.GroceryList.Item,
    //     );
    //     expect(items.length).toBe(0);
    //   });
    // }));
  });
  describe('quando o botão de editar é clicado', () => {
    it('deve abrir o modal de edição com o item correto', fakeAsync(() => {
      TestBed.runInInjectionContext(() => {
        setInput.item({ name: 'Item Editável' });
        fixture.detectChanges();
        clickMenu(0, 'Editar');
        expect(mockDialogService.open).toHaveBeenCalledWith(
          jasmine.objectContaining({
            header: 'Editar item',
            data: jasmine.objectContaining({ item: jasmine.any(Object) }),
          }),
        );
      });
    }));
  });
  fdescribe('quando o usuário clica no item da lista', () => {
    it('precisa chamar updateMissing do service com o item correto', fakeAsync(() => {
      TestBed.runInInjectionContext(() => {
        const mockItem = setInput.item({ missing: false });
        groceryItemService.updateMissing.and.returnValue(
          of(createGroceryItemModelMock({ ...mockItem, missing: true })),
        );

        fixture.detectChanges();
        tick(1);
        fixture.detectChanges();

        const itemElement = DataTestIdHelper.queryOrFail(
          fixture.debugElement,
          DataTestId.GroceryList.Item,
        );
        itemElement.nativeElement.click();
        tick(1);

        expect(groceryItemService.updateMissing).toHaveBeenCalled();
      });
    }));

    it('precisa exibir toast de erro quando updateMissing falhar', fakeAsync(() => {
      TestBed.runInInjectionContext(() => {
        const mockItem = createGroceryItemModelMock({ missing: false });
        fixture.componentRef.setInput('item', mockItem);
        groceryItemService.updateMissing.and.returnValue(
          throwError(() => new Error('Erro ao atualizar')),
        );

        fixture.detectChanges();
        tick(1);
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
      TestBed.runInInjectionContext(() => {
        const mockItem = createGroceryItemModelMock({ missing: false });
        fixture.componentRef.setInput('item', mockItem);
        groceryItemService.updateMissing.and.returnValue(
          of(createGroceryItemModelMock({ ...mockItem, missing: true })).pipe(
            delay(100),
          ),
        );

        fixture.detectChanges();
        tick(1);
        fixture.detectChanges();

        const itemElement = DataTestIdHelper.queryOrFail(
          fixture.debugElement,
          DataTestId.GroceryList.Item,
        );
        itemElement.nativeElement.click();
        fixture.detectChanges();

        expect(component.templateItem()?.changingMissing).toBe(true);
      });
    }));

    it('precisa remover estado de loading após atualização com sucesso', fakeAsync(() => {
      TestBed.runInInjectionContext(() => {
        const mockItem = createGroceryItemModelMock({ missing: false });
        fixture.componentRef.setInput('item', mockItem);
        groceryItemService.updateMissing.and.returnValue(
          of(createGroceryItemModelMock({ ...mockItem, missing: true })),
        );

        fixture.detectChanges();
        tick(1);
        fixture.detectChanges();

        const itemElement = DataTestIdHelper.queryOrFail(
          fixture.debugElement,
          DataTestId.GroceryList.Item,
        );
        itemElement.nativeElement.click();
        tick(1);

        expect(component.templateItem()?.adding).toBe(false);
      });
    }));

    it('precisa alterar o atributo missing antes de chamar o service', fakeAsync(() => {
      TestBed.runInInjectionContext(() => {
        const mockItem = createGroceryItemModelMock({ missing: false });
        fixture.componentRef.setInput('item', mockItem);

        let missingValueWhenServiceCalled: boolean | undefined;
        groceryItemService.updateMissing.and.callFake((item) => {
          missingValueWhenServiceCalled = component.item().missing;
          return of(
            createGroceryItemModelMock({ ...item, missing: true }),
          ).pipe(delay(50));
        });

        fixture.detectChanges();
        tick(1);
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
      TestBed.runInInjectionContext(() => {
        const mockItem = createGroceryItemModelMock({ missing: false });
        fixture.componentRef.setInput('item', mockItem);
        groceryItemService.updateMissing.and.returnValue(
          throwError(() => new Error('Erro ao atualizar')),
        );

        fixture.detectChanges();
        tick(1);
        fixture.detectChanges();

        const itemElement = DataTestIdHelper.queryOrFail(
          fixture.debugElement,
          DataTestId.GroceryList.Item,
        );
        itemElement.nativeElement.click();
        tick(1);

        expect(component.item().missing).toBe(false);
      });
    }));

    it('não deve chamar updateMissing se o item já está em processo de atualização', fakeAsync(() => {
      TestBed.runInInjectionContext(() => {
        const mockItem = createGroceryItemModelMock({ missing: false });
        fixture.componentRef.setInput('item', mockItem);
        groceryItemService.updateMissing.and.returnValue(
          of(createGroceryItemModelMock({ ...mockItem, missing: true })).pipe(
            delay(100),
          ),
        );

        fixture.detectChanges();
        tick(1);
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

        expect(groceryItemService.updateMissing).toHaveBeenCalledTimes(1);
      });
    }));
  });
  describe('quando o componente é inicializado', () => {
    it('precisa passar o ícone do item para o componente jbt-grocery-item-icon', fakeAsync(() => {
      TestBed.runInInjectionContext(() => {
        const mockItem = createGroceryItemModelMock({
          icon: new GroceryItemIconModel('apple'),
        });
        fixture.componentRef.setInput('item', mockItem);

        fixture.detectChanges();
        tick(1);
        fixture.detectChanges();

        const iconElement = fixture.debugElement.query(
          (el) => el.nativeElement.tagName === 'JBT-GROCERY-ITEM-ICON',
        );
        expect(iconElement).toBeTruthy();
        const iconInstance: GroceryItemIconComponent =
          iconElement?.componentInstance;
        expect(iconInstance.iconName()?.name).toBe('apple');
      });
    }));
    it('deve renderizar o ícone de exibição(olho) quando o item estiver configurado como escondido', fakeAsync(() => {
      TestBed.runInInjectionContext(() => {
        const mockItem = createGroceryItemModelMock({ hidden: true });
        fixture.componentRef.setInput('item', mockItem);
        fixture.detectChanges();
        tick(1);
        fixture.detectChanges();
        const itemDebug = DataTestIdHelper.queryOrFail(
          fixture.debugElement,
          DataTestId.GroceryList.Item,
        );
        expect(itemDebug).toBeTruthy();
        const icon = itemDebug?.nativeElement.querySelector('i.pi-eye-slash');
        expect(icon).toBeTruthy();
      });
    }));
    it('não deve renderizar o ícone de exibição quando item estiver configurado como visível', fakeAsync(() => {
      TestBed.runInInjectionContext(() => {
        const mockItem = createGroceryItemModelMock({ hidden: false });
        fixture.componentRef.setInput('item', mockItem);
        fixture.detectChanges();
        tick(1);
        fixture.detectChanges();
        const itemDebug = DataTestIdHelper.queryOrFail(
          fixture.debugElement,
          DataTestId.GroceryList.Item,
        );
        const icon = itemDebug?.nativeElement.querySelector('i.pi-eye-slash');
        expect(icon).toBeFalsy();
      });
    }));
    it('precisa renderizar o nome dos itens corretamente', fakeAsync(() => {
      TestBed.runInInjectionContext(() => {
        const mockItem = createGroceryItemModelMock();
        fixture.componentRef.setInput('item', mockItem);

        fixture.detectChanges();
        tick(1);
        fixture.detectChanges();

        const itemNames = DataTestIdHelper.queryAll(
          fixture.debugElement,
          DataTestId.GroceryListItemComponent.ItemName,
        );

        expect(itemNames.length).toBeGreaterThan(0);
        expect(itemNames[0].nativeElement.textContent.trim()).toBe(
          component.item().name,
        );
      });
    }));
  });
  describe('quando o botão de marcar/desmarcar é clicado', () => {
    it('deve exibir "Marcar" quando missing é false e "Desmarcar" quando missing é true', () => {
      TestBed.runInInjectionContext(() => {
        const mockItem = createGroceryItemModelMock({ missing: false });
        fixture.componentRef.setInput('item', mockItem);
        fixture.detectChanges();
        // missing false
        expect(component.templateItem()?.menu()[2].label).toBe('Marcar');
        // Simula mudança para missing true
        const item = component.templateItem();
        if (item) {
          item.missing = true;
          item['defineMissingLabel']();
        }
        fixture.detectChanges();
        expect(component.templateItem()?.menu()[2].label).toBe('Desmarcar');
      });
    });
    it('precisa chamar updateMissing do service ao clicar no menu', fakeAsync(() => {
      TestBed.runInInjectionContext(() => {
        const mockItem = createGroceryItemModelMock({ missing: false });
        mockSignal.set([mockItem]);
        groceryItemService.updateMissing.and.returnValue(
          of(createGroceryItemModelMock({ ...mockItem, missing: true })),
        );
        fixture.detectChanges();
        // Simula clique no botão de editar missing no menu
        const templateItem = component.templateItem();
        if (templateItem) {
          templateItem
            .menu()[2] // índice do botão 'Marcar' (editar missing)
            .command?.({
              item: { label: 'Marcar' },
            } as MenuItemCommandEvent);
          fixture.detectChanges();
          tick(1);
        }
        expect(groceryItemService.updateMissing).toHaveBeenCalledWith(
          jasmine.objectContaining({ uuid: mockItem.uuid }),
        );
      });
    }));
    it('precisa emitir toast de erro quando updateMissing falhar', fakeAsync(() => {
      TestBed.runInInjectionContext(() => {
        const mockItem = createGroceryItemModelMock({ missing: false });
        fixture.componentRef.setInput('item', mockItem);
        groceryItemService.updateMissing.and.returnValue(
          throwError(() => new Error('Erro ao atualizar')),
        );
        fixture.detectChanges();
        const templateItem = component.templateItem();
        if (templateItem) {
          templateItem.menu()[2].command?.({
            item: { label: 'Marcar' },
          } as MenuItemCommandEvent);
          fixture.detectChanges();
          tick(1);
        }
        expect(mockMessageService.add).toHaveBeenCalledWith(
          jasmine.objectContaining({ severity: 'error' }),
        );
      });
    }));
    it('precisa desabilitar o botão enquanto está atualizando', fakeAsync(() => {
      TestBed.runInInjectionContext(() => {
        const mockItem = createGroceryItemModelMock({ missing: false });
        fixture.componentRef.setInput('item', mockItem);
        groceryItemService.updateMissing.and.returnValue(
          of(createGroceryItemModelMock({ ...mockItem, missing: true })).pipe(
            delay(100),
          ),
        );
        fixture.detectChanges();
        const templateItem = component.templateItem();
        if (templateItem) {
          templateItem.menu()[2].command?.({
            item: { label: 'Marcar' },
          } as MenuItemCommandEvent);
          fixture.detectChanges();
          tick(1);
        }
        const templateItemAfter = component.templateItem();
        expect(templateItemAfter?.menu()[2].disabled).toBe(true);
      });
    }));
  });
  describe('quando o botão de menu do item é clicado', () => {
    it('precisa chamar toggle do menu', fakeAsync(() => {
      TestBed.runInInjectionContext(() => {
        // Cria um item na lista
        const mockItem = createGroceryItemModelMock();
        fixture.componentRef.setInput('item', mockItem);
        fixture.detectChanges();
        tick(1);
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
          DataTestId.GroceryListItemComponent.DetailsItemButton,
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
          DataTestId.GroceryListItemComponent.DetailsMenu,
        );
        if (!menuEl) {
          fail(
            'Teste falhou: precisa implementar busca pelo menu usando data-testid',
          );
          return;
        }
        const menuInstance: Menu = menuEl.componentInstance;
        spyOn(menuInstance, 'toggle');
        menuButton.nativeElement.click();
        fixture.detectChanges();
        expect(menuInstance.toggle).toHaveBeenCalled();
      });
    }));
  });
});
