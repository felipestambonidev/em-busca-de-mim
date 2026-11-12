export const CONEXAO = [
  "Mentoria individual",
  "Palestras e workshops",
  "Cursos online",
  "Projetos sociais",
  "Rede Social",
  "Família",
  "Outros",
];
export const AREAS = [
  "Emocional",
  "Espiritual",
  "Conjugal",
  "Filhos",
  "Família",
  "Parentes",
  "Saúde",
  "Financeiro",
  "Profissional",
  "Intelectual",
  "Servir",
  "Social/Networking",
];
export const INDICACAO = ["Com certeza indicaria", "Talvez indicaria", "Não indicaria"];

export type FeedbackInput = {
  conexao: string[];
  areas: string[];
  momento: string;
  impacto: number | null;
  indicacao: string;
  ajuda: string;
};

export const EMPTY_FEEDBACK: FeedbackInput = {
  conexao: [],
  areas: [],
  momento: "",
  impacto: null,
  indicacao: "",
  ajuda: "",
};

export function isEmptyFeedback(f: FeedbackInput) {
  return !f.conexao.length && !f.areas.length && !f.momento.trim() && !f.impacto && !f.indicacao && !f.ajuda.trim();
}
