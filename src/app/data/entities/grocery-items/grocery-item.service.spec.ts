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

describe(GroceryItemService.name, () => {
  let service: GroceryItemService;
  let mockGroceryItemApiService: jasmine.SpyObj<GroceryItemApiService>;

  const mockApiResponse: IGroceryItemApi = {
    uuid: uuidTestValue,
    name: nameTestValue,
    missing: false,
    created_at: '2024-01-01T00:00:00.000Z',
    updated_at: '2024-01-01T00:00:00.000Z',
    deleted_at: null,
  };

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
    it('deve expor um observable para os itens da lista', (done) => {
      // Given & When
      service.groceryItems$.subscribe((items) => {
        // Then
        expect(items).toEqual([]);
        done();
      });
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

        // Verify BehaviorSubject is updated
        service.groceryItems$.subscribe((items) => {
          expect(items.length).toBe(1);
          expect(items[0].uuid).toBe(uuidTestValue);
          done();
        });
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

        // Verify BehaviorSubject is updated
        service.groceryItems$.subscribe((items) => {
          expect(items.length).toBe(1);
          expect(items[0].uuid).toBe(uuidTestValue);
          done();
        });
      });
    });

    it('deve retornar array vazio quando API retorna resposta vazia', (done) => {
      // Given
      mockGroceryItemApiService.getAll.and.returnValue(of([]));

      // When
      service.getAll().subscribe((result) => {
        // Then
        expect(result).toEqual([]);

        // Verify BehaviorSubject is updated
        service.groceryItems$.subscribe((items) => {
          expect(items).toEqual([]);
          done();
        });
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

    it('não deve chamar API quando BehaviorSubject já tem dados', (done) => {
      // Given - First populate the BehaviorSubject
      const mockItem = createGroceryItemModelMock();
      service['groceryItemsSubject'].next([mockItem]);
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

    it('deve chamar API apenas quando BehaviorSubject está vazio', (done) => {
      // Given - Ensure BehaviorSubject is empty
      service['groceryItemsSubject'].next([]);
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

  describe('ao atualizar o nome do item da lista', () => {
    it('deve retornar item atualizado quando API retorna dados', (done) => {
      // Given
      const mockItem = createGroceryItemModelMock();
      // First populate the BehaviorSubject
      service['groceryItemsSubject'].next([mockItem]);
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

        // Verify BehaviorSubject is updated
        service.groceryItems$.subscribe((items) => {
          expect(items.length).toBe(1);
          expect(items[0].uuid).toBe(uuidTestValue);
          done();
        });
      });
    });

    it('deve lidar com uuid vazio graciosamente', (done) => {
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
      // First populate the BehaviorSubject
      service['groceryItemsSubject'].next([mockItem]);
      mockGroceryItemApiService.deleteRecord.and.returnValue(of(null));

      // When
      service.delete(uuid).subscribe((result) => {
        // Then
        expect(result).toBeNull();
        expect(mockGroceryItemApiService.deleteRecord).toHaveBeenCalledWith(
          uuid,
        );

        // Verify BehaviorSubject is updated (item removed)
        service.groceryItems$.subscribe((items) => {
          expect(items.length).toBe(0);
          done();
        });
      });
    });
  });
});
