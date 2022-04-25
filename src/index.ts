import { ApolloServer } from 'apollo-server-express';
import Express from 'express';
import 'reflect-metadata';
import { buildSchema } from 'type-graphql';
import { DataSource } from 'typeorm';
import { ProductResolver } from './resolvers/ProductResolver';

export const dataSource = new DataSource({
  type: 'mongodb',
  host: 'localhost',
  username: '',
  password: '',
  database: 'boilerplate-db',
  port: 27017,
  synchronize: true,
  entities: ['./src/entities/*.ts'],
});

async function main() {
  await dataSource.initialize();
  const schema = await buildSchema({ resolvers: [ProductResolver] });
  const app = Express();

  const apolloServer = new ApolloServer({ schema });

  await apolloServer.start();

  apolloServer.applyMiddleware({ app });

  app.listen(4000, () => {
    console.log(`Server started at http://localhost:4000/graphql`);
  });
}

main();
