import * as XLSX from "xlsx";

export type ParsedLead = {
  businessName: string;
  contactName?: string;
  phone?: string;
  email?: string;
  category?: string;
  city?: string;
  notes?: string;
};

export type ParseResult = {
  leads: ParsedLead[];
  skippedRows: number;
  totalRows: number;
};

const FIELD_ALIASES: Record<keyof Omit<ParsedLead, "businessName">, string[]> & {
  businessName: string[];
} = {
  businessName: [
    "business name",
    "business",
    "company",
    "company name",
    "name",
    "client name",
    "lead name",
    "shop name",
    "firm name",
  ],
  contactName: [
    "contact name",
    "contact person",
    "contact",
    "owner",
    "owner name",
    "person",
    "poc",
  ],
  phone: [
    "phone",
    "phone number",
    "mobile",
    "mobile number",
    "contact number",
    "number",
    "whatsapp",
    "whatsapp number",
    "tel",
  ],
  email: ["email", "email address", "e-mail", "mail"],
  category: ["category", "niche", "industry", "type", "business type"],
  city: ["city", "location", "area", "town", "address", "place"],
  notes: ["notes", "note", "remarks", "description", "comment", "comments"],
};

function normalizeHeader(header: string) {
  return header.trim().toLowerCase().replace(/\s+/g, " ");
}

function buildHeaderMap(headers: string[]) {
  const map: Partial<Record<keyof ParsedLead, string>> = {};
  const normalized = headers.map((h) => ({ raw: h, norm: normalizeHeader(h) }));

  (Object.keys(FIELD_ALIASES) as (keyof ParsedLead)[]).forEach((field) => {
    const aliases = FIELD_ALIASES[field];
    const match = normalized.find((h) => aliases.includes(h.norm));
    if (match) map[field] = match.raw;
  });

  return map;
}

export function parseLeadsFile(buffer: ArrayBuffer): ParseResult {
  const workbook = XLSX.read(buffer, { type: "array" });
  const firstSheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[firstSheetName];

  const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, {
    defval: "",
    raw: false,
  });

  if (rows.length === 0) {
    return { leads: [], skippedRows: 0, totalRows: 0 };
  }

  const headers = Object.keys(rows[0]);
  const headerMap = buildHeaderMap(headers);

  const leads: ParsedLead[] = [];
  let skippedRows = 0;

  for (const row of rows) {
    const get = (field: keyof ParsedLead) => {
      const key = headerMap[field];
      if (!key) return "";
      const value = row[key];
      return typeof value === "string" ? value.trim() : String(value ?? "").trim();
    };

    const businessName = get("businessName");
    const phone = get("phone");
    const email = get("email");

    if (!businessName || (!phone && !email)) {
      skippedRows += 1;
      continue;
    }

    leads.push({
      businessName,
      contactName: get("contactName") || undefined,
      phone: phone || undefined,
      email: email || undefined,
      category: get("category") || undefined,
      city: get("city") || undefined,
      notes: get("notes") || undefined,
    });
  }

  return { leads, skippedRows, totalRows: rows.length };
}
