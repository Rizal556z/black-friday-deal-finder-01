// Money, discount and verdict helpers shared by the list and detail views.
// Every number on the page comes from these, so a discount shown always
// matches the two prices it was computed from.

export function money(n) {
  return `$${Number(n).toLocaleString("en-US", {
    minimumFractionDigits: Number.isInteger(n) ? 0 : 2,
    maximumFractionDigits: 2,
  })}`;
}

export function percentOff(d) {
  return Math.round((1 - d.price / d.was) * 100);
}

export function saved(d) {
  return Math.round((d.was - d.price) * 100) / 100;
}

export const VERDICTS = {
  "new-low": { label: "NEW LOW", hint: "Lowest price on record for this item." },
  strong: { label: "STRONG DEAL", hint: "A real cut — well below the usual price." },
  routine: { label: "ROUTINE SALE", hint: "Only a small cut — fine if you need it now, not a bargain to chase." },
};

export function verdictOf(d) {
  return VERDICTS[d.verdict] ?? VERDICTS.routine;
}

export function checkLabel(iso) {
  return (
    new Date(iso).toLocaleString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: "UTC",
    }) + " UTC"
  );
}

export function escape(s) {
  return String(s).replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
}
