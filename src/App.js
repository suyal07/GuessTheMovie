import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

import "./App.css";
import { GuessTheMovie_App_Home } from "./GuessTheMovie_App_Home";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <GuessTheMovie_App_Home />
      </header>
    </div>
  );
}

export default App;
