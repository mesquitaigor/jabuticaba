// import {
//   ComponentFixture,
//   fakeAsync,
//   TestBed,
//   tick,
// } from '@angular/core/testing';
// import { GroceryListComponent } from './grocery-list.component';
// import { delay, of, throwError } from 'rxjs';
// import { createGroceryItemModelMock } from '../../tests/mocks/GroceryItemModel.mock.spec';
// import GroceryItemModel from '../../data/entities/grocery-items/grocery-item.model';
// import { Component, signal } from '@angular/core';
// import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
// import { MenuItemCommandEvent, MessageService } from 'primeng/api';
// import { createMessageServiceMock } from '../../tests/mocks/message.service.mock.spec';
// import { ToastModule } from 'primeng/toast';
// import { DataTestIdHelper } from '../../tests/helpers/data-testid.helper.spec';
// import { DataTestId } from '../../shared/directives/data-testid';
// import { Button } from 'primeng/button';
// import { GroceryItemService } from '@models/grocery-items';
// import { DialogService } from '@layout/dialog';
// import GroceryItemServiceMocker from '../../tests/mocks/grocery-item.service.mock.spec';

// @Component({
//   // eslint-disable-next-line @angular-eslint/component-selector
//   selector: 'p-toast',
//   template: '',
//   standalone: true,
// })
// class MockToastComponent {}

// describe(GroceryListComponent.name, () => {
//   let component: GroceryListComponent;
//   let fixture: ComponentFixture<GroceryListComponent>;
//   const groceryItemServiceMocker = new GroceryItemServiceMocker();
//   let groceryItemService: jasmine.SpyObj<GroceryItemService>;
//   let mockMessageService: jasmine.SpyObj<MessageService>;
//   let mockDialogService: jasmine.SpyObj<DialogService>;
//   let mockSignal = signal<GroceryItemModel[]>([]);
//   let loadDelay = 0;

//   // Helper para executar código dentro do contexto de injeção
//   const runInContext = <T>(fn: () => T): T => {
//     return TestBed.runInInjectionContext(fn);
//   };

//   beforeEach(async () => {
//     mockSignal = signal<GroceryItemModel[]>([]);
//     groceryItemServiceMocker.create();
//     mockMessageService = createMessageServiceMock();
//     mockDialogService = jasmine.createSpyObj('DialogService', [
//       'open',
//       'close',
//     ]);

//     await TestBed.configureTestingModule({
//       imports: [GroceryListComponent, MockToastComponent],
//       providers: [
//         provideAnimationsAsync(),
//         groceryItemServiceMocker.getProvider(),
//         { provide: MessageService, useValue: mockMessageService },
//         { provide: DialogService, useValue: mockDialogService },
//       ],
//     })
//       .overrideComponent(GroceryListComponent, {
//         remove: {
//           imports: [ToastModule],
//         },
//         add: {
//           imports: [MockToastComponent],
//         },
//       })
//       .compileComponents();

//     fixture = TestBed.createComponent(GroceryListComponent);
//     component = fixture.componentInstance;
//     loadDelay = component['loadDelay'];
//     groceryItemService = groceryItemServiceMocker.getSpy();
//   });
//   describe('quando o botão de visibilidade do menu é clicado', () => {
//     beforeEach(() => {
//       groceryItemService.updateHidden = jasmine
//         .createSpy('updateHidden')
//         .and.returnValue(of(createGroceryItemModelMock()));
//     });

//     it('deve chamar updateHidden do service ao clicar no menu', fakeAsync(() => {
//       runInContext(() => {
//         const mockItem = createGroceryItemModelMock({ hidden: false });
//         mockSignal.set([mockItem]);
//         groceryItemService.updateHidden.and.returnValue(
//           of(createGroceryItemModelMock({ ...mockItem, hidden: true })),
//         );
//         fixture.detectChanges();
//         // Simula clique no botão de visibilidade no menu
//         component
//           .groceryItems()?.[0]
//           .menu()[1]
//           .command?.({ item: { label: 'Esconder' } } as MenuItemCommandEvent);
//         fixture.detectChanges();
//         tick(1);
//         expect(groceryItemService.updateHidden).toHaveBeenCalledWith(
//           jasmine.objectContaining({ uuid: mockItem.uuid }),
//         );
//       });
//     }));

