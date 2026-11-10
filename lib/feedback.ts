export const CONEXAO = ["Mentoria individual", "Palestras e workshops", "Cursos online", "Projetos sociais", "Outros"];
export const AREAS = [
  "Autoconfiança e autoestima",
  "Carreira e vida profissional",
  "Relacionamentos pessoais",
  "Gestão financeira",
  "Saúde e bem-estar emocional",
];
export const INDICACAO = ["Com certeza indicaria", "Talvez indicaria", "Não indicaria"];

export type FeedbackInput = {
  conexao: string;
  areas: string[];
  impacto: number | null;
  indicacao: string;
  ajuda: string;
};

export const EMPTY_FEEDBACK: FeedbackInput = { conexao: "", areas: [], impacto: null, indicacao: "", ajuda: "" };

export function isEmptyFeedback(f: FeedbackInput) {
  return !f.conexao && !f.areas.length && !f.impacto && !f.indicacao && !f.ajuda.trim();
}
