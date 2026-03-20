import { useState, useEffect, useMemo, useRef } from "react";
import { Strategy, StrategyStatus, StrategyType, getImporto } from "@/data/strategies";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { Star, Archive, User, FileText, Settings, StickyNote } from "lucide-react";

const allStati: StrategyStatus[] = [
  "In pausa",
  "Da realizzare",
  "In attesa/corretta",
  "Pronta per la presentazione",
  "Presentata",
  "Va bene !",
];

const allTipi: StrategyType[] = ["Social", "Sito", "Custom"];

interface StrategyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  strategy: Strategy | null;
  onSave: (strategy: Strategy) => void;
  onDelete: (id: string) => void;
  strategies: Strategy[];
}

const formatDateDisplay = (dateStr: string) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString("it-IT", { day: "2-digit", month: "2-digit", year: "numeric" });
};

const AgentAutocomplete = ({ value, onChange, strategies }: { value: string; onChange: (v: string) => void; strategies: Strategy[] }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const agents = useMemo(() => {
    const set = new Set(strategies.map((s) => s.agente).filter(Boolean));
    return Array.from(set).sort();
  }, [strategies]);

  const filtered = agents.filter((a) => a.toLowerCase().includes(value.toLowerCase()));

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="space-y-1.5 relative" ref={ref}>
      <Label htmlFor="agente" className="text-xs font-medium text-muted-foreground">Agente</Label>
      <Input
        id="agente"
        value={value}
        onChange={(e) => { onChange(e.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)}
        placeholder="Nome agente"
        className="h-10 rounded-xl bg-muted/30 border-border/60 focus:bg-card"
        autoComplete="off"
      />
      {open && filtered.length > 0 && value.length > 0 && (
        <div className="absolute z-50 top-full mt-1 left-0 right-0 bg-card border border-border rounded-xl shadow-lg max-h-32 overflow-y-auto">
          {filtered.map((a) => (
            <button
              key={a}
              type="button"
              className="w-full text-left px-3 py-2.5 text-sm hover:bg-muted/50 transition-colors first:rounded-t-xl last:rounded-b-xl"
              onClick={() => { onChange(a); setOpen(false); }}
            >
              {a}
            </button>
          ))}
        </div>
      )}
    </div>
  );
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
  const [notaCustom, setNotaCustom] = useState("");
  const [note, setNote] = useState("");

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
      setNotaCustom(strategy.nota_custom || "");
      setNote((strategy as any).note || "");
    } else {
      setCodice("");
      setTipo("Social");
      setNome("");
      setStato("Da realizzare");
      setAggiuntaIl(new Date().toISOString().split("T")[0]);
      setDataConferma(null);
      setPrevStato("Da realizzare");
      setAgente("");
      setNotaCustom("");
      setNote("");
    }
  }, [strategy, open]);

  const isCustom = tipo === "Custom";
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
      nota_custom: isCustom ? (notaCustom || "3% della commissione") : undefined,
      note: note || undefined,
    } as Strategy);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px] p-0 gap-0 overflow-hidden rounded-3xl border-border/50 shadow-[0_24px_80px_rgba(0,0,0,0.12)]">
        <DialogHeader className="px-6 pt-6 pb-4">
          <DialogTitle className="text-xl font-semibold tracking-tight">
            {isEdit ? "Modifica Strategia" : "Nuova Strategia"}
          </DialogTitle>
        </DialogHeader>

        {isCustom && (
          <div className="mx-6 flex items-center gap-2 px-4 py-3 rounded-2xl bg-custom-bg border border-custom-border">
            <Star className="w-4 h-4 text-custom" />
            <span className="text-sm font-semibold text-custom-foreground">
              Strategia Custom — importo a percentuale
            </span>
          </div>
        )}

        <div className="px-6 pb-4 space-y-5 max-h-[65vh] overflow-y-auto">
          {/* Sezione: Cliente */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider pt-2">
              <User className="w-3.5 h-3.5" />
              Cliente
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="codice" className="text-xs font-medium text-muted-foreground">Codice cliente</Label>
                <Input id="codice" value={codice} onChange={(e) => setCodice(e.target.value)} className="font-mono h-10 rounded-xl bg-muted/30 border-border/60 focus:bg-card" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="nome" className="text-xs font-medium text-muted-foreground">Nome cliente</Label>
                <Input id="nome" value={nome} onChange={(e) => setNome(e.target.value)} className="h-10 rounded-xl bg-muted/30 border-border/60 focus:bg-card" />
              </div>
            </div>
            <AgentAutocomplete
              value={agente}
              onChange={setAgente}
              strategies={strategies}
            />
          </div>

          <div className="border-t border-border/40" />

          {/* Sezione: Strategia */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              <Settings className="w-3.5 h-3.5" />
              Dettagli strategia
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-muted-foreground">Tipo strategia</Label>
                <Select value={tipo} onValueChange={(v) => setTipo(v as StrategyType)}>
                  <SelectTrigger className="h-10 rounded-xl bg-muted/30 border-border/60"><SelectValue /></SelectTrigger>
                  <SelectContent className="rounded-xl">
                    {allTipi.map((t) => (
                      <SelectItem key={t} value={t} className="rounded-lg">
                        {t === "Custom" ? "⭐ Custom (percentuale)" : t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-muted-foreground">Stato strategia</Label>
                <Select value={stato} onValueChange={(v) => handleStatoChange(v as StrategyStatus)}>
                  <SelectTrigger className="h-10 rounded-xl bg-muted/30 border-border/60"><SelectValue /></SelectTrigger>
                  <SelectContent className="rounded-xl">
                    {allStati.map((s) => (
                      <SelectItem key={s} value={s} className="rounded-lg">{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {isCustom && (
              <div className="space-y-1.5">
                <Label htmlFor="nota_custom" className="text-xs font-medium text-muted-foreground">Dettaglio commissione</Label>
                <Input
                  id="nota_custom"
                  value={notaCustom}
                  onChange={(e) => setNotaCustom(e.target.value)}
                  placeholder="3% della commissione"
                  className="border-custom-border focus-visible:ring-custom h-10 rounded-xl bg-muted/30"
                />
                <p className="text-[11px] text-muted-foreground">
                  L'importo verrà definito in base alla commissione dell'agente
                </p>
              </div>
            )}

            {/* Importo */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground">Importo</Label>
              {isCustom ? (
                <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-custom-bg border border-custom-border">
                  <Star className="w-3.5 h-3.5 text-custom" />
                  <span className="text-sm font-mono font-semibold text-custom-foreground">
                    {notaCustom || "3% della commissione"}
                  </span>
                </div>
              ) : (
                <div className="flex items-center px-4 py-2.5 rounded-xl bg-muted/30 border border-border/60 font-mono text-sm font-semibold">
                  €{importo.toLocaleString("it-IT")}
                </div>
              )}
            </div>
          </div>

          <div className="border-t border-border/40" />

          {/* Sezione: Date */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              <FileText className="w-3.5 h-3.5" />
              Date
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="data" className="text-xs font-medium text-muted-foreground">Aggiunta il</Label>
                <Input id="data" type="date" value={aggiuntaIl} onChange={(e) => setAggiuntaIl(e.target.value)} className="h-10 rounded-xl bg-muted/30 border-border/60 focus:bg-card" />
              </div>
              {dataConferma && (
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-muted-foreground">Confermata il</Label>
                  <div className="flex items-center px-4 py-2.5 rounded-xl bg-muted/30 border border-border/60 text-sm">
                    {formatDateDisplay(dataConferma)}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="border-t border-border/40" />

          {/* Sezione: Note */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              <StickyNote className="w-3.5 h-3.5" />
              Note
            </div>
            <Textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Aggiungi note o osservazioni sulla strategia..."
              className="min-h-[80px] resize-none text-sm rounded-xl bg-muted/30 border-border/60 focus:bg-card"
            />
          </div>
        </div>

        <DialogFooter className="px-6 py-4 border-t border-border/40 bg-muted/20 flex-col sm:flex-row gap-2">
          <div className="flex gap-2 w-full sm:w-auto">
            {isEdit && (
              <Button variant="destructive" size="sm" onClick={() => onDelete(strategy!.id)} className="flex-1 sm:flex-none rounded-xl">
                Elimina
              </Button>
            )}
            {isEdit && stato === "Va bene !" && (
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5 text-muted-foreground flex-1 sm:flex-none rounded-xl"
                onClick={() => { handleStatoChange("Archiviata"); }}
              >
                <Archive className="w-3.5 h-3.5" />
                Archivia
              </Button>
            )}
          </div>
          <div className="flex gap-2 ml-auto">
            <Button variant="outline" size="sm" onClick={handleVaBene} className="gap-1 rounded-xl">
              ✅ Va bene !
            </Button>
            <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)} className="rounded-xl">Annulla</Button>
            <Button size="sm" onClick={handleSave} className="rounded-xl shadow-[0_2px_12px_rgba(0,122,255,0.25)]">Salva</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default StrategyModal;
