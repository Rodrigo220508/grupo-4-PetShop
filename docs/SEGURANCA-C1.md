# Segurança da Informação — Checkpoint C1 (PetShop)

**Responsável transversal:** Segurança — **Módulo C:** Atendimentos. Esta documentação diferencia medidas já implementadas de proteções ainda **não implementadas**. C1 usa principalmente serviços **mock** no front-end; controles no mock não protegem uma API real.

## Ameaças e medidas aplicadas

| Ameaça | O que foi feito | Limitação atual |
|---|---|---|
| Agendamento no passado (RN06) | Validação no formulário, mock e no `AtendimentosService` NestJS | Precisamos de testes de API integrados com banco real. |
| Duplo horário do mesmo profissional (RN05) | Checagem no mock/backend, índice único parcial no MongoDB; erros 409 para duplicidade | O índice precisa existir no banco; migrações com dados duplicados podem falhar. |
| Mudança indevida de status (RN07) | Mapa de transições no mock e no backend; atualização condicional no NestJS | Sem autenticação, qualquer cliente ainda pode chamar o endpoint. |
| Campo extra ou dado inválido | DTOs com `class-validator`; `ValidationPipe` global com `whitelist`, `forbidNonWhitelisted`, `transform` | Regras de domínio também precisam validar referências existentes. |
| Exposição de endpoint de documentação | Swagger só habilitado quando `NODE_ENV !== 'production'` | Não substitui autenticação. |
| Requisições de origens não autorizadas | CORS restrito à variável `CORS_ORIGIN` (`localhost:4200` por padrão) | CORS não protege API contra clientes fora do navegador. |
| Exposição de conteúdo e cache | Headers `nosniff`, `DENY`, `no-referrer`, `no-store` nas respostas da API | Para produção é recomendado complementar com Helmet, HTTPS e CSP adequada. |
| Cross-site scripting (XSS) | Templates Angular usam interpolação, e não `innerHTML` para dados do usuário | Não usar `bypassSecurityTrustHtml` ou manipulação insegura do DOM. |
| Dados pessoais em exemplos | Serviços mock com nomes e contatos fictícios | Não usar dados reais de clientes em commits e capturas. |

## O que falta antes de publicar

- [ ] **Autenticação real** (`POST /auth/login`): bcryptjs para senha com hash, JWT verificado no backend, mensagens genéricas para credenciais inválidas e limite de tentativas. **Não incluída neste C1** (prevista para C4 no manual).
- [ ] **Autorização por perfil** com guards (`admin`, `atendente`, `consulta`) nos controllers e regras revisadas com o PO. Um Angular guard sozinho **não** protege dados.
- [ ] Criação de usuários por administrador, sem permitir ao visitante escolher o perfil `admin`.
- [ ] Validação **no backend** de que pet, serviço e profissional informados existem e estão aptos. Os demais módulos NestJS ainda não existem no ZIP original.
- [ ] Rate limiting, logs com dados pessoais minimizados, HTTPS na implantação, gestão de segredo JWT por variável de ambiente, sessão e expiração.
- [ ] Auditoria de dependências (`npm audit`) e correção revisada **sem** `--force` automático.
- [ ] Testes integrados com MongoDB local antes de liberar o sistema para pessoas reais.

## O que é um guard no Angular?

Um `CanActivateFn` decide se uma rota pode ser exibida/navegada no navegador. Quando o projeto tiver autenticação real, o guard pode verificar sessão e redirecionar para login. **Não é controle de acesso confiável:** o backend deve verificar o token e as permissões em *cada requisição*. Não foi adicionado um guard fictício neste C1 para evitar falsa sensação de proteção.

## Perfis propostos (confirmar com PO)

| Perfil | Ações recomendadas |
|---|---|
| admin | Todos os recursos, exclusões e relatórios |
| atendente | Consultar, cadastrar, editar e mudar status; não excluir |
| consulta | Apenas leitura |

## Testes de segurança sugeridos

1. Tentar agendar uma data passada → formulário e API devem rejeitar.
2. Criar dois agendamentos do mesmo profissional no mesmo instante → segundo deve retornar 409.
3. Cancelar atendimento e voltar a reservar o mesmo horário → deve permitir.
4. Tentar trocar `concluido` para `agendado` → deve retornar 400.
5. Enviar `status: 'concluido'` no POST de criação → campo extra deve retornar 400 (o backend define `agendado`).
6. Enviar ID de pet inválido (`123`) → deve retornar 400. Enviar ID sintaticamente válido mas inexistente → **pendente** de validação de existência.
7. Enviar `<script>alert(1)</script>` em texto de observações → conteúdo não deve executar (somente texto na tela).
8. Tentar acessar endpoints sem login → **vai funcionar nesta entrega C1**; esse risco precisa ser eliminado no C4.

**Não use o C1 com dados reais ou em produção até autenticação/autorização e validação de referências estarem concluídas.**
