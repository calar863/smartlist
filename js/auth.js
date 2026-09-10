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

// Caso de Uso 01 - Cadastrar usuário
function cadastrarUsuario(nome, email, senha) {
  const users = getUsers();

  if (!nome || !email || !senha) {
    return { ok: false, erro: "Preencha todos os campos obrigatórios." };
  }

  // Regra de Negócio: o e-mail informado deve ser único no sistema.
  const jaExiste = users.some((u) => u.email.toLowerCase() === email.toLowerCase());
  if (jaExiste) {
    return { ok: false, erro: "Este e-mail já está cadastrado." };
  }

  if (!isSenhaValida(senha)) {
    return { ok: false, erro: "A senha deve ter no mínimo 8 caracteres, incluindo letras e números." };
  }

  const novoUsuario = {
    id: "u" + Date.now(),
    nome: nome,
    email: email,
    senha: senha,
  };
  users.push(novoUsuario);
  saveUsers(users);

  return { ok: true, usuario: novoUsuario };
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
