// Camada de autenticação: cadastro e login de usuários usando localStorage
// como armazenamento local (sem backend nesta sprint).

const USERS_KEY = "smartlist_users";
const SESSION_KEY = "smartlist_session";

function getUsers() {
  return JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

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

// Caso de Uso 03 - Realizar login
function realizarLogin(email, senha) {
  if (!email || !senha) {
    return { ok: false, erro: "Informe e-mail e senha." };
  }

  const users = getUsers();
  const usuario = users.find(
    (u) => u.email.toLowerCase() === email.toLowerCase() && u.senha === senha
  );

  if (!usuario) {
    return { ok: false, erro: "E-mail ou senha inválidos." };
  }

  setSession(usuario);
  return { ok: true, usuario: usuario };
}

function exigirLogin() {
  const session = getSession();
  if (!session) {
    window.location.href = "index.html";
  }
  return session;
}
