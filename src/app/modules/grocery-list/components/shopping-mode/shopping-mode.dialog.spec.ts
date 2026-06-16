import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { delay, of, throwError } from 'rxjs';
import { MessageService } from 'primeng/api';

import { GroceryItemService } from '@models/grocery-items';
import { DialogService } from '@layout/dialog';
import { DialogServiceSpy } from '../../../../tests/spys/dialog.service.spy.spec';
import { createMessageServiceSpy } from '../../../../tests/spys/message.service.spy.spec';
import { createGroceryItemModelMock } from '../../../../tests/mocks/GroceryItemModel.mock.spec';
import GroceryItemModel from '../../../../data/entities/grocery-items/grocery-item.model';
import { ShoppingModeDialog } from './shopping-mode.dialog';

describe(ShoppingModeDialog.name, () => {
  let component: ShoppingModeDialog;
  let fixture: ComponentFixture<ShoppingModeDialog>;
  let mockGroceryItemService: jasmine.SpyObj<GroceryItemService>;
  let mockMessageService: jasmine.SpyObj<MessageService>;
  const dialogServiceMocker = new DialogServiceSpy();
  let dialogServiceSpy: jasmine.SpyObj<DialogService>;

  beforeEach(async () => {
    dialogServiceMocker.create();
    mockGroceryItemService = jasmine.createSpyObj(GroceryItemService.name, [
      'updateMissing',
    ]);
    mockGroceryItemService.updateMissing.and.returnValue(
      of(createGroceryItemModelMock()),
    );
    mockMessageService = createMessageServiceSpy();

    await TestBed.configureTestingModule({
      imports: [ShoppingModeDialog],
      providers: [
        provideAnimationsAsync(),
        { provide: GroceryItemService, useValue: mockGroceryItemService },
        { provide: MessageService, useValue: mockMessageService },
        dialogServiceMocker.getProvider(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ShoppingModeDialog);
    component = fixture.componentInstance;
    dialogServiceSpy = dialogServiceMocker.getSpy();
  });

  it('precisa ser criado', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe('quando o componente é inicializado', () => {
    it('precisa carregar os itens do dialogData', () => {
      const items = [createGroceryItemModelMock()];
      component.dialogData = { items, id: 'test-id' };

      fixture.detectChanges();

      expect(component.items).toEqual(items);
    });

    it('precisa pré-marcar itens com missing=true como verificados', () => {
      const missingItem = createGroceryItemModelMock({ missing: true });
      const notMissingItem = createGroceryItemModelMock({
        uuid: 'other-uuid',
        missing: false,
      });
      component.dialogData = {
        items: [missingItem, notMissingItem],
        id: 'test-id',
      };

      fixture.detectChanges();

      expect(component.checkedItems().has(missingItem.uuid!)).toBe(true);
      expect(component.checkedItems().has(notMissingItem.uuid!)).toBe(false);
    });

    it('precisa inicializar com lista vazia quando dialogData não é fornecido', () => {
      fixture.detectChanges();

      expect(component.items).toEqual([]);
      expect(component.checkedItems().size).toBe(0);
    });
  });

  describe('isChecked', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('retorna false para uuid undefined', () => {
      expect(component.isChecked(undefined)).toBe(false);
    });

    it('retorna true quando uuid está nos checkedItems', () => {
      const uuid = 'test-uuid';
      component.checkedItems.set(new Set([uuid]));

      expect(component.isChecked(uuid)).toBe(true);
    });

    it('retorna false quando uuid não está nos checkedItems', () => {
      component.checkedItems.set(new Set());

      expect(component.isChecked('uuid-nao-existente')).toBe(false);
    });
  });

  describe('quando o usuário clica em um item', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('não faz nada quando o item não possui uuid', () => {
      const item = new GroceryItemModel();

      component.onCheck(item);

      expect(component.checkedItems().size).toBe(0);
    });

    it('adiciona o item aos checkedItems quando não estava marcado', () => {
      const item = createGroceryItemModelMock({ uuid: 'item-uuid' });

      component.onCheck(item);

      expect(component.checkedItems().has('item-uuid')).toBe(true);
    });

    it('remove o item dos checkedItems quando já estava marcado', () => {
      const item = createGroceryItemModelMock({ uuid: 'item-uuid' });
      component.checkedItems.set(new Set(['item-uuid']));

      component.onCheck(item);

      expect(component.checkedItems().has('item-uuid')).toBe(false);
    });
  });

  describe('quando o usuário confirma', () => {
    it('precisa chamar updateMissing apenas para itens alterados', () => {
      const changedItem = createGroceryItemModelMock({
        uuid: 'item-1',
        missing: false,
      });
      const unchangedItem = createGroceryItemModelMock({
        uuid: 'item-2',
        missing: false,
      });
      component.items = [changedItem, unchangedItem];
      component.checkedItems.set(new Set(['item-1']));

      component.confirm();

      expect(mockGroceryItemService.updateMissing).toHaveBeenCalledOnceWith(
        changedItem,
      );
    });

    it('não precisa chamar updateMissing quando nenhum item mudou', () => {
      const item = createGroceryItemModelMock({
        uuid: 'item-1',
        missing: false,
      });
      component.items = [item];
      component.checkedItems.set(new Set());

      component.confirm();

      expect(mockGroceryItemService.updateMissing).not.toHaveBeenCalled();
    });

    it('precisa fechar o dialog imediatamente quando nenhum item foi alterado', () => {
      component.items = [];

      component.confirm();

      expect(dialogServiceSpy.close).toHaveBeenCalled();
    });

    it('não deve fechar o dialog antes das requisições completarem', fakeAsync(() => {
      const item = createGroceryItemModelMock({ uuid: 'item-1', missing: false });
      component.items = [item];
      component.checkedItems.set(new Set(['item-1']));
      mockGroceryItemService.updateMissing.and.returnValue(
        of(createGroceryItemModelMock()).pipe(delay(100)),
      );

      component.confirm();

      expect(dialogServiceSpy.close).not.toHaveBeenCalled();

      tick(100);

      expect(dialogServiceSpy.close).toHaveBeenCalled();
    }));

    it('precisa fechar o dialog após as requisições completarem', fakeAsync(() => {
      const item = createGroceryItemModelMock({ uuid: 'item-1', missing: false });
      component.items = [item];
      component.checkedItems.set(new Set(['item-1']));

      component.confirm();
      tick();

      expect(dialogServiceSpy.close).toHaveBeenCalled();
    }));

    it('precisa atualizar item.missing de acordo com o estado marcado', () => {
      const item = createGroceryItemModelMock({
        uuid: 'item-1',
        missing: false,
      });
      component.items = [item];
      component.checkedItems.set(new Set(['item-1']));

      component.confirm();

      expect(item.missing).toBe(true);
    });

    it('reverte item.missing quando updateMissing retorna erro', fakeAsync(() => {
      const item = createGroceryItemModelMock({
        uuid: 'item-1',
        missing: false,
      });
      component.items = [item];
      component.checkedItems.set(new Set(['item-1']));
      mockGroceryItemService.updateMissing.and.returnValue(
        throwError(() => new Error('Erro de rede')),
      );

      component.confirm();
      tick();

      expect(item.missing).toBe(false);
    }));

    it('exibe toast de erro quando updateMissing falha', fakeAsync(() => {
      const item = createGroceryItemModelMock({
        uuid: 'item-1',
        missing: false,
      });
      component.items = [item];
      component.checkedItems.set(new Set(['item-1']));
      mockGroceryItemService.updateMissing.and.returnValue(
        throwError(() => new Error('Erro de rede')),
      );

      component.confirm();
      tick();

      expect(mockMessageService.add).toHaveBeenCalledWith({
        severity: 'error',
        summary: 'Erro',
        detail: 'Não foi possível atualizar o item',
      });
    }));

    it('precisa fechar o dialog mesmo quando updateMissing retorna erro', fakeAsync(() => {
      const item = createGroceryItemModelMock({ uuid: 'item-1', missing: false });
      component.items = [item];
      component.checkedItems.set(new Set(['item-1']));
      mockGroceryItemService.updateMissing.and.returnValue(
        throwError(() => new Error('Erro de rede')),
      );

      component.confirm();
      tick();

      expect(dialogServiceSpy.close).toHaveBeenCalled();
    }));
  });
});
