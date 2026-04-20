# Maceng — Calculadoras de Engenharia Mecânica

Plataforma profissional de cálculos técnicos para engenharia mecânica. Dimensionamento, tolerâncias ISO, hidráulica, soldagem e mais. Baseado em normas ABNT, ISO e DIN.

---

## Status do Projeto


| Métrica                                   | Valor                                         |
| ----------------------------------------- | --------------------------------------------- |
| **Total de linhas de código (TS/TSX)**    | 4.648                                         |
| **Linhas de produção (src/)**             | 2.724                                         |
| **Linhas de teste (tests/)**              | 1.924                                         |
| **Linhas de config (root)**               | 79                                            |
| **Linhas SQL (migrations)**               | 116                                           |
| **Linhas CSS**                            | 86                                            |
| **Suites de teste**                       | 41                                            |
| **Testes unitários + integração**         | 223 (todos passando)                          |
| **Arquivos de produção (.ts/.tsx)**       | 59                                            |
| **Arquivos de teste (.test.ts/.tsx)**     | 41                                            |
| **Arquivos de factory (tests/factories)** | 4                                             |
| **Migrations SQL**                        | 1 (schema completo)                           |
| **Regras de negócio (.cursor/rules)**     | 4 (Architecture, TDD, DevSecOps, Performance) |
| **Inputs do usuário na construção**       | 23                                            |
| **Vulnerabilidades (npm audit)**          | 0                                             |


---

## Distribuição de Código por Pasta

### Produção (src/) — 2.724 linhas


| Pasta             | Linhas | Responsabilidade                                                 |
| ----------------- | ------ | ---------------------------------------------------------------- |
| `src/app/`        | 1.122  | Páginas, layouts, API routes (Next.js App Router)                |
| `src/components/` | 1.019  | Componentes UI: layout, auth, dashboard (módulos), seções        |
| `src/core/`       | 412    | Entidades, schemas Zod, ports, use cases, catálogo (camada pura) |
| `src/infra/`      | 145    | Supabase clients, auth provider, migrations SQL                  |
| `src/adapters/`   | 25     | Adapters HTTP (ex.: startGoogleSignIn no browser)                |
| `src/styles/`     | 86     | CSS global + tema Tailwind (azul/branco + dark)                  |
| `src/lib/`        | 1      | Constantes compartilhadas                                        |
| `src/modules/`    | 0      | Reservado para calculadoras (cada módulo terá sua pasta)         |


### Testes (tests/) — 1.924 linhas


| Pasta                    | Linhas | Responsabilidade                                              |
| ------------------------ | ------ | ------------------------------------------------------------- |
| `tests/unit/components/` | 812    | Testes de 21 componentes UI (inclui ModuleCard)               |
| `tests/unit/core/`       | 605    | Schemas, use cases, entity User, entity Module, port, helpers |
| `tests/unit/pages/`      | 180    | Login, cadastro, recuperar senha, módulo detalhado            |
| `tests/factories/`       | 102    | Factories: User, AuthProvider, Credentials                    |
| `tests/unit/security/`   | 76     | Testes de security headers (OWASP)                            |
| `tests/__mocks__/`       | 69     | Mocks de framer-motion, next-themes, next/navigation          |
| `tests/integration/`     | 46     | Teste de integração da homepage                               |
| `tests/unit/adapters/`   | 34     | Testes do adapter Google OAuth (performGoogleSignIn)          |
| `tests/setup.ts`         | 5      | Setup do Jest (jest-dom + cleanup automático RTL)             |


### Configuração (root)


| Arquivo                          | Linhas | Responsabilidade                                        |
| -------------------------------- | ------ | ------------------------------------------------------- |
| `jest.config.ts`                 | 19     | Config Jest com aliases e mocks                         |
| `next.config.ts`                 | 59     | Security headers, CSP, HSTS                             |
| `tsconfig.json`                  | 24     | TypeScript com paths `@/` e `@tests/`                   |
| `.github/workflows/pipeline.yml` | 38     | CI/CD: SCA + testes + CodeQL                            |
| `.gitignore`                     | 82     | Proteção de secrets, deps, builds                       |
| `package.json`                   | 44     | Dependências e scripts                                  |
| `SQL migrations`                 | 116    | Schema do banco (profiles, subscriptions, calculations) |


