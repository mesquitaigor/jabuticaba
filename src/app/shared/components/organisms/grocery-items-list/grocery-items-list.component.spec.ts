// import { ComponentFixture, TestBed } from '@angular/core/testing';
// import { of } from 'rxjs';
// import { GroceryItemsListComponent } from './grocery-items-list.component';
// import { GroceryItemService } from '../../../../data/entities/grocery-items/grocery-item.service';
// import GroceryItemModel from '../../../../data/entities/grocery-items/grocery-item.model';

// describe(GroceryItemsListComponent.name, () => {
//   let component: GroceryItemsListComponent;
//   let fixture: ComponentFixture<GroceryItemsListComponent>;
//   let groceryItemService: jasmine.SpyObj<GroceryItemService>;

//   const mockGroceryItem: GroceryItemModel = {
//     uuid: 'test-uuid-1',
//     name: 'Test Item',
//     missing: false,
//   } as GroceryItemModel;

//   beforeEach(async () => {
//     const groceryItemServiceSpy = jasmine.createSpyObj('GroceryItemService', [
//       'getAll',
//       'save',
//     ]);

//     await TestBed.configureTestingModule({
//       imports: [GroceryItemsListComponent],
//       providers: [
//         { provide: GroceryItemService, useValue: groceryItemServiceSpy },
//       ],
//     }).compileComponents();

//     fixture = TestBed.createComponent(GroceryItemsListComponent);
//     component = fixture.componentInstance;
//     groceryItemService = TestBed.inject(
//       GroceryItemService,
//     ) as jasmine.SpyObj<GroceryItemService>;

//     groceryItemService.getAll.and.returnValue(of([]));
//   });

//   it('precisa ser criado', () => {
//     expect(component).toBeTruthy();
//   });

//   describe('quando handleToggleMissing é chamado', () => {
//     beforeEach(() => {
//       component.itemsList.set([
//         {
//           data: { ...mockGroceryItem },
//           editing: false,
//           initialValue: 'Test Item',
//         },
//       ]);
//       component.saveMissingChanges = jasmine.createSpy().and.returnValue(true);
//     });

//     it('precisa salvar as mudanças quando saveMissingChanges está habilitado', () => {
//       groceryItemService.save.and.returnValue(of(mockGroceryItem));

//       const updatedItem = { ...mockGroceryItem, missing: true };
//       component.handleToggleMissing(updatedItem);

//       expect(groceryItemService.save).toHaveBeenCalledWith(updatedItem);
//     });

//     it('não precisa salvar as mudanças quando saveMissingChanges está desabilitado', () => {
//       (component.saveMissingChanges as jasmine.Spy).and.returnValue(false);

//       const updatedItem = { ...mockGroceryItem, missing: true };
//       component.handleToggleMissing(updatedItem);

//       expect(groceryItemService.save).not.toHaveBeenCalled();
//     });

//     it('precisa atualizar o item na lista local', () => {
//       groceryItemService.save.and.returnValue(of(mockGroceryItem));

//       const updatedItem = { ...mockGroceryItem, missing: true };
//       component.handleToggleMissing(updatedItem);

//       const updatedList = component.itemsList();
//       expect(updatedList[0].data.missing).toBe(true);
//       expect(updatedList[0].data.uuid).toBe(mockGroceryItem.uuid);
//     });

//     it('precisa manter outros itens inalterados na lista', () => {
//       const anotherItem: GroceryItemModel = {
//         uuid: 'test-uuid-2',
//         name: 'Another Item',
//         missing: false,
//       } as GroceryItemModel;

//       component.itemsList.set([
//         {
//           data: { ...mockGroceryItem },
//           editing: false,
//           initialValue: 'Test Item',
//         },
//         {
//           data: { ...anotherItem },
//           editing: false,
//           initialValue: 'Another Item',
//         },
//       ]);

//       groceryItemService.save.and.returnValue(of(mockGroceryItem));

//       const updatedItem = { ...mockGroceryItem, missing: true };
//       component.handleToggleMissing(updatedItem);

//       const updatedList = component.itemsList();
//       expect(updatedList[0].data.missing).toBe(true);
//       expect(updatedList[1].data.missing).toBe(false);
//     });
//   });
// });
