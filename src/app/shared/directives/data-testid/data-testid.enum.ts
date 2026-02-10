/**
 * Função helper para criar IDs de teste com prefixo
 */
const createTestId = (prefix: string, id: string): string => `${prefix}_${id}`;

/**
 * Estrutura organizada de data-testid por módulo/componente
 */
export const DataTestId = {
  // Grocery List Module
  GroceryList: {
    Item: createTestId('grocery-list', 'item'),
    ItemName: createTestId('grocery-list', 'item-name'),
    LoadingState: createTestId('grocery-list', 'loading-state'),
    ErrorState: createTestId('grocery-list', 'error-state'),
    EmptyState: createTestId('grocery-list', 'empty-state'),
    AddItemModal: createTestId('grocery-list', 'add-item-modal'),
    NewItemInput: createTestId('grocery-list', 'new-item-input'),
    SaveButton: createTestId('grocery-list', 'save-button'),
    DetailsItemButton: createTestId('grocery-list', 'details-item-button'),
    DetailsMenu: createTestId('grocery-list', 'details-menu'),
    DeleteItemMenu: createTestId('grocery-list', 'delete-item-menu'),
  },

  // Header Component
  Header: {
    SidebarButton: createTestId('header', 'sidebar-button'),
    Logo: createTestId('header', 'logo'),
    Avatar: createTestId('header', 'avatar'),
  },

  // Sidebar Component
  Sidebar: {
    Logo: createTestId('sidebar', 'logo'),
    CloseButton: createTestId('sidebar', 'close-button'),
    Menu: createTestId('sidebar', 'menu'),
  },

  // Budget Module
  Budget: {
    Container: createTestId('budget', 'container'),
  },

  // Daily Tasks Module
  DailyTasks: {
    Container: createTestId('daily-tasks', 'container'),
  },

  // Billing and Accounts Module
  BillingAndAccounts: {
    Container: createTestId('billing-accounts', 'container'),
  },
} as const;

/**
 * Type helper para extrair todos os valores possíveis de data-testid
 */
type DeepTestIdValues<T> = T extends string
  ? T
  : T extends Record<string, unknown>
    ? { [K in keyof T]: DeepTestIdValues<T[K]> }[keyof T]
    : never;

export type DataTestIdValue = DeepTestIdValues<typeof DataTestId>;

/**
 * Helper para criar IDs customizados em runtime (casos especiais)
 */
export const createCustomTestId = (module: string, element: string): string =>
  createTestId(module, element);