---

## Histórico de Inputs do Usuário


| #   | Input                                                                | Resultado                                                                                                                                           |
| --- | -------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Mapear o projeto legado Caleng como base                             | Análise técnica das funcionalidades do sistema legado                                                                                               |
| 2   | Estrutura do projeto com 15 módulos de eng. mecânica + planos Stripe | Criação da estrutura completa de pastas (sem código)                                                                                                |
| 3   | Como ativo o Composer?                                               | Orientação de uso do Cursor                                                                                                                         |
| 4   | Criar página institucional azul/branco com dark mode e movimento     | Página institucional completa: Hero, Módulos, How It Works, Engineering Areas, Pricing, FAQ, CTA                                                    |
| 5   | Você está seguindo as regras?                                        | Auditoria de conformidade com `.cursor/rules`                                                                                                       |
| 6   | Confirmação para prosseguir                                          | Execução da auditoria                                                                                                                               |
| 7   | Quero que leia as regras a cada input                                | Compromisso de seguir as 4 regras em todas as entregas                                                                                              |
| 8   | Você executou as regras para a parte institucional?                  | Pen-test e correção de security headers no `next.config.ts`                                                                                         |
| 9   | Crie TDD para o código feito                                         | Setup completo de testes: Jest, RTL, mocks de framer-motion e next-themes, 65 testes                                                                |
| 10  | Depois de passar nos testes, você refatorou?                         | Refatoração: YAGNI, DRY (Logo, CONTAINER_CLASS, CalculatorPreview), Footer como Server Component                                                    |
| 11  | As outras regras você rodou corretamente?                            | Auditoria extra: removido `unsafe-eval` do CSP em produção, testes para Logo e CalculatorPreview                                                    |
| 12  | Colocar comentários em português nos testes                          | Todos os testes anotados com `// Evita:` explicando o erro prevenido                                                                                |
| 13  | Criar tela de login com Google, seguindo as regras                   | TDD completo: LoginSchema (Zod), LoginForm, LoginPage, 20 novos testes                                                                              |
| 14  | Tudo será ligado com Supabase e Railway. Qual passo tomar?           | Plano de infra: Entity User, Port AuthProvider, LoginUseCase, Supabase clients, SQL migration                                                       |
| 15  | Vamos para o Supabase                                                | Infra completa: 3 Supabase clients, Entity, Port, Use Case, API routes, migration SQL com RLS                                                       |
| 16  | Devo ativar RLS automático? + Configuração do Google OAuth           | Orientação: manter desabilitado (controle manual via migrations) + passo a passo Google Cloud Console                                               |
| 17  | Criar tela de cadastro                                               | TDD completo: RegisterSchema, RegisterUseCase, RegisterForm, RegisterPage, API route, 30 novos testes + refatoração DRY (GoogleButton, AuthDivider) |
| 18  | Criar documentação do projeto                                        | README.md completo com métricas, histórico, arquitetura, testes, roadmap                                                                            |
| 19  | Gerar .gitignore completo + conectar GitHub + CI/CD                  | .gitignore profissional, git init, primeiro push para github.com/1515ma/maceng, pipeline atualizado (CodeQL v3)                                     |
| 20  | Refatorar testes para padrão Factory                                 | Criada pasta `tests/factories/` com UserFactory, AuthFactory, CredentialsFactory. 8 arquivos refatorados, 0 regressões                              |
| 21  | Criar fluxo de esqueceu/redefinir senha (TDD + regras)               | TDD completo: 2 schemas Zod, 2 use cases, port expandido, 2 forms, 2 páginas, 2 API routes, 42 novos testes + refactor DRY (firstValidationError)   |
| 22  | Fazer o login via Google funcionar                                   | GoogleButton com onClick/loading, adapter `startGoogleSignIn`, `GoogleSignInField` (DRY), dashboard protegido, SignOutButton, 19 novos testes       |
| 23  | Criar o dashboard da engenharia mecânica (15 módulos)                | Entidade `Module`, catálogo `MECHANICAL_MODULES` com 15 entradas, `ModuleCard`, grid no dashboard, rota `/dashboard/[slug]` com auth guard e 404    |


---

## Tech Stack


