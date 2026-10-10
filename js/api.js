// Cliente HTTP da SmartList API (https://github.com/calar863/smartlist-api).
// Todas as chamadas devolvem { ok: true, dados } ou { ok: false, erro },
// o mesmo contrato usado pelas telas desde a sprint anterior.

const API_URL_PADRAO = "https://smartlist-api-production.up.railway.app";

// Permite apontar para uma API local sem editar o código:
//   localStorage.setItem("smartlist_api_url", "http://localhost:3000")
function getApiUrl() {
  try {
    return localStorage.getItem("smartlist_api_url") || API_URL_PADRAO;
  } catch (e) {
    return API_URL_PADRAO;
  }
}

function mensagemDeErro(corpo, status) {
  if (corpo && corpo.detalhes) {
    const msgs = Object.values(corpo.detalhes).flat();
    if (msgs.length > 0) return msgs.join(" ");
  }
  if (corpo && corpo.erro) return corpo.erro;
  return "Erro inesperado (" + status + "). Tente novamente.";
}

async function apiRequest(metodo, caminho, corpo) {
  let resposta;
  try {
    resposta = await fetch(getApiUrl() + caminho, {
      method: metodo,
      headers: corpo ? { "Content-Type": "application/json" } : {},
      body: corpo ? JSON.stringify(corpo) : undefined,
    });
  } catch (e) {
    return { ok: false, erro: "Não foi possível conectar ao servidor. Tente novamente em instantes." };
  }

  if (resposta.status === 204) {
    return { ok: true, dados: null };
  }

  let dados = null;
  try {
    dados = await resposta.json();
  } catch (e) {
    dados = null;
  }

  if (!resposta.ok) {
    return { ok: false, status: resposta.status, erro: mensagemDeErro(dados, resposta.status) };
  }
  return { ok: true, dados: dados };
}

// Os nomes de listas/itens vêm do servidor e são inseridos via innerHTML.
function escapeHtml(texto) {
  return String(texto)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
