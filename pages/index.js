import { useState } from "react";

export default function HomePage() {
  const [form, setForm] = useState({
    nome: "",
    email: "",
    dataCasamentoMes: "",
    cidade: "",
    convidadosFaixa: "50-120",
    estilo: "Clássico",
    orcamentoEstimado: "",
  });

  const [loading, setLoading] = useState(false);
  const [planner, setPlanner] = useState(null);
  const [error, setError] = useState(null);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  // converte a faixa em número aproximado
  function convidadosDaFaixa(faixa) {
    if (faixa === "0-50") return 40;
    if (faixa === "50-120") return 90;
    if (faixa === "120-250") return 180;
    return 280; // 250+
  }

  // converte "2026-05" em "2026-05-15"
  function dataDoMes(mesStr) {
    if (!mesStr) return "";
    return mesStr + "-15";
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setPlanner(null);

    try {
      const payload = {
        nome: form.nome || "Casal",
        email: form.email,
        dataCasamento: dataDoMes(form.dataCasamentoMes),
        cidade: form.cidade,
        convidados: convidadosDaFaixa(form.convidadosFaixa),
        estilo: form.estilo.toLowerCase(),
        orcamentoEstimado: form.orcamentoEstimado
          ? Number(form.orcamentoEstimado)
          : null,
        prioridades: [], // dá pra adicionar depois se quiser
      };

      const resp = await fetch("/api/planejador", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!resp.ok) {
        const data = await resp.json().catch(() => ({}));
        throw new Error(data.error || "Erro ao gerar planejamento");
      }

      const data = await resp.json();
      setPlanner(data);
      // rolar até a seção do resultado
      const el = document.getElementById("resultado");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    } catch (err) {
      console.error(err);
      setError(err.message || "Erro inesperado. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page">
      <div className="container">
        {/* Topbar simples */}
        <div className="topbar">
          <div className="logo">
            <div className="logo-mark">W</div>
            <span>Wedy</span>
          </div>
          <div className="top-links">
            <span>Para seu casamento</span>
            <span>Dicas &amp; guias</span>
            <span className="top-link-cta">Entrar</span>
          </div>
        </div>

        {/* HERO */}
        <section className="hero">
          <div>
            <div className="hero-eyebrow">Criado pela Wedy</div>
            <h1 className="hero-title">
              Planeje seu casamento em um toque de mágica ✨
            </h1>
            <p className="hero-subtitle">
              Responda algumas perguntinhas, receba um plano personalizado com
              checklist e linha do tempo e organize tudo no nosso planner de
              casamento no Notion — 100% grátis.
            </p>
            <div className="hero-actions">
              <a href="#form">
                <button className="btn-primary" type="button">
                  Começar meu plano grátis
                </button>
              </a>
              <span className="hero-helper">Leva menos de 2 minutos.</span>
            </div>
            <div className="hero-badges">
              <div className="badge-soft">💜 Escolhido por +700 mil casais</div>
              <div className="badge-soft">
                📅 Perfeito pra quem ficou noiva em janeiro
              </div>
              <div className="badge-soft">
                🧩 Planner inteligente + template Notion
              </div>
            </div>
          </div>
          <div className="hero-visual" aria-hidden="true">
            <div className="hero-card">
              <div className="hero-card-header">Exemplo de plano</div>
              <div className="hero-card-title">
                Plano de casamento para Ana &amp; Bruno
              </div>
              <div className="hero-card-meta">
                Casamento em São Paulo • 120 convidados • estilo clássico
                moderno
              </div>
              <div className="hero-card-pill">14 meses até o grande dia</div>

              <div className="hero-card-section-title">Próximas ações</div>
              <ul className="hero-card-list">
                <li>
                  <span></span>
                  <div>Definir orçamento base e quem contribui.</div>
                </li>
                <li>
                  <span></span>
                  <div>
                    Selecionar 3 espaços para visitar nas próximas 2 semanas.
                  </div>
                </li>
                <li>
                  <span></span>
                  <div>
                    Começar lista de convidados e prioridades do casal.
                  </div>
                </li>
              </ul>

              <div className="hero-card-section-title">Noção de orçamento</div>
              <ul className="hero-card-list">
                <li>
                  <span></span>
                  <div>Buffet ~40% • Espaço ~20% • Decoração ~15%</div>
                </li>
              </ul>
            </div>

            <div className="hero-floating-pill">
              🧠 Plano gerado automaticamente para o seu casamento
            </div>
            <div className="hero-floating-planner">
              <strong>Planner Notion de Casamento</strong>
              <div>
                Checklist, orçamento, fornecedores e convidados em um único
                lugar para acompanhar tudo ao longo dos meses.
              </div>
            </div>
          </div>
        </section>

        {/* COMO FUNCIONA */}
        <section className="section">
          <h2 className="section-title">Como funciona</h2>
          <p className="section-subtitle">
            Em poucos minutos você sai do “não sei por onde começar” para um
            plano claro do seu casamento — com tudo organizado em um planner
            completo.
          </p>
          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">1</div>
              <div className="step-title">Responda 7 perguntinhas</div>
              <p className="step-text">
                Conte quando pretende casar, onde, quantos convidados e o que é
                mais importante para vocês.
              </p>
            </div>
            <div className="step-card">
              <div className="step-number">2</div>
              <div className="step-title">Receba um plano personalizado</div>
              <p className="step-text">
                Nosso planejador inteligente monta sua linha do tempo, checklist
                e distribuição de orçamento de acordo com o seu perfil.
              </p>
            </div>
            <div className="step-card">
              <div className="step-number">3</div>
              <div className="step-title">Organize tudo no Notion</div>
              <p className="step-text">
                Você ganha acesso ao planner oficial de casamento da Wedy no
                Notion para acompanhar tarefas, fornecedores e inspirações.
              </p>
            </div>
          </div>
        </section>

        {/* O QUE VOCÊ RECEBE */}
        <section className="section">
          <h2 className="section-title">O que você vai receber</h2>
          <p className="section-subtitle">
            Dois presentes em um: um plano inteligente para guiar decisões
            importantes e um espaço organizado para colocar tudo em prática.
          </p>

          <div className="benefits-grid">
            <div className="benefit-card">
              <div className="benefit-title">Plano de casamento personalizado</div>
              <ul className="benefit-list">
                <li>✔ Linha do tempo até o grande dia</li>
                <li>✔ Checklist com prioridades por etapa</li>
                <li>✔ Estimativa de orçamento por categoria</li>
                <li>✔ Próximas ações práticas para começar hoje</li>
              </ul>
            </div>
            <div className="benefit-card">
              <div className="benefit-title">
                Planner completo de casamento no Notion
              </div>
              <ul className="benefit-list">
                <li>✔ Dashboard com visão geral do casamento</li>
                <li>
                  ✔ Tarefas por etapa: noivado, pré, semana e pós-casamento
                </li>
                <li>✔ Controle de orçamento, fornecedores e convidados</li>
                <li>✔ Espaço para inspirações, links e anotações</li>
              </ul>
            </div>
          </div>
        </section>

        {/* POR QUE JANEIRO */}
        <section className="section">
          <h2 className="section-title">Por que começar em janeiro?</h2>
          <p className="section-subtitle">
            Janeiro é o mês oficial dos noivados — e o melhor momento para
            transformar empolgação em um plano realista e sem surto.
          </p>
          <div className="benefit-card">
            <ul className="why-list">
              <li className="why-item">
                <div className="why-emoji">🌱</div>
                <div>
                  <strong>
                    Muitos pedidos acontecem entre Natal e Ano Novo.
                  </strong>
                  <br />
                  Começar a se organizar em janeiro garante mais datas e
                  fornecedores disponíveis.
                </div>
              </li>
              <li className="why-item">
                <div className="why-emoji">⏰</div>
                <div>
                  <strong>Menos correria, mais escolhas conscientes.</strong>
                  <br />
                  Ter uma linha do tempo clara evita decisões na pressa e
                  arrependimentos depois.
                </div>
              </li>
              <li className="why-item">
                <div className="why-emoji">😌</div>
                <div>
                  <strong>Ansiedade diminui quando existe um plano.</strong>
                  <br />
                  Em vez de mil abas abertas, você tem um caminho pensado para o
                  seu tipo de casamento.
                </div>
              </li>
            </ul>
          </div>
        </section>

        {/* PROVA SOCIAL */}
        <section className="section">
          <h2 className="section-title">
            Criado pela Wedy, escolhida por mais de 700 mil casais 💜
          </h2>
          <p className="section-subtitle">
            A Wedy ajuda casais a organizarem o casamento do Save the Date ao
            último presente recebido. Esse planner foi criado a partir da
            experiência de milhares de casamentos reais, para que você viva esse
            momento com mais leveza.
          </p>
        </section>

        {/* CTA FINAL + FORM + RESULTADO */}
        <section className="section" id="form">
          <div className="cta-final">
            <h2>Comece o planejamento do seu casamento hoje</h2>
            <p>
              Em poucos minutos você tem um plano claro, um planner completo e
              um peso a menos na cabeça.
            </p>

            <div className="form-wrapper">
              <form onSubmit={handleSubmit}>
                <div className="form-grid">
                  <div className="form-field">
                    <label htmlFor="nome">Nome do casal</label>
                    <input
                      id="nome"
                      name="nome"
                      placeholder="Ex: Ana e Bruno"
                      value={form.nome}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-field">
                    <label htmlFor="email">E-mail</label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="seu@email.com"
                      value={form.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-field">
                    <label htmlFor="dataCasamentoMes">
                      Quando pretende casar?
                    </label>
                    <input
                      id="dataCasamentoMes"
                      name="dataCasamentoMes"
                      type="month"
                      value={form.dataCasamentoMes}
                      onChange={handleChange}
                      required
                    />
                    <span>Pode ser uma ideia aproximada :)</span>
                  </div>
                  <div className="form-field">
                    <label htmlFor="cidade">Cidade do casamento</label>
                    <input
                      id="cidade"
                      name="cidade"
                      placeholder="Ex: São Paulo, Florianópolis..."
                      value={form.cidade}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-field">
                    <label htmlFor="convidadosFaixa">
                      Número de convidados (aprox.)
                    </label>
                    <select
                      id="convidadosFaixa"
                      name="convidadosFaixa"
                      value={form.convidadosFaixa}
                      onChange={handleChange}
                    >
                      <option value="0-50">Até 50</option>
                      <option value="50-120">50 a 120</option>
                      <option value="120-250">120 a 250</option>
                      <option value="250+">250+</option>
                    </select>
                  </div>
                  <div className="form-field">
                    <label htmlFor="estilo">Estilo do casamento</label>
                    <select
                      id="estilo"
                      name="estilo"
                      value={form.estilo}
                      onChange={handleChange}
                    >
                      <option>Clássico</option>
                      <option>Rústico / Campo</option>
                      <option>Praia</option>
                      <option>Boho</option>
                      <option>Minimalista</option>
                      <option>Não sei ainda</option>
                    </select>
                  </div>
                  <div className="form-field">
                    <label htmlFor="orcamentoEstimado">
                      Orçamento estimado (R$) <span>(opcional)</span>
                    </label>
                    <input
                      id="orcamentoEstimado"
                      name="orcamentoEstimado"
                      type="number"
                      min="0"
                      placeholder="Ex: 50000"
                      value={form.orcamentoEstimado}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                {error && (
                  <div
                    style={{
                      marginTop: 12,
                      fontSize: 13,
                      color: "#b91c1c",
                      textAlign: "left",
                    }}
                  >
                    {error}
                  </div>
                )}

                <div className="form-footer">
                  <button className="btn-primary" type="submit" disabled={loading}>
                    {loading
                      ? "Gerando seu plano..."
                      : "Gerar meu plano personalizado"}
                  </button>
                  <small>
                    Ao continuar, você concorda em receber o plano por e-mail e
                    comunicações da Wedy. Você pode se descadastrar quando
                    quiser.
                  </small>
                </div>
              </form>
            </div>
          </div>

          {/* RESULTADO */}
          <div id="resultado" style={{ marginTop: planner ? 32 : 0 }}>
            {planner && (
              <div className="result-section">
                <h2 className="section-title">Seu plano de casamento</h2>
                <p className="section-subtitle">
                  Este plano foi gerado com base nas informações que você
                  compartilhou. Use como guia e adapte à sua realidade.
                </p>

                <div className="result-meta">
                  <p>
                    Para: <strong>{planner.meta.nome}</strong>{" "}
                    {planner.meta.cidade && (
                      <>
                        • Cidade: <strong>{planner.meta.cidade}</strong>{" "}
                      </>
                    )}
                  </p>
                  <p>
                    Faltam aproximadamente{" "}
                    <strong>{planner.meta.mesesAteCasamento} meses</strong> para
                    o casamento ({planner.meta.tamanhoCasamento}). Estilo
                    escolhido: <strong>{planner.meta.estilo}</strong>.
                  </p>
                </div>

                <h3>Linha do tempo</h3>
                {planner.linhaDoTempo.map((fase) => (
                  <div key={fase.fase} className="result-block">
                    <strong>{fase.fase}</strong>
                    <p>{fase.descricao}</p>
                  </div>
                ))}

                <h3>Checklist por fase</h3>
                {planner.checklist.map((fase) => (
                  <div key={fase.fase} className="result-block">
                    <strong>{fase.fase}</strong>
                    <ul>
                      {fase.tarefas.map((tarefa, idx) => (
                        <li key={idx}>{tarefa}</li>
                      ))}
                    </ul>
                  </div>
                ))}

                <h3>Orçamento sugerido</h3>
                <p>
                  Orçamento total:{" "}
                  {planner.orcamento.orcamentoTotal
                    ? `R$ ${planner.orcamento.orcamentoTotal.toLocaleString(
                        "pt-BR"
                      )}`
                    : "não informado"}{" "}
                  ({planner.orcamento.nivelOrcamento})
                </p>
                <ul>
                  {planner.orcamento.categorias.map((cat) => (
                    <li key={cat.categoria}>
                      {cat.categoria}: {cat.percentual}%{" "}
                      {cat.valorEstimado &&
                        `(~ R$ ${cat.valorEstimado.toLocaleString("pt-BR")})`}
                    </li>
                  ))}
                </ul>

                <h3>Próximas ações imediatas</h3>
                <ul>
                  {planner.proximasAcoes.map((acao, idx) => (
                    <li key={idx}>{acao}</li>
                  ))}
                </ul>

                <h3>Tags para inspirações &amp; moodboard</h3>
                <div className="result-tags">
                  {planner.moodboardTags.map((tag) => (
                    <span key={tag} className="badge-soft">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="result-notion-hint">
                  💡 Dica: depois de ver seu plano, você pode organizar tudo no
                  nosso planner de casamento no Notion. (Aqui entra o link pro
                  template.)
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
