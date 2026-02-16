import { Type } from '@angular/core';

export interface DialogConfig<T, I = unknown> {
  id?: string;
  component: Type<T>;
  header?: string;
  data?: I;
  width?: string;
  onClose?: () => void;
}

export interface DialogInstance {
  id: string;
  config: DialogConfig<unknown>;
  close: () => void;
}

export interface DialogState {
  id: string;
  config: DialogConfig<unknown>;
  isVisible: boolean;
}
