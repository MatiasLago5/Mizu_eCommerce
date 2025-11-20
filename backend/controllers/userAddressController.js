const { UserAddress } = require("../models");

const REQUIRED_FIELDS = ["fullName", "phone", "street", "city", "department"];

const sanitize = (value) => {
  if (value === undefined) return undefined;
  if (value === null) return null;
  if (typeof value === "string") return value.trim();
  return value;
};

const buildPayload = (body = {}) => ({
  fullName: sanitize(body.fullName),
  phone: sanitize(body.phone),
  street: sanitize(body.street),
  city: sanitize(body.city),
  department: sanitize(body.department),
  postalCode: sanitize(body.postalCode),
  reference: sanitize(body.reference),
  country: body.country ? sanitize(body.country) : "Uruguay",
});

async function getAddress(req, res) {
  try {
    const address = await UserAddress.findOne({ where: { userId: req.user.id } });
    return res.json({ address });
  } catch (error) {
    console.error("Error en getAddress:", error);
    return res.status(500).json({ error: "Error al obtener la dirección" });
  }
}

async function upsertAddress(req, res) {
  try {
    const payload = buildPayload(req.body);
    const missing = REQUIRED_FIELDS.filter((field) => !payload[field]);
    if (missing.length) {
      return res.status(400).json({
        error: `Los campos ${missing.join(", ")} son requeridos`,
      });
    }

    const existing = await UserAddress.findOne({ where: { userId: req.user.id } });
    if (existing) {
      await existing.update(payload);
      return res.json({ message: "Dirección actualizada", address: existing });
    }

    const newAddress = await UserAddress.create({ ...payload, userId: req.user.id });
    return res.status(201).json({ message: "Dirección guardada", address: newAddress });
  } catch (error) {
    console.error("Error en upsertAddress:", error);
    return res.status(500).json({ error: "Error al guardar la dirección" });
  }
}

async function deleteAddress(req, res) {
  try {
    const address = await UserAddress.findOne({ where: { userId: req.user.id } });
    if (!address) {
      return res.status(404).json({ error: "No hay dirección guardada" });
    }

    await address.destroy();
    return res.json({ message: "Dirección eliminada" });
  } catch (error) {
    console.error("Error en deleteAddress:", error);
    return res.status(500).json({ error: "Error al eliminar la dirección" });
  }
}

module.exports = {
  getAddress,
  upsertAddress,
  deleteAddress,
};
