import Spy from './spy.spec';
import { DialogService } from '@layout/dialog';

export class DialogServiceSpy extends Spy<DialogService> {
  protected override readonly token = DialogService;
  public create(): jasmine.SpyObj<DialogService> {
    this.spy = jasmine.createSpyObj(DialogService.name, [
      'open',
      'close',
    ]) as jasmine.SpyObj<DialogService>;
    return this.spy;
  }
}
