// Camada de listas de compras e itens: todas as operações passam pela
// SmartList API (js/api.js) e devolvem { ok, ... } / { ok: false, erro }.

// GET /api/listas?usuarioId= (a API limita pageSize a 50 listas por consulta)
async function getListsByUser(userId) {
  const resposta = await apiRequest("GET", "/api/listas?usuarioId=" + userId + "&pageSize=50");
  if (!resposta.ok) {
    return { ok: false, erro: resposta.erro };
  }
  return { ok: true, listas: resposta.dados.dados };
}

// GET /api/listas/:id (já traz os itens da lista)
async function getListById(listId) {
  const resposta = await apiRequest("GET", "/api/listas/" + encodeURIComponent(listId));
  if (!resposta.ok) {
    return { ok: false, erro: resposta.erro, status: resposta.status };
  }
  return { ok: true, lista: resposta.dados };
}

// Caso de Uso 02 - Criar lista de compras (POST /api/listas)
async function criarLista(nome, userId) {
  // Regra de Negócio: o nome da lista não pode ser nulo.
  if (!nome || !nome.trim()) {
    return { ok: false, erro: "O nome da lista não pode ser vazio." };
  }

  // Ponto de Extensão: nome duplicado para o mesmo usuário é recusado pela
  // API (409 Conflict) com a mensagem exibida na tela.
  const resposta = await apiRequest("POST", "/api/listas", { nome: nome.trim(), usuarioId: userId });
  if (!resposta.ok) {
    return { ok: false, erro: resposta.erro };
  }
  return { ok: true, lista: resposta.dados };
}

// DELETE /api/listas/:id (a API remove também os itens da lista)
async function excluirLista(listId) {
  const resposta = await apiRequest("DELETE", "/api/listas/" + listId);
  if (!resposta.ok) {
    return { ok: false, erro: resposta.erro };
  }
  return { ok: true };
}

// Caso de Uso "Adicionar Item" (fluxo principal do Diagrama de Sequência 2)
// (POST /api/listas/:id/itens)
async function adicionarItem(listId, nome, quantidade, categoria) {
  if (!nome || !nome.trim()) {
    return { ok: false, erro: "Informe o nome do item." };
  }

  const resposta = await apiRequest("POST", "/api/listas/" + listId + "/itens", {
    nome: nome.trim(),
    quantidade: quantidade && quantidade > 0 ? quantidade : 1,
    categoria: categoria && categoria.trim() ? categoria.trim() : "Outros",
  });
  if (!resposta.ok) {
    return { ok: false, erro: resposta.erro };
  }
  return { ok: true, item: resposta.dados };
}

// Caso de Uso "Remover Item" (Diagrama de Sequência 1)
// (DELETE /api/listas/:id/itens/:itemId)
async function removerItem(listId, itemId) {
  const resposta = await apiRequest("DELETE", "/api/listas/" + listId + "/itens/" + itemId);
  if (!resposta.ok) {
    return { ok: false, erro: resposta.erro };
  }
  return { ok: true };
}

// Alterna entre "pendente" e "concluido" (PATCH /api/listas/:id/itens/:itemId)
async function alternarStatusItem(listId, item) {
  const novoStatus = item.status === "concluido" ? "pendente" : "concluido";
  const resposta = await apiRequest("PATCH", "/api/listas/" + listId + "/itens/" + item.id, {
    status: novoStatus,
  });
  if (!resposta.ok) {
    return { ok: false, erro: resposta.erro };
  }
  return { ok: true, item: resposta.dados };
}

function progressoLista(lista) {
  const total = lista.itens.length;
  const concluidos = lista.itens.filter((i) => i.status === "concluido").length;
  const percentual = total === 0 ? 0 : Math.round((concluidos / total) * 100);
  return { total, concluidos, percentual };
}
