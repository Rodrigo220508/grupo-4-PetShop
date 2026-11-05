# Checklist de testes manuais — C1

Este checklist é para o integrante de Testes/Qualidade executar no navegador; **não foi marcado como aprovado sem execução**.

## Rotas, navegação e formulário

- [ ] Abrir `/`, `/tutores`, `/pets`, `/atendimentos`, `/servicos`, `/profissionais`, `/relatorios` pelo menu.
- [ ] Entrar em `/<modulo>/novo` pelo botão da listagem.
- [ ] Salvar cadastro válido e confirmar retorno à lista.
- [ ] Clicar em Editar e verificar o preenchimento do formulário de acordo com `/:id/editar`.
- [ ] Tentar salvar com campos obrigatórios vazios; verificar mensagens e ausência de cadastro.
- [ ] Tentar editar um ID inexistente; verificar erro sem tela quebrada.
- [ ] Acessar `/endereco-inexistente`; verificar página 404 e retorno para Início.
- [ ] Verificar estados **carregando**, **vazio**, **erro** e **sucesso** (simular erros e filtros sem resultados).

## Operações CRUD nos cinco módulos

- [ ] **Tutores** — cadastrar, pesquisar parte do nome, editar, excluir com confirmação, verificar e-mail duplicado e telefone fora do formato.
- [ ] **Pets** — cadastrar com tutor do select, filtrar espécie, editar por rota e excluir após confirmação.
- [ ] **Atendimentos** — cadastrar com três referências, filtrar status, editar por rota e executar transições válidas; cancelamento faz o papel de remoção definido no manual.
- [ ] **Serviços** — cadastrar, filtrar categoria, editar, inativar com confirmação; serviço inativo some da listagem de ativos.
- [ ] **Profissionais** — cadastrar, filtrar função, editar, excluir e rejeitar veterinário sem CRMV e e-mail duplicado.
- [ ] **Relatórios** — conferir totalizadores, tabela por status e faturamento, inclusive painel em Início.

## Responsividade e acessibilidade (UX/UI)

- [ ] 320px, 375px, 768px, desktop; não deve haver elementos cortados fora das tabelas com rolagem horizontal.
- [ ] Navegar só pelo teclado (Tab, Shift+Tab, Enter, Space); foco visível.
- [ ] Usar link **Pular para o conteúdo principal** com Tab.
- [ ] Verificar nomes de campos, mensagens `role="alert"` e feedback `role="status"`.
- [ ] Testar zoom do navegador em 200%; conferir contraste, labels e tamanhos de toque.
- [ ] Testar leitor de tela (NVDA) em ações e formulários e preferências de redução de movimento.

## Back-end e segurança

- [ ] `cd backend && npm test` — executar testes NestJS com dependências instaladas.
- [ ] `cd backend && npm run build` — compilar backend.
- [ ] MongoDB rodando, executar RN05/RN06/RN07 conforme `docs/SEGURANCA-C1.md`.
- [ ] Verificar que Swagger não seja publicado com `NODE_ENV=production`.
- [ ] Verificar autenticação/guards quando forem implementados no C4.

## Checkpoint / integração (PO e Git)

- [ ] PO revisou backlog, funcionalidades e critérios do C1.
- [ ] Testes manuais concluídos e bugs registrados.
- [ ] PR revisado para `develop` e sem conflitos com alterações dos colegas.
- [ ] Integração realizada pelo responsável pelo Git e tag `v0.1-c1` criada **somente após revisão/aprovação**.
