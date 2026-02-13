import { useState, useEffect } from "react";
import { Strategy, StrategyStatus, StrategyType, getImporto } from "@/data/strategies";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const allStati: StrategyStatus[] = [
  "In pausa",
  "Da realizzare",
  "In attesa/corretta",
  "Pronta per la presentazione",
  "Presentata",
  "Va bene !",
];

const allTipi: StrategyType[] = ["Social", "Sito"];

interface StrategyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  strategy: Strategy | null;
  onSave: (strategy: Strategy) => void;
  onDelete: (id: string) => void;
  strategies: Strategy[];
}

const formatDateInput = (dateStr: string) => {
  // YYYY-MM-DD
  return dateStr;
};

const formatDateDisplay = (dateStr: string) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString("it-IT", { day: "2-digit", month: "2-digit", year: "numeric" });
};

const StrategyModal = ({ open, onOpenChange, strategy, onSave, onDelete, strategies }: StrategyModalProps) => {
  const isEdit = !!strategy;

  const [codice, setCodice] = useState("");
  const [tipo, setTipo] = useState<StrategyType>("Social");
  const [nome, setNome] = useState("");
  const [stato, setStato] = useState<StrategyStatus>("Da realizzare");
  const [aggiuntaIl, setAggiuntaIl] = useState(new Date().toISOString().split("T")[0]);
  const [dataConferma, setDataConferma] = useState<string | null>(null);
  const [prevStato, setPrevStato] = useState<StrategyStatus>("Da realizzare");
  const [agente, setAgente] = useState("");

  useEffect(() => {
    if (strategy) {
      setCodice(strategy.codice_cliente);
      setTipo(strategy.tipo_strategia);
      setNome(strategy.nome_cliente);
      setStato(strategy.stato_strategia);
      setAggiuntaIl(strategy.aggiunta_il);
      setDataConferma(strategy.data_conferma);
      setPrevStato(strategy.stato_strategia);
      setAgente(strategy.agente || "");
    } else {
      setCodice("");
      setTipo("Social");
      setNome("");
      setStato("Da realizzare");
      setAggiuntaIl(new Date().toISOString().split("T")[0]);
      setDataConferma(null);
      setPrevStato("Da realizzare");
      setAgente("");
    }
  }, [strategy, open]);

  const importo = getImporto(tipo, stato);

  const handleStatoChange = (newStato: StrategyStatus) => {
    if (newStato === "Va bene !" && prevStato !== "Va bene !") {
      setDataConferma(new Date().toISOString().split("T")[0]);
    } else if (newStato !== "Va bene !" && stato === "Va bene !") {
      setDataConferma(null);
    }
    setPrevStato(stato);
    setStato(newStato);
  };

  const handleVaBene = () => {
    handleStatoChange("Va bene !");
  };

  const handleSave = () => {
    const id = strategy?.id || String(Date.now());
    onSave({
      id,
      codice_cliente: codice,
      nome_cliente: nome,
      tipo_strategia: tipo,
      stato_strategia: stato,
      importo_strategia: importo,
      aggiunta_il: aggiuntaIl,
      data_conferma: dataConferma,
      agente,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Modifica Strategia" : "Nuova Strategia"}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="codice">Codice cliente</Label>
            <Input id="codice" value={codice} onChange={(e) => setCodice(e.target.value)} className="font-mono" />
          </div>
          <div className="grid gap-2">
            <Label>Tipo strategia</Label>
            <Select value={tipo} onValueChange={(v) => setTipo(v as StrategyType)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {allTipi.map((t) => (
                  <SelectItem key={t} value={t}>{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="nome">Nome cliente</Label>
            <Input id="nome" value={nome} onChange={(e) => setNome(e.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label>Stato strategia</Label>
            <Select value={stato} onValueChange={(v) => handleStatoChange(v as StrategyStatus)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {allStati.map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label>Importo (auto)</Label>
            <Input value={`€${importo}`} readOnly className="font-mono bg-muted/30" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="agente">Agente</Label>
            <Input id="agente" value={agente} onChange={(e) => setAgente(e.target.value)} placeholder="Nome agente" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="data">Aggiunta il</Label>
            <Input id="data" type="date" value={aggiuntaIl} onChange={(e) => setAggiuntaIl(e.target.value)} />
          </div>
          {dataConferma && (
            <p className="text-sm text-muted-foreground">
              Confermata il: <span className="font-medium">{formatDateDisplay(dataConferma)}</span>
            </p>
          )}
        </div>
        <DialogFooter className="flex-col sm:flex-row gap-2">
          <div className="flex gap-2 w-full sm:w-auto">
            {isEdit && (
              <Button variant="destructive" onClick={() => onDelete(strategy!.id)} className="flex-1 sm:flex-none">
                Elimina
              </Button>
            )}
          </div>
          <div className="flex gap-2 ml-auto">
            <Button variant="outline" onClick={handleVaBene} className="gap-1">
              ✅ Va bene !
            </Button>
            <Button variant="ghost" onClick={() => onOpenChange(false)}>Annulla</Button>
            <Button onClick={handleSave}>Salva</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default StrategyModal;
