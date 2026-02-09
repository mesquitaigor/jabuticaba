import { NavigationItem } from './navigation.types';

export const NAVIGATION_ITEMS: NavigationItem[] = [
  {
    label: 'Supermercado',
    icon: 'pi pi-shopping-cart',
    route: 'grocery-list',
  },
  { label: 'Carteira', icon: 'pi pi-wallet', route: 'billing-and-accounts' },
  { label: 'Planejamento', icon: 'pi pi-bullseye', route: 'budget' },
  { label: 'Tarefas', icon: 'pi pi-calendar', route: 'daily-tasks' },
];
