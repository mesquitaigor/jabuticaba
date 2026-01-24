// import {
//   ComponentFixture,
//   TestBed,
//   tick,
//   fakeAsync,
// } from '@angular/core/testing';
// import { GroceryItemService } from '../../../../data/entities/grocery-items/grocery-item.service';
// import { GroceryItemBoxComponent } from './grocery-item-box.component';
// import ElementGetter from '../../../../tests/helpers/ElementGetter.spec';
// import {
//   createGroceryItemModelMock,
//   nameTestValue,
//   uuidTestValue,
// } from '../../../../tests/mocks/GroceryItemModel.mock.spec';
// import { createGroceryItemServiceMock } from '../../../../tests/mocks/grocery-item.service.mock.spec';

// const COMPONENT_DATA_TEST_IDS = {
//   grocery_item_box_delete_button: 'grocery-item-box-delete-button',
//   grocery_item_box_checkbox: 'grocery-item-box-checkbox',
//   grocery_item_box_p_name: 'grocery-item-box-p-name',
//   grocery_item_box_input_name: 'grocery-item-box-input-name',
// };

// describe(GroceryItemBoxComponent.name, () => {
//   let component: GroceryItemBoxComponent;
//   let fixture: ComponentFixture<GroceryItemBoxComponent>;
//   let mockGroceryItemService: jasmine.SpyObj<GroceryItemService>;

//   const elementGetter = new ElementGetter(COMPONENT_DATA_TEST_IDS);

//   beforeEach(async () => {
//     mockGroceryItemService = createGroceryItemServiceMock();

//     await TestBed.configureTestingModule({
//       imports: [GroceryItemBoxComponent],
//       providers: [
//         { provide: GroceryItemService, useValue: mockGroceryItemService },
//       ],
//     }).compileComponents();
//     fixture = TestBed.createComponent(GroceryItemBoxComponent);
//     component = fixture.componentInstance;
//     elementGetter.setFixture(fixture);
//     const mockGroceryItemModel = createGroceryItemModelMock();
//     fixture.componentRef.setInput('item', mockGroceryItemModel);
//     fixture.detectChanges();
//   });

//   it('deve ser criado', () => {
//     expect(component).toBeTruthy();
//   });

//   describe('Dado que o usuário está visualizando um item da lista', () => {
//     it('deve exibir o nome do item corretamente', () => {
//       const nomeElement = elementGetter.getByTestId('grocery_item_box_p_name');
//       expect(nomeElement?.nativeElement.textContent.trim()).toBe(nameTestValue);
//     });

//     it('deve exibir checkbox desmarcado para item que não está em falta', () => {
//       const groceryItem = component.groceryItem();
//       expect(groceryItem?.data.missing).toBe(false);

//       const pCheckbox = elementGetter.getByTestId('grocery_item_box_checkbox');
//       const checkBoxElement = ElementGetter.getInputInDebugElement(pCheckbox!);
//       expect(checkBoxElement?.checked).toBe(false);
//     });

//     it('deve aplicar valor predefinido de missing quando fornecido', () => {
//       fixture.componentRef.setInput('predefinedMissingValue', true);
//       fixture.detectChanges();

//       const groceryItem = component.groceryItem();
//       expect(groceryItem?.data.missing).toBe(true);
//     });
//     it('deve bloquear a edição do nome do item quando configuração for definida', () => {
//       fixture.componentRef.setInput('ableNameEdit', false);
//       fixture.detectChanges();

//       const nameElement = elementGetter.getByTestId('grocery_item_box_p_name');
//       nameElement?.nativeElement.click();
//       fixture.detectChanges();

//       const inputElement = elementGetter.getByTestId(
//         'grocery_item_box_input_name',
//       );
//       expect(inputElement).toBeNull();
//     });
//   });

//   describe('Quando o usuário quer editar um item', () => {
//     it('deve entrar em modo de edição ao clicar no nome', fakeAsync(() => {
//       const nomeElement = elementGetter.getByTestId('grocery_item_box_p_name');
//       nomeElement?.nativeElement.click();
//       fixture.detectChanges();
//       tick();

//       const groceryItem = component.groceryItem();
//       expect(groceryItem?.editing).toBe(true);

//       const inputElement = elementGetter.getByTestId(
//         'grocery_item_box_input_name',
//       );
//       expect(inputElement?.nativeElement.value).toBe(nameTestValue);
//     }));

//     it('deve focar automaticamente no input quando entra em modo de edição', fakeAsync(() => {
//       const nomeElement = elementGetter.getByTestId('grocery_item_box_p_name');
//       nomeElement?.nativeElement.click();
//       fixture.detectChanges();
//       tick();

//       const inputElement = elementGetter.getByTestId(
//         'grocery_item_box_input_name',
//       );
//       expect(document.activeElement).toBe(inputElement?.nativeElement);
//     }));
//   });

//   describe('Quando o usuário finaliza a edição do nome', () => {
//     beforeEach(() => {
//       const groceryItem = component.groceryItem();
//       if (groceryItem) {
//         groceryItem.editing = true;
//         component.groceryItem.set({ ...groceryItem });
//         fixture.detectChanges();
//       }
//     });

//     it('deve salvar o nome alterado e sair do modo de edição', () => {
//       const inputElement = elementGetter.getByTestId(
//         'grocery_item_box_input_name',
//       );
//       const newName = 'Leite Desnatado Editado';

//       if (inputElement) {
//         inputElement.nativeElement.value = newName;
//         inputElement.nativeElement.dispatchEvent(new Event('input'));
//         inputElement.nativeElement.dispatchEvent(new Event('blur'));
//       }
//       fixture.detectChanges();

//       expect(mockGroceryItemService.updateName).toHaveBeenCalledWith(
//         jasmine.objectContaining({ name: newName }),
//       );
//     });

//     it('deve cancelar edição sem salvar quando o nome não foi alterado', () => {
//       const inputElement = elementGetter.getByTestId(
//         'grocery_item_box_input_name',
//       );

//       if (inputElement) {
//         inputElement.nativeElement.dispatchEvent(new Event('blur'));
//       }
//       fixture.detectChanges();

//       const groceryItem = component.groceryItem();
//       expect(groceryItem?.editing).toBe(false);
//       expect(mockGroceryItemService.updateName).not.toHaveBeenCalled();
//     });
//   });

//   describe('Quando o usuário altera o status do item', () => {
//     it('deve atualizar status de falta quando checkbox é alterado', () => {
//       const checkboxElement = elementGetter.getByTestId(
//         'grocery_item_box_checkbox',
//       );
//       const checkbox = ElementGetter.getInputInDebugElement(checkboxElement!);

//       if (checkbox) {
//         checkbox.checked = true;
//         checkbox.dispatchEvent(new Event('change'));
//       }
//       fixture.detectChanges();

//       expect(mockGroceryItemService.updateMissing).toHaveBeenCalledWith(
//         jasmine.objectContaining({ missing: true }),
//       );
//     });
//   });

//   describe('Quando o usuário remove um item', () => {
//     it('deve deletar item e emitir evento de remoção', () => {
//       spyOn(component.deletedItem, 'emit');

//       const deleteButton = elementGetter.getByTestId(
//         'grocery_item_box_delete_button',
//       );
//       deleteButton?.nativeElement.click();

//       expect(mockGroceryItemService.delete).toHaveBeenCalledWith(uuidTestValue);
//       expect(component.deletedItem.emit).toHaveBeenCalledWith(
//         jasmine.objectContaining({ uuid: uuidTestValue }),
//       );
//     });
//   });
// });
