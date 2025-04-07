import React, { useState, useEffect } from "react";
import "./Conteudo.css";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const Conteudo = () => {
  const [transacoes, setTransacoes] = useState([]);
  const [filtro, setFiltro] = useState("todos");
  const [novoValor, setNovoValor] = useState("");
  const [novaCategoria, setNovaCategoria] = useState("");
  const [tipo, setTipo] = useState("despesa");
  const [limites, setLimites] = useState({});
  const [usuario, setUsuario] = useState("");
  const [metas, setMetas] = useState([]);
  const [metaTitulo, setMetaTitulo] = useState("");
  const [metaValor, setMetaValor] = useState("");
  const [progressoMetas, setProgressoMetas] = useState({});
  const [valoresAdicionados, setValoresAdicionados] = useState({});

  useEffect(() => {
    const usuarioSalvo = JSON.parse(localStorage.getItem("usuario"));
    if (usuarioSalvo && usuarioSalvo.nome) {
      const primeiroNome = usuarioSalvo.nome.split(" ")[0];
      setUsuario(primeiroNome);
    }

    const transacoesSalvas = JSON.parse(localStorage.getItem("transacoes"));
    if (transacoesSalvas) setTransacoes(transacoesSalvas);

    const limitesSalvos = JSON.parse(localStorage.getItem("limites"));
    if (limitesSalvos) setLimites(limitesSalvos);

    const metasSalvas = JSON.parse(localStorage.getItem("metas"));
    if (metasSalvas) setMetas(metasSalvas);

    const progressoSalvo = JSON.parse(localStorage.getItem("progressoMetas"));
    if (progressoSalvo) setProgressoMetas(progressoSalvo);
  }, []);

  useEffect(() => {
    localStorage.setItem("transacoes", JSON.stringify(transacoes));
  }, [transacoes]);

  useEffect(() => {
    localStorage.setItem("limites", JSON.stringify(limites));
  }, [limites]);

  useEffect(() => {
    localStorage.setItem("metas", JSON.stringify(metas));
  }, [metas]);

  useEffect(() => {
    localStorage.setItem("progressoMetas", JSON.stringify(progressoMetas));
  }, [progressoMetas]);

  useEffect(() => {
    const progressoCategorias = {};

    Object.keys(limites).forEach((cat) => {
      const totalGasto = transacoes
        .filter((t) => t.categoria === cat && t.tipo === "despesa")
        .reduce((acc, curr) => acc + curr.valor, 0);

      progressoCategorias[cat] = totalGasto;
    });

    setProgressoMetas((prevProgresso) => ({
      ...prevProgresso,
      ...progressoCategorias,
    }));
  }, [transacoes, limites]);

  const handleAdicionar = (e) => {
    e.preventDefault();
    if (!novoValor || !novaCategoria) return;

    const novaTransacao = {
      id: transacoes.length + 1,
      tipo,
      categoria: novaCategoria,
      valor: parseFloat(novoValor),
    };

    setTransacoes([...transacoes, novaTransacao]);
    setNovoValor("");
    setNovaCategoria("");
  };

  const transacoesFiltradas =
    filtro === "todos"
      ? transacoes
      : transacoes.filter((t) => t.categoria === filtro);

  const dadosGraficoPizza = transacoes
    .filter((t) => t.tipo === "despesa")
    .reduce((acc, curr) => {
      const existe = acc.find((item) => item.name === curr.categoria);
      if (existe) {
        existe.value += curr.valor;
      } else {
        acc.push({ name: curr.categoria, value: curr.valor });
      }
      return acc;
    }, []);

  const dadosGraficoLinha = transacoes.reduce((acc, curr, index) => {
    const saldoAnterior = index > 0 ? acc[index - 1].saldo : 0;
    const saldoAtual =
      curr.tipo === "renda"
        ? saldoAnterior + curr.valor
        : saldoAnterior - curr.valor;

    acc.push({ name: `#${curr.id}`, saldo: saldoAtual });
    return acc;
  }, []);

  const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7f50", "#a6c"];

  const removerCategoria = (categoriaRemover) => {
    const confirmacao = window.confirm(
      `Tem certeza que deseja remover a categoria "${categoriaRemover}" e todas as suas transações?`
    );
    if (confirmacao) {
      setTransacoes(transacoes.filter((t) => t.categoria !== categoriaRemover));
    }
  };

  const atualizarProgressoMeta = (metaId) => {
    const valor = parseFloat(valoresAdicionados[metaId]);
    if (!valor || valor <= 0) return;

    setProgressoMetas((prev) => ({
      ...prev,
      [metaId]: (prev[metaId] || 0) + valor,
    }));

    setValoresAdicionados((prev) => ({ ...prev, [metaId]: "" }));
  };

  const removerMeta = (id) => {
    const novasMetas = metas.filter((meta) => meta.id !== id);
    setMetas(novasMetas);
    localStorage.setItem("metas", JSON.stringify(novasMetas));
  };

  const criarMeta = () => {
    if (!metaTitulo || !metaValor) return;

    const novaMeta = {
      id: Date.now(), // gera ID único
      titulo: metaTitulo,
      valor: parseFloat(metaValor),
    };

    const novasMetas = [...metas, novaMeta];
    setMetas(novasMetas);
    setMetaTitulo("");
    setMetaValor("");
  };

  return (
    <div className="conteudo-container">
      <h1>Olá {usuario}, seja bem-vindo ao seu resumo financeiro!</h1>

      {/* Filtro */}
      <div className="filtros">
        <select
          className="select-ajustado"
          onChange={(e) => setFiltro(e.target.value)}
          value={filtro}
        >
          <option value="todos">Todos</option>
          {Array.from(new Set(transacoes.map((t) => t.categoria))).map(
            (cat, index) => (
              <option key={index} value={cat}>
                {cat}
              </option>
            )
          )}
        </select>
      </div>

      {/* Lista de transações */}
      <div className="lista-transacoes">
        {transacoesFiltradas.map((t) => (
          <div
            key={t.id}
            className={`transacao ${t.tipo} ${
              limites[t.categoria] &&
              t.tipo === "despesa" &&
              t.valor >= limites[t.categoria] * 0.9
                ? "alerta"
                : ""
            }`}
          >
            <span>
              {t.tipo === "renda" ? "💰" : "💸"} <strong>{t.categoria}</strong>
            </span>
            <span>R$ {t.valor}</span>
          </div>
        ))}
      </div>

      {/* Gráfico de pizza */}
      <div className="grafico">
        <h3>Despesas por categoria</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={dadosGraficoPizza}
              cx="50%"
              cy="50%"
              outerRadius={100}
              dataKey="value"
              label
            >
              {dadosGraficoPizza.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Gráfico de linha */}
      <div className="grafico">
        <h3>Evolução do Saldo</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={dadosGraficoLinha}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="saldo"
              stroke="#82ca9d"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Gerenciar Categorias */}
      <div className="categorias-container">
        <h3>Gerenciar Categorias</h3>
        {Array.from(new Set(transacoes.map((t) => t.categoria))).length ===
        0 ? (
          <p>Nenhuma categoria criada ainda.</p>
        ) : (
          <ul className="lista-categorias">
            {Array.from(new Set(transacoes.map((t) => t.categoria))).map(
              (cat, index) => (
                <li key={index}>
                  {cat}
                  <button onClick={() => removerCategoria(cat)}>❌</button>
                </li>
              )
            )}
          </ul>
        )}
      </div>

      {/* Limites */}
      <div className="limites-container">
        <h3>Definir Limites por Categoria</h3>
        {Array.from(new Set(transacoes.map((t) => t.categoria))).map(
          (cat, index) => (
            <div key={index}>
              <span>{cat}</span>
              <input
                type="number"
                placeholder="Limite"
                value={limites[cat] || ""}
                onChange={(e) =>
                  setLimites({ ...limites, [cat]: parseFloat(e.target.value) })
                }
              />
            </div>
          )
        )}
      </div>

      {/* Avisos de limite */}
      <div className="avisos">
        {Object.keys(limites).map((cat) => {
          const total = transacoes
            .filter((t) => t.categoria === cat && t.tipo === "despesa")
            .reduce((acc, curr) => acc + curr.valor, 0);

          const limite = limites[cat];
          if (limite && total >= limite * 0.9) {
            return (
              <p key={cat} style={{ color: "red" }}>
                ⚠️ Atenção! Você está perto ou ultrapassou o limite da categoria{" "}
                <strong>{cat}</strong> (Limite: R$ {limite}, Gasto: R$ {total})
              </p>
            );
          }
          return null;
        })}
      </div>

      {/* Progresso dos gastos */}
      <div className="progresso-container">
        <h3>Progresso dos Gastos por Categoria</h3>
        {Object.keys(limites).map((cat) => {
          const total = transacoes
            .filter((t) => t.categoria === cat && t.tipo === "despesa")
            .reduce((acc, curr) => acc + curr.valor, 0);
          const limite = limites[cat];

          if (limite) {
            const porcentagem = Math.min((total / limite) * 100, 100);
            let classeBarra = "barra-verde";
            if (porcentagem >= 90) classeBarra = "barra-vermelha";
            else if (porcentagem >= 70) classeBarra = "barra-amarela";

            return (
              <div key={cat}>
                <div className="progresso-info">
                  <strong>{cat}</strong>: R$ {total} / R$ {limite} (
                  {porcentagem.toFixed(0)}%)
                </div>
                <div className="barra-progresso">
                  <div
                    className={`barra-preenchida ${classeBarra}`}
                    style={{ width: `${porcentagem}%` }}
                  ></div>
                </div>
              </div>
            );
          }
          return null;
        })}
      </div>

      {/* Formulário de nova transação */}
      <form onSubmit={handleAdicionar} className="formulario">
        <h3>Adicionar transação</h3>
        <select
          className="select-ajustado"
          onChange={(e) => setTipo(e.target.value)}
          value={tipo}
        >
          <option value="despesa">Despesa</option>
          <option value="renda">Renda</option>
        </select>

        <input
          type="text"
          placeholder="Categoria"
          value={novaCategoria}
          onChange={(e) => setNovaCategoria(e.target.value)}
        />

        <input
          type="number"
          placeholder="Valor"
          value={novoValor}
          onChange={(e) => setNovoValor(e.target.value)}
        />

        <button type="submit">Adicionar</button>
      </form>

      {/* Metas Financeiras */}
      <div className="metas-container">
        <h3>Metas Financeiras</h3>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const novaMeta = {
              id: metas.length + 1,
              titulo: metaTitulo,
              valor: parseFloat(metaValor),
              progresso: 0,
            };
            setMetas([...metas, novaMeta]);
            setMetaTitulo("");
            setMetaValor("");
          }}
        >
          <input
            type="text"
            placeholder="Título da meta"
            value={metaTitulo}
            onChange={(e) => setMetaTitulo(e.target.value)}
          />
          <input
            type="number"
            placeholder="Valor da meta"
            value={metaValor}
            onChange={(e) => setMetaValor(e.target.value)}
          />
          <button type="submit">Criar Meta</button>
        </form>

        <ul className="lista-metas">
          {metas.map((meta) => {
            const progresso = progressoMetas[meta.id] || 0;
            const percentual = Math.min((progresso / meta.valor) * 100, 100);
            return (
              <li key={meta.id}>
                <strong>{meta.titulo}</strong> - R$ {meta.valor}
                <div className="barra-progresso">
                  <div
                    className="barra-preenchida barra-verde"
                    style={{ width: `${percentual}%` }}
                  ></div>
                </div>
                <small>
                  Progresso: R$ {progresso} ({percentual.toFixed(1)}%)
                </small>
                <div style={{ marginTop: "8px" }}>
                  <input
                    type="number"
                    placeholder="Adicionar valor"
                    value={valoresAdicionados[meta.id] || ""}
                    onChange={(e) =>
                      setValoresAdicionados({
                        ...valoresAdicionados,
                        [meta.id]: e.target.value,
                      })
                    }
                    style={{ marginRight: "8px" }}
                  />
                  <button
                    type="button"
                    onClick={() => atualizarProgressoMeta(meta.id)}
                  >
                    Adicionar
                  </button>

                  <button
                    type="button"
                    className="botao-remover"
                    onClick={() => removerMeta(meta.id)}
                  >
                    Remover Meta
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default Conteudo;
