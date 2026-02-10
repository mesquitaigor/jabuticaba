import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { DataTestIdValue } from '../../shared/directives/data-testid/data-testid.enum';

/**
 * Helper para buscar elementos por data-testid em testes usando DebugElement
 */
export class DataTestIdHelper {
  /**
   * Busca um DebugElement por data-testid
   * @param element DebugElement raiz para buscar
   * @param testId ID de teste do enum ou string
   * @returns DebugElement encontrado ou null
   */
  static query(
    element: DebugElement,
    testId: DataTestIdValue | string,
  ): DebugElement | null {
    return element.query(By.css(`[data-testid="${testId}"]`));
  }

  /**
   * Busca todos os DebugElements por data-testid
   * @param element DebugElement raiz para buscar
   * @param testId ID de teste do enum ou string
   * @returns Lista de DebugElements encontrados
   */
  static queryAll(
    element: DebugElement,
    testId: DataTestIdValue | string,
  ): DebugElement[] {
    return element.queryAll(By.css(`[data-testid="${testId}"]`));
  }

  /**
   * Busca um DebugElement e lança erro se não encontrar
   * @param element DebugElement raiz para buscar
   * @param testId ID de teste do enum ou string
   * @returns DebugElement encontrado
   * @throws Error se elemento não for encontrado
   */
  static queryOrFail(
    element: DebugElement,
    testId: DataTestIdValue | string,
  ): DebugElement {
    const result = this.query(element, testId);
    if (!result) {
      throw new Error(`Elemento com data-testid="${testId}" não encontrado`);
    }
    return result;
  }

  /**
   * Verifica se um elemento com data-testid existe
   * @param element DebugElement raiz para buscar
   * @param testId ID de teste do enum ou string
   * @returns true se o elemento existe
   */
  static exists(
    element: DebugElement,
    testId: DataTestIdValue | string,
  ): boolean {
    return this.query(element, testId) !== null;
  }

  /**
   * Busca um nativeElement (HTMLElement) por data-testid
   * @param element DebugElement raiz para buscar
   * @param testId ID de teste do enum ou string
   * @returns HTMLElement encontrado ou null
   */
  static queryNative<T extends HTMLElement = HTMLElement>(
    element: DebugElement,
    testId: DataTestIdValue | string,
  ): T | null {
    const debugElement = this.query(element, testId);
    return debugElement ? (debugElement.nativeElement as T) : null;
  }

  /**
   * Busca todos os nativeElements (HTMLElement) por data-testid
   * @param element DebugElement raiz para buscar
   * @param testId ID de teste do enum ou string
   * @returns Lista de HTMLElements encontrados
   */
  static queryAllNative<T extends HTMLElement = HTMLElement>(
    element: DebugElement,
    testId: DataTestIdValue | string,
  ): T[] {
    return this.queryAll(element, testId).map((de) => de.nativeElement as T);
  }
}
