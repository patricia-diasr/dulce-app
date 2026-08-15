# Dulce App

Frontend do **DULCE** (Digitalização e Unificação da Logística de Confeitaria e
Encomendas), sistema de gestão de encomendas de uma confeitaria artesanal. Este
repositório contém apenas o frontend (Spring Boot); o backend (React) vive em
um repositório separado.

## Stack

- **React 19** + **TypeScript**, com **Vite** como bundler/dev server
- **Mantine** como biblioteca de componentes (`@mantine/core`, `@mantine/dates`,
  `@mantine/notifications`, `@mantine/form`)
- **React Router** para navegação
- **TanStack Query** para chamadas à API, cache e revalidação
- **Axios** como cliente HTTP, com interceptor de JWT
- **Zod** para validação de formulários (integrado ao `@mantine/form`)
- **lucide-react** para ícones
- **Fraunces** (títulos/marca) + **Nunito Sans** (corpo de texto), via Fontsource
- **ESLint** + **Prettier** para lint e formatação automática

## Pré-requisitos

- Node.js 24 (LTS)
- npm

## Como rodar

```bash
npm install
cp .env.example .env.development
npm run dev
```

A aplicação sobe em `http://localhost:5173`.

## Scripts

| Comando                | O que faz                                   |
| ---------------------- | ------------------------------------------- |
| `npm run dev`          | Sobe o servidor de desenvolvimento (Vite)   |
| `npm run build`        | Type-check + build de produção (`dist/`)    |
| `npm run preview`      | Serve o build de produção localmente        |
| `npm run lint`         | Roda o ESLint                               |
| `npm run lint:fix`     | Roda o ESLint corrigindo o que for possível |
| `npm run format`       | Formata todo o projeto com o Prettier       |
| `npm run format:check` | Verifica formatação sem alterar arquivos    |
| `npm run typecheck`    | Roda apenas o type-check do TypeScript      |

## Variáveis de ambiente

Todas as variáveis usadas pelo frontend são prefixadas com `VITE_` (exigência
do Vite para expor variáveis ao código do cliente).

| Variável       | Descrição                              |
| -------------- | -------------------------------------- |
| `VITE_API_URL` | URL base da API do backend Spring Boot |

- `.env.example` — referência versionada, sem valores sensíveis.
- `.env.development` — valores padrão para desenvolvimento local (já versionado,
  aponta para `http://localhost:8080/api`).
- `.env.production` — **não versionado**; criar localmente ou configurar como
  variável de ambiente na plataforma de deploy quando o projeto for ao ar.

## Estrutura de pastas

```
src/
  app/            # Bootstrap da aplicação: router e query client
  features/       # Uma pasta por funcionalidade de negócio
    auth/           # Login (cliente e admin) e cadastro
    orders/         # Pedidos: montagem, carrinho, detalhe, dashboard admin
    customers/      # Listagem e detalhe de clientes (admin)
    schedule/       # Calendário e bloqueios de agenda (admin)
    flavors/        # Recheios e matriz de preços (admin)
    notifications/  # Configuração dos templates de notificação (admin)
  pages/          # Páginas que não pertencem a uma feature específica
    dev/            # Página de referência do design system (uso interno)
    errors/         # 404 e outras páginas de erro
  shared/         # Componentes, hooks, utils e types reaproveitáveis
  lib/            # Integrações de baixo nível (cliente HTTP, etc.)
  theme/          # Tema do Mantine: cores, tipografia, radius, sombras
```

Cada feature segue o mesmo padrão interno, conforme necessário:
`api/` (chamadas HTTP), `components/`, `hooks/`, `pages/`, `types/`.

## Padrões de código

- **Formatação automática**: Prettier roda ao salvar (via configuração do
  VS Code em `.vscode/settings.json`) e pode ser conferida/aplicada via
  `npm run format` / `npm run format:check`.
- **Lint**: ESLint com as regras recomendadas para React + TypeScript, mais
  `eslint-plugin-react-hooks` e `eslint-plugin-react-refresh`. Regras que
  conflitam com o Prettier são desligadas via `eslint-config-prettier`.
- **EditorConfig**: garante indentação (2 espaços), charset (UTF-8) e fim de
  linha (LF) consistentes entre editores.
- **Alias de import**: `@/` aponta para `src/` (configurado no Vite e no
  TypeScript) — evite `../../../`.

### VS Code

O repositório inclui `.vscode/extensions.json` com as extensões recomendadas
(ESLint, Prettier, EditorConfig, entre outras) e `.vscode/settings.json` com
formatação e correção automática ao salvar já configuradas. O VS Code deve
sugerir a instalação das extensões ao abrir a pasta.

## Controle de versão

- `main`: sempre estável e implantável.
- `feature/nome-da-funcionalidade`: para cada nova funcionalidade.
- `fix/nome-do-bug`: correções.

Use Pull Requests ao mergear em `main` para manter o histórico organizado e
facilitar reverter algo se necessário.

### Commits

Seguimos [Conventional Commits](https://www.conventionalcommits.org/):
`feat:`, `fix:`, `docs:`, `refactor:`, `test:`, `chore:`, `style:`.

Exemplo: `feat: adiciona formulário de montagem do bolo`
