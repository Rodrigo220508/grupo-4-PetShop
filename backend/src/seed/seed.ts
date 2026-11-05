/**
 * Popula o banco com dados de exemplo.
 * Uso: npm run seed
 * Cada aluno acrescenta aqui os dados do seu módulo (aula 08).
 */
import 'dotenv/config';
import mongoose from 'mongoose';
import { ProdutoSchema } from '../produtos/schemas/produto.schema';
import { PetSchema } from '../pets/schemas/pet.schema';

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

const pets = [
  {
    nome: 'Rex',
    especie: 'cachorro',
    raca: 'Labrador',
    dataNascimento: new Date('2021-04-12'),
    tutor: '1',
    ativo: true,
  },
  {
    nome: 'Mimi',
    especie: 'gato',
    raca: 'Siamês',
    dataNascimento: new Date('2022-08-20'),
    tutor: '2',
    ativo: true,
  },
  {
    nome: 'Luna',
    especie: 'cachorro',
    raca: 'Poodle',
    dataNascimento: new Date('2023-01-10'),
    tutor: '3',
    ativo: true,
  },
  {
    nome: 'Pipoca',
    especie: 'ave',
    raca: 'Calopsita',
    dataNascimento: new Date('2022-11-05'),
    tutor: '1',
    ativo: true,
  },
  {
    nome: 'Thor',
    especie: 'cachorro',
    raca: 'Pastor Alemão',
    dataNascimento: new Date('2020-06-18'),
    tutor: '2',
    ativo: true,
  },
];

async function seed() {
  const uri =
    process.env.MONGODB_URI ?? 'mongodb://localhost:27017/projeto-integrador';

  try {
    await mongoose.connect(uri);

    const Produto = mongoose.model('Produto', ProdutoSchema, 'produtos');
    const Pet = mongoose.model('Pet', PetSchema, 'pets');

    // Insere produtos somente quando ainda não existem.
    for (const produto of produtos) {
      await Produto.updateOne(
        { nome: produto.nome },
        { $setOnInsert: produto },
        { upsert: true },
      );
    }

    // Insere pets somente quando ainda não existem.
    for (const pet of pets) {
      await Pet.updateOne(
        { nome: pet.nome },
        { $setOnInsert: pet },
        { upsert: true },
      );
    }

    console.log(`Produtos de exemplo verificados: ${produtos.length}`);
    console.log(`Pets de exemplo verificados: ${pets.length}`);
  } catch (erro) {
    console.error('Erro no seed:', erro);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

void seed();
