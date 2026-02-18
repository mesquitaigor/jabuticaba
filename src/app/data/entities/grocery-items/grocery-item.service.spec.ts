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

describe(GroceryItemService.name, () => {
  let service: GroceryItemService;
  let mockGroceryItemApiService: jasmine.SpyObj<GroceryItemApiService>;

  const mockApiResponse: IGroceryItemApi = GroceryItemApiResponseMock.create();

  beforeEach(() => {
    const spy = jasmine.createSpyObj('GroceryItemApiService', [
      'create',
      'getAll',
      'updateRecord',
      'deleteRecord',
    ]);

    TestBed.configureTestingModule({
      providers: [{ provide: GroceryItemApiService, useValue: spy }],
    });

    service = TestBed.inject(GroceryItemService);
    mockGroceryItemApiService = TestBed.inject(
      GroceryItemApiService,
    ) as jasmine.SpyObj<GroceryItemApiService>;
  });

  describe('ao inicializar o service', () => {
    it('deve expor um signal para os itens da lista', () => {
      // Given & When
      const groceryList = service.getGroceryList();

      // Then
      expect(groceryList()).toEqual([]);
    });
  });

  describe('ao criar um item da lista', () => {
    it('deve retornar um item mapeado quando API retorna dados', (done) => {
      // Given
      const itemName = 'New Grocery Item';
      mockGroceryItemApiService.create.and.returnValue(of([mockApiResponse]));

      // When
      service.create(itemName).subscribe((result) => {
        // Then
        expect(result).toBeTruthy();
        expect(result?.uuid).toBe(uuidTestValue);
        expect(result?.name).toBe(nameTestValue);
        expect(mockGroceryItemApiService.create).toHaveBeenCalledWith({
          name: itemName,
        });

        // Verify signal is updated
        const groceryList = service.getGroceryList();
        expect(groceryList().length).toBe(1);
        expect(groceryList()[0].uuid).toBe(uuidTestValue);
        done();
      });
    });

    it('should return null when API returns empty response', (done) => {
      // Given
      const itemName = 'New Item';
      mockGroceryItemApiService.create.and.returnValue(of([]));

      // When
      service.create(itemName).subscribe((result) => {
        // Then
        expect(result).toBeNull();
        done();
      });
    });

    it('deve retornar null quando API retorna null', (done) => {
      // Given
      const itemName = 'New Item';
      mockGroceryItemApiService.create.and.returnValue(of(null));

      // When
      service.create(itemName).subscribe((result) => {
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
        icon: 'test-icon',
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
          { name: mockItem.name, icon: mockItem.icon },
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
