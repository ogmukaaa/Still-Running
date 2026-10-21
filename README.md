# Still Running

Aplicação web para organizar o catálogo e o estoque de tênis da Still Running. O projeto permite consultar os modelos cadastrados e manter seus dados em uma interface simples, adaptada para computador e celular.

## Funcionalidades

- Listar os tênis cadastrados no catálogo.
- Cadastrar um tênis com nome, marca, cor, preço, quantidade em estoque e imagem opcional.
- Editar os dados de um tênis cadastrado.
- Excluir um tênis após confirmação.
- Validar os campos obrigatórios e mostrar mensagens de sucesso ou erro.
- Enviar imagens JPG, PNG, WEBP, GIF ou AVIF de até 5 MB.
- Reaproveitar a imagem local quando o mesmo arquivo é enviado novamente.

## Tecnologias

- **Front-end:** Next.js com App Router, React e Bootstrap.
- **Back-end:** Node.js e Express.
- **Upload de imagens:** Multer.
- **Armazenamento dos cadastros:** array em memória no back-end.

## Estrutura do projeto

```text
backend/
  controllers/       Operações de cadastro, consulta, edição e exclusão
  data/              Array inicial de tênis
  middleware/        Recebimento e armazenamento de imagens
  routes/            Rotas HTTP da API
  server.js          Inicialização do Express

frontend/
  public/images/     Imagens usadas pelo catálogo
  src/app/           Páginas do Next.js
  src/components/    Cabeçalho, rodapé, catálogo, cards e formulário
```

## Instalação

Com o terminal aberto na pasta do projeto, instale as dependências de cada parte:

```bash
cd backend
npm install
```

```bash
cd ../frontend
npm install
```

Essa instalação é necessária na primeira configuração do projeto ou quando as dependências mudarem.

## Como executar

Abra dois terminais na pasta do projeto.

No primeiro terminal, inicie a API:

```bash
cd backend
npm start
```

A API ficará disponível em `http://localhost:3001`.

No segundo terminal, inicie o front-end:

```bash
cd frontend
npm run dev
```

Abra `http://localhost:3000` no navegador.

## Rotas da API

| Método | Rota | Ação |
|---|---|---|
| `GET` | `/api/check` | Verifica se a API está funcionando. |
| `GET` | `/api/tenis` | Lista os tênis. |
| `GET` | `/api/tenis/:id` | Busca um tênis pelo ID. |
| `POST` | `/api/tenis` | Cadastra um tênis. |
| `PUT` | `/api/tenis/:id` | Atualiza um tênis. |
| `DELETE` | `/api/tenis/:id` | Exclui um tênis. |

## Observação sobre os dados

Os registros dos tênis ficam em memória no Express. Quando a API reinicia, os cadastros, edições e exclusões voltam ao estado inicial definido em `backend/data/tenis.js`. Os arquivos de imagem enviados ficam em `frontend/public/images` e permanecem nessa pasta após a reinicialização.