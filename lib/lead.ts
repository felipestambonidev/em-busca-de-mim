export const INTERESTS = ["Identidade", "Fé", "Família", "Relacionamentos", "Carreira", "Negócios", "Propósito"] as const;

export type LeadInput = {
  nome: string;
  email: string;
  whatsapp: string;
  interesses: string[];
  consentimento: boolean;
};

export type FieldErrors = Partial<Record<keyof LeadInput, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const onlyDigits = (v: string) => v.replace(/\D/g, "");

/** Formata no padrão brasileiro: (11) 91234-5678 */
export function formatPhone(value: string) {
  const d = onlyDigits(value).slice(0, 11);
  if (d.length <= 2) return d.length ? `(${d}` : "";
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

export function validateField(field: keyof LeadInput, data: LeadInput): string | undefined {
  switch (field) {
    case "nome":
      return data.nome.trim().length < 2 ? "Como podemos te chamar?" : undefined;
    case "email":
      if (!data.email.trim()) return "Informe seu e-mail.";
      return EMAIL_RE.test(data.email.trim()) ? undefined : "Confira o e-mail — parece faltar algo.";
    case "whatsapp": {
      const n = onlyDigits(data.whatsapp).length;
      if (!n) return "Informe seu WhatsApp com DDD.";
      return n === 10 || n === 11 ? undefined : "Use o formato (DDD) 91234-5678.";
    }
    case "consentimento":
      return data.consentimento ? undefined : "Precisamos da sua autorização para entrar em contato.";
    default:
      return undefined;
  }
}

export function validateLead(data: LeadInput): FieldErrors {
  const errors: FieldErrors = {};
  (["nome", "email", "whatsapp", "consentimento"] as const).forEach((f) => {
    const e = validateField(f, data);
    if (e) errors[f] = e;
  });
  return errors;
}
