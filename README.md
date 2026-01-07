# Jabuticaba

Sistema para ajudar no planejamento pessoal, incluindo lista de compras do supermercado, finanças e outras funcionalidades de organização.

## 🚀 Tecnologias

- Angular
- TypeScript
- ESLint
- Prettier
- Husky
- lint-staged
- Commitlint

## 📋 Pré-requisitos

- Node.js (versão 18 ou superior)
- npm ou yarn
- Angular CLI

## 🔧 Instalação

1. Clone o repositório:

```bash
git clone <url-do-repositorio>
cd jabuticaba
```

2. Instale as dependências:

```bash
npm install
```

3. Instale o Angular CLI globalmente (se ainda não tiver):

```bash
npm install -g @angular/cli
```

## 🏃‍♂️ Executando o projeto

Para iniciar o servidor de desenvolvimento:

```bash
ng serve
```

O aplicativo estará disponível em `http://localhost:4200/`.

### Outros comandos úteis:

- `ng build` - Compila o projeto
- `ng test` - Executa os testes unitários
- `ng lint` - Executa o linting do código

## 🛠️ Configuração do Ambiente de Desenvolvimento

### Plugins VS Code Obrigatórios

Instale os seguintes plugins no VS Code:

1. **Prettier - Code formatter**
   - ID: `esbenp.prettier-vscode`
   - Link: https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode

2. **ESLint**
   - ID: `dbaeumer.vscode-eslint`
   - Link: https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint

### Configuração VS Code

Crie ou edite o arquivo `.vscode/settings.json` na raiz do projeto com as seguintes configurações:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[html]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[scss]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[css]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}
```

### ESLint e Prettier

O projeto já está configurado com ESLint e Prettier. As configurações incluem:

- **ESLint**: Linting para TypeScript e Angular
- **Prettier**: Formatação automática de código
- Integração entre ESLint e Prettier para evitar conflitos

### Git Hooks e Qualidade de Código

O projeto utiliza ferramentas para garantir a qualidade do código:

- **Husky**: Gerencia git hooks para executar scripts antes de commits e pushes
- **lint-staged**: Executa linters apenas nos arquivos que foram modificados
- **Commitlint**: Valida mensagens de commit seguindo o padrão Conventional Commits

#### Git Hooks configurados:

- **pre-commit**: Executa linting e formatação nos arquivos modificados
- **commit-msg**: Valida o formato da mensagem de commit

#### Scripts disponíveis:

````bash
# Verificar problemas de linting
npm run lint

# Corrigir problemas de linting automaticamente
npm run lint:fix

# Formatar código com Prettier### Git Hooks e Qualidade de Código

O projeto utiliza ferramentas para garantir a qualidade do código:

- **Husky**: Gerencia git hooks para executar scripts antes de commits e pushes
- **lint-staged**: Executa linters apenas nos arquivos que foram modificados
- **Commitlint**: Valida mensagens de commit seguindo o padrão Conventional Commits
- **Commitizen**: Ferramenta interativa para criar commits seguindo o padrão Conventional Commits

#### Git Hooks configurados:

- **pre-commit**: Executa linting e formatação nos arquivos modificados
- **commit-msg**: Valida o formato da mensagem de commit

#### Como fazer commits:

Para garantir que suas mensagens de commit sigam o padrão Conventional Commits, utilize o Commitizen:

```bash
# Ao invés de usar 'git commit', use:
npm run commit
````

O Commitizen irá guiá-lo através de um processo interativo para criar commits padronizados, perguntando sobre:

- **Tipo do commit** (feat, fix, docs, style, refactor, test, chore, etc.)
- **Escopo** (opcional - parte do projeto afetada)
- **Descrição curta** (obrigatória)
- **Descrição longa** (opcional)
- **Breaking changes** (opcional)
- **Issues fechadas** (opcional)

#### Exemplos de mensagens de commit geradas:

```
feat(auth): add login functionality
fix(shopping-list): resolve item duplication bug
docs: update README with Commitizen instructions
style: format code with Prettier
refactor(api): restructure service layer
test(components): add unit tests for shopping list
chore(deps): update Angular to v20
```

#### Scripts disponíveis:

```bash
# Verificar problemas de linting
npm run lint

# Corrigir problemas de linting automaticamente
npm run lint:fix

# Formatar código com Prettier
npm run format

# Fazer commit interativo com Commitizen
npm run commit

# Preparar Husky hooks (executado automaticamente após npm install)
npm run prepare

# Verificar formato das mensagens de commit
npm run commitlint

# Executar lint-staged manualmente
npm run lint-staged
```

### Diretrizes para Mensagens de Commit

Para manter a consistência e qualidade das mensagens de commit no projeto, consulte o arquivo de [diretrizes de commit](.github/guidelines/commits.md). Esse arquivo contém:

- Formato estrutural obrigatório (Conventional Commits)
- Regras de conteúdo e estilo
- Restrições e boas práticas
- Exemplos de uso

### Configuração do GitHub Copilot para Commits

Se você usa o GitHub Copilot no VS Code, pode configurá-lo para gerar mensagens de commit automaticamente seguindo nossas diretrizes:

1. **Certifique-se de que o GitHub Copilot está instalado** no VS Code
2. **Adicione a configuração no settings.json**: O arquivo `.vscode/settings.json` já contém a configuração necessária:

```json
{
  "github.copilot.chat.commitMessageGeneration.instructions": [{ "file": ".github/guidelines/commits.md" }]
}
```

3. **Como usar**: No controle de versão (Source Control) do VS Code:
   - Faça suas alterações e adicione-as ao stage
   - Clique no ícone ✨ (sparkles) no campo de mensagem de commit
   - O Copilot gerará uma mensagem seguindo nossas diretrizes automaticamente

Esta configuração faz com que o GitHub Copilot use nossas diretrizes como base para gerar mensagens de commit apropriadas, mantendo a consistência em todo o projeto.

## 📁 Estrutura do Projeto

```

src/
├── app/
│ ├── components/ # Componentes reutilizáveis
│ ├── pages/ # Páginas da aplicação
│ ├── services/ # Serviços
│ ├── models/ # Interfaces e modelos
│ └── shared/ # Módulos compartilhados
├── assets/ # Recursos estáticos
└── environments/ # Configurações de ambiente

```

```

```
