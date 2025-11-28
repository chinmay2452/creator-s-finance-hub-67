export type ParsedPayment = {
  brand?: string;
  amount?: number;
  currency?: string;
  dueDate?: string;
  status?: string;
  confidence: number;
};

const normalize = (s: string) => s.replace(/[\t\r]+/g, " ").replace(/ +/g, " ").trim();

const lines = (s: string) => s.split(/\n+/).map((l) => l.trim()).filter(Boolean);

const parseCurrencyAmount = (text: string) => {
  const patterns = [
    /(?:USD|US\s*\$|\$)\s*([0-9]{1,3}(?:,[0-9]{3})*(?:\.[0-9]{2})?)/gi,
    /amount\s*[:-]?\s*(?:USD|US\s*\$|\$)?\s*([0-9]{1,3}(?:,[0-9]{3})*(?:\.[0-9]{2})?)/gi,
    /total\s*(?:due|amount)?\s*[:-]?\s*(?:USD|US\s*\$|\$)?\s*([0-9]{1,3}(?:,[0-9]{3})*(?:\.[0-9]{2})?)/gi,
  ];
  const matches: number[] = [];
  for (const re of patterns) {
    let m: RegExpExecArray | null;
    re.lastIndex = 0;
    while ((m = re.exec(text)) !== null) {
      const v = Number(m[1].replace(/,/g, ""));
      if (!Number.isNaN(v)) matches.push(v);
    }
  }
  if (!matches.length) return undefined;
  return Math.max(...matches);
};

const parseDueDate = (text: string) => {
  const dateRe1 = /(\d{1,2}[/-]\d{1,2}[/-]\d{2,4})/;
  const dateRe2 = /([A-Za-z]{3,9}\s+\d{1,2},\s+\d{4})/;
  const phrases = [
    /due\s*(?:date)?\s*[:-]?\s*(.+?)(?:\.|\n|$)/i,
    /(payment\s*due|payable\s*by|due\s*on|by)\s*(.+?)(?:\.|\n|$)/i,
  ];
  for (const p of phrases) {
    const m = p.exec(text);
    if (m && m[2]) {
      const seg = m[2];
      const d2 = dateRe2.exec(seg);
      if (d2) return new Date(d2[1]).toISOString().slice(0, 10);
      const d1 = dateRe1.exec(seg);
      if (d1) {
        const parts = d1[1].split(/[/-]/);
        const mm = Number(parts[0]);
        const dd = Number(parts[1]);
        let yy = Number(parts[2]);
        if (yy < 100) yy += 2000;
        return new Date(yy, mm - 1, dd).toISOString().slice(0, 10);
      }
    }
  }
  const net = /net\s*(\d{1,3})/i.exec(text);
  const invoiceDatePhrase = /(invoice\s*date\s*[:-]?\s*)(.+?)(?:\.|\n|$)/i.exec(text);
  if (net && invoiceDatePhrase) {
    const days = Number(net[1]);
    const seg = invoiceDatePhrase[2];
    const d = dateRe2.exec(seg) || dateRe1.exec(seg);
    if (d) {
      const base = new Date(d[1]);
      if (!Number.isNaN(base.getTime())) {
        base.setDate(base.getDate() + days);
        return base.toISOString().slice(0, 10);
      }
    }
  }
  return undefined;
};

const parseBrand = (text: string) => {
  const ls = lines(text);
  const keys = [/brand/i, /client/i, /company/i, /vendor/i, /organization/i];
  for (const l of ls) {
    for (const k of keys) {
      const m = new RegExp(k).exec(l);
      if (m) {
        const after = l.split(/[:-]/).slice(1).join(" ").trim();
        if (after && /[A-Za-z]/.test(after)) {
          return after.replace(/[^A-Za-z0-9 &-]/g, "").trim();
        }
      }
    }
  }
  for (let i = ls.length - 1; i >= 0; i--) {
    const l = ls[i];
    if (/^regards|^thanks|^sincerely/i.test(l)) {
      const next = ls[i + 1] || "";
      const maybe = ls[i + 2] || "";
      const cand = [next, maybe].find((x) => /[A-Z][A-Za-z]+\s+[A-Z][A-Za-z]+/.test(x)) || maybe;
      const org = ls.slice(i + 1, i + 4).find((x) => /[A-Z][A-Za-z]+/.test(x) && !/@/.test(x));
      if (org && org.length <= 64) return org.replace(/[^A-Za-z0-9 &-]/g, "").trim();
      if (cand) return cand.replace(/[^A-Za-z0-9 &-]/g, "").trim();
    }
  }
  const top = ls[0] || "";
  const m = /(from|on\s+behalf\s+of)\s+([A-Z][A-Za-z0-9 &-]{2,})/i.exec(top);
  if (m) return m[2].trim();
  return undefined;
};

const parseStatus = (text: string) => {
  if (/pending|awaiting\s*payment/i.test(text)) return "Pending";
  if (/paid|received|settled/i.test(text)) return "Received";
  if (/overdue|late/i.test(text)) return "Overdue";
  return undefined;
};

export const parseEmailPaymentDetails = (raw: string): ParsedPayment => {
  const text = normalize(raw);
  const amount = parseCurrencyAmount(text);
  const dueDate = parseDueDate(text);
  const brand = parseBrand(text);
  const status = parseStatus(text);
  const currency = /USD|US\s*\$|\$/i.test(text) ? "USD" : undefined;
  let found = 0;
  if (amount !== undefined) found++;
  if (dueDate !== undefined) found++;
  if (brand !== undefined) found++;
  if (status !== undefined) found++;
  const confidence = Math.min(0.99, 0.6 + 0.1 * found);
  return { amount, dueDate, brand, status, currency, confidence };
};
