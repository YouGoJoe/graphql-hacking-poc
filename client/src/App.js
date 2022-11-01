import gql from "graphql-tag";
import { useSubscription, useMutation } from "@apollo/client";
import logo from "./logo.svg";
import "./App.css";

const subQuery = gql`
  subscription {
    greetings
  }
`;

const chatQuery = gql`
  subscription {
    chatroom {
      name
      message
    }
  }
`;

const chatMutation = gql`
  mutation chatMutation($name: String!, $message: String!) {
    sendMessage(name: $name, message: $message)
  }
`;

function App() {
  const { data } = useSubscription(subQuery);

  const { data: data2 } = useSubscription(chatQuery, {
    onData: ({ data: data2 }) => {
      console.log(`data in onData ${JSON.stringify(data2)}`);
    },
  });

  const [sendMessage, { data: data3 }] = useMutation(chatMutation);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          {data?.greetings}
        </a>

        <button
          onClick={() =>
            sendMessage({ variables: { name: "joe", message: "hello" } })
          }
        >
          Let's go
        </button>
      </header>
    </div>
  );
}

export default App;
