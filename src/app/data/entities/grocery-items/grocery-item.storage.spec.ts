import { TestBed } from '@angular/core/testing';
import { GroceryItemStorageService } from './grocery-item.storage.service';
import { createGroceryItemModelMock } from '../../../tests/mocks/GroceryItemModel.mock.spec';
import { safeStringify } from '../../../shared/utils/serialize';

describe(GroceryItemStorageService.name, () => {
  let service: GroceryItemStorageService;
  let storeKey: string;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GroceryItemStorageService);
    storeKey = service['storageKey'];
    spyOn(localStorage, 'setItem');
    spyOn(localStorage, 'getItem');
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

  describe('ao recuperar a lista do storage', () => {
    it('precisa retornar a lista de itens quando o storage tem dados', () => {
      const list = [createGroceryItemModelMock()];
      (localStorage.getItem as jasmine.Spy).and.returnValue(
        safeStringify(list),
      );

      const result = service.recover();

      expect(localStorage.getItem).toHaveBeenCalledWith(storeKey);
      expect(result.length).toBe(1);
      expect(result[0].uuid).toBe(list[0].uuid);
    });

    it('precisa retornar array vazio quando o storage está vazio', () => {
      (localStorage.getItem as jasmine.Spy).and.returnValue(null);

      const result = service.recover();

      expect(result).toEqual([]);
    });

    it('precisa retornar array vazio quando o JSON armazenado é inválido', () => {
      (localStorage.getItem as jasmine.Spy).and.returnValue('invalid-json{');

      const result = service.recover();

      expect(result).toEqual([]);
    });
  });
});
