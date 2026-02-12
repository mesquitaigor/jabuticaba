import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';

import { GroceryItemRegistryModalDialog } from './grocery-item-registry.dialog';
import { DataTestIdHelper } from '../../../../tests/helpers/data-testid.helper.spec';
import { DataTestId } from '../../../../shared/directives/data-testid';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { delay, of, throwError } from 'rxjs';
import { GroceryItemService } from '../../../../data/entities/grocery-items/grocery-item.service';
import { createGroceryItemModelMock } from '../../../../tests/mocks/GroceryItemModel.mock.spec';
import { signal } from '@angular/core';
import GroceryItemModel from '../../../../data/entities/grocery-items/grocery-item.model';
import { MessageService } from 'primeng/api';
import { createMessageServiceMock } from '../../../../tests/mocks/message.service.mock.spec';

fdescribe(GroceryItemRegistryModalDialog.name, () => {
  let component: GroceryItemRegistryModalDialog;
  let fixture: ComponentFixture<GroceryItemRegistryModalDialog>;
  let mockGroceryItemService: jasmine.SpyObj<GroceryItemService>;
  let mockSignal = signal<GroceryItemModel[]>([]);
  let mockMessageService: jasmine.SpyObj<MessageService>;

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
      providers: [
        provideAnimationsAsync(),
        { provide: GroceryItemService, useValue: mockGroceryItemService },
        { provide: MessageService, useValue: mockMessageService },
      ],
      imports: [GroceryItemRegistryModalDialog],
    }).compileComponents();

    fixture = TestBed.createComponent(GroceryItemRegistryModalDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('precisa ser criado', () => {
    expect(component).toBeTruthy();
  });
  describe('quando componente é inicializado', () => {
    it('precisa manter o botão de salvar desabilitado quando o input está vazio', () => {
      TestBed.runInInjectionContext(() => {
        fixture.componentRef.setInput('showDialog', true);
        component.itemNameControl.setValue('');

        fixture.detectChanges();

        const saveButton = DataTestIdHelper.query(
          fixture.debugElement,
          DataTestId.GroceryList.SaveButton,
        );

        expect(saveButton?.componentInstance.disabled).toBe(true);
      });
    });
  });
  describe('quando usuário inserir valor no input de nome do item', () => {
    it('precisa habilitar o botão de salvar quando o usuário digita no input', fakeAsync(() => {
      TestBed.runInInjectionContext(() => {
        fixture.componentRef.setInput('showDialog', true);
        component.itemNameControl.setValue('');

        fixture.detectChanges();

        component.itemNameControl.setValue('Novo Item');
        fixture.detectChanges();
        tick();
        const saveButton = DataTestIdHelper.query(
          fixture.debugElement,
          DataTestId.GroceryList.SaveButton,
        );

        expect(saveButton!.componentInstance.disabled).toBe(false);
      });
    }));

    it('precisa desabilitar o botão novamente se o input for esvaziado', () => {
      TestBed.runInInjectionContext(() => {
        fixture.componentRef.setInput('showDialog', true);
        component.itemNameControl.setValue('Novo Item');

        fixture.detectChanges();

        component.itemNameControl.setValue('');
        fixture.detectChanges();

        const saveButton = DataTestIdHelper.queryOrFail(
          fixture.debugElement,
          DataTestId.GroceryList.SaveButton,
        );

        expect(saveButton.componentInstance.disabled).toBe(true);
      });
    });
  });
  describe('quando salvar um novo item', () => {
    it('precisa chamar o método create do service', () => {
      TestBed.runInInjectionContext(() => {
        const itemName = 'Novo Item';
        component.itemNameControl.setValue(itemName);
        fixture.detectChanges();

        component.exec();

        expect(mockGroceryItemService.create).toHaveBeenCalledWith(itemName);
      });
    });

    it('precisa definir executing como true ao iniciar a criação', () => {
      TestBed.runInInjectionContext(() => {
        component.itemNameControl.setValue('Novo Item');
        mockGroceryItemService.create.and.returnValue(
          of(null).pipe(delay(100)),
        );

        component.exec();
        expect(component.executing()).toBe(true);
      });
    });

    it('precisa definir executing como false após criar com sucesso', fakeAsync(() => {
      component.itemNameControl.setValue('Novo Item');
      mockGroceryItemService.create.and.returnValue(
        of(createGroceryItemModelMock()),
      );

      component.exec();
      tick(1);

      expect(component.executing()).toBe(false);
    }));

    it('precisa definir executing como false após erro na criação', fakeAsync(() => {
      component.itemNameControl.setValue('Novo Item');
      mockGroceryItemService.create.and.returnValue(
        throwError(() => new Error('Erro ao criar')),
      );

      component.exec();
      tick(1);

      expect(component.executing()).toBe(false);
    }));

    it('precisa fechar o modal após criar com sucesso', fakeAsync(() => {
      component.itemNameControl.setValue('Novo Item');
      component.showDialogFlag = true;
      mockGroceryItemService.create.and.returnValue(
        of(createGroceryItemModelMock()),
      );

      component.exec();
      tick(1);

      expect(component.showDialogFlag).toBe(false);
    }));

    it('precisa limpar o campo itemNameControl após criar com sucesso', fakeAsync(() => {
      component.itemNameControl.setValue('Novo Item');
      mockGroceryItemService.create.and.returnValue(
        of(createGroceryItemModelMock()),
      );

      component.exec();
      tick(1);

      expect(component.itemNameControl.value).toBe('');
    }));

    it('não deve chamar o service múltiplas vezes se já está criando', () => {
      component.itemNameControl.setValue('Novo Item');
      component.executing.set(true);

      component.exec();

      expect(mockGroceryItemService.create).not.toHaveBeenCalled();
    });

    it('precisa desabilitar o botão de salvar durante a criação', fakeAsync(() => {
      TestBed.runInInjectionContext(() => {
        component.itemNameControl.setValue('Novo Item');
        component.showDialogFlag = true;
        mockGroceryItemService.create.and.returnValue(
          of(null).pipe(delay(100)),
        );

        fixture.detectChanges();
        component.exec();
        fixture.detectChanges();

        const saveButton = DataTestIdHelper.queryOrFail(
          fixture.debugElement,
          DataTestId.GroceryList.SaveButton,
        );
        expect(saveButton.componentInstance.disabled).toBe(true);
      });
    }));

    it('precisa exibir loading no botão durante a criação', fakeAsync(() => {
      TestBed.runInInjectionContext(() => {
        component.itemNameControl.setValue('Novo Item');
        component.showDialogFlag = true;
        mockGroceryItemService.create.and.returnValue(
          of(null).pipe(delay(100)),
        );

        fixture.detectChanges();
        component.exec();
        fixture.detectChanges();

        const saveButton = DataTestIdHelper.query(
          fixture.debugElement,
          DataTestId.GroceryList.SaveButton,
        );

        expect(saveButton!.componentInstance.disabled).toBe(true);
      });
    }));
    it('precisa exibir toast de erro quando a criação falhar', fakeAsync(() => {
      component.itemNameControl.setValue('Novo Item');
      mockGroceryItemService.create.and.returnValue(
        throwError(() => new Error('Erro ao criar')),
      );

      component.exec();
      tick(1);

      expect(mockMessageService.add).toHaveBeenCalledWith({
        severity: 'error',
        summary: 'Erro',
        detail: 'Não foi possível adicionar o item',
      });
    }));
  });
  // it('deve preencher o input de nome com o nome do item ao abrir o modal', () => {
  //     runInContext(() => {
  //       fixture.detectChanges();
  //       const mockItem = createGroceryItemModelMock({ name: 'Item Editável' });
  //       mockSignal.set([mockItem]);
  //       fixture.detectChanges();
  //       component
  //         .groceryItems()?.[0]
  //         .menu()[0]
  //         .command?.({ item: { label: 'Editar' } } as MenuItemCommandEvent);
  //       fixture.detectChanges();
  //       // Verifica se o input foi preenchido corretamente
  //       expect(component.newItemName.value).toBe('Item Editável');
  //     });
  //   });
});
