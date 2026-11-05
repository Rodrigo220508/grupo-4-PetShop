# PetShop — como aplicar e testar esta versão (C1 + Segurança)

## O que foi implementado

- Rotas SPA de cinco módulos do tema PetShop: Tutores, Pets, **Atendimentos**, Serviços e Profissionais. Também Relatórios, tela inicial e 404.
- Listagem, cadastro e edição por URLs `/novo` e `/:id/editar`, com navegação após salvar. Remoções com confirmação para Tutores/Pets/Profissionais; Serviços usa inativação lógica; Atendimentos usa **cancelamento de status**, pois não possui `DELETE` no manual.
- Busca de tutor por parte do nome, filtro por espécie/status/categoria/função, validações de formulário, feedback de carregamento/erro/vazio/sucesso.
- Serviços mock em memória (dados **não** sobrevivem à atualização completa da página).
- Relatórios **mock** a partir dos dados em memória, sem API de relatórios ainda.
- Backend NestJS do **Módulo C / Atendimentos**: DTOs validados, MongoDB/Mongoose, RN05/RN06/RN07, tratamento de conflito e índice único parcial de horário; Swagger local. Endpoints são **sem autenticação** nesta versão C1.
- Endurecimento básico de respostas no backend (CORS e headers) e documentação de segurança.

## Para testar na tua máquina (Windows + Node portátil)

1. **Não sobrescreva os arquivos do grupo na `main`/`develop`**. Crie uma branch de trabalho a partir da `develop` com alterações locais salvas/guardadas. Por exemplo, depois de verificar `git status`:

   ```powershell
   git switch develop
   git switch -c feature/seguranca-atendimentos-c1
   ```

2. Copie para essa branch os arquivos deste ZIP (sem mexer nas pastas `.git` e `node_modules` existentes). Revise o diff com `git status` e `git diff`.
3. No terminal do VS Code, configure o Node portátil **se necessário**:

   ```powershell
   $env:Path = "C:\Users\Aluno\Downloads\node-v24.22.1-win-x64\node-v24.22.1-win-x64;$env:Path"
   ```

4. Para rodar frontend **C1 com mocks**:

   ```powershell
   cd frontend
   npm.cmd install
   npm.cmd start
   ```

5. Abra `http://localhost:4200` e teste as rotas e formulários do checklist em `docs/TESTES-C1.md`.
6. Para testar backend (precisa de MongoDB local e dependências):

   ```powershell
   cd ..\backend
   npm.cmd install
   Copy-Item .env.example .env
   npm.cmd test
   npm.cmd run start:dev
   ```

   A API responde em `http://localhost:3000/api/v1/atendimentos` e o Swagger local em `http://localhost:3000/api/docs`.

## Observações importantes

- **Cinco módulos completos em mock** é a entrega C1; o backend C2/C3 de Tutores, Pets, Serviços e Profissionais ainda **não veio no ZIP original**.
- O servidor ainda não verifica existência das referências de Pet/Serviço/Profissional, pois os schemas dos colegas não estão no backend original. Essa verificação deve ser adicionada na integração (C3).
- **Autenticação, JWT, senhas e guard de perfil** não foram implementados neste C1. O manual deixa isso para aulas 12–13 / C4. Guard Angular não substitui controle de acesso na API.
- Antes de criar o PR, compare mudanças dos colegas, especialmente menu, layout, `app.routes.ts` e `app.config.ts`, para evitar sobrescrever trabalho paralelo.
- A tag `v0.1-c1` **não foi criada**: esta cópia em ZIP não possui `.git`, acesso ao repositório remoto ou aprovações do grupo. A tag deve ser criada depois da revisão e merge na `develop` pelo responsável Git.
- O Angular foi verificado com `ngc` (compilação de TypeScript e templates). O `ng build` não pôde executar neste ambiente porque as dependências nativas empacotadas no ZIP eram para Windows; executar `npm.cmd install && npm.cmd run build` no Windows.

## Registro simples de merge/tag (executar só quando o grupo aprovar)

```powershell
# Pela pessoa responsável pela integração, depois de revisar o PR
# git switch develop
# git pull --ff-only origin develop
# git tag v0.1-c1
# git push origin v0.1-c1
```

Para a documentação de Segurança e a tabela de riscos, veja `docs/SEGURANCA-C1.md`.
