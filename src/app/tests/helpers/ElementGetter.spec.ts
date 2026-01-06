import { By } from '@angular/platform-browser';
import { ComponentFixture } from '@angular/core/testing';
import { DebugElement } from '@angular/core';

interface GetterElementOptions {
  fail?: boolean;
  query?: string;
  debugElement?: DebugElement;
  testId?: string;
}
type HtmlElementsName = 'input' | 'button' | 'p' | 'div' | 'span' | 'label';

export default class ElementGetter<T extends Record<string, string>> {
  private fixture?: ComponentFixture<unknown>;
  constructor(private testIds: T) {}
  public setFixture(fixture: ComponentFixture<unknown>): void {
    this.fixture = fixture;
  }
  public static getInputInDebugElement(
    debugElement: DebugElement,
    options?: GetterElementOptions,
  ): HTMLInputElement | null {
    return this.getInDebugElement<HTMLInputElement>(
      debugElement,
      'input',
      options,
    );
  }
  public static getInDebugElement<T extends HTMLElement>(
    debugElement: DebugElement,
    query: HtmlElementsName,
    options?: GetterElementOptions,
  ): T | null {
    const element = debugElement.nativeElement.querySelector(query);
    if (options?.fail && !element) {
      fail(`Elemento(${query}) não encontrado`);
    }
    return element;
  }
  public getByTestId(
    testId: keyof T,
    options?: GetterElementOptions,
  ): DebugElement | null {
    const query = `[data-testid="${this.testIds[testId]}"]`;
    const element: DebugElement | undefined = this.getElementInFixture(query);
    if (!element && options?.fail) {
      fail(
        `Elemento com data-testid="${this.testIds[options?.testId || '']}" não encontrado`,
      );
    }
    return element || null;
  }
  private getElementInFixture(query: string): DebugElement | undefined {
    return this.fixture?.debugElement.query(By.css(query));
  }
}
