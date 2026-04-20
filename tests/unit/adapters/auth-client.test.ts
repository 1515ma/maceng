import {
  postLogin,
  postRegister,
  postPasswordReset,
  postPasswordUpdate,
} from "@/adapters/http/auth-client";

type FetchInit = RequestInit & { body?: string };

function mockFetch(response: {
  ok: boolean;
  status: number;
  json: unknown;
}): jest.Mock {
  const fetchMock = jest.fn(async () => ({
    ok: response.ok,
    status: response.status,
    json: async () => response.json,
  })) as unknown as jest.Mock;
  (globalThis as unknown as { fetch: typeof fetch }).fetch = fetchMock as unknown as typeof fetch;
  return fetchMock;
}

beforeEach(() => {
  jest.restoreAllMocks();
});

describe("auth-client adapter", () => {
  describe("postLogin", () => {
    // Evita: cliente não enviar POST para a rota correta, quebrando autenticação
    it("envia POST para /api/auth/login com email e senha", async () => {
      const fetchMock = mockFetch({ ok: true, status: 200, json: { success: true, user: { id: "u1" } } });

      await postLogin("foo@bar.com", "Senha@123");

      expect(fetchMock).toHaveBeenCalledTimes(1);
      const [url, init] = fetchMock.mock.calls[0] as [string, FetchInit];
      expect(url).toBe("/api/auth/login");
      expect(init.method).toBe("POST");
      expect(JSON.parse(init.body as string)).toEqual({ email: "foo@bar.com", password: "Senha@123" });
      expect((init.headers as Record<string, string>)["Content-Type"]).toBe("application/json");
    });

    // Evita: adapter não propagar sucesso, impedindo redirect pós-login
    it("retorna success=true quando API responde 200", async () => {
      mockFetch({ ok: true, status: 200, json: { success: true, user: { id: "u1" } } });
      const result = await postLogin("foo@bar.com", "Senha@123");
      expect(result.success).toBe(true);
    });

    // Evita: erro 401 silencioso, deixando o usuário sem feedback de credencial inválida
    it("retorna success=false com error quando API responde 401", async () => {
      mockFetch({ ok: false, status: 401, json: { success: false, error: "Credenciais inválidas" } });
      const result = await postLogin("foo@bar.com", "errada");
      expect(result.success).toBe(false);
      expect(result.error).toBe("Credenciais inválidas");
    });

    // Evita: exceção de rede crashar o form sem mensagem amigável ao usuário
    it("retorna success=false com mensagem amigável quando fetch falha", async () => {
      (globalThis as unknown as { fetch: typeof fetch }).fetch = jest.fn(async () => {
        throw new Error("network down");
      }) as unknown as typeof fetch;

      const result = await postLogin("foo@bar.com", "Senha@123");
      expect(result.success).toBe(false);
      expect(result.error).toMatch(/conex/i);
    });
  });

  describe("postRegister", () => {
    // Evita: cadastro não enviar todos os campos necessários ao backend
    it("envia POST para /api/auth/register com name, email, password, confirmPassword", async () => {
      const fetchMock = mockFetch({ ok: true, status: 201, json: { success: true, user: { id: "u1" } } });

      await postRegister("Fulano", "a@b.com", "Senha@123", "Senha@123");

      const [url, init] = fetchMock.mock.calls[0] as [string, FetchInit];
      expect(url).toBe("/api/auth/register");
      expect(JSON.parse(init.body as string)).toEqual({
        name: "Fulano",
        email: "a@b.com",
        password: "Senha@123",
        confirmPassword: "Senha@123",
      });
    });

    // Evita: erro 400 (email duplicado etc.) ser perdido, frustrando o cadastro
    it("propaga error do backend em caso de 400", async () => {
      mockFetch({ ok: false, status: 400, json: { success: false, error: "E-mail já cadastrado" } });
      const result = await postRegister("Fulano", "a@b.com", "Senha@123", "Senha@123");
      expect(result.success).toBe(false);
      expect(result.error).toBe("E-mail já cadastrado");
    });
  });

  describe("postPasswordReset", () => {
    // Evita: esqueci a senha não chegar ao backend, impedindo envio do link
    it("envia POST para /api/auth/password-reset com email", async () => {
      const fetchMock = mockFetch({ ok: true, status: 200, json: { success: true } });

      await postPasswordReset("a@b.com");

      const [url, init] = fetchMock.mock.calls[0] as [string, FetchInit];
      expect(url).toBe("/api/auth/password-reset");
      expect(JSON.parse(init.body as string)).toEqual({ email: "a@b.com" });
    });
  });

  describe("postPasswordUpdate", () => {
    // Evita: nova senha não ser enviada com confirmPassword, violando schema do backend
    it("envia POST para /api/auth/password-update com password e confirmPassword", async () => {
      const fetchMock = mockFetch({ ok: true, status: 200, json: { success: true, user: { id: "u1" } } });

      await postPasswordUpdate("Nova@123", "Nova@123");

      const [url, init] = fetchMock.mock.calls[0] as [string, FetchInit];
      expect(url).toBe("/api/auth/password-update");
      expect(JSON.parse(init.body as string)).toEqual({
        password: "Nova@123",
        confirmPassword: "Nova@123",
      });
    });
  });
});
