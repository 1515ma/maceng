-- ============================================================
-- Maceng — Schema inicial
-- ============================================================
-- DevSecOps: UUIDs como PK (anti-IDOR), RLS habilitado
-- Performance: indexes em colunas usadas em WHERE, JOIN, ORDER BY
-- Architecture: profiles separado de auth.users (Supabase)
-- ============================================================

-- ENUM para planos de assinatura
CREATE TYPE subscription_plan AS ENUM ('free', 'pro', 'max');

-- ============================================================
-- PROFILES — dados do usuário no nosso domínio
-- ============================================================
CREATE TABLE profiles (
  id            UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name          TEXT,
  plan          subscription_plan NOT NULL DEFAULT 'free',
  calculations_used INTEGER NOT NULL DEFAULT 0,
  calculations_reset_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  stripe_customer_id TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Performance: busca por plano (filtros administrativos)
CREATE INDEX idx_profiles_plan ON profiles(plan);

-- Performance: busca por Stripe customer (webhook de pagamento)
CREATE INDEX idx_profiles_stripe_customer ON profiles(stripe_customer_id)
  WHERE stripe_customer_id IS NOT NULL;

-- ============================================================
-- SUBSCRIPTIONS — histórico de assinaturas (Stripe)
-- ============================================================
CREATE TABLE subscriptions (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  stripe_subscription_id TEXT NOT NULL UNIQUE,
  plan                subscription_plan NOT NULL,
  status              TEXT NOT NULL DEFAULT 'active',
  current_period_start TIMESTAMPTZ NOT NULL,
  current_period_end  TIMESTAMPTZ NOT NULL,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Performance: busca de assinatura ativa por user_id (JOIN com profiles)
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);

-- Performance: busca por status para jobs de expiração
CREATE INDEX idx_subscriptions_status ON subscriptions(status)
  WHERE status = 'active';

-- ============================================================
-- CALCULATIONS — histórico de cálculos realizados
-- ============================================================
CREATE TABLE calculations (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  module      TEXT NOT NULL,
  input_data  JSONB NOT NULL,
  result_data JSONB NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Performance: listagem de cálculos por usuário (ORDER BY created_at DESC)
CREATE INDEX idx_calculations_user_created ON calculations(user_id, created_at DESC);

-- Performance: filtragem por módulo
CREATE INDEX idx_calculations_module ON calculations(module);

-- ============================================================
-- ROW LEVEL SECURITY (DevSecOps: zero trust)
-- ============================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE calculations ENABLE ROW LEVEL SECURITY;

-- Profiles: usuário só lê/edita o próprio perfil
CREATE POLICY "Users read own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Subscriptions: usuário só vê as próprias assinaturas
CREATE POLICY "Users read own subscriptions"
  ON subscriptions FOR SELECT
  USING (auth.uid() = user_id);

-- Calculations: usuário só vê/cria os próprios cálculos
CREATE POLICY "Users read own calculations"
  ON calculations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users insert own calculations"
  ON calculations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- TRIGGER: criar profile automaticamente quando user se registra
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- TRIGGER: atualizar updated_at automaticamente
-- ============================================================
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();
