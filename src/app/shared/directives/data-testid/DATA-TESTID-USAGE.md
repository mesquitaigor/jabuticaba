# DataTestId - Diretiva para Test IDs Tipados com Prefixos Automáticos

Esta diretiva permite adicionar atributos `data-testid` aos elementos HTML de forma tipada e organizada hierarquicamente, facilitando os testes end-to-end e garantindo consistência nos IDs de teste.

## 🎯 Estrutura Hierárquica com Prefixos

Os IDs são organizados por módulo/componente com prefixos automáticos:

```typescript
DataTestId.GroceryList.Item; // → 'grocery-list_item'
DataTestId.Sidebar.Logo; // → 'sidebar_logo'
DataTestId.Header.Avatar; // → 'header_avatar'
```

### Benefícios da Estrutura Hierárquica

1. **Organização Clara**: IDs agrupados por contexto/módulo
2. **Prefixos Automáticos**: Evita conflitos entre módulos
3. **Autocomplete Inteligente**: IDE sugere apenas IDs do módulo relevante
4. **Fácil Navegação**: Descubra IDs relacionados navegando a estrutura

## Uso no Template (HTML)

### Opção 1: Usando a Estrutura Hierárquica (Recomendado)

No componente TypeScript:

```typescript
import { Component } from "@angular/core";
import { DataTestidDirective, DataTestId } from "../../../directives";

@Component({
  selector: "app-example",
  standalone: true,
  imports: [DataTestidDirective],
  template: `
    <button [jbtDataTestid]="testIds.GroceryList.SaveButton">Salvar</button>
    <div [jbtDataTestid]="testIds.GroceryList.LoadingState">Carregando...</div>
    <header [jbtDataTestid]="testIds.Header.Logo">
      <img src="logo.png" />
    </header>
  `,
})
export class ExampleComponent {
  testIds = DataTestId; // Expõe a estrutura para o template
}
```

### Opção 2: Usando ID Customizado

Para casos especiais, você pode criar IDs customizados em runtime:

```typescript
import { Component } from '@angular/core';
import { DataTestidDirective, createCustomTestId } from '../../../directives';

@Component({
  selector: 'app-dynamic',
  standalone: true,
  imports: [DataTestidDirective],
  template: `<div [jbtDataTestid]="customId">Elemento dinâmico</div>`
})
export class DynamicComponent {
  customId = createCustomTestId('my-module', 'special-element');
  // Resultado: 'my-module_special-element'
```

## Uso em Testes

### Com o Helper (Recomendado)

```typescript
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { DataTestId } from "../../../directives";
import { DataTestIdHelper } from "../../../../../tests/helpers/data-testid.helper.spec";
import { GroceryListComponent } from "./grocery-list.component";

describe("GroceryListComponent", () => {
  let fixture: ComponentFixture<GroceryListComponent>;
  let compiled: HTMLElement;

  beforeEach(() => {
    fixture = TestBed.createComponent(GroceryListComponent);
    compiled = fixture.nativeElement;
  });

  it("precisa renderizar o botão de salvar", () => {
    fixture.detectChanges();

    const saveButton = DataTestIdHelper.query(compiled, DataTestId.GroceryList.SaveButton);

    expect(saveButton).toBeTruthy();
    expect(saveButton?.textContent).toContain("Salvar");
  });

  it("precisa lançar erro se elemento não existir", () => {
    fixture.detectChanges();

    expect(() => {
      DataTestIdHelper.queryOrFail(compiled, DataTestId.GroceryList.SaveButton);
    }).not.toThrow();
  });

  it("precisa verificar se elemento existe", () => {
    fixture.detectChanges();

    expect(DataTestIdHelper.exists(compiled, DataTestId.GroceryList.EmptyState)).toBe(true);
  });
});
```

### Sem o Helper

```typescript
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { DataTestId } from "../../../directives";
import { GroceryListComponent } from "./grocery-list.component";

describe("GroceryListComponent", () => {
  let fixture: ComponentFixture<GroceryListComponent>;
  let compiled: HTMLElement;

  beforeEach(() => {
    fixture = TestBed.createComponent(GroceryListComponent);
    compiled = fixture.nativeElement;
  });

  it("precisa renderizar o botão de salvar", () => {
    fixture.detectChanges();

    const saveButton = compiled.querySelector(`[data-testid="${DataTestId.GroceryList.SaveButton}"]`);

    expect(saveButton).toBeTruthy();
    expect(saveButton?.textContent).toContain("Salvar");
  });
});
```

## Adicionando Novos Test IDs

Para adicionar um novo ID de teste, edite o arquivo `data-testid.enum.ts`:

### Adicionando a um módulo existente:

```typescript
export const DataTestId = {
  GroceryList: {
    Item: createTestId("grocery-list", "item"),
    // Adicione aqui:
    DeleteButton: createTestId("grocery-list", "delete-button"),
  },
  // ... outros módulos
};
```

### Adicionando um novo módulo:

```typescript
export const DataTestId = {
  // ... módulos existentes

  // Novo módulo
  Profile: {
    Avatar: createTestId("profile", "avatar"),
    Name: createTestId("profile", "name"),
    EditButton: createTestId("profile", "edit-button"),
  },
};
```

## Benefícios

1. **Tipagem Forte**: Autocomplete no IDE e detecção de erros em tempo de desenvolvimento
2. **Organização Clara**: IDs agrupados logicamente por módulo/componente
3. **Prefixos Automáticos**: Sem conflitos de nomes entre módulos (grocery-list*, header*, etc)
4. **Consistência**: IDs centralizados evitam duplicação e typos
5. **Manutenção Fácil**: Refatore em um lugar só
6. **Navegação Intuitiva**: Autocomplete mostra apenas IDs relevantes ao contexto
7. **Documentação Automática**: A estrutura serve como documentação dos IDs disponíveis

## Estrutura Gerada

A função `createTestId` gera automaticamente IDs com prefixos:

```typescript
createTestId("grocery-list", "item"); // → 'grocery-list_item'
createTestId("header", "logo"); // → 'header_logo'
createCustomTestId("custom", "element"); // → 'custom_element'
```

## IDs Disponíveis

Veja todos os IDs disponíveis e sua organização em [data-testid.enum.ts](./data-testid.enum.ts).

## Exemplo Completo

Veja um exemplo de implementação completa no [LogoComponent](../components/atoms/logo/) que usa:

- A diretiva no template
- DataTestId no componente TypeScript
- DataTestIdHelper nos testes
