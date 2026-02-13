
-- Create strategies table
CREATE TABLE public.strategies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  codice_cliente TEXT NOT NULL,
  nome_cliente TEXT NOT NULL,
  tipo_strategia TEXT NOT NULL CHECK (tipo_strategia IN ('Social', 'Sito')),
  stato_strategia TEXT NOT NULL CHECK (stato_strategia IN ('Da realizzare', 'Va bene !', 'In attesa/corretta', 'Pronta per la presentazione', 'Presentata', 'In pausa')),
  importo_strategia INTEGER NOT NULL DEFAULT 0,
  aggiunta_il DATE NOT NULL DEFAULT CURRENT_DATE,
  data_conferma DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.strategies ENABLE ROW LEVEL SECURITY;

-- Authenticated users can do everything (single admin user)
CREATE POLICY "Authenticated users can view strategies"
  ON public.strategies FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert strategies"
  ON public.strategies FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update strategies"
  ON public.strategies FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Authenticated users can delete strategies"
  ON public.strategies FOR DELETE TO authenticated USING (true);

-- Timestamp trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_strategies_updated_at
  BEFORE UPDATE ON public.strategies
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.strategies;
