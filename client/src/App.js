import gql from "graphql-tag";
import { useSubscription } from "@apollo/client";
import logo from "./logo.svg";
import "./App.css";

const subQuery = gql`
  subscription {
    greetings
  }
`;

function App() {
  let results;
  const { loading, data } = useSubscription(subQuery, {
    onData: ({ data }) => {
      console.log(`data in onData ${JSON.stringify(data)}`);
    },
  });

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
      </header>
    </div>
  );
}

export default App;
