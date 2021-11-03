import "./App.css";
import Router from "./components/Router/Router";
import { BrowserRouter } from "react-router-dom";
import NavBar from "./components/NavBar/NavBar";
function App() {
  return (
    <div>
      <BrowserRouter>
        <NavBar />
        <Router />
      </BrowserRouter>
    </div>
  );
}

export default App;
