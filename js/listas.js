// Camada de listas de compras e itens usando localStorage.

const LISTS_KEY = "smartlist_lists";

function getLists() {
  return JSON.parse(localStorage.getItem(LISTS_KEY) || "[]");
}

function saveLists(lists) {
  localStorage.setItem(LISTS_KEY, JSON.stringify(lists));
}

function getListsByUser(userId) {
  return getLists().filter((l) => l.idUsuario === userId);
}

function getListById(listId) {
  return getLists().find((l) => l.id === listId) || null;
}

// Caso de Uso 02 - Criar lista de compras
function criarLista(nome, userId) {
  // Regra de Negócio: o nome da lista não pode ser nulo.
  if (!nome || !nome.trim()) {
    return { ok: false, erro: "O nome da lista não pode ser vazio." };
  }

  const lists = getLists();

  // Ponto de Extensão: nome de lista duplicado para o mesmo usuário.
  const duplicada = lists.some(
    (l) => l.idUsuario === userId && l.nome.toLowerCase() === nome.trim().toLowerCase()
  );
  if (duplicada) {
    return { ok: false, erro: "Você já possui uma lista com esse nome." };
  }

  const novaLista = {
    id: "l" + Date.now(),
    nome: nome.trim(),
    idUsuario: userId,
    dataCriacao: new Date().toISOString(),
    itens: [],
  };

  lists.push(novaLista);
  saveLists(lists);
  return { ok: true, lista: novaLista };
}

function excluirLista(listId) {
  const lists = getLists().filter((l) => l.id !== listId);
  saveLists(lists);
}

// Caso de Uso "Adicionar Item" (fluxo principal do Diagrama de Sequência 2)
function adicionarItem(listId, nome, quantidade, categoria) {
  if (!nome || !nome.trim()) {
    return { ok: false, erro: "Informe o nome do item." };
  }

  const lists = getLists();
  const lista = lists.find((l) => l.id === listId);
  if (!lista) {
    return { ok: false, erro: "Lista não encontrada." };
  }

  const novoItem = {
    id: "i" + Date.now(),
    nome: nome.trim(),
    quantidade: quantidade && quantidade > 0 ? quantidade : 1,
    categoria: categoria || "Outros",
    status: "pendente",
  };

  lista.itens.push(novoItem);
  saveLists(lists);
  return { ok: true, item: novoItem };
}

// Caso de Uso "Remover Item" (Diagrama de Sequência 1)
function removerItem(listId, itemId) {
  const lists = getLists();
  const lista = lists.find((l) => l.id === listId);
  if (!lista) return;
  lista.itens = lista.itens.filter((i) => i.id !== itemId);
  saveLists(lists);
}

function alternarStatusItem(listId, itemId) {
  const lists = getLists();
  const lista = lists.find((l) => l.id === listId);
  if (!lista) return;
  const item = lista.itens.find((i) => i.id === itemId);
  if (!item) return;
  item.status = item.status === "concluido" ? "pendente" : "concluido";
  saveLists(lists);
}

function progressoLista(lista) {
  const total = lista.itens.length;
  const concluidos = lista.itens.filter((i) => i.status === "concluido").length;
  const percentual = total === 0 ? 0 : Math.round((concluidos / total) * 100);
  return { total, concluidos, percentual };
}
