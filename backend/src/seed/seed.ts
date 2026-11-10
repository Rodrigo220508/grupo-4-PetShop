/**
 * Popula o banco com dados de exemplo.
 * Uso: npm run seed
 * Cada aluno acrescenta aqui os dados do seu módulo (aula 08).
 * Só insere o que ainda não existe: rodar de novo não apaga nada.
 */
import 'dotenv/config';
import * as bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { ProdutoSchema } from '../produtos/schemas/produto.schema';
import { PetSchema } from '../pets/schemas/pet.schema';
import { TutorSchema } from '../tutores/schemas/tutor.schema';
import { ServicoSchema } from '../servicos/schemas/servico.schema';
import { ProfissionalSchema } from '../profissionais/schemas/profissional.schema';
import { UsuarioSchema } from '../usuarios/schemas/usuario.schema';

const produtos = [
  {
    nome: 'Arroz integral 1 kg',
    preco: 8.9,
    estoque: 25,
    categoria: 'alimento',
  },
  {
    nome: 'Feijão preto 1 kg',
    preco: 7.5,
    estoque: 40,
    categoria: 'alimento',
  },
  {
    nome: 'Sabonete neutro',
    preco: 2.99,
    estoque: 60,
    categoria: 'higiene',
  },
  {
    nome: 'Detergente 500 ml',
    preco: 3.49,
    estoque: 0,
    categoria: 'limpeza',
  },
  {
    nome: 'Pilha AA (par)',
    preco: 12.0,
    estoque: 15,
    categoria: 'outros',
  },
];

const tutores = [
  {
    nome: 'Maria Oliveira',
    telefone: '(51) 99876-5432',
    email: 'maria.oliveira@email.com',
    endereco: 'Rua das Flores, 120',
  },
  {
    nome: 'João Pereira',
    telefone: '(51) 98765-4321',
    email: 'joao.pereira@email.com',
  },
  {
    nome: 'Carla Santos',
    telefone: '(51) 99123-4567',
    email: 'carla.santos@email.com',
  },
];

// tutorEmail liga cada pet ao tutor (o _id é buscado na hora)
const pets = [
  {
    nome: 'Rex',
    especie: 'cachorro',
    raca: 'Labrador',
    dataNascimento: new Date('2021-04-12'),
    tutorEmail: 'maria.oliveira@email.com',
  },
  {
    nome: 'Mimi',
    especie: 'gato',
    raca: 'Siamês',
    dataNascimento: new Date('2022-08-20'),
    tutorEmail: 'joao.pereira@email.com',
  },
  {
    nome: 'Luna',
    especie: 'cachorro',
    raca: 'Poodle',
    dataNascimento: new Date('2023-01-10'),
    tutorEmail: 'carla.santos@email.com',
  },
  {
    nome: 'Pipoca',
    especie: 'ave',
    raca: 'Calopsita',
    dataNascimento: new Date('2022-11-05'),
    tutorEmail: 'maria.oliveira@email.com',
  },
  {
    nome: 'Thor',
    especie: 'cachorro',
    raca: 'Pastor Alemão',
    dataNascimento: new Date('2020-06-18'),
    tutorEmail: 'joao.pereira@email.com',
  },
];

const servicos = [
  { nome: 'Banho', categoria: 'banho', preco: 50, duracaoMinutos: 40 },
  { nome: 'Tosa completa', categoria: 'tosa', preco: 80, duracaoMinutos: 60 },
  { nome: 'Consulta', categoria: 'consulta', preco: 120, duracaoMinutos: 30 },
];

const profissionais = [
  {
    nome: 'Ana Lima',
    funcao: 'banhista',
    telefone: '(51) 98888-1111',
    email: 'ana.lima@petshop.com',
  },
  {
    nome: 'Bruno Costa',
    funcao: 'tosador',
    telefone: '(51) 98888-2222',
    email: 'bruno.costa@petshop.com',
  },
  {
    nome: 'Dra. Paula Reis',
    funcao: 'veterinario',
    telefone: '(51) 98888-3333',
    email: 'paula.reis@petshop.com',
    crmv: 'CRMV-RS 12345',
  },
];

// Senhas só para o ambiente de desenvolvimento. Troque em produção.
const usuarios = [
  {
    nome: 'Administrador',
    email: 'admin@petshop.com',
    senha: 'Admin@123',
    perfil: 'admin',
  },
  {
    nome: 'Atendente',
    email: 'atendente@petshop.com',
    senha: 'Atende@123',
    perfil: 'atendente',
  },
];

async function seed() {
  const uri =
    process.env.MONGODB_URI ?? 'mongodb://localhost:27017/projeto-integrador';

  try {
    await mongoose.connect(uri);

    const Produto = mongoose.model('Produto', ProdutoSchema, 'produtos');
    const Tutor = mongoose.model('Tutor', TutorSchema, 'tutores');
    const Pet = mongoose.model('Pet', PetSchema, 'pets');
    const Servico = mongoose.model('Servico', ServicoSchema, 'servicos');
    const Profissional = mongoose.model(
      'Profissional',
      ProfissionalSchema,
      'profissionais',
    );
    const Usuario = mongoose.model('Usuario', UsuarioSchema, 'usuarios');

    for (const produto of produtos) {
      await Produto.updateOne(
        { nome: produto.nome },
        { $setOnInsert: produto },
        { upsert: true },
      );
    }

    for (const tutor of tutores) {
      await Tutor.updateOne(
        { email: tutor.email },
        { $setOnInsert: tutor },
        { upsert: true },
      );
    }

    for (const { tutorEmail, ...pet } of pets) {
      const tutor = await Tutor.findOne({ email: tutorEmail }).lean();
      if (!tutor) continue;
      await Pet.updateOne(
        { nome: pet.nome },
        { $setOnInsert: { ...pet, tutor: String(tutor._id), ativo: true } },
        { upsert: true },
      );
    }

    for (const servico of servicos) {
      await Servico.updateOne(
        { nome: servico.nome },
        { $setOnInsert: servico },
        { upsert: true },
      );
    }

    for (const profissional of profissionais) {
      await Profissional.updateOne(
        { email: profissional.email },
        { $setOnInsert: profissional },
        { upsert: true },
      );
    }

    // Usuários com a senha já em hash (aula 12)
    for (const { senha, ...usuario } of usuarios) {
      await Usuario.updateOne(
        { email: usuario.email },
        {
          $setOnInsert: {
            ...usuario,
            senhaHash: await bcrypt.hash(senha, 10),
            ativo: true,
          },
        },
        { upsert: true },
      );
    }

    console.log(`Produtos de exemplo verificados: ${produtos.length}`);
    console.log(`Tutores de exemplo verificados: ${tutores.length}`);
    console.log(`Pets de exemplo verificados: ${pets.length}`);
    console.log(`Serviços de exemplo verificados: ${servicos.length}`);
    console.log(
      `Profissionais de exemplo verificados: ${profissionais.length}`,
    );
    console.log('✔ Usuários: admin@petshop.com / Admin@123');
    console.log('            atendente@petshop.com / Atende@123');
  } catch (erro) {
    console.error('Erro no seed:', erro);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

void seed();
