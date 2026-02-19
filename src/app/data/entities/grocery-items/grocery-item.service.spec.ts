import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { GroceryItemService } from './grocery-item.service';
import { GroceryItemApiService } from './grocery-item.api.service';
import { IGroceryItemApi } from './grocery-item.dto';
import {
  createGroceryItemModelMock,
  uuidTestValue,
  nameTestValue,
} from '../../../tests/mocks/GroceryItemModel.mock.spec';
import { GroceryItemApiResponseMock } from '../../../tests/mocks/grocery-item-api-response.mock.spec';
import { GroceryItemApiServiceMock } from '../../../tests/mocks/grocery-item.api.service.mock.spec';
import { GroceryItemIconModel } from './grocery-item-icon.model';
import GroceryItemModel from './grocery-item.model';

describe(GroceryItemService.name, () => {
  let service: GroceryItemService;
  let mockGroceryItemApiService: jasmine.SpyObj<GroceryItemApiService>;
  let mockApiResponse: IGroceryItemApi = GroceryItemApiResponseMock.create();
  const groceryItemApiServiceMock = new GroceryItemApiServiceMock();
  beforeEach(() => {
    mockApiResponse = GroceryItemApiResponseMock.create();
    groceryItemApiServiceMock.create();

    TestBed.configureTestingModule({
      providers: [groceryItemApiServiceMock.getProvider()],
    });

    service = TestBed.inject(GroceryItemService);
    mockGroceryItemApiService = groceryItemApiServiceMock.getSpy();
  });

  describe('ao criar um item da lista', () => {
    const itemName = 'New Grocery Item';
    beforeEach(() => {
      mockGroceryItemApiService.create.and.returnValue(of([mockApiResponse]));
    });
    it('deve retornar um item mapeado quando API retorna dados', (done) => {
      const item = new GroceryItemModel();
      item.name = itemName;
      item.icon = new GroceryItemIconModel('test-icon');
      service.create(item).subscribe(() => {
        expect(mockGroceryItemApiService.create)
          .withContext(
            'O método create da API deve ser chamado com os parâmetros corretos',
          )
          .toHaveBeenCalledWith({
            name: itemName,
            icon: item.icon!.name,
          });
        done();
      });
    });

    it('deve atualizar a lista de itens do signal no service', (done) => {
      const item = new GroceryItemModel();
      item.name = itemName;
      item.icon = new GroceryItemIconModel('test-icon');
      service.create(item).subscribe(() => {
        const groceryList = service.getGroceryList();
        expect(groceryList().length)
          .withContext(
            'A lista de itens do signal deve conter 1 item após a criação',
          )
          .toBe(1);
        expect(groceryList()[0].uuid)
          .withContext(
            'O UUID do item na lista deve corresponder ao UUID do item criado',
          )
          .toBe(uuidTestValue);
        expect(groceryList()[0].name)
          .withContext(
            'O nome do item na lista deve corresponder ao nome do item criado',
          )
          .toBe(mockApiResponse.name);
        done();
      });
    });

    it('deve retornar null quando API retorna resposta vazia', (done) => {
      mockGroceryItemApiService.create.and.returnValue(of([]));

      // When
      const item = new GroceryItemModel();
      item.name = itemName;
      item.icon = new GroceryItemIconModel('test-icon');
      service.create(item).subscribe((result) => {
        // Then
        expect(result)
          .withContext('O resultado recebido não foi o esperado')
          .toBeNull();
        done();
      });
    });

    it('deve retornar null quando API retorna null', (done) => {
      // Given
      const itemName = 'New Item';
      mockGroceryItemApiService.create.and.returnValue(of(null));

      // When
      const item = new GroceryItemModel();
      item.name = itemName;
      item.icon = new GroceryItemIconModel('test-icon');
      service.create(item).subscribe((result) => {
        // Then
        expect(result).toBeNull();
        done();
      });
    });
  });

  describe('ao buscar todos os itens da lista', () => {
    it('deve retornar itens mapeados quando API retorna dados', (done) => {
      // Given
      mockGroceryItemApiService.getAll.and.returnValue(of([mockApiResponse]));

      // When
      service.getAll().subscribe((result) => {
        // Then
        expect(result.length).toBe(1);
        expect(result[0].uuid).toBe(uuidTestValue);
        expect(result[0].name).toBe(nameTestValue);

        // Verify signal is updated
        const groceryList = service.getGroceryList();
        expect(groceryList().length).toBe(1);
        expect(groceryList()[0].uuid).toBe(uuidTestValue);
        done();
      });
    });

    it('deve retornar array vazio quando API retorna resposta vazia', (done) => {
      // Given
      mockGroceryItemApiService.getAll.and.returnValue(of([]));

      // When
      service.getAll().subscribe((result) => {
        // Then
        expect(result).toEqual([]);

        // Verify signal is updated
        const groceryList = service.getGroceryList();
        expect(groceryList()).toEqual([]);
        done();
      });
    });

    it('deve retornar array vazio quando API retorna null', (done) => {
      // Given
      mockGroceryItemApiService.getAll.and.returnValue(of(null));

      // When
      service.getAll().subscribe((result) => {
        // Then
        expect(result).toEqual([]);
        done();
      });
    });

    it('não deve chamar API quando signal já tem dados', (done) => {
      // Given - First populate the signal
      const mockItem = createGroceryItemModelMock();
      service['groceryItems$'].set([mockItem]);
      mockGroceryItemApiService.getAll.and.returnValue(of([mockApiResponse]));

      // When
      service.getAll().subscribe((result) => {
        // Then
        expect(result.length).toBe(1);
        expect(result[0].uuid).toBe(mockItem.uuid);
        expect(mockGroceryItemApiService.getAll).not.toHaveBeenCalled();
        done();
      });
    });

    it('deve chamar API apenas quando signal está vazio', (done) => {
      // Given - Ensure signal is empty
      service['groceryItems$'].set([]);
      mockGroceryItemApiService.getAll.and.returnValue(of([mockApiResponse]));

      // When
      service.getAll().subscribe((result) => {
        // Then
        expect(result.length).toBe(1);
        expect(mockGroceryItemApiService.getAll).toHaveBeenCalled();
        done();
      });
    });
  });

  describe('ao editar um item', () => {
    it('deve retornar item atualizado quando API retorna dados', (done) => {
      // Given
      const mockItem = createGroceryItemModelMock({
        icon: new GroceryItemIconModel('test-icon'),
      });
      // First populate the signal
      service['groceryItems$'].set([mockItem]);
      mockGroceryItemApiService.updateRecord.and.returnValue(
        of([mockApiResponse]),
      );

      // When
      service.editItem(mockItem).subscribe((result) => {
        // Then
        expect(result).toBeTruthy();
        expect(result?.uuid).toBe(uuidTestValue);
        expect(mockGroceryItemApiService.updateRecord).toHaveBeenCalledWith(
          mockItem.uuid || '',
          { name: mockItem.name, icon: 'test-icon' },
        );

        // Verify signal is updated
        const groceryList = service.getGroceryList();
        expect(groceryList().length).toBe(1);
        expect(groceryList()[0].uuid).toBe(uuidTestValue);
        done();
      });
    });
  });
  describe('ao atualizar o nome do item', () => {
    it('deve retornar item atualizado quando API retorna dados', (done) => {
      // Given
      const mockItem = createGroceryItemModelMock();
      // First populate the signal
      service['groceryItems$'].set([mockItem]);
      mockGroceryItemApiService.updateRecord.and.returnValue(
        of([mockApiResponse]),
      );

      // When
      service.updateName(mockItem).subscribe((result) => {
        // Then
        expect(result).toBeTruthy();
        expect(result?.uuid).toBe(uuidTestValue);
        expect(mockGroceryItemApiService.updateRecord).toHaveBeenCalledWith(
          mockItem.uuid || '',
          { name: mockItem.name },
        );

        // Verify signal is updated
        const groceryList = service.getGroceryList();
        expect(groceryList().length).toBe(1);
        expect(groceryList()[0].uuid).toBe(uuidTestValue);
        done();
      });
    });

    it('deve lidar com uuid vazio', (done) => {
      // Given
      const mockItem = createGroceryItemModelMock({ uuid: undefined });
      mockGroceryItemApiService.updateRecord.and.returnValue(of(null));

      // When
      service.updateName(mockItem).subscribe((result) => {
        // Then
        expect(result).toBeNull();
        expect(mockGroceryItemApiService.updateRecord).toHaveBeenCalledWith(
          '',
          { name: mockItem.name },
        );
        done();
      });
    });
  });

  describe('ao atualizar status de falta do item da lista', () => {
    it('deve retornar item atualizado quando API retorna dados', (done) => {
      // Given
      const mockItem = createGroceryItemModelMock({ missing: true });
      mockGroceryItemApiService.updateRecord.and.returnValue(
        of([mockApiResponse]),
      );

      // When
      service.updateMissing(mockItem).subscribe((result) => {
        // Then
        expect(result).toBeTruthy();
        expect(mockGroceryItemApiService.updateRecord).toHaveBeenCalledWith(
          mockItem.uuid || '',
          { missing: mockItem.missing },
        );
        done();
      });
    });

    it('deve retornar null quando API retorna resposta vazia', (done) => {
      // Given
      const mockItem = createGroceryItemModelMock();
      mockGroceryItemApiService.updateRecord.and.returnValue(of([]));

      // When
      service.updateMissing(mockItem).subscribe((result) => {
        // Then
        expect(result).toBeNull();
        done();
      });
    });
  });

  describe('ao deletar um item da lista', () => {
    it('deve chamar método delete da API com uuid correto', (done) => {
      // Given
      const uuid = 'test-uuid';
      const mockItem = createGroceryItemModelMock({ uuid });
      // First populate the signal
      service['groceryItems$'].set([mockItem]);
      mockGroceryItemApiService.deleteRecord.and.returnValue(of(null));

      // When
      service.delete(uuid).subscribe((result) => {
        // Then
        expect(result).toBeNull();
        expect(mockGroceryItemApiService.deleteRecord).toHaveBeenCalledWith(
          uuid,
        );

        // Verify signal is updated (item removed)
        const groceryList = service.getGroceryList();
        expect(groceryList().length).toBe(0);
        done();
      });
    });
  });
});