//     it('deve bloquear múltiplas chamadas enquanto está processando', fakeAsync(() => {
//       runInContext(() => {
//         const mockItem = createGroceryItemModelMock({ hidden: false });
//         mockSignal.set([mockItem]);
//         groceryItemService.updateHidden.and.returnValue(
//           of(createGroceryItemModelMock({ ...mockItem, hidden: true })).pipe(
//             delay(100),
//           ),
//         );
//         fixture.detectChanges();
//         component
//           .groceryItems()?.[0]
//           .menu()[1]
//           .command?.({ item: { label: 'Esconder' } } as MenuItemCommandEvent);
//         fixture.detectChanges();
//         // Segunda chamada antes de terminar a primeira
//         component
//           .groceryItems()?.[0]
//           .menu()[1]
//           .command?.({ item: { label: 'Esconder' } } as MenuItemCommandEvent);
//         tick(100);
//         expect(groceryItemService.updateHidden).toHaveBeenCalledTimes(1);
//       });
//     }));

//     it('deve atualizar o atributo hidden do item', fakeAsync(() => {
//       runInContext(() => {
//         const mockItem = createGroceryItemModelMock({ hidden: false });
//         mockSignal.set([mockItem]);
//         groceryItemService.updateHidden.and.returnValue(
//           of(createGroceryItemModelMock({ ...mockItem, hidden: true })),
//         );
//         fixture.detectChanges();
//         component
//           .groceryItems()?.[0]
//           .menu()[1]
//           .command?.({ item: { label: 'Esconder' } } as MenuItemCommandEvent);
//         tick(1);
//         expect(component.groceryItems()?.[0].hidden).toBe(true);
//       });
//     }));

//     it('deve exibir label "Mostrar" quando hidden é true e "Esconder" quando hidden é false', () => {
//       runInContext(() => {
//         const mockItem = createGroceryItemModelMock({ hidden: false });
//         mockSignal.set([mockItem]);
//         fixture.detectChanges();
//         // hidden false
//         expect(component.groceryItems()?.[0].menu()[1].label).toBe('Esconder');
//         // Simula mudança para hidden true
//         const item = component.groceryItems()[0];
//         item.hidden = true;
//         item['defineVisibilityItem']();
//         fixture.detectChanges();
//         expect(component.groceryItems()?.[0].menu()[1].label).toBe('Mostrar');
//       });
//     });
//   });

//   describe('quando botão de visibilidade é clicado', () => {
//     it('deve alternar estado de visibilidade dos items da lista', () => {
//       runInContext(() => {
//         fixture.detectChanges();
//         const initial = component.showAllItems();
//         const button = DataTestIdHelper.queryOrFail(
//           fixture.debugElement,
//           DataTestId.GroceryList.VisibilityOffIcon,
//         );
//         const ngButtonInstance: Button = button.componentInstance;
//         ngButtonInstance.onClick.emit();
//         fixture.detectChanges();
//         expect(component.showAllItems()).toBe(!initial);
//       });
//     });
//   });

//   describe('quando o componente é inicializado', () => {
//     it('precisa exibir estado vazio quando não há itens', fakeAsync(() => {
//       runInContext(() => {
//         mockSignal.set([]);
//         groceryItemService.getAll.and.returnValue(of([]));

//         fixture.detectChanges();
//         tick(loadDelay);
//         fixture.detectChanges();

//         const emptyState = DataTestIdHelper.query(
//           fixture.debugElement,
//           DataTestId.GroceryList.EmptyState,
//         );

//         expect(emptyState).toBeTruthy();
//       });
//     }));

//     it('precisa carregar os itens do serviço', () => {
//       runInContext(() => {
//         fixture.detectChanges();
//         expect(groceryItemService.getAll).toHaveBeenCalled();
//       });
//     });