| Tecnologia            | Versão | Uso                              |
| --------------------- | ------ | -------------------------------- |
| Next.js (App Router)  | 15.3   | Framework full-stack             |
| React                 | 19.1   | UI                               |
| TypeScript            | 5.8    | Tipagem estática                 |
| Tailwind CSS          | 4.1    | Estilização                      |
| Framer Motion         | 12.6   | Animações                        |
| Zod                   | 4.3    | Validação de inputs (zero-trust) |
| Supabase (Auth + DB)  | 2.103  | Autenticação + PostgreSQL        |
| Jest                  | 30.3   | Testes unitários                 |
| React Testing Library | 16.3   | Testes de componentes            |
| Lucide React          | 0.469  | Ícones                           |
| next-themes           | 0.4    | Tema claro/escuro                |


---

## Arquitetura (Clean Architecture)

```
src/
  core/                                 ← Camada pura, ZERO deps externas (412 linhas)
    entities/user.ts                    ← Entidade User (UUID, planos, calculationsUsed)
    entities/module.ts                  ← Entidade EngineeringModule + guard isEngineeringArea
    data/mechanical-modules.ts          ← Catálogo dos 15 módulos (dados readonly)
    schemas/login-schema.ts             ← Validação Zod para login
    schemas/register-schema.ts          ← Validação Zod para cadastro
    schemas/password-reset-schema.ts    ← Validação Zod do e-mail de recuperação
    schemas/password-update-schema.ts   ← Validação Zod da nova senha
    schemas/validation-helpers.ts       ← firstValidationError() (DRY)
    ports/auth-provider.ts              ← Interface AuthProvider (contrato)
    use-cases/login.ts                  ← LoginUseCase (constructor injection)
    use-cases/register.ts               ← RegisterUseCase
    use-cases/request-password-reset.ts ← RequestPasswordResetUseCase (anti-enumeration)
    use-cases/update-password.ts        ← UpdatePasswordUseCase

  infra/                          ← Implementações concretas (145 linhas)
    database/
      supabase-client.ts          ← Browser client (NEXT_PUBLIC_*)
      supabase-server.ts          ← Server client (cookies SSR)
      supabase-admin.ts           ← Service role (server-only)
      migrations/
        001_initial_schema.sql    ← Schema: profiles, subscriptions, calculations
    services/
      supabase-auth-provider.ts   ← Implementação do port AuthProvider

  components/                     ← Componentes React (1.019 linhas)
    layout/                       ← Navbar, Footer, ThemeProvider
    ui/                           ← Logo, SectionHeading, CalculatorPreview
    auth/                         ← LoginForm, RegisterForm, ForgotPasswordForm, ResetPasswordForm,
                                    GoogleButton, GoogleSignInField, AuthDivider, SignOutButton
    dashboard/                    ← DashboardContent + ModuleCard (grid dos 15 módulos)

  adapters/                       ← Adapters de borda (25 linhas)
    http/google-sign-in.ts        ← performGoogleSignIn (puro) + startGoogleSignIn (browser)

  app/                            ← Next.js App Router (1.122 linhas)
    (site)/                       ← Página institucional pública
    (auth)/                       ← Login, Cadastro, Recuperar-senha, Redefinir-senha
    (app)/dashboard/              ← Área privada (auth guard server-side)
    (app)/dashboard/[slug]/       ← Página de cada módulo (generateStaticParams + notFound)
    api/auth/                     ← login, register, callback, password-reset, password-update
    layout.tsx                    ← Root layout (Inter font, ThemeProvider)

  lib/constants.ts                ← Constantes compartilhadas
  styles/globals.css              ← Tema customizado (azul/branco + dark mode)

tests/
  factories/                      ← Padrão Factory para dados de teste (102 linhas)
    user-factory.ts               ← createUser() com overrides
    auth-factory.ts               ← createMockAuthProvider() com jest.fn()
    credentials-factory.ts        ← createLoginInput, createRegisterInput,
                                    createPasswordResetInput, createPasswordUpdateInput
    index.ts                      ← Barrel export
```

---

## Banco de Dados (Supabase / PostgreSQL)

### Tabelas


