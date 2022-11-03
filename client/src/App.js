import { useState, useEffect } from "react";
import gql from "graphql-tag";
import { useSubscription, useMutation } from "@apollo/client";
import logo from "./logo.svg";
import "./App.css";

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
  const [userName, setUserName] = useState("Anonymous");
  const [chatMessage, setChatMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([]);

  useSubscription(chatQuery, {
    onData: ({ data }) =>
      setChatMessages([...chatMessages, data?.data?.chatroom]),
  });

  const [sendMessage] = useMutation(chatMutation);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <input
          onChange={(event) => setUserName(event.target.value)}
          value={userName}
        />
        <input
          onChange={(event) => setChatMessage(event.target.value)}
          value={chatMessage}
        />
        {chatMessages.map(({ name, message }, index) => (
          <div key={index}>
            <strong>{name} says:</strong> {message}
          </div>
        ))}

        <button
          onClick={() =>
            sendMessage({ variables: { name: userName, message: chatMessage } })
          }
        >
          Let's go
        </button>
      </header>
    </div>
  );
}

export default App;
