import { GraphQLSchema, GraphQLObjectType, GraphQLString } from "graphql";
import { PubSub } from "graphql-subscriptions"
import { ApolloServer } from "apollo-server-express";
import express from "express";
import { createHandler } from "graphql-sse";
import cors from "cors";

const pubsub = new PubSub();

const INCREMENT_CHANGE = "increment_changed"


import { interval } from 'rxjs';
const numbers = interval(1000);

numbers.subscribe(num => {
  pubsub.publish(INCREMENT_CHANGE,{greetings: num});
})



/**
 * Construct a GraphQL schema and define the necessary resolvers.
 *
 * type Query {
 *   hello: String
 * }
 * type Subscription {
 *   greetings: String
 * }
 */
const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: "Query",
    fields: {
      hello: {
        type: GraphQLString,
        resolve: () => "world",
      },
    },
  }),
  subscription: new GraphQLObjectType({
    name: "Subscription",
    fields: {
      greetings: {
        type: GraphQLString,
        subscribe: (parent, args) => {
          return pubsub.asyncIterator(INCREMENT_CHANGE);
        },
      },
    },
  }),
});

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