| Tabela          | PK                     | RLS | Indexes                                |
| --------------- | ---------------------- | --- | -------------------------------------- |
| `profiles`      | UUID (FK → auth.users) | Sim | `plan`, `stripe_customer_id`           |
| `subscriptions` | UUID                   | Sim | `user_id`, `status WHERE active`       |
| `calculations`  | UUID                   | Sim | `(user_id, created_at DESC)`, `module` |


### Triggers automáticos

- `on_auth_user_created` → Cria profile automaticamente no cadastro
- `profiles_updated_at` → Atualiza `updated_at` em cada UPDATE

### Row Level Security (RLS)

Cada usuário só lê/edita seus próprios dados. Policies configuradas para SELECT, UPDATE e INSERT por tabela.

---

## Segurança (DevSecOps — OWASP Top 10)


| Proteção               | Implementação                                                                 |
| ---------------------- | ----------------------------------------------------------------------------- |
| Anti-IDOR              | UUIDs como PK em todas as tabelas                                             |
| Validação de input     | Zod schemas em client + server (dupla validação)                              |
| Anti-mass-assignment   | `.strip()` / `.transform()` remove campos extras                              |
| CSP                    | Content-Security-Policy sem `unsafe-eval` em produção                         |
| Anti-clickjacking      | X-Frame-Options: DENY + frame-ancestors: none                                 |
| HSTS                   | max-age=63072000; includeSubDomains; preload                                  |
| Anti-sniffing          | X-Content-Type-Options: nosniff                                               |
| Anti-fingerprint       | poweredByHeader: false                                                        |
| Permissions-Policy     | camera=(), microphone=(), geolocation=() bloqueados                           |
| Secrets                | Todas as chaves em `.env.local` (gitignored)                                  |
| RLS                    | Row Level Security no PostgreSQL por tabela                                   |
| Hashing                | Supabase Auth usa BCrypt automaticamente                                      |
| OAuth                  | Google OAuth via Supabase (sem secret no client)                              |
| Anti-enumeration (A07) | `/api/auth/password-reset` sempre retorna 200 (não revela se e-mail existe)   |
| Reset seguro           | Supabase gera token de uso único, expira em 1h, redirect para redefinir-senha |


---

## Planos de Assinatura


| Plano    | Preço        | Limite               |
| -------- | ------------ | -------------------- |
| Gratuito | R$ 0         | 5 cálculos / dia     |
| Pro      | R$ 7,99/mês  | 800 cálculos / mês   |
| Max      | R$ 14,99/mês | 1.600 cálculos / mês |


---

## 15 Módulos de Engenharia Mecânica

1. Dimensionamento e Resistência
2. Elementos de Fixação e Roscas
3. Tolerâncias e Ajustes
4. Materiais e Tratamentos
5. Componentes e Transmissão
6. Hidráulica e Pneumática
7. Processos de Fabricação
8. Motores e Redutores
9. Molas e Elementos Elásticos
10. Custos e Estimativa de Fabricação
11. Ergonomia e Segurança (NR-12)
12. Vedação e Lubrificação
13. Soldagem e Simbologia
14. Conversor de Unidades Técnicas
15. Gestão de Arquivos e Revisões

---

## Testes (223 testes, 41 suites)

### Testes unitários — Core (camada pura)


| Suite                                     | Testes | O que valida                                                                   |
| ----------------------------------------- | ------ | ------------------------------------------------------------------------------ |
| `login-schema.test.ts`                    | 6      | Validação Zod: email, senha, strip de campos extras                            |
| `register-schema.test.ts`                 | 8      | Validação Zod: nome, email, senha, confirmação, max length, strip              |
| `password-reset-schema.test.ts`           | 4      | Validação Zod do email de recuperação + strip anti-mass-assignment             |
| `password-update-schema.test.ts`          | 5      | Validação Zod da nova senha, coincidência, strip anti-mass-assignment          |
| `user-entity.test.ts`                     | 5      | Formato UUID, planos válidos, campos obrigatórios                              |
| `auth-provider-port.test.ts`              | 7      | Contrato da interface: signIn, signUp, Google, signOut, getUser, reset, update |
| `login-use-case.test.ts`                  | 6      | Validação antes do provider, tratamento de erro, credenciais                   |
| `register-use-case.test.ts`               | 6      | Validação antes do provider, senhas, erros, fluxo completo                     |
| `request-password-reset-use-case.test.ts` | 5      | Validação de email, anti-enumeration (OWASP A07), erros silenciosos            |
| `update-password-use-case.test.ts`        | 5      | Validação de senha, coincidência, token expirado, erros inesperados            |
| `validation-helpers.test.ts`              | 2      | Extração de erro Zod com fallback defensivo                                    |
| `module-entity.test.ts`                   | 3      | Guard `isEngineeringArea`, contrato do `EngineeringModule`                     |
| `mechanical-modules.test.ts`              | 9      | 15 módulos, slugs únicos/kebab-case, calculadoras por módulo, lookup por slug  |


