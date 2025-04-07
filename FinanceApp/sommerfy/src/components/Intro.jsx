import "./Intro.css";
import { motion } from "framer-motion";
import React from "react";
import { Link } from "react-router-dom";

const Intro = () => {
  return (
    <div className="intro">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.h2
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Bem-vindo ao seu assistente financeiro inteligente!
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          Cuidar das finanças pessoais pode ser desafiador, mas o Sommerfy torna
          isso simples e eficiente...
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          💰 O que você pode fazer no Sommerfy?
        </motion.h2>

        <motion.ul>
          {[
            "✔️ Registrar sua renda e despesas de forma prática.",
            "✔️ Criar limites de gastos por categoria e acompanhar seus hábitos financeiros.",
            "✔️ Visualizar gráficos interativos para entender onde seu dinheiro está indo.",
            "✔️ Receber alertas quando estiver perto de ultrapassar seu orçamento.",
            "✔️ Personalizar suas metas financeiras e acompanhar seu progresso.",
          ].map((item, index) => (
            <motion.li
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.8 + index * 0.2 }}
            >
              {item}
            </motion.li>
          ))}
        </motion.ul>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 2 }}
        >
          Com o Sommerfy, você tem o controle total do seu dinheiro e pode tomar
          decisões mais inteligentes para um futuro financeiro mais seguro. 🚀
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 2.2 }}
        >
          📊 Clique no botão de cadastro abaixo e transforme sua vida
          financeira!
        </motion.p>

        <Link to="/cadastro">
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 2.5 }}
          >
            Cadastre-se agora!
          </motion.button>
        </Link>

        <Link to="/login">
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 2.5 }}
          >
            Fazer login!
          </motion.button>
        </Link>
      </motion.div>
    </div>
  );
};

export default Intro;
