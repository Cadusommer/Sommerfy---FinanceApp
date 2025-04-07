import { motion } from "framer-motion";
import "./App.css";
import "./index.css";
import Intro from "./components/Intro";
import Cadastro from "./components/Cadastro";
import Conteudo from "./components/Conteudo";

function App() {
  return (
    <div className="container">
      <header className="topo">
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          Sommerfy
        </motion.h1>
      </header>
      <div className="page-content">
        <Intro />
      </div>
    </div>
  );
}

export default App;