### Testes unitários — Componentes UI


| Suite                           | Testes | O que valida                                                                |
| ------------------------------- | ------ | --------------------------------------------------------------------------- |
| `navbar.test.tsx`               | 7      | Logo, links, botões, acessibilidade (aria-label), rotas                     |
| `footer.test.tsx`               | 6      | Logo, seções, links legais (LGPD), copyright dinâmico                       |
| `hero.test.tsx`                 | 7      | Headline, badges, CTA, stats, calculator preview                            |
| `modules.test.tsx`              | 4      | 15 módulos, contagem, descrições                                            |
| `pricing.test.tsx`              | 9      | 3 planos, preços, limites, popular badge, links com ?plan=                  |
| `faq.test.tsx`                  | 5      | 6 perguntas, accordion, disclaimer CREA/CONFEA                              |
| `how-it-works.test.tsx`         | 4      | 4 passos, numeração, descrições                                             |
| `engineering-areas.test.tsx`    | 5      | 4 áreas, status disponível/em breve, contagem                               |
| `cta.test.tsx`                  | 3      | Headline, CTA link, textos de confiança                                     |
| `logo.test.tsx`                 | 3      | Marca, link home, ícone SVG                                                 |
| `calculator-preview.test.tsx`   | 5      | Campos de entrada, fórmula, resultado, badge aprovação                      |
| `login-form.test.tsx`           | 10     | Inputs, tipos, validação, autocomplete, links, Google (usa Factory)         |
| `register-form.test.tsx`        | 11     | 4 campos, tipos, validação, senhas coincidentes, autocomplete (usa Factory) |
| `forgot-password-form.test.tsx` | 6      | Campo email, validação, link voltar, mensagem anti-enumeration              |
| `reset-password-form.test.tsx`  | 6      | Inputs de senha, autocomplete=new-password, divergência, tamanho mínimo     |
| `google-button.test.tsx`        | 6      | Rótulo, type=button, onClick, loading disabled, texto loading, ícone SVG    |
| `google-sign-in-field.test.tsx` | 3      | Renderização, chamada ao adapter, exibição de erro OAuth                    |
| `dashboard-content.test.tsx`    | 7      | Saudação, plano, cálculos usados, botão sair, grid dos 15 módulos           |
| `sign-out-button.test.tsx`      | 2      | Renderização + disparo do onSignOut                                         |
| `module-card.test.tsx`          | 5      | Nome, descrição, link para /dashboard/{slug}, badge "Em breve"              |


### Testes unitários — Páginas


| Suite                           | Testes | O que valida                               |
| ------------------------------- | ------ | ------------------------------------------ |
| `login-page.test.tsx`           | 5      | Heading, Logo, form, Google OAuth, divider |
| `register-page.test.tsx`        | 5      | Heading, Logo, form, Google OAuth, divider |
| `forgot-password-page.test.tsx` | 4      | Heading, Logo, form de email, helper text  |
| `reset-password-page.test.tsx`  | 3      | Heading, Logo, form de nova senha          |
| `module-detail-page.test.tsx`   | 4      | notFound em slug inválido, nome do módulo, lista de calculadoras, link voltar |


### Testes unitários — Segurança


| Suite                      | Testes | O que valida                                                    |
| -------------------------- | ------ | --------------------------------------------------------------- |
| `security-headers.test.ts` | 9      | 7 headers HTTP, anti-eval em produção, cobertura total de rotas |


### Testes unitários — Adapters


| Suite                          | Testes | O que valida                                                            |
| ------------------------------ | ------ | ----------------------------------------------------------------------- |
| `start-google-sign-in.test.ts` | 3      | Throw em falha, redirect em sucesso, propagação de exceções do provider |


