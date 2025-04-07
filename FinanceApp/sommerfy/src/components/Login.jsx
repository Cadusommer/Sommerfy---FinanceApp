import React, { useState } from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    const usuarioSalvo = JSON.parse(localStorage.getItem("usuario"));

    if (
      usuarioSalvo &&
      email === usuarioSalvo.email &&
      senha === usuarioSalvo.senha
    ) {
      alert("Login bem-sucedido!");
      navigate("/conteudo");
    } else {
      alert("E-mail ou senha inválidos.");
    }
  };

  return (
    <div className="cadastro-container">
      <form onSubmit={handleSubmit}>
        <p>Login:</p>
        <input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          required
        />

        <button type="submit">Logar</button>
      </form>
    </div>
  );
};

export default Login;
