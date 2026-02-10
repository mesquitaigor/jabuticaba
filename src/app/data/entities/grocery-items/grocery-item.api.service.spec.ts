import { TestBed } from '@angular/core/testing';
import { GroceryItemApiService } from './grocery-item.api.service';
import { SupabaseService } from '../../../core/services/api/supabase.service';
import { IGroceryItemApi } from './grocery-item.dto';
import { PostgresMockHelper } from '../../../tests/helpers/PostgresMock.helper.spec';

describe(GroceryItemApiService.name, () => {
  let service: GroceryItemApiService;
  let mockSupabaseService: jasmine.SpyObj<SupabaseService>;

  const mockGroceryItem: IGroceryItemApi = {
    uuid: '123e4567-e89b-12d3-a456-426614174000',
    name: 'Test Item',
    missing: false,
    hidden: false,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    deleted_at: null,
  };

  beforeEach(() => {
    const supabaseServiceSpy = PostgresMockHelper.createSupabaseServiceMock();

    TestBed.configureTestingModule({
      providers: [
        GroceryItemApiService,
        { provide: SupabaseService, useValue: supabaseServiceSpy },
      ],
    });

    service = TestBed.inject(GroceryItemApiService);
    mockSupabaseService = TestBed.inject(
      SupabaseService,
    ) as jasmine.SpyObj<SupabaseService>;
  });

  describe('quando o serviço é inicializado', () => {
    it('precisa ser criado corretamente', () => {
      expect(service).toBeTruthy();
    });
  });

  describe('create', () => {
    describe('quando o cliente Supabase está disponível', () => {
      it('precisa criar um novo item e retornar os dados', (done) => {
        // Arrange
        const payload = { name: 'New Item' };
        const expectedResponse = PostgresMockHelper.createSuccessResponse([
          mockGroceryItem,
        ]);
        mockSupabaseService.insert.and.returnValue(
          Promise.resolve(expectedResponse),
        );

        // Act
        service.create(payload).subscribe((result) => {
          // Assert
          expect(mockSupabaseService.insert).toHaveBeenCalledWith(
            payload,
            'grocery_item',
          );
          expect(result).toEqual([mockGroceryItem]);
          done();
        });
      });

      it('precisa retornar null quando a resposta não contém dados', (done) => {
        // Arrange
        const payload = { name: 'New Item' };
        const expectedResponse =
          PostgresMockHelper.createNullResponse<IGroceryItemApi>();
        mockSupabaseService.insert.and.returnValue(
          Promise.resolve(expectedResponse),
        );

        // Act
        service.create(payload).subscribe((result) => {
          // Assert
          expect(result).toBeNull();
          done();
        });
      });
    });

    describe('quando o cliente Supabase não está disponível', () => {
      it('precisa retornar null sem chamar o método insert', (done) => {
        // Arrange
        const payload = { name: 'New Item' };
        Object.defineProperty(mockSupabaseService, 'client', {
          get: () => undefined,
        });

        // Act
        service.create(payload).subscribe((result) => {
          // Assert
          expect(mockSupabaseService.insert).not.toHaveBeenCalled();
          expect(result).toBeNull();
          done();
        });
      });
    });
  });

  describe('updateRecord', () => {
    describe('quando o cliente Supabase está disponível', () => {
      it('precisa atualizar um item existente e retornar os dados', (done) => {
        // Arrange
        const uuid = '123e4567-e89b-12d3-a456-426614174000';
        const payload = { name: 'Updated Item' };
        const updatedItem = { ...mockGroceryItem, ...payload };
        const expectedResponse = PostgresMockHelper.createSuccessResponse([
          updatedItem,
        ]);
        mockSupabaseService.update.and.returnValue(
          Promise.resolve(expectedResponse),
        );

        // Act
        service.updateRecord(uuid, payload).subscribe((result) => {
          // Assert
          expect(mockSupabaseService.update).toHaveBeenCalledWith(
            'grocery_item',
            uuid,
            payload,
          );
          expect(result).toEqual([updatedItem]);
          done();
        });
      });

      it('precisa retornar null quando a resposta não contém dados', (done) => {
        // Arrange
        const uuid = '123e4567-e89b-12d3-a456-426614174000';
        const payload = { name: 'Updated Item' };
        const expectedResponse =
          PostgresMockHelper.createNullResponse<IGroceryItemApi>();
        mockSupabaseService.update.and.returnValue(
          Promise.resolve(expectedResponse),
        );

        // Act
        service.updateRecord(uuid, payload).subscribe((result) => {
          // Assert
          expect(result).toBeNull();
          done();
        });
      });
    });

    describe('quando o cliente Supabase não está disponível', () => {
      it('precisa retornar null sem chamar o método update', (done) => {
        // Arrange
        const uuid = '123e4567-e89b-12d3-a456-426614174000';
        const payload = { name: 'Updated Item' };
        Object.defineProperty(mockSupabaseService, 'client', {
          get: () => undefined,
        });

        // Act
        service.updateRecord(uuid, payload).subscribe((result) => {
          // Assert
          expect(mockSupabaseService.update).not.toHaveBeenCalled();
          expect(result).toBeNull();
          done();
        });
      });
    });
  });

  describe('deleteRecord', () => {
    describe('quando o cliente Supabase está disponível', () => {
      it('precisa deletar um item e retornar null', (done) => {
        // Arrange
        const uuid = '123e4567-e89b-12d3-a456-426614174000';
        const expectedResponse = PostgresMockHelper.createDeleteResponse();
        mockSupabaseService.delete.and.returnValue(
          Promise.resolve(expectedResponse),
        );

        // Act
        service.deleteRecord(uuid).subscribe((result) => {
          // Assert
          expect(mockSupabaseService.delete).toHaveBeenCalledWith(
            'grocery_item',
            uuid,
          );
          expect(result).toBeNull();
          done();
        });
      });
    });

    describe('quando o cliente Supabase não está disponível', () => {
      it('precisa retornar null sem chamar o método delete', (done) => {
        // Arrange
        const uuid = '123e4567-e89b-12d3-a456-426614174000';
        Object.defineProperty(mockSupabaseService, 'client', {
          get: () => undefined,
        });

        // Act
        service.deleteRecord(uuid).subscribe((result) => {
          // Assert
          expect(mockSupabaseService.delete).not.toHaveBeenCalled();
          expect(result).toBeNull();
          done();
        });
      });
    });
  });

  describe('getAll', () => {
    describe('quando o cliente Supabase está disponível', () => {
      it('precisa buscar todos os itens e retornar os dados', (done) => {
        // Arrange
        const expectedResponse = PostgresMockHelper.createSuccessResponse([
          mockGroceryItem,
        ]);
        mockSupabaseService.select.and.returnValue(
          Promise.resolve(expectedResponse),
        );

        // Act
        service.getAll().subscribe((result) => {
          // Assert
          expect(mockSupabaseService.select).toHaveBeenCalledWith(
            'grocery_item',
          );
          expect(result).toEqual([mockGroceryItem]);
          done();
        });
      });

      it('precisa retornar null quando a resposta não contém dados', (done) => {
        // Arrange
        const expectedResponse =
          PostgresMockHelper.createNullResponse<IGroceryItemApi>();
        mockSupabaseService.select.and.returnValue(
          Promise.resolve(expectedResponse),
        );

        // Act
        service.getAll().subscribe((result) => {
          // Assert
          expect(result).toBeNull();
          done();
        });
      });
    });

    describe('quando o cliente Supabase não está disponível', () => {
      it('precisa retornar null sem chamar o método select', (done) => {
        // Arrange
        Object.defineProperty(mockSupabaseService, 'client', {
          get: () => undefined,
        });

        // Act
        service.getAll().subscribe((result) => {
          // Assert
          expect(mockSupabaseService.select).not.toHaveBeenCalled();
          expect(result).toBeNull();
          done();
        });
      });
    });
  });
});
