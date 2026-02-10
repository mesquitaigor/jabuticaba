import { MessageService } from 'primeng/api';
import { Subject } from 'rxjs';

export function createMessageServiceMock(): jasmine.SpyObj<MessageService> {
  const messageObserver = new Subject();

  const mock = jasmine.createSpyObj('MessageService', [
    'add',
    'addAll',
    'clear',
  ]) as jasmine.SpyObj<MessageService>;

  // Adiciona messageObserver como getter para garantir que sempre retorna o Subject
  Object.defineProperty(mock, 'messageObserver', {
    get: () => messageObserver,
    enumerable: true,
    configurable: true,
  });

  return mock;
}
