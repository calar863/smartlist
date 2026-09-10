# SmartList

Plataforma web para criação e gerenciamento de listas de compras, desenvolvida
como Projeto Integrador do curso de Sistemas para Internet.

## Tecnologias (front-end)

- HTML5
- CSS3
- JavaScript (vanilla, sem frameworks ou build tools)
- Persistência local via `localStorage` do navegador (nesta sprint ainda não
  há backend/banco de dados integrado)

## Como rodar o projeto localmente

Como o front-end usa `localStorage`, é recomendado servir os arquivos por HTTP
em vez de abri-los diretamente como `file://`.

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
js/auth.js      -> Regras de cadastro e login
js/listas.js    -> Regras de listas de compras e itens
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

## Próximos passos

- Definir e implementar o back-end (API + banco de dados) a partir do DER e
  do diagrama de classes já modelados.
- Substituir a persistência em `localStorage` por chamadas HTTP ao back-end.
- Avaliar autenticação social (Google/Facebook) conforme prototipado no
  Figma, hoje fora do escopo funcional implementado.
