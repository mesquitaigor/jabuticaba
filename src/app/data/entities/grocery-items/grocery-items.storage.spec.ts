import { TestBed } from '@angular/core/testing';
import { GroceryItemsStorageService } from './grocery-items.storage.service';
import { createGroceryItemModelMock } from '../../../tests/mocks/GroceryItemModel.mock.spec';
import { safeStringify } from '../../../shared/utils/serialize';

describe(GroceryItemsStorageService.name, () => {
  let service: GroceryItemsStorageService;
  let storeKey: string;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GroceryItemsStorageService);
    storeKey = service['storageKey'];
    spyOn(localStorage, 'setItem');
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('dado uma lista de itens válida', () => {
    it('precisa salvar os itens no localStorage e retornar true', () => {
      const list = [createGroceryItemModelMock()];

      const result = service.save(list);

      expect(localStorage.setItem).toHaveBeenCalledWith(
        storeKey,
        safeStringify(list),
      );
      expect(result).toBeTrue();
    });
  });

  describe('dado uma falha no localStorage', () => {
    it('precisa retornar false quando o setItem lança um erro', () => {
      (localStorage.setItem as jasmine.Spy).and.throwError('Storage full');

      const result = service.save([createGroceryItemModelMock()]);

      expect(result).toBeFalse();
    });
  });
});
