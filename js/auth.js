// Camada de autenticação: cadastro e login via SmartList API (js/api.js).
// O navegador guarda apenas a sessão (usuário logado) no localStorage.

const SESSION_KEY = "smartlist_session";

function getSession() {
  return JSON.parse(localStorage.getItem(SESSION_KEY) || "null");
}

function setSession(user) {
  localStorage.setItem(SESSION_KEY, JSON.stringify({ id: user.id, nome: user.nome, email: user.email }));
}

function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

function isSenhaValida(senha) {
  // Regra de Negócio (Caso de Uso 01 - Cadastrar usuário): mínimo 8 caracteres,
  // incluindo letras e números.
  return senha.length >= 8 && /[a-zA-Z]/.test(senha) && /[0-9]/.test(senha);
}

// Caso de Uso 01 - Cadastrar usuário (POST /api/usuarios)
async function cadastrarUsuario(nome, email, senha) {
  if (!nome || !email || !senha) {
    return { ok: false, erro: "Preencha todos os campos obrigatórios." };
  }

  if (!isSenhaValida(senha)) {
    return { ok: false, erro: "A senha deve ter no mínimo 8 caracteres, incluindo letras e números." };
  }

  // A unicidade do e-mail é garantida pela API (409 Conflict).
  const resposta = await apiRequest("POST", "/api/usuarios", { nome, email, senha });
  if (!resposta.ok) {
    return { ok: false, erro: resposta.erro };
  }
  return { ok: true, usuario: resposta.dados };
}

// Caso de Uso 03 - Realizar login (POST /api/auth/login)
async function realizarLogin(email, senha) {
  if (!email || !senha) {
    return { ok: false, erro: "Informe e-mail e senha." };
  }

  const resposta = await apiRequest("POST", "/api/auth/login", { email, senha });
  if (!resposta.ok) {
    return { ok: false, erro: resposta.erro };
  }

  setSession(resposta.dados);
  return { ok: true, usuario: resposta.dados };
}

function exigirLogin() {
  const session = getSession();
  // Sessões de versões antigas (ids em texto, gerados no localStorage) não
  // existem na API: descarta e pede login novamente.
  if (!session || typeof session.id !== "number") {
    clearSession();
    window.location.href = "index.html";
    return null;
  }
  return session;
}
