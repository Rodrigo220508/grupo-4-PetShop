> [!IMPORTANT]
> **Este é o repositório base do Projeto Integrador.** Antes de tudo, leia o [`COMECE-AQUI.md`](COMECE-AQUI.md).
> Depois do fork, este README passa a ser **do grupo**: apague este aviso e preencha as seções marcadas com ✏️.

# [Nome do Sistema] — Projeto Integrador Sprint 5

> Substitua o título e preencha as seções marcadas com ✏️. Este README é parte da entrega (checkpoint C5).

**Grupo:** ✏️ número do grupo · **Tema:** ✏️ tema sorteado
**Turma:** Programador Full-Stack · SENAI · 2026

## ✏️ Sobre o sistema

Descreva em 3 a 5 linhas o problema que o sistema resolve, para quem e qual o valor entregue.

## Integrantes, módulos e papéis

| Aluno | Módulo | Papel transversal | GitHub |
| --- | --- | --- | --- |
| ✏️ | ✏️ | PO / Scrum Master | ✏️ |
| ✏️ | ✏️ | Git e Integração | ✏️ |
| ✏️ | ✏️ | Segurança | ✏️ |
| ✏️ | ✏️ | Testes e Qualidade | ✏️ |
| ✏️ | ✏️ | UX/UI e Acessibilidade | ✏️ |
| ✏️ | Relatórios | Documentação e Apresentação | ✏️ |

## Tecnologias

- **Front-end:** Angular 21 (standalone, signals, formulários reativos)
- **Back-end:** NestJS 11 (módulos, controllers, services, DTOs)
- **Banco:** MongoDB com Mongoose
- **Testes:** Jest · **Documentação da API:** Swagger

## Pré-requisitos

- Node.js 20.19+ ou 22.12+ (`node -v`)
- MongoDB Community rodando em `mongodb://localhost:27017` (`mongosh` para testar)
- Git e VS Code

## Como rodar

> **O grupo usa um banco MongoDB Atlas (na nuvem).** Depois de clonar, siga o passo a passo em [CONFIGURAR-BANCO.md](CONFIGURAR-BANCO.md), que explica como colocar o arquivo `.env` recebido de um colega. Os comandos abaixo são para quem usa o MongoDB instalado no próprio computador.

```bash
# 1) Back-end
cd backend
npm install
copy .env.example .env      # no Linux/Mac: cp .env.example .env
npm run seed                # popula o banco com dados de exemplo
npm run start:dev           # API em http://localhost:3000/api/v1

# 2) Front-end (em outro terminal)
cd frontend
npm install
npm start                   # http://localhost:4200
```

- Documentação da API (Swagger): http://localhost:3000/api/docs
- Testes do back-end: `cd backend && npm test`
- No `backend/.env`, troque o `JWT_SECRET` por um texto aleatório de pelo menos 32 caracteres. Sem ele a API não inicia.

**Contas criadas pelo `npm run seed`** (só para desenvolvimento):

| E-mail | Senha | Perfil |
| --- | --- | --- |
| `admin@petshop.com` | `Admin@123` | admin |
| `atendente@petshop.com` | `Atende@123` | atendente |

Contas criadas pela tela **Criar conta** começam com o perfil `consulta`.

> Se o `npm install` mostrar o erro `Cannot read properties of null (reading 'edgesOut')`, rode `npx npm@11 install`.

## Estrutura de pastas

```
guia/                # material do professor: manual do tema, receitas, templates (não altere)
docs/                # documentos do grupo (visão, contrato, dicionário, testes...)
backend/
  src/
    common/          # código compartilhado (padrão de resposta, filtros)
    produtos/        # MÓDULO DE EXEMPLO — use como modelo
      dto/           # contratos de entrada (validação)
      schemas/       # estrutura do documento no MongoDB
      produtos.controller.ts
      produtos.service.ts        # regras de negócio
      produtos.service.spec.ts   # testes unitários
    seed/            # dados de exemplo
  testes-obrigatorios/  # testes da autenticação (aulas 12 e 13)
frontend/
  src/
    environments/    # apiUrl e usarMock
    estilos-do-grupo.css  # estilos do grupo (vencem o styles.css)
    app/
      core/          # código compartilhado (modelos de resposta e de referência)
      layout/        # cabeçalho e menu
      pages/         # telas gerais (início, 404)
      features/
        produtos/    # MÓDULO DE EXEMPLO — use como modelo
          services/  # contrato + mock + API
          produtos-lista/
          produto-form/
```

