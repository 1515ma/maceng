# Maceng — Calculadoras de Engenharia Mecânica

Plataforma profissional de cálculos técnicos para engenharia mecânica. Dimensionamento, tolerâncias ISO, hidráulica, soldagem e mais. Baseado em normas ABNT, ISO e DIN.

---

## Status do Projeto

| Métrica | Valor |
|---|---|
| **Suites de teste** | 23 |
| **Testes unitários + integração** | 139 (todos passando) |
| **Arquivos de produção (.ts/.tsx)** | 37 |
| **Arquivos de teste (.test.ts/.tsx)** | 23 |
| **Migrations SQL** | 1 (schema completo) |
| **Regras de negócio (.cursor/rules)** | 4 (Architecture, TDD, DevSecOps, Performance) |
| **Inputs do usuário na construção** | 17 |
| **Vulnerabilidades (npm audit)** | 0 |

---

## Histórico de Inputs do Usuário

| # | Input | Resultado |
|---|---|---|
| 1 | Mapear o projeto legado Caleng como base | Análise técnica das funcionalidades do sistema legado |
| 2 | Estrutura do projeto com 15 módulos de eng. mecânica + planos Stripe | Criação da estrutura completa de pastas (sem código) |
| 3 | Como ativo o Composer? | Orientação de uso do Cursor |
| 4 | Criar página institucional azul/branco com dark mode e movimento | Página institucional completa: Hero, Módulos, How It Works, Engineering Areas, Pricing, FAQ, CTA |
| 5 | Você está seguindo as regras? | Auditoria de conformidade com `.cursor/rules` |
| 6 | Confirmação para prosseguir | Execução da auditoria |
| 7 | Quero que leia as regras a cada input | Compromisso de seguir as 4 regras em todas as entregas |
| 8 | Você executou as regras para a parte institucional? | Pen-test e correção de security headers no `next.config.ts` |
| 9 | Crie TDD para o código feito | Setup completo de testes: Jest, RTL, mocks de framer-motion e next-themes, 65 testes |
| 10 | Depois de passar nos testes, você refatorou? | Refatoração: YAGNI, DRY (Logo, CONTAINER_CLASS, CalculatorPreview), Footer como Server Component |
| 11 | As outras regras você rodou corretamente? | Auditoria extra: removido `unsafe-eval` do CSP em produção, testes para Logo e CalculatorPreview |
| 12 | Colocar comentários em português nos testes | Todos os 74 testes anotados com `// Evita:` explicando o erro prevenido |
| 13 | Criar tela de login com Google, seguindo as regras | TDD completo: LoginSchema (Zod), LoginForm, LoginPage, 20 novos testes |
| 14 | Tudo será ligado com Supabase e Railway. Qual passo tomar? | Plano de infra: Entity User, Port AuthProvider, LoginUseCase, Supabase clients, SQL migration |
| 15 | Vamos para o Supabase | Infra completa: 3 Supabase clients, Entity, Port, Use Case, API routes, migration SQL com RLS |
| 16 | Devo ativar RLS automático? + Configuração do Google OAuth | Orientação: manter desabilitado (controle manual via migrations) + passo a passo Google Cloud Console |
| 17 | Criar tela de cadastro | TDD completo: RegisterSchema, RegisterUseCase, RegisterForm, RegisterPage, API route, 30 novos testes + refatoração DRY (GoogleButton, AuthDivider) |

---

## Tech Stack

| Tecnologia | Versão | Uso |
|---|---|---|
| Next.js (App Router) | 15.3 | Framework full-stack |
| React | 19.1 | UI |
| TypeScript | 5.8 | Tipagem estática |
| Tailwind CSS | 4.1 | Estilização |
| Framer Motion | 12.6 | Animações |
| Zod | 4.3 | Validação de inputs (zero-trust) |
| Supabase (Auth + DB) | 2.103 | Autenticação + PostgreSQL |
| Jest | 30.3 | Testes unitários |
| React Testing Library | 16.3 | Testes de componentes |
| Lucide React | 0.469 | Ícones |
| next-themes | 0.4 | Tema claro/escuro |

