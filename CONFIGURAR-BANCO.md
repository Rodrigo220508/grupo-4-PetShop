# Configurar o banco de dados (MongoDB Atlas)

O projeto usa um banco **MongoDB Atlas** (na nuvem), compartilhado pelo grupo. Assim ninguém precisa instalar o MongoDB no computador, e todos veem os mesmos dados.

A senha do banco fica no arquivo `backend/.env`. Esse arquivo **não vai para o GitHub** (está no `.gitignore`), então quem clona o repositório precisa recebê-lo de um colega e colocá-lo no lugar certo.

---

## Passo a passo depois de clonar

### 1. Pré-requisitos

- **Node.js** 22 ou mais novo (`node -v` para conferir). Baixe a versão **LTS** em https://nodejs.org
- **Git**
- Não é preciso instalar o MongoDB.

### 2. Clonar o repositório

```bash
git clone https://github.com/Rodrigo220508/grupo-4-PetShop.git
cd grupo-4-PetShop
git checkout develop
```

> **Importante:** o código do PetShop está na branch **`develop`**. A `main` (que vem por padrão no clone) ainda tem só o projeto base. Sem o `git checkout develop`, o site não vai funcionar.
>
> Se você já tinha clonado antes, basta atualizar: `git checkout develop` e depois `git pull`.

### 3. Colocar o arquivo `.env`

1. Peça o arquivo `.env` a um colega do grupo (por WhatsApp, Teams, e-mail... **nunca** pelo GitHub).
2. Salve o arquivo dentro da pasta **`backend`**, com o nome exato **`.env`**:

```
grupo-4-PetShop/
├── backend/
│   ├── .env          <-- aqui
│   ├── .env.example
│   ├── package.json
│   └── src/
└── frontend/
```

**Cuidados no Windows:**

- O nome tem que ser `.env`, e não `.env.txt` nem `env`. No Explorador de Arquivos, ative **Exibir → Extensões de nomes de arquivos** para conferir.
- Se o arquivo vier com outro nome (por exemplo `env-petshop.env`), renomeie para `.env`. Pelo terminal, na pasta do projeto:

```bash
# PowerShell / Git Bash
mv caminho/do/arquivo/baixado backend/.env
```

### 4. Instalar as dependências

```bash
cd backend
npm install

cd ../frontend
npm install
```

> Se o `npm install` mostrar `Cannot read properties of null (reading 'edgesOut')`, rode `npx npm@11 install`.

### 5. Iniciar a API (back-end)

```bash
cd backend
npm run start:dev
```

Espere aparecer a mensagem de que a aplicação iniciou. A API fica em http://localhost:3000/api/v1 e a documentação em http://localhost:3000/api/docs.

### 6. Iniciar o site (front-end), em **outro terminal**

```bash
cd frontend
npm start
```

Abra **http://localhost:4200** e entre com:

| E-mail | Senha | Perfil |
| --- | --- | --- |
| `admin@petshop.com` | `Admin@123` | admin |
| `atendente@petshop.com` | `Atende@123` | atendente |

> **Não é preciso rodar `npm run seed`.** O banco no Atlas já tem esses usuários e os dados de exemplo. Se alguém rodar, não estraga nada: o seed só cria o que estiver faltando.

---

## Problemas comuns

| Erro | Causa e solução |
| --- | --- |
| `JWT_SECRET` ausente / a API não inicia | O `.env` não está na pasta `backend` ou o nome está errado (ex.: `.env.txt`). Volte ao passo 3. |
| `Server selection timed out` / `ETIMEDOUT` | O Atlas está bloqueando a sua conexão. O responsável pelo banco precisa liberar o acesso (veja a seção abaixo). Algumas redes de escola/empresa bloqueiam a porta 27017; teste com o roteador do celular. |
| `Authentication failed` | O usuário ou a senha no `MONGODB_URI` estão errados. Peça o `.env` atualizado. |
| `querySrv ECONNREFUSED` | Alguém trocou o `MONGODB_URI` por um endereço `mongodb+srv://...`. Use o `.env` do grupo, que tem o endereço no formato `mongodb://...` (funciona em qualquer rede). |
| `Cannot POST /api/v1/auth/login` no login | Está rodando uma API antiga. Pare o terminal da API (`Ctrl+C`) e rode `npm run start:dev` de novo. |
| `Cannot find module ...` | Faltou `npm install` (passo 4). Rode de novo depois de cada `git pull`. |
| A pasta não tem as telas do PetShop / `npm start` dá erro logo de cara | Você está na branch `main`. Rode `git checkout develop` (passo 2). |
| `The Angular CLI requires a minimum Node.js version` | Node desatualizado. Instale o Node LTS mais recente (passo 1). |
| A porta 3000 ou 4200 já está em uso | Já tem uma API ou um site rodando em outro terminal. Feche esse terminal (ou `Ctrl+C` nele) e rode de novo. |

---

## Para o responsável pelo banco (uma vez só)

Feito no site do Atlas: https://cloud.mongodb.com

1. **Liberar o acesso de qualquer lugar:** em **Security → Network Access → Add IP Address**, clique em **Allow Access from Anywhere** (`0.0.0.0/0`) e confirme. Sem isso, só o seu computador consegue conectar.
2. **Trocar a senha (se ela vazar):** em **Security → Database Access → Edit** no usuário, gere uma nova senha. Depois atualize o `MONGODB_URI` no `.env` e mande o arquivo novo para o grupo.

### Formato do `MONGODB_URI`

O endereço usa o formato padrão (`mongodb://`) em vez do `mongodb+srv://` que o Atlas sugere, porque o `+srv` falha no Node em várias redes do Windows:

```
MONGODB_URI=mongodb://USUARIO:SENHA@HOST-00:27017,HOST-01:27017,HOST-02:27017/projeto-integrador?ssl=true&replicaSet=NOME-DO-REPLICASET&authSource=admin&retryWrites=true&w=majority
```

Os três hosts e o nome do replica set aparecem no Atlas em **Connect → Drivers**, escolhendo uma versão antiga do driver (ex.: Node.js 2.2.12 ou anterior).
