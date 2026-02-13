import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Create admin user
    const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();
    const adminEmail = "admin@dashboard.local";
    const adminExists = existingUsers?.users?.some((u) => u.email === adminEmail);

    if (!adminExists) {
      const { error: createError } = await supabaseAdmin.auth.admin.createUser({
        email: adminEmail,
        password: "strategia26",
        email_confirm: true,
      });
      if (createError) throw createError;
    }

    // Seed strategies if table is empty
    const { count } = await supabaseAdmin
      .from("strategies")
      .select("*", { count: "exact", head: true });

    if (count === 0) {
      const strategies = [
        { codice_cliente: "444944", nome_cliente: "BLU SUD Impresa Sociale SRL", stato_strategia: "In pausa", importo_strategia: 0, aggiunta_il: "2026-02-11", tipo_strategia: "Social", data_conferma: null },
        { codice_cliente: "376385", nome_cliente: "Davide Muraca (+ LinkedIn)", stato_strategia: "Da realizzare", importo_strategia: 300, aggiunta_il: "2026-02-11", tipo_strategia: "Social", data_conferma: null },
        { codice_cliente: "312167", nome_cliente: "Br Termitalia", stato_strategia: "Da realizzare", importo_strategia: 300, aggiunta_il: "2026-02-11", tipo_strategia: "Social", data_conferma: null },
        { codice_cliente: "312163", nome_cliente: "Cerra Giuseppe", stato_strategia: "Da realizzare", importo_strategia: 300, aggiunta_il: "2026-02-11", tipo_strategia: "Social", data_conferma: null },
        { codice_cliente: "316608", nome_cliente: "Grecoplast", stato_strategia: "In attesa/corretta", importo_strategia: 300, aggiunta_il: "2026-02-11", tipo_strategia: "Social", data_conferma: null },
        { codice_cliente: "443241", nome_cliente: "Sorrento Giardini SNC di Mauro Angelo", stato_strategia: "Va bene !", importo_strategia: 300, aggiunta_il: "2026-02-11", tipo_strategia: "Social", data_conferma: null },
        { codice_cliente: "367444", nome_cliente: "Olearia Lametina Vescio", stato_strategia: "Va bene !", importo_strategia: 300, aggiunta_il: "2026-02-11", tipo_strategia: "Social", data_conferma: "2026-02-11" },
        { codice_cliente: "411584", nome_cliente: "Mario Moniaci", stato_strategia: "Va bene !", importo_strategia: 300, aggiunta_il: "2026-02-11", tipo_strategia: "Social", data_conferma: null },
        { codice_cliente: "376382", nome_cliente: "Fotovoltaica SRL", stato_strategia: "Va bene !", importo_strategia: 300, aggiunta_il: "2026-02-11", tipo_strategia: "Social", data_conferma: null },
        { codice_cliente: "427357", nome_cliente: "U Fhalignami", stato_strategia: "Va bene !", importo_strategia: 300, aggiunta_il: "2026-02-11", tipo_strategia: "Social", data_conferma: null },
        { codice_cliente: "312167", nome_cliente: "Br Termitalia", stato_strategia: "Da realizzare", importo_strategia: 150, aggiunta_il: "2026-02-11", tipo_strategia: "Sito", data_conferma: null },
        { codice_cliente: "312111", nome_cliente: "Sgromo Costruzioni SRL", stato_strategia: "Da realizzare", importo_strategia: 150, aggiunta_il: "2026-02-11", tipo_strategia: "Sito", data_conferma: null },
        { codice_cliente: "316852", nome_cliente: "Studio Legale Fucile", stato_strategia: "Pronta per la presentazione", importo_strategia: 150, aggiunta_il: "2026-02-11", tipo_strategia: "Sito", data_conferma: null },
        { codice_cliente: "443241", nome_cliente: "Sorrento Giardini SNC di Mauro Angelo", stato_strategia: "Va bene !", importo_strategia: 150, aggiunta_il: "2026-02-11", tipo_strategia: "Sito", data_conferma: null },
        { codice_cliente: "419863", nome_cliente: "Park Hotel Leonardo", stato_strategia: "Pronta per la presentazione", importo_strategia: 150, aggiunta_il: "2026-02-11", tipo_strategia: "Sito", data_conferma: null },
        { codice_cliente: "321625", nome_cliente: "Profiltek srl", stato_strategia: "Va bene !", importo_strategia: 150, aggiunta_il: "2026-02-11", tipo_strategia: "Sito", data_conferma: null },
      ];

      const { error: insertError } = await supabaseAdmin
        .from("strategies")
        .insert(strategies);
      if (insertError) throw insertError;
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
