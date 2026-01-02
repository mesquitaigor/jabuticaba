# Jabuticaba

Sistema para ajudar no planejamento pessoal, incluindo lista de compras do supermercado, finanças e outras funcionalidades de organização.

## 🚀 Tecnologias

- Angular
- TypeScript
- ESLint
- Prettier

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

#### Scripts disponíveis:

```bash
# Verificar problemas de linting
npm run lint

# Corrigir problemas de linting automaticamente
npm run lint:fix

# Formatar código com Prettier
npm run format
```

## 📁 Estrutura do Projeto

```
src/
├── app/
│   ├── components/     # Componentes reutilizáveis
│   ├── pages/         # Páginas da aplicação
│   ├── services/      # Serviços
│   ├── models/        # Interfaces e modelos
│   └── shared/        # Módulos compartilhados
├── assets/            # Recursos estáticos
└── environments/      # Configurações de ambiente
```

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request
