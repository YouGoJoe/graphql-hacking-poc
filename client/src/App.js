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

  const secretJoinCode = `ƒ∂ßå˚¬ÔÍ`;
  const joinedRegex = new RegExp(secretJoinCode);
  const unlockChat = () => {
    sendMessage({
      variables: {
        name: userName,
        message: secretJoinCode,
      },
    });
    setChatRoomLocked(false);
  };

  const send = () => {
    sendMessage({
      variables: { name: userName, message: chatMessage },
    });
    setChatMessage("");
  };
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
            onKeyUp={(event) => {
              if (event.code === "Enter") {
                unlockChat();
              }
            }}
          />
          <button onClick={unlockChat}>Join</button>
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
              {joinedRegex.test(message) ? (
                <em>{name} has joined</em>
              ) : (
                <span>
                  <strong>{name} says:</strong> {message}
                </span>
              )}
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
                send();
              }
            }}
            value={chatMessage}
          />
          <button disabled={chatRoomLocked} onClick={send}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
