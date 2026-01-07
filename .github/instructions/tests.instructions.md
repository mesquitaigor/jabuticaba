---
applyTo: **/*spec.ts
---

# Padrões de Teste Unitário

Sempre que gerar testes para este projeto, siga estas diretrizes:

## Framework e Ferramentas

- Use **Jasmine** como runner de testes.

## Estrutura do Teste

- Use o padrão **AAA** (Arrange, Act, Assert).
- Use o padrão **BDD** para escrever os testes
- Agrupe testes relacionados usando blocos `describe`.
- Use `beforeEach` para configurar o estado inicial comum a vários testes.
- Use `afterEach` para limpar ou resetar estados após os testes, se necessário.
- fixture.detectChanges() deve ser chamado apenas quando necessário para atualizar a view e não no beforeEach.
- Apenas 2 níveis de describe por arquivo de teste, a menos que esteja testando uma classe com muitas responsabilidades.
- Describes não podem ter descrições baseadas em métodos (ex: `describe('meuMetodo()')`), foque no comportamento (ex: `describe('quando o usuário está logado')`).

## Boas Práticas

- Não faça mock de funções internas, foque no comportamento público.
- Não exagere no número de testes
- Não escreva testes fáceis de serem quebrados por mudanças triviais.
- Mantenha os testes pequenos e focados.
- O nome do teste deve descrever claramente o comportamento esperado (ex: `it('precisa renderizar mensagem de erro quando o login falha', ...)`).
- Utilize a pasta src/app/tests para criar mocks e helpers reutilizáveis.
- Não use any em testes, crie mocks ou spies tipados.
