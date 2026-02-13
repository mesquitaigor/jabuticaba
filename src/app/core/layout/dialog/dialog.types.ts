import { Type } from '@angular/core';

export interface DialogConfig<T, I = unknown> {
  component: Type<T>;
  header?: string;
  data?: I;
  width?: string;
  onClose?: () => void;
}

export interface DialogInstance {
  close: () => void;
}
