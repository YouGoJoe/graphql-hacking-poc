import { useState, useRef, useEffect } from "react";
import gql from "graphql-tag";
import { useSubscription, useMutation } from "@apollo/client";
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
  const bottomRef = useRef(null);
  const [userName, setUserName] = useState("Anonymous");
  const [chatMessage, setChatMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([]);

  useSubscription(chatQuery, {
    onData: ({ data }) =>
      setChatMessages([data?.data?.chatroom, ...chatMessages]),
  });

  const [sendMessage] = useMutation(chatMutation);

  useEffect(() => {
    // 👇️ scroll to bottom every time messages change
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  return (
    <div className="App">
      <header className="App-header">
        <h2>Joe's dumb chatroom PoC</h2>
      </header>
      <div>
        <input
          onChange={(event) => setUserName(event.target.value)}
          value={userName}
        />
        <input
          onChange={(event) => setChatMessage(event.target.value)}
          value={chatMessage}
        />
        <button
          onClick={() =>
            sendMessage({ variables: { name: userName, message: chatMessage } })
          }
        >
          Send
        </button>

        <div
          style={{
            backgroundColor: "beige",
            fontFamily: "monospace",
            height: "30vh",
            width: "80%",
            marginLeft: "10%",
            overflowY: "scroll",
            display: "flex",
            flexDirection: "column-reverse",
            padding: "12px 0",
          }}
        >
          <div ref={bottomRef} />
          {chatMessages.map(({ name, message }, index) => (
            <div key={index} style={{ backgroundColor: "transparent" }}>
              <strong>{name} says:</strong> {message}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
