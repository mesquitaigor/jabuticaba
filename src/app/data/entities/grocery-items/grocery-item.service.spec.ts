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

  describe('when creating a grocery item', () => {
    it('should return a mapped grocery item when API returns data', (done) => {
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

    it('should return null when API returns null', (done) => {
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

  describe('when getting all grocery items', () => {
    it('should return mapped grocery items when API returns data', (done) => {
      // Given
      mockGroceryItemApiService.getAll.and.returnValue(of([mockApiResponse]));

      // When
      service.getAll().subscribe((result) => {
        // Then
        expect(result.length).toBe(1);
        expect(result[0].uuid).toBe(uuidTestValue);
        expect(result[0].name).toBe(nameTestValue);
        done();
      });
    });

    it('should return empty array when API returns empty response', (done) => {
      // Given
      mockGroceryItemApiService.getAll.and.returnValue(of([]));

      // When
      service.getAll().subscribe((result) => {
        // Then
        expect(result).toEqual([]);
        done();
      });
    });

    it('should return empty array when API returns null', (done) => {
      // Given
      mockGroceryItemApiService.getAll.and.returnValue(of(null));

      // When
      service.getAll().subscribe((result) => {
        // Then
        expect(result).toEqual([]);
        done();
      });
    });
  });

  describe('when updating grocery item name', () => {
    it('should return updated grocery item when API returns data', (done) => {
      // Given
      const mockItem = createGroceryItemModelMock();
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
        done();
      });
    });

    it('should handle empty uuid gracefully', (done) => {
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

  describe('when updating grocery item missing status', () => {
    it('should return updated grocery item when API returns data', (done) => {
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

    it('should return null when API returns empty response', (done) => {
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

  describe('when deleting a grocery item', () => {
    it('should call API delete method with correct uuid', (done) => {
      // Given
      const uuid = 'test-uuid';
      mockGroceryItemApiService.deleteRecord.and.returnValue(of(null));

      // When
      service.delete(uuid).subscribe((result) => {
        // Then
        expect(result).toBeNull();
        expect(mockGroceryItemApiService.deleteRecord).toHaveBeenCalledWith(
          uuid,
        );
        done();
      });
    });
  });
});
