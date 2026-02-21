export type StrategyStatus =
  | "Da realizzare"
  | "Va bene !"
  | "In attesa/corretta"
  | "Pronta per la presentazione"
  | "Presentata"
  | "In pausa";

export type StrategyType = "Social" | "Sito" | "Custom";

export interface Strategy {
  id: string;
  codice_cliente: string;
  nome_cliente: string;
  tipo_strategia: StrategyType;
  stato_strategia: StrategyStatus;
  importo_strategia: number;
  aggiunta_il: string;
  data_conferma: string | null;
  agente: string;
  nota_custom?: string; // es. "3% della commissione"
}

export function getImporto(tipo: StrategyType, stato: StrategyStatus): number {
  if (stato === "In pausa") return 0;
  if (tipo === "Custom") return 0; // importo a percentuale, non fisso
  return tipo === "Social" ? 300 : 150;
}