---

## Arquitetura (Clean Architecture)

```
src/
  core/                          ← Camada pura, ZERO deps externas
    entities/user.ts             ← Entidade User (UUID, planos, calculationsUsed)
    schemas/login-schema.ts      ← Validação Zod para login
    schemas/register-schema.ts   ← Validação Zod para cadastro
    ports/auth-provider.ts       ← Interface AuthProvider (contrato)
    use-cases/login.ts           ← LoginUseCase (constructor injection)
    use-cases/register.ts        ← RegisterUseCase (constructor injection)

  infra/                         ← Implementações (Supabase, DB)
    database/
      supabase-client.ts         ← Browser client (NEXT_PUBLIC_*)
      supabase-server.ts         ← Server client (cookies SSR)
      supabase-admin.ts          ← Service role (server-only)
      migrations/
        001_initial_schema.sql   ← Schema: profiles, subscriptions, calculations
    services/
      supabase-auth-provider.ts  ← Implementação do port AuthProvider

  components/
    layout/                      ← Navbar, Footer, ThemeProvider
    ui/                          ← Logo, SectionHeading, CalculatorPreview
    auth/                        ← LoginForm, RegisterForm, GoogleButton, AuthDivider

  app/
    (site)/                      ← Página institucional pública
    (auth)/                      ← Login, Cadastro (layout centralizado)
    api/auth/                    ← API routes: login, register, callback
    layout.tsx                   ← Root layout (Inter font, ThemeProvider)

  lib/constants.ts               ← Constantes compartilhadas
  styles/globals.css             ← Tema customizado (azul/branco + dark mode)
```

---

## Banco de Dados (Supabase / PostgreSQL)

### Tabelas

| Tabela | PK | RLS | Indexes |
|---|---|---|---|
| `profiles` | UUID (FK → auth.users) | Sim | `plan`, `stripe_customer_id` |
| `subscriptions` | UUID | Sim | `user_id`, `status WHERE active` |
| `calculations` | UUID | Sim | `(user_id, created_at DESC)`, `module` |

### Triggers automáticos

- `on_auth_user_created` → Cria profile automaticamente no cadastro
- `profiles_updated_at` → Atualiza `updated_at` em cada UPDATE

### Row Level Security (RLS)

Cada usuário só lê/edita seus próprios dados. Policies configuradas para SELECT, UPDATE e INSERT por tabela.

---

## Segurança (DevSecOps — OWASP Top 10)

| Proteção | Implementação |
|---|---|
| Anti-IDOR | UUIDs como PK em todas as tabelas |
| Validação de input | Zod schemas em client + server (dupla validação) |
| Anti-mass-assignment | `.strip()` / `.transform()` remove campos extras |
| CSP | Content-Security-Policy sem `unsafe-eval` em produção |
| Anti-clickjacking | X-Frame-Options: DENY + frame-ancestors: none |
| HSTS | max-age=63072000; includeSubDomains; preload |
| Anti-sniffing | X-Content-Type-Options: nosniff |
| Anti-fingerprint | poweredByHeader: false |
| Permissions-Policy | camera=(), microphone=(), geolocation=() bloqueados |
| Secrets | Todas as chaves em `.env.local` (gitignored) |
| RLS | Row Level Security no PostgreSQL por tabela |
| Hashing | Supabase Auth usa BCrypt automaticamente |
| OAuth | Google OAuth via Supabase (sem secret no client) |

---

## Planos de Assinatura

| Plano | Preço | Limite |
|---|---|---|
| Gratuito | R$ 0 | 5 cálculos / dia |
| Pro | R$ 7,99/mês | 800 cálculos / mês |
| Max | R$ 14,99/mês | 1.600 cálculos / mês |

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

## Testes (139 testes, 23 suites)

### Testes unitários — Core (camada pura)

