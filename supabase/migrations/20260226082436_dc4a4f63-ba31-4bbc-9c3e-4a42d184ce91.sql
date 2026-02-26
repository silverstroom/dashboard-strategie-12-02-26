
-- Update the check constraint to allow "Archiviata" status
ALTER TABLE public.strategies DROP CONSTRAINT IF EXISTS strategies_stato_strategia_check;
ALTER TABLE public.strategies ADD CONSTRAINT strategies_stato_strategia_check 
  CHECK (stato_strategia IN ('Da realizzare', 'Va bene !', 'In attesa/corretta', 'Pronta per la presentazione', 'Presentata', 'In pausa', 'Archiviata'));
