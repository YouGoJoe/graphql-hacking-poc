import React from "react";
import ReactDOM from "react-dom/client";
import { ApolloLink, Observable } from "@apollo/client/core";
import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  from,
  ApolloProvider,
} from "@apollo/client";
import { print } from "graphql";
import { createClient } from "graphql-sse";
import { onError } from "@apollo/client/link/error";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

const httpLink = new HttpLink({
  uri: "http://localhost:4000/graphql/stream",
});

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.forEach(({ message, locations, path }) =>
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      )
    );

  if (networkError) console.log(`[Network error]: ${networkError}`);
});

class SSELink extends ApolloLink {
  constructor(options) {
    super();
    this.client = createClient(options);
  }

  request(operation) {
    return new Observable((sink) => {
      return this.client.subscribe(
        { ...operation, query: print(operation.query) },
        {
          next: sink.next.bind(sink),
          complete: sink.complete.bind(sink),
          error: sink.error.bind(sink),
        }
      );
    });
  }
}

const sseLink = new SSELink({
  url: "http://localhost:4000/graphql/stream",
  headers: () => {
    const session = null; //getSession();
    if (!session) return {};
    return {
      Authorization: `Bearer ${session.token}`,
    };
  },
});

const client = new ApolloClient({
  link: from([errorLink, sseLink]),
  cache: new InMemoryCache(),
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
