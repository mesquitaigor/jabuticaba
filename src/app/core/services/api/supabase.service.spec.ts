import { TestBed } from '@angular/core/testing';
import { SupabaseClient } from '@supabase/supabase-js';
import { SupabaseService } from './supabase.service';
import { PostgresMockHelper } from '../../../tests/helpers/PostgresMock.helper.spec';

describe('SupabaseService', () => {
  let service: SupabaseService;
  let mockSupabaseClient: jasmine.SpyObj<SupabaseClient>;
  let mockFrom: jasmine.Spy;
  let mockInsert: jasmine.Spy;
  let mockSelect: jasmine.Spy;
  let mockDelete: jasmine.Spy;
  let mockUpdate: jasmine.Spy;
  let mockEq: jasmine.Spy;

  beforeEach(() => {
    const mocks = PostgresMockHelper.createOperationMocks();
    mockInsert = mocks.mockInsert;
    mockSelect = mocks.mockSelect;
    mockDelete = mocks.mockDelete;
    mockUpdate = mocks.mockUpdate;
    mockEq = mocks.mockEq;
    mockFrom = mocks.mockFrom;

    mockFrom.and.returnValue({
      insert: mockInsert,
      select: mockSelect,
      delete: mockDelete,
      update: mockUpdate,
    });

    // Create a partial mock that satisfies SupabaseClient interface
    mockSupabaseClient = {
      from: mockFrom,
    } as jasmine.SpyObj<SupabaseClient>;

    TestBed.configureTestingModule({});
    service = TestBed.inject(SupabaseService);

    // Mock the private supabaseClient property using Object.defineProperty
    Object.defineProperty(service, 'supabaseClient', {
      value: mockSupabaseClient,
      writable: true,
    });
  });

  describe('quando inicializado', () => {
    it('precisa ser criado corretamente', () => {
      expect(service).toBeTruthy();
    });

    it('precisa retornar undefined para o client quando não inicializado', () => {
      // Reset the client to test uninitialized state
      Object.defineProperty(service, 'supabaseClient', {
        value: undefined,
        writable: true,
      });

      expect(service.client).toBeUndefined();
    });

    it('precisa inicializar o cliente supabase com as credenciais corretas', () => {
      // Reset to test initialization
      Object.defineProperty(service, 'supabaseClient', {
        value: undefined,
        writable: true,
      });

      service.init();

      expect(service.client).toBeDefined();
    });
  });

  describe('quando realizando operações CRUD', () => {
    describe('insert', () => {
      it('precisa inserir dados na tabela especificada e retornar resposta', async () => {
        const mockData = { name: 'test item' };
        const mockResponse = {
          data: [mockData],
          error: null,
          count: null,
          status: 200,
          statusText: 'OK',
        };

        mockInsert.and.returnValue({
          select: jasmine
            .createSpy('select')
            .and.returnValue(Promise.resolve(mockResponse)),
        });

        const result = await service.insert(mockData, 'test_table');

        expect(mockFrom).toHaveBeenCalledWith('test_table');
        expect(mockInsert).toHaveBeenCalledWith(mockData);
        expect(result).toBe(mockResponse);
      });

      it('precisa retornar undefined quando client não está disponível', async () => {
        const serviceWithoutClient = new SupabaseService();
        const result = await serviceWithoutClient.insert(
          { name: 'test' },
          'table',
        );

        expect(result).toBeUndefined();
      });
    });

    describe('select', () => {
      it('precisa buscar dados da tabela especificada', async () => {
        const mockResponse = {
          data: [{ id: 1, name: 'test' }],
          error: null,
          count: null,
          status: 200,
          statusText: 'OK',
        };
        mockSelect.and.returnValue(Promise.resolve(mockResponse));

        const result = await service.select('test_table');

        expect(mockFrom).toHaveBeenCalledWith('test_table');
        expect(mockSelect).toHaveBeenCalled();
        expect(result).toBe(mockResponse);
      });

      it('precisa retornar undefined quando client não está disponível', async () => {
        const serviceWithoutClient = new SupabaseService();
        const result = await serviceWithoutClient.select('table');

        expect(result).toBeUndefined();
      });
    });

    describe('delete', () => {
      it('precisa deletar registro da tabela usando uuid', async () => {
        const mockUuid = '123e4567-e89b-12d3-a456-426614174000';
        const mockResponse = {
          data: null,
          error: null,
          count: null,
          status: 200,
          statusText: 'OK',
        };

        mockDelete.and.returnValue({
          eq: mockEq.and.returnValue(Promise.resolve(mockResponse)),
        });

        const result = await service.delete('test_table', mockUuid);

        expect(mockFrom).toHaveBeenCalledWith('test_table');
        expect(mockDelete).toHaveBeenCalled();
        expect(mockEq).toHaveBeenCalledWith('uuid', mockUuid);
        expect(result).toBe(mockResponse);
      });

      it('precisa retornar undefined quando client não está disponível', async () => {
        const serviceWithoutClient = new SupabaseService();
        const result = await serviceWithoutClient.delete('table', 'uuid');

        expect(result).toBeUndefined();
      });
    });

    describe('update', () => {
      it('precisa atualizar registro da tabela usando uuid e retornar dados atualizados', async () => {
        const mockUuid = '123e4567-e89b-12d3-a456-426614174000';
        const mockData = { name: 'updated item' };
        const mockResponse = {
          data: [mockData],
          error: null,
          count: null,
          status: 200,
          statusText: 'OK',
        };

        mockUpdate.and.returnValue({
          eq: jasmine.createSpy('eq').and.returnValue({
            select: jasmine
              .createSpy('select')
              .and.returnValue(Promise.resolve(mockResponse)),
          }),
        });

        const result = await service.update('test_table', mockUuid, mockData);

        expect(mockFrom).toHaveBeenCalledWith('test_table');
        expect(mockUpdate).toHaveBeenCalledWith(mockData);
        expect(result).toBe(mockResponse);
      });

      it('precisa retornar undefined quando client não está disponível', async () => {
        const serviceWithoutClient = new SupabaseService();
        const result = await serviceWithoutClient.update('table', 'uuid', {
          name: 'test',
        });

        expect(result).toBeUndefined();
      });
    });
  });
});
