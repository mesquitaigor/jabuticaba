import { DataTestIdValue } from '../../shared/directives/data-testid/data-testid.enum';

/**
 * Helper para buscar elementos por data-testid em testes
 */
export class DataTestIdHelper {
  /**
   * Busca um elemento por data-testid
   * @param element Elemento raiz para buscar
   * @param testId ID de teste do enum ou string
   * @returns Elemento encontrado ou null
   */
  static query<T extends Element = HTMLElement>(
    element: HTMLElement | DocumentFragment,
    testId: DataTestIdValue | string,
  ): T | null {
    return element.querySelector(`[data-testid="${testId}"]`) as T | null;
  }

  /**
   * Busca todos os elementos por data-testid
   * @param element Elemento raiz para buscar
   * @param testId ID de teste do enum ou string
   * @returns Lista de elementos encontrados
   */
  static queryAll<T extends Element = HTMLElement>(
    element: HTMLElement | DocumentFragment,
    testId: DataTestIdValue | string,
  ): T[] {
    return Array.from(
      element.querySelectorAll(`[data-testid="${testId}"]`),
    ) as T[];
  }

  /**
   * Busca um elemento e lança erro se não encontrar
   * @param element Elemento raiz para buscar
   * @param testId ID de teste do enum ou string
   * @returns Elemento encontrado
   * @throws Error se elemento não for encontrado
   */
  static queryOrFail<T extends Element = HTMLElement>(
    element: HTMLElement | DocumentFragment,
    testId: DataTestIdValue | string,
  ): T {
    const result = this.query<T>(element, testId);
    if (!result) {
      throw new Error(`Elemento com data-testid="${testId}" não encontrado`);
    }
    return result;
  }

  /**
   * Verifica se um elemento com data-testid existe
   * @param element Elemento raiz para buscar
   * @param testId ID de teste do enum ou string
   * @returns true se o elemento existe
   */
  static exists(
    element: HTMLElement | DocumentFragment,
    testId: DataTestIdValue | string,
  ): boolean {
    return this.query(element, testId) !== null;
  }
}
