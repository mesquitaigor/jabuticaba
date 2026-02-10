# Estrutura Hierárquica de Data Test IDs

## 📋 Visão Geral

Esta aplicação usa uma estrutura hierárquica e tipada para organizar `data-testid` por módulo/componente, com prefixos automáticos para evitar conflitos.

## 🎯 Formato dos IDs Gerados

```
DataTestId.[Módulo].[Elemento] → '[modulo]_[elemento]'
```

## 📊 Estrutura Completa

```typescript
DataTestId
├── GroceryList
│   ├── Item                → 'grocery-list_item'
│   ├── ItemName            → 'grocery-list_item-name'
│   ├── ItemCheckbox        → 'grocery-list_item-checkbox'
│   ├── LoadingState        → 'grocery-list_loading-state'
│   ├── ErrorState          → 'grocery-list_error-state'
│   ├── EmptyState          → 'grocery-list_empty-state'
│   ├── AddItemModal        → 'grocery-list_add-item-modal'
│   ├── NewItemInput        → 'grocery-list_new-item-input'
│   └── SaveButton          → 'grocery-list_save-button'
│
├── Header
│   ├── SidebarButton       → 'header_sidebar-button'
│   ├── Logo                → 'header_logo'
│   └── Avatar              → 'header_avatar'
│
├── Sidebar
│   ├── Logo                → 'sidebar_logo'
│   ├── CloseButton         → 'sidebar_close-button'
│   └── Menu                → 'sidebar_menu'
│
├── Budget
│   └── Container           → 'budget_container'
│
├── DailyTasks
│   └── Container           → 'daily-tasks_container'
│
└── BillingAndAccounts
    └── Container           → 'billing-accounts_container'
```

## 💡 Exemplos de Uso

### No Template (HTML)

```typescript
// No componente
export class GroceryListComponent {
  testIds = DataTestId.GroceryList; // Expõe apenas IDs relevantes
}
```

```html
<!-- No template -->
<button [jbtDataTestid]="testIds.SaveButton">Salvar</button>
<div [jbtDataTestid]="testIds.LoadingState">Carregando...</div>
```

### Nos Testes

```typescript
import { DataTestIdHelper } from "@tests/helpers/data-testid.helper.spec";
import { DataTestId } from "@shared/directives";

// Buscar elemento
const button = DataTestIdHelper.query(compiled, DataTestId.GroceryList.SaveButton);

// Verificar existência
expect(DataTestIdHelper.exists(compiled, DataTestId.Sidebar.Logo)).toBe(true);
```

## ✨ Vantagens

### 1. **Organização Clara**

IDs agrupados logicamente por contexto

### 2. **Prefixos Automáticos**

Evita conflitos: `header_logo` vs `sidebar_logo`

### 3. **Autocomplete Inteligente**

```typescript
DataTestId.GroceryList. // IDE mostra apenas: Item, ItemName, SaveButton, etc.
DataTestId.Header.      // IDE mostra apenas: Logo, Avatar, SidebarButton
```

### 4. **Fácil Manutenção**

Adicionar novo módulo:

```typescript
export const DataTestId = {
  // ... módulos existentes

  NewModule: {
    Element1: createTestId("new-module", "element-1"),
    Element2: createTestId("new-module", "element-2"),
  },
};
```

### 5. **Type Safety**

```typescript
// ✅ Correto - TypeScript aceita
testId = DataTestId.GroceryList.SaveButton;

// ❌ Erro - TypeScript detecta
testId = DataTestId.GroceryList.NonExistent; // Property 'NonExistent' does not exist
```

## 🔧 IDs Customizados (Casos Especiais)

Para elementos dinâmicos:

```typescript
import { createCustomTestId } from "../directives";

// Em um loop ou situação dinâmica
const dynamicId = createCustomTestId("user-list", `user-${userId}`);
// Resultado: 'user-list_user-123'
```

## 📝 Convenções de Nomenclatura

### Prefixo do Módulo (kebab-case)

- `grocery-list` - módulo principal
- `header`, `sidebar` - componentes de layout
- `daily-tasks` - módulos com múltiplas palavras

### Nome do Elemento (PascalCase no código, kebab-case no output)

- `SaveButton` → `save-button`
- `ItemName` → `item-name`
- `LoadingState` → `loading-state`

## 🎨 Diagrama Visual

```
┌─────────────────────────────────────────────┐
│          DataTestId (Objeto)                │
├─────────────────────────────────────────────┤
│                                             │
│  ┌──────────────┐  ┌─────────────┐         │
│  │ GroceryList  │  │   Header    │         │
│  ├──────────────┤  ├─────────────┤         │
│  │ • Item       │  │ • Logo      │         │
│  │ • SaveButton │  │ • Avatar    │         │
│  │ • ...        │  │ • ...       │         │
│  └──────────────┘  └─────────────┘         │
│                                             │
│  ┌──────────────┐  ┌─────────────┐         │
│  │   Sidebar    │  │   Budget    │         │
│  ├──────────────┤  ├─────────────┤         │
│  │ • Logo       │  │ • Container │         │
│  │ • Menu       │  └─────────────┘         │
│  │ • ...        │                           │
│  └──────────────┘                           │
│                                             │
└─────────────────────────────────────────────┘
          ▼ Prefixos automáticos
┌─────────────────────────────────────────────┐
│     IDs Gerados (data-testid HTML)          │
├─────────────────────────────────────────────┤
│  grocery-list_item                          │
│  grocery-list_save-button                   │
│  header_logo                                │
│  header_avatar                              │
│  sidebar_logo                               │
│  sidebar_menu                               │
│  budget_container                           │
└─────────────────────────────────────────────┘
```
