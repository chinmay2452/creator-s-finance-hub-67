export const apiBase = "/api";

export const runMoneyBuddy = async (args: { userId: string; query: string }) => {
  const res = await fetch(`${apiBase}/money-buddy/run`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(args) });
  return await res.json();
};

export const runIncomeSync = async (args: { userId: string; since?: string }) => {
  const res = await fetch(`${apiBase}/income-sync/run`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(args) });
  return await res.json();
};

export const runFinanceIntel = async (args: { userId: string }) => {
  const res = await fetch(`${apiBase}/finance-intel/run`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(args) });
  return await res.json();
};

export const runParseEmail = async (args: { emailText: string; userId: string }) => {
  const res = await fetch(`${apiBase}/parse-email`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(args) });
  return await res.json();
};
