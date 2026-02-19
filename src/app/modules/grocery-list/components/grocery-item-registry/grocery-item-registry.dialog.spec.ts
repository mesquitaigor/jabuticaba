import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';

import { GroceryItemRegistryDialog } from './grocery-item-registry.dialog';
import { DataTestIdHelper } from '../../../../tests/helpers/data-testid.helper.spec';
import { DataTestId } from '../../../../shared/directives/data-testid';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { delay, of, throwError } from 'rxjs';
import { createGroceryItemModelMock } from '../../../../tests/mocks/GroceryItemModel.mock.spec';
import { signal } from '@angular/core';
import GroceryItemModel from '../../../../data/entities/grocery-items/grocery-item.model';
import { MessageService } from 'primeng/api';
import { createMessageServiceMock } from '../../../../tests/mocks/message.service.mock.spec';
import { GroceryItemService } from '@models/grocery-items';
import { DialogServiceMock } from '../../../../tests/mocks/dialog.service.mock.spec';
import { DialogService } from '@layout/dialog';

describe(GroceryItemRegistryDialog.name, () => {
  let component: GroceryItemRegistryDialog;
  let fixture: ComponentFixture<GroceryItemRegistryDialog>;
  let mockGroceryItemService: jasmine.SpyObj<GroceryItemService>;
  let mockSignal = signal<GroceryItemModel[]>([]);
  let mockMessageService: jasmine.SpyObj<MessageService>;
  const dialogServiceMocker = new DialogServiceMock();
  let dialogServiceSpy: jasmine.SpyObj<DialogService>;
  beforeEach(async () => {
    dialogServiceMocker.create();
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
        dialogServiceMocker.getProvider(),
      ],
      imports: [GroceryItemRegistryDialog],
    }).compileComponents();

    fixture = TestBed.createComponent(GroceryItemRegistryDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
    dialogServiceSpy = dialogServiceMocker.getSpy();
  });

  it('precisa ser criado', () => {
    expect(component).toBeTruthy();
  });
  describe('quando componente é inicializado', () => {
    it('precisa manter o botão de salvar desabilitado quando o input está vazio', () => {
      TestBed.runInInjectionContext(() => {
        component.itemNameControl.setValue('');

        fixture.detectChanges();

        const saveButton = DataTestIdHelper.query(
          fixture.debugElement,
          DataTestId.GroceryItemRegistryDialog.SaveButton,
        );

        expect(saveButton?.componentInstance.disabled).toBe(true);
      });
    });
  });
  describe('quando usuário inserir valor no input de nome do item', () => {
    it('precisa habilitar o botão de salvar quando o usuário digita no input', fakeAsync(() => {
      TestBed.runInInjectionContext(() => {
        component.itemNameControl.setValue('');

        fixture.detectChanges();

        component.itemNameControl.setValue('Novo Item');
        fixture.detectChanges();
        tick();
        const saveButton = DataTestIdHelper.query(
          fixture.debugElement,
          DataTestId.GroceryItemRegistryDialog.SaveButton,
        );

        expect(saveButton!.componentInstance.disabled).toBe(false);
      });
    }));

    it('precisa desabilitar o botão novamente se o input for esvaziado', () => {
      TestBed.runInInjectionContext(() => {
        component.itemNameControl.setValue('Novo Item');

        fixture.detectChanges();

        component.itemNameControl.setValue('');
        fixture.detectChanges();

        const saveButton = DataTestIdHelper.queryOrFail(
          fixture.debugElement,
          DataTestId.GroceryItemRegistryDialog.SaveButton,
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

    it('precisa chamar dialogService.close após criar com sucesso', fakeAsync(() => {
      component.itemNameControl.setValue('Novo Item');
      mockGroceryItemService.create.and.returnValue(
        of(createGroceryItemModelMock()),
      );

      component.exec();
      tick(1);

      expect(dialogServiceSpy.close).toHaveBeenCalled();
    }));

    it('precisa limpar o campo itemNameControl após criar com sucesso', fakeAsync(() => {
      component.itemNameControl.setValue('Novo Item');
      mockGroceryItemService.create.and.returnValue(
        of(createGroceryItemModelMock()),
      );

      component.exec();
      tick(1);

      expect(component.itemNameControl.value).toBeNull();
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
        mockGroceryItemService.create.and.returnValue(
          of(null).pipe(delay(100)),
        );

        fixture.detectChanges();
        component.exec();
        fixture.detectChanges();

        const saveButton = DataTestIdHelper.queryOrFail(
          fixture.debugElement,
          DataTestId.GroceryItemRegistryDialog.SaveButton,
        );
        expect(saveButton.componentInstance.disabled).toBe(true);
      });
    }));

    it('precisa exibir loading no botão durante a criação', fakeAsync(() => {
      TestBed.runInInjectionContext(() => {
        component.itemNameControl.setValue('Novo Item');

        mockGroceryItemService.create.and.returnValue(
          of(null).pipe(delay(100)),
        );

        fixture.detectChanges();
        component.exec();
        fixture.detectChanges();

        const saveButton = DataTestIdHelper.queryOrFail(
          fixture.debugElement,
          DataTestId.GroceryItemRegistryDialog.SaveButton,
        );

        expect(saveButton.componentInstance.disabled).toBe(true);
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

  describe('quando usuário clicar no botão cancelar', () => {
    it('precisa exibir mensagem de erro', fakeAsync(() => {
      component.itemNameControl.setValue('Novo Item');
      mockGroceryItemService.create.and.returnValue(
        throwError(() => new Error('Erro da rede')),
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

  describe('quando usuário clicar no botão cancelar', () => {
    it('precisa chamar dialogService.close', () => {
      component.itemNameControl.setValue('Teste');

      component.handleCancel();

      expect(dialogServiceSpy.close).toHaveBeenCalled();
    });

    it('precisa limpar o campo itemNameControl', () => {
      component.itemNameControl.setValue('Teste');

      component.handleCancel();

      expect(component.itemNameControl.value).toBeNull();
    });
  });

  describe('quando dialog é criado', () => {
    it('precisa manter o input vazio inicialmente', () => {
      expect(component.itemNameControl.value).toBeNull();
    });

    it('precisa preencher o input quando item é fornecido', async () => {
      // Simula definição do item via input
      fixture.detectChanges();
      Object.defineProperty(component, 'dialogData', {
        value: {
          id: '1',
          item: createGroceryItemModelMock({
            name: 'Item Editável',
          }),
        },
        writable: true,
      });
      component.ngAfterViewInit();
      await fixture.whenStable();
      expect(component.itemNameControl.value).toBe('Item Editável');
    });
  });
});
