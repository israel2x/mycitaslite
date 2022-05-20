const Joi = require("joi");
//const config = require('config');
//const jwt = require('jsonwebtoken');
const mongoose = require("mongoose");

const citaSchema = new mongoose.Schema({
  pacienteId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    minlength: 5,
    maxlength: 50,
  },
  motivo: {
    type: String,
  },
  fecha_cita: {
    type: Date,
    required: true,
    default: Date.now(),
  },
  sintomas: {
    type: String,
  },
  diagnostico: {
    type: String,
  },
  receta: {
    type: String,
  },
  fecha_cita_update: {
    type: Date,
    default: Date.now(),
  },
  proxima_cita: {
    type: Date,
    default: Date.now(),
  },
  hora_cita: {
    type: String,
    required: true,
  },
  hora_proxima_cita: {
    type: String,
  },
  estado_cita: {
    type: String,
    required: true,
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    minlength: 5,
    maxlength: 50,
  },
});

const Cita = mongoose.model("Cita", citaSchema);

function validateCita(cita) {
  const schema = Joi.object({
    pacienteId: Joi.object().required(),
    motivo: Joi.string().max(255).required(),
    fecha_cita: Joi.date().required(),
    sintomas: Joi.string().required(),
    hora_cita: Joi.string().required(),
    estado_cita: Joi.string().required(),
    doctorId: Joi.object().required(),
  });

  return schema.validate(cita);
}

function validateCitaSinPaciente(cita) {
  const schema = Joi.object({
    motivo: Joi.string().max(255).required(),
    fecha_cita: Joi.date().required(),
    sintomas: Joi.string().required(),
    hora_cita: Joi.string().required(),
    estado_cita: Joi.string().required(),
    doctorId: Joi.object().required(),
  });

  return schema.validate(cita);
}

exports.Cita = Cita;
exports.validate = validateCita;
exports.validateCitaSinPaciente = validateCitaSinPaciente;
