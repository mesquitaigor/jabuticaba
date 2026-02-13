import { IGroceryItemApi } from './grocery-item.dto';
import GroceryItem from './grocery-item.model';
import GroceryItemMapper from './grocery-item.mapper';

describe(GroceryItemMapper.name, () => {
  const mockApiData: IGroceryItemApi = {
    uuid: '123e4567-e89b-12d3-a456-426614174000',
    name: 'Test Grocery Item',
    missing: true,
    hidden: false,
    icon: 'test-icon.svg',
    created_at: '2024-01-15T10:30:00Z',
    updated_at: '2024-01-16T14:45:00Z',
    deleted_at: null,
  };

  describe('quando convertendo dados da API para o modelo', () => {
    it('precisa criar uma instância do modelo com todas as propriedades básicas', () => {
      // Arrange
      const apiData = mockApiData;

      // Act
      const result = GroceryItemMapper.apiToModel(apiData);

      // Assert
      expect(result).toBeInstanceOf(GroceryItem);
      expect(result.uuid).toBe(apiData.uuid);
      expect(result.name).toBe(apiData.name);
      expect(result.icon).toBe(apiData.icon);
      expect(result.missing).toBe(apiData.missing);
    });

    it('precisa criar uma instância do modelo com todas as propriedades básicas', () => {
      // Arrange
      const apiData = mockApiData;
      apiData.icon = null;

      // Act
      const result = GroceryItemMapper.apiToModel(apiData);

      expect(result.icon).toBe('default-icon');
    });

    it('precisa converter created_at de string para Date corretamente', () => {
      // Arrange
      const apiData = mockApiData;

      // Act
      const result = GroceryItemMapper.apiToModel(apiData);

      // Assert
      expect(result.created_at).toBeInstanceOf(Date);
      expect(result.created_at?.getTime()).toBe(
        new Date(apiData.created_at).getTime(),
      );
    });

    it('precisa converter updated_at de string para Date corretamente', () => {
      // Arrange
      const apiData = mockApiData;

      // Act
      const result = GroceryItemMapper.apiToModel(apiData);

      // Assert
      expect(result.updated_at).toBeInstanceOf(Date);
      expect(result.updated_at?.getTime()).toBe(
        new Date(apiData.updated_at).getTime(),
      );
    });

    it('precisa manter deleted_at como undefined quando for null na API', () => {
      // Arrange
      const apiData = { ...mockApiData, deleted_at: null };

      // Act
      const result = GroceryItemMapper.apiToModel(apiData);

      // Assert
      expect(result.deleted_at).toBeUndefined();
    });

    it('precisa converter deleted_at de string para Date quando não for null', () => {
      // Arrange
      const deletedAtString = '2024-01-17T09:15:00Z';
      const apiData = { ...mockApiData, deleted_at: deletedAtString };

      // Act
      const result = GroceryItemMapper.apiToModel(apiData);

      // Assert
      expect(result.deleted_at).toBeInstanceOf(Date);
      expect(result.deleted_at?.getTime()).toBe(
        new Date(deletedAtString).getTime(),
      );
    });
  });

  describe('quando trabalhando com diferentes valores de entrada', () => {
    it('precisa manter false para missing quando definido na API', () => {
      // Arrange
      const apiData = { ...mockApiData, missing: false };

      // Act
      const result = GroceryItemMapper.apiToModel(apiData);

      // Assert
      expect(result.missing).toBe(false);
    });

    it('precisa manter true para missing quando definido na API', () => {
      // Arrange
      const apiData = { ...mockApiData, missing: true };

      // Act
      const result = GroceryItemMapper.apiToModel(apiData);

      // Assert
      expect(result.missing).toBe(true);
    });

    it('precisa processar nomes vazios corretamente', () => {
      // Arrange
      const apiData = { ...mockApiData, name: '' };

      // Act
      const result = GroceryItemMapper.apiToModel(apiData);

      // Assert
      expect(result.name).toBe('');
    });

    it('precisa processar UUIDs diferentes corretamente', () => {
      // Arrange
      const differentUuid = '456e7890-f12c-34d5-b678-901234567890';
      const apiData = { ...mockApiData, uuid: differentUuid };

      // Act
      const result = GroceryItemMapper.apiToModel(apiData);

      // Assert
      expect(result.uuid).toBe(differentUuid);
    });
  });
});
