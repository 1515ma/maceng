import { createHash } from "node:crypto";

/**
 * Logger estruturado para eventos de autenticação.
 *
 * Cobre a regra DevSecOps: "Log authentication failures for anomaly detection".
 *
 * Princípios:
 *   - Nunca registra email em plaintext (LGPD/GDPR). Usa SHA-256 como
 *     pseudonimização reversível só com força bruta no dicionário do atacante.
 *   - Formato JSON estruturado (1 objeto por linha) — consumível por qualquer
 *     agente (CloudWatch, Logtail, Datadog) sem parsing adicional.
 *   - `severity` distingue sucesso (info) de falha (warn), permitindo
 *     disparar alertas só em anomalias.
 *   - Sink é injetável — facilita teste e permite trocar para stdout em prod.
 */

export type AuthEventType =
  | "login_success"
  | "login_failed"
  | "register_success"
  | "register_failed"
  | "password_reset_requested"
  | "password_reset_rate_limited"
  | "password_update_success"
  | "password_update_failed";

export interface AuthEvent {
  type: AuthEventType;
  email: string;
  ip: string;
  success: boolean;
  reason?: string;
}

export interface AuthLogRecord {
  timestamp: string;
  type: AuthEventType;
  severity: "info" | "warn";
  emailHash: string;
  ip: string;
  success: boolean;
  reason?: string;
}

export interface AuthLogger {
  logEvent(event: AuthEvent): void;
}

export interface AuthLoggerOptions {
  sink?: (record: AuthLogRecord) => void;
}

export function hashEmail(email: string): string {
  const normalized = email.trim().toLowerCase();
  return createHash("sha256").update(normalized).digest("hex");
}

function defaultSink(record: AuthLogRecord): void {
  const line = JSON.stringify(record);
  if (record.severity === "warn") {
    console.warn(line);
  } else {
    console.info(line);
  }
}

export function createAuthLogger(options: AuthLoggerOptions = {}): AuthLogger {
  const sink = options.sink ?? defaultSink;

  return {
    logEvent(event: AuthEvent): void {
      const record: AuthLogRecord = {
        timestamp: new Date().toISOString(),
        type: event.type,
        severity: event.success ? "info" : "warn",
        emailHash: hashEmail(event.email),
        ip: event.ip,
        success: event.success,
        ...(event.reason ? { reason: event.reason } : {}),
      };
      sink(record);
    },
  };
}

/** Instância padrão compartilhada pela aplicação. */
export const authLogger = createAuthLogger();
