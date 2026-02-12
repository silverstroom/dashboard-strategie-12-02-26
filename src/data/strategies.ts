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
  {
    id: "1",
    codice: "376385",
    nomeCliente: "Davide Muraca (+ LinkedIn)",
    tipo: "Social",
    stato: "Da realizzare",
    importo: 300,
    aggiuntaIl: "11/02/2026",
  },
  {
    id: "2",
    codice: "312167",
    nomeCliente: "Br Termitalia",
    tipo: "Social",
    stato: "Da realizzare",
    importo: 300,
    aggiuntaIl: "11/02/2026",
  },
  {
    id: "3",
    codice: "312163",
    nomeCliente: "Cerra Giuseppe",
    tipo: "Social",
    stato: "Da realizzare",
    importo: 300,
    aggiuntaIl: "11/02/2026",
  },
  {
    id: "4",
    codice: "312167",
    nomeCliente: "Br Termitalia",
    tipo: "Sito",
    stato: "Da realizzare",
    importo: 150,
    aggiuntaIl: "11/02/2026",
  },
  {
    id: "5",
    codice: "312111",
    nomeCliente: "Sgromo Costruzioni SRL",
    tipo: "Sito",
    stato: "Da realizzare",
    importo: 150,
    aggiuntaIl: "11/02/2026",
  },
  {
    id: "6",
    codice: "310001",
    nomeCliente: "Marco Rossi",
    tipo: "Social",
    stato: "Va bene !",
    importo: 300,
    aggiuntaIl: "05/02/2026",
  },
  {
    id: "7",
    codice: "310002",
    nomeCliente: "Studio Legale Bianchi",
    tipo: "Sito",
    stato: "Va bene !",
    importo: 150,
    aggiuntaIl: "05/02/2026",
  },
  {
    id: "8",
    codice: "310003",
    nomeCliente: "Pizzeria Da Luigi",
    tipo: "Social",
    stato: "Presentata",
    importo: 300,
    aggiuntaIl: "01/02/2026",
  },
  {
    id: "9",
    codice: "310004",
    nomeCliente: "Auto Service Roma",
    tipo: "Social",
    stato: "Presentata",
    importo: 300,
    aggiuntaIl: "01/02/2026",
  },
  {
    id: "10",
    codice: "310005",
    nomeCliente: "Beauty Center Stella",
    tipo: "Sito",
    stato: "Presentata",
    importo: 150,
    aggiuntaIl: "28/01/2026",
  },
  {
    id: "11",
    codice: "310006",
    nomeCliente: "Farmacia Centrale",
    tipo: "Social",
    stato: "Pronta per la presentazione",
    importo: 300,
    aggiuntaIl: "03/02/2026",
  },
  {
    id: "12",
    codice: "310007",
    nomeCliente: "Ottica Visione",
    tipo: "Social",
    stato: "In attesa/corretta",
    importo: 300,
    aggiuntaIl: "06/02/2026",
  },
  {
    id: "13",
    codice: "310008",
    nomeCliente: "Ristorante Il Giardino",
    tipo: "Social",
    stato: "In pausa",
    importo: 300,
    aggiuntaIl: "20/01/2026",
  },
  {
    id: "14",
    codice: "310009",
    nomeCliente: "Palestra FitZone",
    tipo: "Sito",
    stato: "Va bene !",
    importo: 150,
    aggiuntaIl: "04/02/2026",
  },
  {
    id: "15",
    codice: "310010",
    nomeCliente: "Hotel Bellavista",
    tipo: "Social",
    stato: "Va bene !",
    importo: 300,
    aggiuntaIl: "02/02/2026",
  },
  {
    id: "16",
    codice: "310011",
    nomeCliente: "Agenzia Viaggi Mondo",
    tipo: "Sito",
    stato: "Va bene !",
    importo: 150,
    aggiuntaIl: "30/01/2026",
  },
];
