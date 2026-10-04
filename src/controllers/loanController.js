import { LoanModel } from "../models/loanModel.js";

const loanStatuses = ["Dipinjam", "Dikembalikan", "Terlambat"];
const loanFields = ["member_name", "book_title", "loan_date", "due_date", "return_date", "status"];
const fieldAliases = {
  member_name: ["member_name", "memberName"],
  book_title: ["book_title", "bookTitle"],
  loan_date: ["loan_date", "loanDate"],
  due_date: ["due_date", "dueDate"],
  return_date: ["return_date", "returnDate"],
  status: ["status"],
};

const normalizeLoanInput = (loan = {}) => {
  const normalized = {};
  const aliasKeys = new Set(Object.values(fieldAliases).flat());

  for (const [canonicalField, aliases] of Object.entries(fieldAliases)) {
    const sourceField = aliases.find((key) => Object.prototype.hasOwnProperty.call(loan, key));
    if (sourceField !== undefined) {
      normalized[canonicalField] = loan[sourceField];
    }
  }

  for (const [key, value] of Object.entries(loan)) {
    if (Object.prototype.hasOwnProperty.call(fieldAliases, key) || aliasKeys.has(key)) {
      continue;
    }

    if (!Object.prototype.hasOwnProperty.call(normalized, key)) {
      normalized[key] = value;
    }
  }

  for (const [key, value] of Object.entries(normalized)) {
    if (typeof value === "string") {
      normalized[key] = value.trim();
    }
  }

  return normalized;
};

const isValidDate = (value) => {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parsedDate = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(parsedDate.getTime()) && parsedDate.toISOString().slice(0, 10) === value;
};

const validateLoan = (loan, partial = false) => {
  const invalidFields = Object.keys(loan).filter((field) => !loanFields.includes(field));
  if (invalidFields.length) return `Field tidak dikenal: ${invalidFields.join(", ")}`;

  for (const field of ["member_name", "book_title"]) {
    if ((!partial || field in loan) && (typeof loan[field] !== "string" || !loan[field].trim())) {
      return `${field} wajib diisi dengan teks`;
    }
  }

  for (const field of ["loan_date", "due_date", "return_date"]) {
    if (field in loan && loan[field] !== null && !isValidDate(loan[field])) {
      return `${field} harus menggunakan format tanggal YYYY-MM-DD`;
    }
    if (!partial && field !== "return_date" && !isValidDate(loan[field])) {
      return `${field} wajib menggunakan format tanggal YYYY-MM-DD`;
    }
  }

  if ("status" in loan && !loanStatuses.includes(loan.status)) {
    return `status harus salah satu dari: ${loanStatuses.join(", ")}`;
  }
  return null;
};

export const LoanController = {
  async getAll(req, res) {
    try {
      if (req.query.status && !loanStatuses.includes(req.query.status)) {
        return res.status(400).json({ error: `status harus salah satu dari: ${loanStatuses.join(", ")}` });
      }
      const loans = await LoanModel.getAll({ status: req.query.status });
      return res.status(200).json(loans);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  async getById(req, res) {
    try {
      const loan = await LoanModel.getById(req.params.id);
      if (!loan) return res.status(404).json({ error: "Data peminjaman tidak ditemukan" });
      return res.status(200).json(loan);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  async create(req, res) {
    try {
      const loan = normalizeLoanInput(req.body);
      loan.status = loan.status ?? "Dipinjam";
      const validationError = validateLoan(loan);
      if (validationError) return res.status(400).json({ error: validationError });
      const createdLoan = await LoanModel.create(loan);
      return res.status(201).json(createdLoan);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  },

  async update(req, res) {
    try {
      if (!Object.keys(req.body).length) {
        return res.status(400).json({ error: "Minimal satu field harus dikirim" });
      }
      const loanPayload = normalizeLoanInput(req.body);
      const validationError = validateLoan(loanPayload, true);
      if (validationError) return res.status(400).json({ error: validationError });
      const loan = await LoanModel.update(req.params.id, loanPayload);
      if (!loan) return res.status(404).json({ error: "Data peminjaman tidak ditemukan" });
      return res.status(200).json(loan);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  },

  async remove(req, res) {
    try {
      const deleted = await LoanModel.remove(req.params.id);
      if (!deleted) return res.status(404).json({ error: "Data peminjaman tidak ditemukan" });
      return res.status(200).json({ message: "Data peminjaman berhasil dihapus" });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },
};