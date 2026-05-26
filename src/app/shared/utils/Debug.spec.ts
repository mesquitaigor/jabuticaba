import { environment } from '../../../environments/environment';
import Debug from './Debug';

describe(Debug.name, () => {
  const originalConsole = console;
  beforeEach(() => {
    environment.production = false;
    console = {
      ...originalConsole,
      log: jasmine.createSpy('log'),
      error: jasmine.createSpy('error'),
    };
  });
  afterEach(() => {
    console = originalConsole;
  });
  it('Deve logar mensagens no console quando não está em produção', () => {
    environment.production = true;
    Debug.log('Test log1');
    expect(console.log).not.toHaveBeenCalled();
    environment.production = false;
    Debug.log('Test log2');
    expect(console.log).toHaveBeenCalledWith('Test log2');
  });
  it('Deve logar erros no console quando não está em produção', () => {
    environment.production = true;
    Debug.error('Test error1');
    expect(console.error).not.toHaveBeenCalled();
    environment.production = false;
    Debug.error('Test error2');
    expect(console.error).toHaveBeenCalledWith('Test error2');
  });
});
