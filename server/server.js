import { GraphQLSchema, GraphQLObjectType, GraphQLString } from "graphql";
import express from "express"; // yarn add express
import { createHandler } from "graphql-sse";

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
        subscribe: async function* () {
          for (const hi of ["Hi", "Bonjour", "Hola", "Ciao", "Zdravo"]) {
            yield { greetings: hi };
          }
        },
      },
    },
  }),
});

// Create the GraphQL over SSE handler
const handler = createHandler({ schema });

// Create an express app serving all methods on `/graphql/stream`
const app = express();
app.all("/graphql/stream", handler);

app.listen(4000);
console.log("Listening to port 4000");
