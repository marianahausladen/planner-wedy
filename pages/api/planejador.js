// pages/api/planejador.js

function mesesAteCasamento(dataStr) {
  const hoje = new Date();
  const data = new Date(dataStr + "T00:00:00");

  let anos = data.getFullYear() - hoje.getFullYear();
  let meses = data.getMonth() - hoje.getMonth() + anos * 12;

  if (data.getDate() < hoje.getDate()) {
    meses -= 1;
  }
  return Math.max(meses, 0);
}

function classificarTamanho(convidados) {
  if (convidados <= 60) return "mini wedding";
  if (convidados <= 150) return "casamento médio";
  return "casamento grande";
}

function faixaOrcamentoLabel(orcamento) {
  if (orcamento == null) return "não informado";
  if (orcamento < 30000) return "mais enxuto";
  if (orcamento <= 80000) return "intermediário";
  return "alto investimento";
}

function distribuicaoOrcamento(orcamento) {
  const percentuais = {
    buffet: 0.4,
    espaco: 0.2,
    decoracao: 0.15,
    foto_video: 0.1,
    musica_cerimonia_festa: 0.07,
    traje_beleza: 0.04,
    papelaria_site_convites: 0.02,
    outros: 0.02,
  };

  const categorias = Object.entries(percentuais).map(([nome, pct]) => ({
    categoria: nome,
    percentual: Math.round(pct * 100),
    valorEstimado: orcamento != null ? Math.round(orcamento * pct) : null,
  }));

  return {
    orcamentoTotal: orcamento,
    nivelOrcamento: faixaOrcamentoLabel(orcamento),
    categorias,
  };
}

function definirFasesTempo(meses) {
  let faseInicio;
  if (meses >= 18) faseInicio = "18+ meses até o casamento";
  else if (meses >= 12) faseInicio = "12 a 18 meses até o casamento";
  else if (meses >= 9) faseInicio = "9 a 12 meses até o casamento";
  else if (meses >= 6) faseInicio = "6 a 9 meses até o casamento";
  else if (meses >= 3) faseInicio = "3 a 6 meses até o casamento";
  else if (meses >= 1) faseInicio = "1 a 3 meses até o casamento";
  else faseInicio = "menos de 1 mês até o casamento";

  return [
    {
      fase: "Agora",
      descricao: `Situação atual: ${faseInicio}. Vamos organizar os próximos passos críticos.`,
    },
    {
      fase: "Pré-casamento",
      descricao:
        "Contratações, ajustes finos e confirmações com fornecedores.",
    },
    {
      fase: "Semana do casamento",
      descricao:
        "Check final, alinhamento com fornecedores e ensaio (se houver).",
    },
    {
      fase: "Dia do casamento",
      descricao:
        "Tudo pronto: foco em curtir o dia com tranquilidade.",
    },
  ];
}

function checklistPorFase(meses, tamanho, prioridades = []) {
  const baseAgora = [
    "Definir data aproximada ou janela de meses para o casamento",
    "Conversar sobre orçamento total e quem vai contribuir",
    "Definir estilo do casamento (clássico, rústico, praia, etc.)",
    "Montar lista preliminar de convidados",
    "Criar uma conta em uma plataforma para centralizar o planejamento",
  ];

  const basePre = [
    "Pesquisar e visitar possíveis espaços de casamento",
    "Solicitar orçamentos de buffet e bebidas",
    "Pesquisar foto e vídeo com portfólio alinhado ao estilo",
    "Definir celebrante (religioso, civil ou simbólico)",
    "Começar a pesquisar decoração e flores",
  ];

  if (tamanho === "mini wedding") {
    basePre.push(
      "Avaliar a possibilidade de menus personalizados para poucos convidados"
    );
  } else if (tamanho === "casamento grande") {
    basePre.push(
      "Planejar logística de transporte/hospedagem para convidados de fora"
    );
  }

  const prioridadesLower = prioridades.map((p) => p.toLowerCase());

  if (
    prioridadesLower.some(
      (p) => p.includes("buffet") || p.includes("comida")
    )
  ) {
    basePre.push(
      "Agendar degustações com os 2–3 buffets preferidos o quanto antes"
    );
  }
  if (
    prioridadesLower.some(
      (p) =>
        p.includes("foto") ||
        p.includes("vídeo") ||
        p.includes("video")
    )
  ) {
    basePre.push(
      "Reservar fotógrafo e videomaker o quanto antes (profissionais bons esgotam rápido)"
    );
  }
  if (
    prioridadesLower.some(
      (p) =>
        p.includes("decor") ||
        p.includes("decoração") ||
        p.includes("decoracao")
    )
  ) {
    basePre.push(
      "Montar pasta de referências de decoração (Pinterest, Instagram, etc.)"
    );
  }

  const semana = [
    "Reconfirmar todos os horários com fornecedores",
    "Enviar cronograma do dia para fornecedores e padrinhos",
    "Conferir roupas, alianças e documentos",
    "Alinhar com cerimonial/assessoria os detalhes finais",
  ];

  const dia = [
    "Separar um kit SOS (remédios simples, costura, itens de higiene)",
    "Definir quem será o ponto de contato com fornecedores (para não acionarem vocês)",
    "Hidratar-se e comer bem pela manhã",
    "Respirar fundo e aproveitar o momento",
  ];

  if (meses <= 3) {
    baseAgora.push(
      "Priorizar contratações essenciais (espaço, buffet, foto/vídeo) esta semana"
    );
    basePre.push(
      "Considerar opções de fornecedores com boa disponibilidade em prazos curtos"
    );
  }

  return [
    { fase: "Agora", tarefas: baseAgora },
    { fase: "Pré-casamento", tarefas: basePre },
    { fase: "Semana do casamento", tarefas: semana },
    { fase: "Dia do casamento", tarefas: dia },
  ];
}

