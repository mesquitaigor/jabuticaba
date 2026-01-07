import { SupabaseClient } from '@supabase/supabase-js';
import {
  PostgrestResponse,
  PostgrestSingleResponse,
  PostgrestError,
} from '@supabase/supabase-js';

/**
 * Helper class para criar mocks de resposta do PostgreSQL/Supabase
 * Centraliza a criação de diferentes tipos de resposta para testes
 */
export class PostgresMockHelper {
  /**
   * Cria uma resposta de sucesso com dados
   */
  static createSuccessResponse<T>(data: T[]): PostgrestResponse<T> {
    return {
      data,
      error: null,
      count: data.length,
      status: 200,
      statusText: 'OK',
    };
  }

  /**
   * Cria uma resposta vazia/nula (sem dados encontrados)
   */
  static createNullResponse<T>(): PostgrestResponse<T> {
    return {
      data: null,
      error: {
        message: 'No data found',
        details: '',
        hint: '',
        code: '404',
        name: 'PostgrestError',
      } as PostgrestError,
      count: null,
      status: 200,
      statusText: 'OK',
    };
  }

  /**
   * Cria uma resposta de erro personalizada
   */
  static createErrorResponse<T>(
    message: string,
    code = '500',
  ): PostgrestResponse<T> {
    return {
      data: null,
      error: {
        message,
        details: '',
        hint: '',
        code,
        name: 'PostgrestError',
      } as PostgrestError,
      count: null,
      status: parseInt(code),
      statusText: 'Error',
    };
  }

  /**
   * Cria uma resposta de delete (sem conteúdo)
   */
  static createDeleteResponse(): PostgrestSingleResponse<null> {
    return {
      data: null,
      error: null,
      count: 1,
      status: 204,
      statusText: 'No Content',
    };
  }

  /**
   * Cria uma resposta de delete com erro
   */
  static createDeleteErrorResponse(
    message: string,
  ): PostgrestSingleResponse<null> {
    return {
      data: null,
      error: {
        message,
        details: '',
        hint: '',
        code: '400',
        name: 'PostgrestError',
      } as PostgrestError,
      count: null,
      status: 400,
      statusText: 'Bad Request',
    };
  }

  /**
   * Cria um mock completo do SupabaseClient com todos os métodos necessários
   */
  static createSupabaseClientMock(): jasmine.SpyObj<SupabaseClient> {
    const mockInsert = jasmine.createSpy('insert');
    const mockSelect = jasmine.createSpy('select');
    const mockDelete = jasmine.createSpy('delete');
    const mockUpdate = jasmine.createSpy('update');
    const mockEq = jasmine.createSpy('eq');
    const mockFrom = jasmine.createSpy('from');

    // Configurar o comportamento padrão dos mocks
    mockFrom.and.returnValue({
      insert: mockInsert,
      select: mockSelect,
      delete: mockDelete,
      update: mockUpdate,
    });

    mockDelete.and.returnValue({
      eq: mockEq,
    });

    mockUpdate.and.returnValue({
      eq: jasmine.createSpy('eq').and.returnValue({
        select: jasmine.createSpy('select'),
      }),
    });

    mockInsert.and.returnValue({
      select: jasmine.createSpy('select'),
    });

    return {
      from: mockFrom,
    } as jasmine.SpyObj<SupabaseClient>;
  }

  /**
   * Cria mocks individuais para operações específicas
   */
  static createOperationMocks(): {
    mockInsert: jasmine.Spy;
    mockSelect: jasmine.Spy;
    mockDelete: jasmine.Spy;
    mockUpdate: jasmine.Spy;
    mockEq: jasmine.Spy;
    mockFrom: jasmine.Spy;
  } {
    return {
      mockInsert: jasmine.createSpy('insert'),
      mockSelect: jasmine.createSpy('select'),
      mockDelete: jasmine.createSpy('delete'),
      mockUpdate: jasmine.createSpy('update'),
      mockEq: jasmine.createSpy('eq'),
      mockFrom: jasmine.createSpy('from'),
    };
  }

  /**
   * Configura um mock de SupabaseService com os métodos principais
   */
  static createSupabaseServiceMock(): jasmine.SpyObj<{
    insert: jasmine.Spy;
    update: jasmine.Spy;
    delete: jasmine.Spy;
    select: jasmine.Spy;
    client: object;
  }> {
    return jasmine.createSpyObj(
      'SupabaseService',
      ['insert', 'update', 'delete', 'select'],
      {
        client: {}, // Mock client existence
      },
    );
  }

  /**
   * Simula um cliente sem conexão (retorna undefined)
   */
  static createDisconnectedClientMock(): undefined {
    return undefined;
  }

  /**
   * Cria dados mock para testes específicos de entidade
   */
  static createMockData<T>(overrides: Partial<T>, defaults: T): T {
    return { ...defaults, ...overrides };
  }
}
