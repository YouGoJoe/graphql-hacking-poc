import { makeExecutableSchema } from "@graphql-tools/schema";
import { PubSub } from "graphql-subscriptions";
import { ApolloServer, gql } from "apollo-server-express"; // swap to graphql-yoga
import express from "express";
import { createHandler } from "graphql-sse";
import cors from "cors";
import { interval } from "rxjs";

const pubsub = new PubSub();
const INCREMENT_CHANGE = "increment_changed";
const numbers = interval(1000);
numbers.subscribe((num) => {
  pubsub.publish(INCREMENT_CHANGE, { greetings: num });
});

const typeDefs = gql`
  type Query {
    hello: String
  }
  type Subscription {
    greetings: String
  }
`;

const resolvers = {
  Query: {
    hello: () => "world",
  },
  Subscription: {
    greetings: {
      subscribe: (parent, args) => {
        return pubsub.asyncIterator(INCREMENT_CHANGE);
      },
    },
  },
};

const schema = makeExecutableSchema({ typeDefs, resolvers });

const app = express({ origin: "*" });
app.use(cors());

const server = new ApolloServer({
  schema,
  introspection: true,
  debug: true,
});

const path = "/graphql";
const port = 4000;

// Create the GraphQL over SSE handler
const handler = createHandler({ schema });

// Create an express app serving all methods on `/graphql/stream`
app.all("/graphql/stream", handler);

const startup = async () => {
  await server.start();
  server.applyMiddleware({ app, path });
  app.listen(port, () => {
    console.log(`Up at http://localhost:${port}${path}/`);
  });
};

startup();