//     it('precisa listar os itens na interface', fakeAsync(() => {
//       runInContext(() => {
//         const mockItems = [
//           createGroceryItemModelMock(),
//           createGroceryItemModelMock({ name: 'Item 2' }),
//           createGroceryItemModelMock({ name: 'Item 3' }),
//         ];
//         mockSignal.set(mockItems);

//         fixture.detectChanges();
//         tick(loadDelay);
//         fixture.detectChanges();

//         const items = DataTestIdHelper.queryAll(
//           fixture.debugElement,
//           DataTestId.GroceryList.Item,
//         );

//         expect(items.length).toBe(mockItems.length);
//       });
//     }));
//   });
//   describe('quando ocorre um erro ao carregar os itens', () => {
//     it('precisa exibir mensagem de erro', () => {
//       runInContext(() => {
//         groceryItemService.getAll.and.returnValue(
//           throwError(() => new Error('Erro ao carregar')),
//         );
//         fixture.detectChanges();
//         expect(component.hasError).toBe(true);
//       });
//     });

//     it('precisa renderizar o estado de erro na interface', () => {
//       runInContext(() => {
//         groceryItemService.getAll.and.returnValue(
//           throwError(() => new Error('Erro ao carregar')),
//         );

//         fixture.detectChanges();

//         const errorState = DataTestIdHelper.query(
//           fixture.debugElement,
//           DataTestId.GroceryList.ErrorState,
//         );
//         expect(errorState).toBeTruthy();
//       });
//     });

//     it('não deve exibir a lista de itens quando houver erro', () => {
//       runInContext(() => {
//         groceryItemService.getAll.and.returnValue(
//           throwError(() => new Error('Erro ao carregar')),
//         );

//         fixture.detectChanges();

//         const items = DataTestIdHelper.queryAll(
//           fixture.debugElement,
//           DataTestId.GroceryList.Item,
//         );

//         expect(items.length).toBe(0);
//       });
//     });
//   });
//   describe('quando está carregando os itens', () => {
//     it('precisa exibir estado de loading', () => {
//       runInContext(() => {
//         groceryItemService.getAll.and.returnValue(of([]).pipe(delay(1000)));
//         component.loading = true;

//         fixture.detectChanges();

//         const loadingState = DataTestIdHelper.query(
//           fixture.debugElement,
//           DataTestId.GroceryList.LoadingState,
//         );

//         expect(loadingState).toBeTruthy();
//       });
//     });

//     it('não deve exibir a lista de itens durante o loading', () => {
//       runInContext(() => {
//         const mockItems = [createGroceryItemModelMock()];
//         mockSignal.set(mockItems);

//         fixture.detectChanges();
//         component.loading = true;
//         fixture.detectChanges();

//         const items = DataTestIdHelper.queryAll(
//           fixture.debugElement,
//           DataTestId.GroceryList.Item,
//         );

//         expect(items.length).toBe(0);
//       });
//     });

//     it('não deve exibir o estado vazio durante o loading', () => {
//       runInContext(() => {
//         mockSignal.set([]);
//         groceryItemService.getAll.and.returnValue(of([]).pipe(delay(1000)));
//         component.loading = true;

//         fixture.detectChanges();

//         const emptyState = DataTestIdHelper.query(
//           fixture.debugElement,
//           DataTestId.GroceryList.EmptyState,
//         );

//         expect(emptyState).toBeFalsy();
//       });
//     });

//     it('precisa definir loading como false após carregar com sucesso', fakeAsync(() => {
//       const mockItems = [createGroceryItemModelMock()];
//       groceryItemService.getAll.and.returnValue(of(mockItems));

//       component.loadItems();
//       tick(loadDelay);

//       expect(component.loading).toBe(false);
//     }));
//   });
//   describe('quando o botão de adicionar é clicado', () => {
//     it('precisa chamar dialogService.open com o componente correto', () => {
//       runInContext(() => {
//         fixture.detectChanges();
//         component.onAdd();
//         fixture.detectChanges();
//         expect(mockDialogService.open).toHaveBeenCalledWith(
//           jasmine.objectContaining({
//             header: 'Cadastrar item',
//             width: '90%',
//           }),
//         );
//       });
//     });
//   });
// });
