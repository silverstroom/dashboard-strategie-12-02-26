export type StrategyStatus =
  | "Da realizzare"
  | "Va bene !"
  | "In attesa/corretta"
  | "Pronta per la presentazione"
  | "Presentata"
  | "In pausa";

export type StrategyType = "Social" | "Sito";

export interface Strategy {
  id: string;
  codice_cliente: string;
  nome_cliente: string;
  tipo_strategia: StrategyType;
  stato_strategia: StrategyStatus;
  importo_strategia: number;
  aggiunta_il: string;
  data_conferma: string | null;
}

export const initialStrategies: Strategy[] = [
  { id: "1", codice_cliente: "444944", nome_cliente: "BLU SUD Impresa Sociale SRL", stato_strategia: "In pausa", importo_strategia: 0, aggiunta_il: "2026-02-11", tipo_strategia: "Social", data_conferma: null },
  { id: "2", codice_cliente: "376385", nome_cliente: "Davide Muraca (+ LinkedIn)", stato_strategia: "Da realizzare", importo_strategia: 300, aggiunta_il: "2026-02-11", tipo_strategia: "Social", data_conferma: null },
  { id: "3", codice_cliente: "312167", nome_cliente: "Br Termitalia", stato_strategia: "Da realizzare", importo_strategia: 300, aggiunta_il: "2026-02-11", tipo_strategia: "Social", data_conferma: null },
  { id: "4", codice_cliente: "312163", nome_cliente: "Cerra Giuseppe", stato_strategia: "Da realizzare", importo_strategia: 300, aggiunta_il: "2026-02-11", tipo_strategia: "Social", data_conferma: null },
  { id: "5", codice_cliente: "316608", nome_cliente: "Grecoplast", stato_strategia: "In attesa/corretta", importo_strategia: 300, aggiunta_il: "2026-02-11", tipo_strategia: "Social", data_conferma: null },
  { id: "6", codice_cliente: "443241", nome_cliente: "Sorrento Giardini SNC di Mauro Angelo", stato_strategia: "Va bene !", importo_strategia: 300, aggiunta_il: "2026-02-11", tipo_strategia: "Social", data_conferma: null },
  { id: "7", codice_cliente: "367444", nome_cliente: "Olearia Lametina Vescio", stato_strategia: "Va bene !", importo_strategia: 300, aggiunta_il: "2026-02-11", tipo_strategia: "Social", data_conferma: "2026-02-11" },
  { id: "8", codice_cliente: "411584", nome_cliente: "Mario Moniaci", stato_strategia: "Va bene !", importo_strategia: 300, aggiunta_il: "2026-02-11", tipo_strategia: "Social", data_conferma: null },
  { id: "9", codice_cliente: "376382", nome_cliente: "Fotovoltaica SRL", stato_strategia: "Va bene !", importo_strategia: 300, aggiunta_il: "2026-02-11", tipo_strategia: "Social", data_conferma: null },
  { id: "10", codice_cliente: "427357", nome_cliente: "U Fhalignami", stato_strategia: "Va bene !", importo_strategia: 300, aggiunta_il: "2026-02-11", tipo_strategia: "Social", data_conferma: null },
  { id: "11", codice_cliente: "312167", nome_cliente: "Br Termitalia", stato_strategia: "Da realizzare", importo_strategia: 150, aggiunta_il: "2026-02-11", tipo_strategia: "Sito", data_conferma: null },
  { id: "12", codice_cliente: "312111", nome_cliente: "Sgromo Costruzioni SRL", stato_strategia: "Da realizzare", importo_strategia: 150, aggiunta_il: "2026-02-11", tipo_strategia: "Sito", data_conferma: null },
  { id: "13", codice_cliente: "316852", nome_cliente: "Studio Legale Fucile", stato_strategia: "Pronta per la presentazione", importo_strategia: 150, aggiunta_il: "2026-02-11", tipo_strategia: "Sito", data_conferma: null },
  { id: "14", codice_cliente: "443241", nome_cliente: "Sorrento Giardini SNC di Mauro Angelo", stato_strategia: "Va bene !", importo_strategia: 150, aggiunta_il: "2026-02-11", tipo_strategia: "Sito", data_conferma: null },
  { id: "15", codice_cliente: "419863", nome_cliente: "Park Hotel Leonardo", stato_strategia: "Pronta per la presentazione", importo_strategia: 150, aggiunta_il: "2026-02-11", tipo_strategia: "Sito", data_conferma: null },
  { id: "16", codice_cliente: "321625", nome_cliente: "Profiltek srl", stato_strategia: "Va bene !", importo_strategia: 150, aggiunta_il: "2026-02-11", tipo_strategia: "Sito", data_conferma: null },
];

export function getImporto(tipo: StrategyType, stato: StrategyStatus): number {
  if (stato === "In pausa") return 0;
  return tipo === "Social" ? 300 : 150;
}
