import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'grocery-list',
    loadComponent: () =>
      import('./modules/grocery-list/grocery-list.component').then(
        (m) => m.GroceryListComponent,
      ),
  },
  {
    path: 'budget',
    loadComponent: () =>
      import('./modules/budget/budget.component').then(
        (m) => m.BudgetComponent,
      ),
  },
  {
    path: 'daily-tasks',
    loadComponent: () =>
      import('./modules/daily-tasks/daily-tasks.component').then(
        (m) => m.DailyTasksComponent,
      ),
  },
  {
    path: 'billing-and-accounts',
    loadComponent: () =>
      import('./modules/billing-and-accounts/billing-and-accounts.component').then(
        (m) => m.BillingAndAccountsComponent,
      ),
  },
];
