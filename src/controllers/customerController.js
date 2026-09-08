import { CustomerModel } from "../models/customerModel.js";

// Helper fungsi validasi input email dan phone
const validateCustomerInput = (email, phone) => {
  if (email && !email.includes("@")) {
    return "Email harus mengandung karakter '@'";
  }
  if (phone && phone.length < 10) {
    return "Nomor telepon harus diisi minimal 10 karakter";
  }
  return null;
};

export const CustomerController = {
  async getAll(req, res) {
    try {
      const { name, page, limit } = req.query;
      const result = await CustomerModel.getAll({ name, page, limit });
      res.status(200).json(result);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async getById(req, res) {
    try {
      const customer = await CustomerModel.getById(req.params.id);
      res.status(200).json(customer);
    } catch (err) {
      res.status(404).json({ error: "Customer tidak ditemukan" });
    }
  },

  async create(req, res) {
    try {
      const { name, email, phone } = req.body;

      // Validasi Email dan Phone
      const validationError = validateCustomerInput(email, phone);
      if (validationError) {
        return res.status(400).json({ error: validationError });
      }

      const customer = await CustomerModel.create({ name, email, phone });
      res.status(201).json(customer);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  async update(req, res) {
    try {
      const { email, phone } = req.body;

      // Validasi Email dan Phone
      const validationError = validateCustomerInput(email, phone);
      if (validationError) {
        return res.status(400).json({ error: validationError });
      }

      const customer = await CustomerModel.update(req.params.id, req.body);
      res.status(200).json(customer);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  async remove(req, res) {
    try {
      await CustomerModel.remove(req.params.id);
      res.status(200).json({ message: "Customer berhasil dihapus" });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  async getTotalCount(req, res) {
    try {
      const total = await CustomerModel.getTotalCount();
      res.status(200).json({ total_customers: total });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};