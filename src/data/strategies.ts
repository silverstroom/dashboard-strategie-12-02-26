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
  codice: string;
  nomeCliente: string;
  tipo: StrategyType;
  stato: StrategyStatus;
  importo: number;
  aggiuntaIl: string;
}

export const strategies: Strategy[] = [
  // === SOCIAL (SOC-STR) - €300 ===
  {
    id: "1",
    codice: "445076",
    nomeCliente: "Universo SRL",
    tipo: "Social",
    stato: "In pausa",
    importo: 300,
    aggiuntaIl: "11/02/2026",
  },
  {
    id: "2",
    codice: "376385",
    nomeCliente: "Davide Muraca (+ LinkedIn)",
    tipo: "Social",
    stato: "Da realizzare",
    importo: 300,
    aggiuntaIl: "11/02/2026",
  },
  {
    id: "3",
    codice: "312167",
    nomeCliente: "Br Termitalia",
    tipo: "Social",
    stato: "Da realizzare",
    importo: 300,
    aggiuntaIl: "11/02/2026",
  },
  {
    id: "4",
    codice: "312163",
    nomeCliente: "Cerra Giuseppe",
    tipo: "Social",
    stato: "Da realizzare",
    importo: 300,
    aggiuntaIl: "11/02/2026",
  },
  {
    id: "5",
    codice: "316608",
    nomeCliente: "Grecoplast",
    tipo: "Social",
    stato: "In attesa/corretta",
    importo: 300,
    aggiuntaIl: "11/02/2026",
  },
  {
    id: "6",
    codice: "443241",
    nomeCliente: "Sorrento Giardini SNC di Mauro Angelo",
    tipo: "Social",
    stato: "Va bene !",
    importo: 300,
    aggiuntaIl: "11/02/2026",
  },
  {
    id: "7",
    codice: "367444",
    nomeCliente: "Olearia Lametina Vescio",
    tipo: "Social",
    stato: "Pronta per la presentazione",
    importo: 300,
    aggiuntaIl: "11/02/2026",
  },
  {
    id: "8",
    codice: "411584",
    nomeCliente: "Mario Moniaci",
    tipo: "Social",
    stato: "Va bene !",
    importo: 300,
    aggiuntaIl: "11/02/2026",
  },
  {
    id: "9",
    codice: "376382",
    nomeCliente: "Fotovoltaica SRL",
    tipo: "Social",
    stato: "Va bene !",
    importo: 300,
    aggiuntaIl: "11/02/2026",
  },
  {
    id: "10",
    codice: "427357",
    nomeCliente: "U Fhalignami",
    tipo: "Social",
    stato: "Va bene !",
    importo: 300,
    aggiuntaIl: "11/02/2026",
  },

  // === SITO (SI2-STR) - €150 ===
  {
    id: "11",
    codice: "312167",
    nomeCliente: "Br Termitalia",
    tipo: "Sito",
    stato: "Da realizzare",
    importo: 150,
    aggiuntaIl: "11/02/2026",
  },
  {
    id: "12",
    codice: "312111",
    nomeCliente: "Sgromo Costruzioni SRL",
    tipo: "Sito",
    stato: "Da realizzare",
    importo: 150,
    aggiuntaIl: "11/02/2026",
  },
  {
    id: "13",
    codice: "443233",
    nomeCliente: "Eurocar - Napoli Filomena",
    tipo: "Sito",
    stato: "Pronta per la presentazione",
    importo: 150,
    aggiuntaIl: "11/02/2026",
  },
  {
    id: "14",
    codice: "443241",
    nomeCliente: "Sorrento Giardini SNC di Mauro Angelo",
    tipo: "Sito",
    stato: "Va bene !",
    importo: 150,
    aggiuntaIl: "11/02/2026",
  },
  {
    id: "15",
    codice: "445083",
    nomeCliente: "Muvy Rent",
    tipo: "Sito",
    stato: "Pronta per la presentazione",
    importo: 150,
    aggiuntaIl: "11/02/2026",
  },
  {
    id: "16",
    codice: "430181",
    nomeCliente: "Profiltek SRL",
    tipo: "Sito",
    stato: "Va bene !",
    importo: 150,
    aggiuntaIl: "11/02/2026",
  },
];
