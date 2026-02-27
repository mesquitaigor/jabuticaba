import { Type } from '@angular/core';
import { TestBed } from '@angular/core/testing';

export default abstract class Mocker<T> {
  public spy?: jasmine.SpyObj<T>;
  protected abstract readonly token: Type<T>;
  public abstract create(): jasmine.SpyObj<T>;
  public getSpy(): jasmine.SpyObj<T> {
    return TestBed.inject(this.token) as jasmine.SpyObj<T>;
  }
  public getProvider(): {
    provide: Type<T>;
    useValue: jasmine.SpyObj<T>;
  } {
    return { provide: this.token, useValue: this.spy! };
  }
}
