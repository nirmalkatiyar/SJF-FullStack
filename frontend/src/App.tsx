import MainCon from "./containers/index";
import { GlobalStyle } from "./skins";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import "./App.css";

function App() {
  return (
    <div className="App">
      <GlobalStyle />
      <ToastContainer />
      <MainCon />
    </div>
  );
}

export default App;
