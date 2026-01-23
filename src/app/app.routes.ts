import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'grocery-list',
    loadComponent: () =>
      import('./modules/grocery-list/grocery-list.component').then(
        (m) => m.GroceryListComponent,
      ),
  },
];
