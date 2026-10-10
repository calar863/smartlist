# SmartList

Plataforma web para criação e gerenciamento de listas de compras, desenvolvida
como Projeto Integrador do curso de Sistemas para Internet.

## Tecnologias (front-end)

- HTML5
- CSS3
- JavaScript (vanilla, sem frameworks ou build tools), com `fetch` para
  consumir a API
- **SmartList API** (repositório separado:
  [calar863/smartlist-api](https://github.com/calar863/smartlist-api)) —
  Node.js + Express + Prisma + PostgreSQL, publicada em
  https://smartlist-api-production.up.railway.app (documentação Swagger em
  `/api-docs`)
- `localStorage` do navegador apenas para guardar a sessão do usuário logado

## Como rodar o projeto localmente

É recomendado servir os arquivos por HTTP em vez de abri-los diretamente como
`file://`. Por padrão a UI usa a API publicada no Railway. Para apontar para
uma API local, execute no console do navegador:

```js
localStorage.setItem("smartlist_api_url", "http://localhost:3000")
```

(e `localStorage.removeItem("smartlist_api_url")` para voltar ao padrão).

**Opção 1 - com PowerShell (Windows), sem depender de Node/Python:**

```powershell
powershell -File serve.ps1
```

Depois acesse http://localhost:8791 no navegador.

**Opção 2:** qualquer servidor estático (ex.: extensão "Live Server" do
VS Code, `npx serve`, `python -m http.server`, etc.), apontando para a raiz
deste repositório.

## Estrutura do projeto

```
index.html      -> Tela de login (Caso de Uso: Realizar login)
cadastro.html   -> Tela de cadastro (Caso de Uso: Cadastrar usuário)
home.html       -> Tela inicial: criar lista + histórico (Caso de Uso: Criar lista de compras)
lista.html      -> Tela da lista: adicionar/concluir/remover itens (Caso de Uso: Adicionar Item)
css/style.css   -> Estilos compartilhados entre as telas
js/api.js       -> Cliente HTTP da SmartList API (fetch, tratamento de erros)
js/auth.js      -> Cadastro, login, sessão e logout (via API)
js/listas.js    -> Listas de compras e itens (via API)
serve.ps1       -> Servidor HTTP estático simples para desenvolvimento local
```

## Tarefas da Sprint 1

Implementadas de acordo com os Casos de Uso definidos na modelagem UML do
projeto:

1. **Cadastrar usuário** - formulário de cadastro com validação de e-mail
   único e senha (mínimo 8 caracteres, letras e números).
2. **Realizar login** - autenticação por e-mail e senha, com mensagens de
   erro para credenciais inválidas.
3. **Criar lista de compras** - criação de listas vinculadas ao usuário
   autenticado, com validação de nome obrigatório e não duplicado.
4. **Adicionar item** - inclusão de itens (nome, quantidade, categoria) em
   uma lista, com opções de concluir/remover.

## Tarefas da Entrega 3 (integração com a API)

A persistência em `localStorage` foi substituída por chamadas HTTP à
SmartList API:

1. Cliente HTTP da API (`js/api.js`)
2. Cadastro de usuário via `POST /api/usuarios`
3. Login via `POST /api/auth/login` (sessões antigas do `localStorage` são descartadas)
4. Histórico de listas do usuário via `GET /api/listas?usuarioId=`
5. Criação de lista via `POST /api/listas`
6. Tela da lista carregando dados via `GET /api/listas/:id`
7. Adicionar item via `POST /api/listas/:id/itens`
8. Concluir/reabrir item via `PATCH /api/listas/:id/itens/:itemId`
9. Remover item via `DELETE /api/listas/:id/itens/:itemId`
10. Excluir lista via `DELETE /api/listas/:id`
11. Saudação e botão de logout
12. Bloqueio de envio duplicado e estado de carregamento

## Próximos passos

- Autenticação por token (JWT): hoje o login devolve só os dados do usuário e
  a API não verifica o dono das listas.
- Avaliar autenticação social (Google/Facebook) conforme prototipado no
  Figma, hoje fora do escopo funcional implementado.
