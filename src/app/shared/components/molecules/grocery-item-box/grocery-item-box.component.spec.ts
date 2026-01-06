import {
  ComponentFixture,
  TestBed,
  tick,
  fakeAsync,
} from '@angular/core/testing';
import { GroceryItemService } from '../../../../data/entities/grocery-items/grocery-item.service';
import { GroceryItemBoxComponent } from './grocery-item-box.component';
import ElementGetter from '../../../../tests/helpers/ElementGetter.spec';
import {
  createGroceryItemModelMock,
  nameTestValue,
  uuidTestValue,
} from '../../../../tests/mocks/GroceryItemModel.mock.spec';
import { createGroceryItemServiceMock } from '../../../../tests/mocks/grocery-item.service.mock.spec';

const COMPONENT_DATA_TEST_IDS = {
  grocery_item_box_delete_button: 'grocery-item-box-delete-button',
  grocery_item_box_checkbox: 'grocery-item-box-checkbox',
  grocery_item_box_p_name: 'grocery-item-box-p-name',
  grocery_item_box_input_name: 'grocery-item-box-input-name',
};

describe(GroceryItemBoxComponent.name, () => {
  let component: GroceryItemBoxComponent;
  let fixture: ComponentFixture<GroceryItemBoxComponent>;
  let mockGroceryItemService: jasmine.SpyObj<GroceryItemService>;

  const elementGetter = new ElementGetter(COMPONENT_DATA_TEST_IDS);

  beforeEach(async () => {
    mockGroceryItemService = createGroceryItemServiceMock();
    await TestBed.configureTestingModule({
      imports: [GroceryItemBoxComponent],
      providers: [
        { provide: GroceryItemService, useValue: mockGroceryItemService },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(GroceryItemBoxComponent);
    component = fixture.componentInstance;
    elementGetter.setFixture(fixture);
    const mockGroceryItemModel = createGroceryItemModelMock();
    fixture.componentRef.setInput('item', mockGroceryItemModel);
    fixture.detectChanges();
  });

  it('deve ser criado', () => {
    expect(component).toBeTruthy();
  });

  describe('Quando o usuário visualiza um item da lista', () => {
    it('deve exibir o nome do item', () => {
      const nomeElement = elementGetter.getByTestId('grocery_item_box_p_name');
      expect(nomeElement?.nativeElement.textContent.trim()).toBe(nameTestValue);
    });

    it('deve mostrar checkbox desmarcado quando item não está em falta', () => {
      const pCheckbox = elementGetter.getByTestId('grocery_item_box_checkbox');
      const checkBoxElement = ElementGetter.getInputInDebugElement(pCheckbox!);
      expect(checkBoxElement?.checked).toBe(false);
    });
  });

  describe('Quando o usuário clica no nome do item', () => {
    it('deve ativar o modo de edição mostrando um input', fakeAsync(() => {
      const nomeElement = elementGetter.getByTestId('grocery_item_box_p_name');
      if (nomeElement) {
        nomeElement.nativeElement.click();
      }

      fixture.detectChanges();
      tick();

      const inputElement = elementGetter.getByTestId(
        'grocery_item_box_input_name',
      );
      expect(inputElement?.nativeElement.value).toBe(nameTestValue);
    }));
  });

  describe('Quando o usuário termina de editar o nome', () => {
    it('deve salvar o novo nome quando o input perde o foco', () => {
      const groceryItem = component.groceryItem();
      if (groceryItem) {
        groceryItem.editing = true;
        component.groceryItem.set(groceryItem);
      }

      fixture.detectChanges();

      const inputElement = elementGetter.getByTestId(
        'grocery_item_box_input_name',
      );
      const testName = 'Leite Desnatado';
      if (inputElement) {
        inputElement.nativeElement.value = testName;
        inputElement.nativeElement.dispatchEvent(new Event('input'));
        inputElement.nativeElement.dispatchEvent(new Event('blur'));
      }

      expect(mockGroceryItemService.updateName).toHaveBeenCalledWith(
        jasmine.objectContaining({ name: testName }),
      );
    });
  });

  describe('Quando o usuário altera o status de falta do item', () => {
    it('deve salvar o novo status quando checkbox é alterado', () => {
      const ngPrimeCheckbox = elementGetter.getByTestId(
        'grocery_item_box_checkbox',
      );
      if (ngPrimeCheckbox) {
        const checkbox = ElementGetter.getInputInDebugElement(ngPrimeCheckbox);
        if (checkbox) {
          checkbox.checked = true;
          checkbox.dispatchEvent(new Event('change'));
        }
      }
      fixture.detectChanges();
      expect(mockGroceryItemService.updateMissing).toHaveBeenCalledWith(
        jasmine.objectContaining({ missing: true }),
      );
    });
  });

  describe('Quando o usuário remove um item', () => {
    it('deve chamar o serviço de deletar e emitir evento quando botão é clicado', () => {
      spyOn(component.deletedItem, 'emit');
      const deleteButton = elementGetter.getByTestId(
        'grocery_item_box_delete_button',
      );
      if (deleteButton) {
        deleteButton.nativeElement.click();
      }

      expect(mockGroceryItemService.delete).toHaveBeenCalledWith(uuidTestValue);
      expect(component.deletedItem.emit).toHaveBeenCalled();
    });
  });
});