function proximasAcoes(cidade, meses, prioridades = []) {
  const acoes = [];

  if (meses >= 9) {
    acoes.push("Fechar data e espaço principal nas próximas 2 semanas.");
  } else if (meses >= 3) {
    acoes.push(
      "Listar e contatar imediatamente 3 espaços disponíveis na sua data."
    );
  } else {
    acoes.push(
      "Buscar espaços com experiência em casamentos organizados em curto prazo."
    );
  }

  if (prioridades.length > 0) {
    acoes.push(
      `Listar 3 fornecedores para cada prioridade principal: ${prioridades.join(
        ", "
      )}.`
    );
  }

  acoes.push(
    "Criar um documento ou planner online compartilhado com seu par."
  );
  if (cidade) {
    acoes.push(
      `Montar uma lista de 10–20 referências de casamento inspiradas em casamentos na região de ${cidade}.`
    );
  }

  return acoes;
}

function tagsMoodboard(estilo) {
  const e = (estilo || "").toLowerCase();
  const tags = ["casamento", "inspiração casamento", "wedding inspo"];

  if (e.includes("rústic") || e.includes("rustic")) {
    tags.push("rustic wedding", "casamento rústico", "greenery");
  } else if (e.includes("praia") || e.includes("beach")) {
    tags.push("beach wedding", "casamento na praia", "sunset");
  } else if (e.includes("clássic") || e.includes("classic")) {
    tags.push("classic wedding", "white flowers", "black tie");
  } else if (e.includes("boho")) {
    tags.push("boho wedding", "macrame", "earth tones");
  } else if (e.includes("industrial")) {
    tags.push("industrial wedding", "city wedding", "minimal decor");
  } else if (e) {
    tags.push(e);
  }

  return tags;
}

export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  try {
    const {
      nome = "Casal",
      email,
      dataCasamento,
      cidade = "",
      convidados = 0,
      estilo = "clássico",
      orcamentoEstimado = null,
      prioridades = [],
    } = req.body || {};

    if (!email || !dataCasamento) {
      return res
        .status(400)
        .json({ error: "Email e data do casamento são obrigatórios" });
    }

    const meses = mesesAteCasamento(dataCasamento);
    const tamanho = classificarTamanho(convidados);
    const linhaDoTempo = definirFasesTempo(meses);
    const checklist = checklistPorFase(meses, tamanho, prioridades);
    const orcamento = distribuicaoOrcamento(orcamentoEstimado);
    const acoes = proximasAcoes(cidade, meses, prioridades);
    const tags = tagsMoodboard(estilo);

    const planner = {
      meta: {
        geradoEm: new Date().toISOString().slice(0, 10),
        nome,
        cidade,
        tamanhoCasamento: tamanho,
        mesesAteCasamento: meses,
        estilo,
      },
      linhaDoTempo,
      checklist,
      orcamento,
      proximasAcoes: acoes,
      moodboardTags: tags,
    };

    // Aqui no futuro você pode:
    // - enviar pro Intercom
    // - salvar em um banco
    // - mandar email, etc.

    return res.status(200).json(planner);
  } catch (e) {
    console.error(e);
    return res
      .status(500)
      .json({ error: "Erro interno ao gerar planejador" });
  }
}