### Testes de integração


| Suite           | Testes | O que valida                                     |
| --------------- | ------ | ------------------------------------------------ |
| `home.test.tsx` | 8      | Todas as 7 seções renderizadas juntas + contagem |


### Test Factories (padrão Factory)


| Factory                                             | Arquivo                  | Função                                                      |
| --------------------------------------------------- | ------------------------ | ----------------------------------------------------------- |
| `createUser()`                                      | `user-factory.ts`        | Gera entidade User com UUID incremental e overrides         |
| `createMockAuthProvider()`                          | `auth-factory.ts`        | Mock completo do AuthProvider (7 métodos) com jest.fn()     |
| `createLoginInput()`                                | `credentials-factory.ts` | Gera dados de login (email + senha)                         |
| `createRegisterInput()`                             | `credentials-factory.ts` | Gera dados de cadastro (nome + email + senha + confirmação) |
| `createPasswordResetInput()`                        | `credentials-factory.ts` | Gera dados do pedido de recuperação de senha                |
| `createPasswordUpdateInput()`                       | `credentials-factory.ts` | Gera dados de nova senha + confirmação                      |
| `VALID_PASSWORD`, `SHORT_PASSWORD`, `INVALID_EMAIL` | `credentials-factory.ts` | Constantes reutilizáveis de teste                           |


---

## Regras de Governança (.cursor/rules)


| Regra            | Arquivo            | Aplicação                                                     |
| ---------------- | ------------------ | ------------------------------------------------------------- |
| **Architecture** | `architecture.mdc` | Clean Architecture, layer isolation, dependency inversion     |
| **TDD**          | `xp-tdd.mdc`       | Red → Green → Refactor, YAGNI, todo código com teste primeiro |
| **DevSecOps**    | `devsecops.mdc`    | OWASP Top 10, Zod validation, UUIDs, secrets em env           |
| **Performance**  | `performance.mdc`  | Big O, indexes, N+1 prevention, streams, pagination           |


Cada teste inclui um comentário `// Evita:` em português explicando qual erro ou regressão aquele teste previne.

---

## CI/CD (GitHub Actions)

**Repositório:** [github.com/1515ma/maceng](https://github.com/1515ma/maceng)

O pipeline roda automaticamente a cada push e pull request na branch `main`:


| Job              | O que faz                                                               |
| ---------------- | ----------------------------------------------------------------------- |
| `audit_and_test` | `npm ci` → `npm audit` (SCA) → `npm run lint` → `npm test` (223 testes) |
| `codeql`         | Análise estática de segurança com CodeQL v3 (JavaScript/TypeScript)     |


---

## Como Rodar

```bash
# Instalar dependências
npm install

# Rodar em desenvolvimento
npm run dev

# Rodar testes
npm test

# Rodar testes com watch
npm run test:watch

# Rodar testes com cobertura
npm run test:coverage
```

## Variáveis de Ambiente

Copie `.env.example` para `.env.local` e preencha:

```
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-anon-key
SUPABASE_SERVICE_ROLE_KEY=sua-service-role-key
```

---

## Roadmap

- Página institucional (7 seções)
- Tema claro/escuro
- Security headers (OWASP)
- Tela de login (email + Google OAuth funcional)
- Tela de cadastro (email + Google OAuth funcional)
- Tela de recuperação de senha (pedido + redefinição)
- Google OAuth end-to-end (button → callback → dashboard)
- Dashboard do usuário (rota privada com auth guard)
- SignOut completo (cookies limpos + redirect)
- Infraestrutura Supabase (client, server, admin)
- Schema do banco (profiles, subscriptions, calculations)
- Clean Architecture (Entity, Port, Use Case, Adapters)
- 223 testes com comentários em português
- Dashboard com catálogo dos 15 módulos mecânicos (cards + páginas placeholder)
- Test Factories (padrão Factory)
- GitHub + CI/CD (SCA + testes + CodeQL)
- .gitignore profissional
- Integração fetch nos forms (POST real para API routes)
- Módulos de cálculo (15 módulos de eng. mecânica)
- Integração Stripe (pagamentos)
- Deploy Railway