| Suite | Testes | O que valida |
|---|---|---|
| `login-schema.test.ts` | 6 | Validação Zod: email, senha, strip de campos extras |
| `register-schema.test.ts` | 8 | Validação Zod: nome, email, senha, confirmação, max length, strip |
| `user-entity.test.ts` | 5 | Formato UUID, planos válidos, campos obrigatórios |
| `auth-provider-port.test.ts` | 5 | Contrato da interface: signIn, signUp, signOut, getUser, Google |
| `login-use-case.test.ts` | 6 | Validação antes do provider, tratamento de erro, credenciais |
| `register-use-case.test.ts` | 6 | Validação antes do provider, senhas, erros, fluxo completo |

### Testes unitários — Componentes UI

| Suite | Testes | O que valida |
|---|---|---|
| `navbar.test.tsx` | 7 | Logo, links, botões, acessibilidade (aria-label), rotas |
| `footer.test.tsx` | 6 | Logo, seções, links legais (LGPD), copyright dinâmico |
| `hero.test.tsx` | 7 | Headline, badges, CTA, stats, calculator preview |
| `modules.test.tsx` | 4 | 15 módulos, contagem, descrições |
| `pricing.test.tsx` | 9 | 3 planos, preços, limites, popular badge, links com ?plan= |
| `faq.test.tsx` | 5 | 6 perguntas, accordion, disclaimer CREA/CONFEA |
| `how-it-works.test.tsx` | 4 | 4 passos, numeração, descrições |
| `engineering-areas.test.tsx` | 5 | 4 áreas, status disponível/em breve, contagem |
| `cta.test.tsx` | 3 | Headline, CTA link, textos de confiança |
| `logo.test.tsx` | 3 | Marca, link home, ícone SVG |
| `calculator-preview.test.tsx` | 5 | Campos de entrada, fórmula, resultado, badge aprovação |
| `login-form.test.tsx` | 10 | Inputs, tipos, validação, autocomplete, links, Google |
| `register-form.test.tsx` | 11 | 4 campos, tipos, validação, senhas coincidentes, autocomplete |

### Testes unitários — Páginas

| Suite | Testes | O que valida |
|---|---|---|
| `login-page.test.tsx` | 5 | Heading, Logo, form, Google OAuth, divider |
| `register-page.test.tsx` | 5 | Heading, Logo, form, Google OAuth, divider |

### Testes unitários — Segurança

| Suite | Testes | O que valida |
|---|---|---|
| `security-headers.test.ts` | 9 | 7 headers HTTP, anti-eval em produção, cobertura total de rotas |

### Testes de integração

| Suite | Testes | O que valida |
|---|---|---|
| `home.test.tsx` | 8 | Todas as 7 seções renderizadas juntas + contagem |

---

## Regras de Governança (.cursor/rules)

| Regra | Arquivo | Aplicação |
|---|---|---|
| **Architecture** | `architecture.mdc` | Clean Architecture, layer isolation, dependency inversion |
| **TDD** | `xp-tdd.mdc` | Red → Green → Refactor, YAGNI, todo código com teste primeiro |
| **DevSecOps** | `devsecops.mdc` | OWASP Top 10, Zod validation, UUIDs, secrets em env |
| **Performance** | `performance.mdc` | Big O, indexes, N+1 prevention, streams, pagination |

Cada teste inclui um comentário `// Evita:` em português explicando qual erro ou regressão aquele teste previne.

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

- [x] Página institucional (7 seções)
- [x] Tema claro/escuro
- [x] Security headers (OWASP)
- [x] Tela de login (email + Google OAuth)
- [x] Tela de cadastro (email + Google OAuth)
- [x] Infraestrutura Supabase (client, server, admin)
- [x] Schema do banco (profiles, subscriptions, calculations)
- [x] Clean Architecture (Entity, Port, Use Case)
- [x] 139 testes com comentários em português
- [ ] Tela de recuperação de senha
- [ ] Dashboard do usuário
- [ ] Módulos de cálculo (15 módulos de eng. mecânica)
- [ ] Integração Stripe (pagamentos)
- [ ] Deploy Railway
