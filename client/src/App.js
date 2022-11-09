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
  const [chatRoomLocked, setChatRoomLocked] = useState(true);
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
        <div
          style={{
            display: "flex",
            width: "80%",
            marginLeft: "10%",
            justifyContent: "center",
            marginBottom: "12px",
          }}
        >
          <strong
            style={{
              color: "whitesmoke",
              fontSize: "24px",
              marginRight: "8px",
            }}
          >
            Set your display name:
          </strong>
          <input
            style={{
              fontSize: "24px",
            }}
            onChange={(event) => setUserName(event.target.value)}
            value={userName}
          />
          <button
            onClick={() => {
              sendMessage({
                variables: {
                  name: userName,
                  message: `${userName} has joined the chat`,
                },
              });
              setChatRoomLocked(false);
            }}
          >
            Join
          </button>
        </div>

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
        <div
          style={{
            display: "flex",
            width: "80%",
            marginLeft: "10%",
          }}
        >
          <input
            disabled={chatRoomLocked}
            style={{ flexGrow: 1, fontSize: "18px" }}
            onChange={(event) => setChatMessage(event.target.value)}
            onKeyUp={(event) => {
              if (event.code === "Enter") {
                sendMessage({
                  variables: { name: userName, message: chatMessage },
                });
              }
            }}
            value={chatMessage}
          />
          <button
            disabled={chatRoomLocked}
            onClick={() =>
              sendMessage({
                variables: { name: userName, message: chatMessage },
              })
            }
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
