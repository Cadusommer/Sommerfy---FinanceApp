import React, { useState } from "react";
import "./Cadastro.css";
import { useNavigate } from "react-router-dom";

const Cadastro = () => {
  const [nome, setNome] = useState("");
  const [sobrenome, setSobrenome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [aceitou, setAceitou] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!aceitou) {
      alert("Você precisa aceitar os termos para continuar.");
      return;
    }

    if (senha !== confirmarSenha) {
      alert("As senhas não coincidem.");
      return;
    }

    const usuario = {
      nome,
      sobrenome,
      email,
      senha,
    };

    localStorage.setItem("usuario", JSON.stringify(usuario));

    alert("Cadastro realizado com sucesso!");
    navigate("/login");
  };

  return (
    <div className="cadastro-container">
      <form onSubmit={handleSubmit}>
        <p>Formulário de cadastro:</p>

        <input
          type="text"
          placeholder="Nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Sobrenome"
          value={sobrenome}
          onChange={(e) => setSobrenome(e.target.value)}
          required
        />

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

        <input
          type="password"
          placeholder="Confirme sua senha"
          value={confirmarSenha}
          onChange={(e) => setConfirmarSenha(e.target.value)}
          required
        />

        <label className="termos">
          <input
            type="checkbox"
            checked={aceitou}
            onChange={(e) => setAceitou(e.target.checked)}
          />
          Aceito os termos de uso e política de privacidade.
        </label>

        <button type="submit">Criar Conta</button>
      </form>
    </div>
  );
};

export default Cadastro;
