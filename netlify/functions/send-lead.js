// netlify/functions/send-lead.js
export async function handler(event) {
    try {
        // Garante método POST
        if (event.httpMethod !== "POST") {
            return { statusCode: 405, body: "Method Not Allowed" };
        }

        // Encaminha os dados como x-www-form-urlencoded para o Apps Script
        const res = await fetch("https://script.google.com/macros/s/AKfycbyfuPlHkiseThqDqGbDNl4gxVOGHTETErAu9ZHuAsosRTqlCS6AofH76gu6mAfXXV9yMw/exec", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams(event.body), // repassa os campos
        });

        // Opcional: tentar ler o retorno (não é obrigatório)
        let ok = res.ok;
        try { const j = await res.json(); ok = j?.ok ?? res.ok; } catch { }

        return {
            statusCode: ok ? 200 : 500,
            headers: { "Access-Control-Allow-Origin": "*" },
            body: JSON.stringify({ ok }),
        };
    } catch (err) {
        return {
            statusCode: 500,
            headers: { "Access-Control-Allow-Origin": "*" },
            body: JSON.stringify({ ok: false, error: String(err) }),
        };
    }
}