## ✏️ Regras de negócio implementadas

| Código | Regra | Módulo | Onde está (arquivo) |
| --- | --- | --- | --- |
| RN01 | Não pode haver dois tutores com o mesmo e-mail (409) | Tutores | `backend/src/tutores/tutores.service.ts` |
| RN02 | Telefone no formato (51) 99999-9999 (400) | Tutores | `backend/src/tutores/dto/create-tutor.dto.ts` |
| RN03 | Data de nascimento do pet não pode ser futura (400) | Pets | `backend/src/pets/schemas/pet.schema.ts` |
| RN04 | O tutor do pet precisa existir (404) | Pets | `backend/src/pets/pets.service.ts` |
| RN05 | Profissional não pode ter dois atendimentos no mesmo horário (409) | Atendimentos | `backend/src/atendimentos/atendimentos.service.ts` |
| RN06 | Atendimento só pode ser agendado para o futuro (400) | Atendimentos | `backend/src/atendimentos/atendimentos.service.ts` |
| RN07 | Status segue o fluxo agendado → em atendimento → concluído (ou cancelado) (400) | Atendimentos | `backend/src/atendimentos/atendimentos.service.ts` |
| RN08 | Não pode haver dois serviços com o mesmo nome (409) | Serviços | `backend/src/servicos/servicos.service.ts` |
| RN09 | Excluir um serviço só o inativa | Serviços | `backend/src/servicos/servicos.service.ts` |
| RN10 | Veterinário precisa ter CRMV (400) | Profissionais | `backend/src/profissionais/dto/create-profissional.dto.ts` |
| RN11 | Não pode haver dois profissionais com o mesmo e-mail (409) | Profissionais | `backend/src/profissionais/profissionais.service.ts` |

Regras extras: atendimentos exigem pet, serviço e profissional existentes e ativos, e um tutor com pets não pode ser excluído (409).

## ✏️ Perfis de acesso

| Perfil | O que pode fazer |
| --- | --- |
| `admin` | Tudo, inclusive excluir, ver relatórios e cadastrar usuários (`POST /usuarios`) |
| `atendente` | Cadastrar e editar em todos os módulos e mudar o status dos atendimentos; não exclui nem vê relatórios |
| `consulta` | Apenas listar e ver detalhes |

Sem token a API responde `401`; com um perfil sem permissão, `403`. Na tela, os botões que o perfil não pode usar ficam escondidos.

## ✏️ Decisões técnicas (ADRs)

Registre as decisões importantes: o que foi decidido, por quê e qual alternativa foi descartada.

1. **Senhas com `bcryptjs` em vez de `bcrypt`:** é JavaScript puro, não precisa compilar nada na instalação e é a biblioteca usada nos testes obrigatórios.
2. **`@nestjs/jwt` na versão 11:** a versão 12 só funciona como módulo ESM, que o Jest do projeto não carrega; a 11 acompanha o NestJS 11.
3. **Token no `sessionStorage`:** a sessão termina ao fechar a aba, o que reduz o risco de um token esquecido no navegador. Descartado: `localStorage`.
4. **Cadastro aberto cria perfil `consulta`:** quem se cadastra pela tela não escolhe o próprio perfil; só o admin cria atendentes e admins.
5. **Relatórios calculados no MongoDB (`aggregate`):** os números vêm prontos da API, em vez de o navegador baixar todas as listas para somar.

## ✏️ Limitações conhecidas e próximos passos

- ✏️

## ✏️ Respostas às perguntas de verificação do manual

Cada aluno responde às perguntas do seu módulo aqui ou em `docs/respostas-<nome>.md`.

## Material de apoio

- [`COMECE-AQUI.md`](COMECE-AQUI.md) — fork, clone e atualizações da base
- [`guia/`](guia/) — manual do tema, receitas, Manual de Construção e templates
- [`CONTRIBUTING.md`](CONTRIBUTING.md) — branches, commits e Pull Requests
