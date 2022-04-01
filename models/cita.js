const Joi = require('joi');
//const config = require('config');
//const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const citaSchema = new mongoose.Schema({
  pacienteId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    minlength: 5,
    maxlength: 50
  },
  motivo: {
    type: String,
    required: true,
  },
  fecha_cita: {
    type: Date,
    required: true,
    default: Date.now()
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
    default: Date.now()
  },
  proxima_cita: {
    type: Date,
    default: Date.now()
  }
  
});

const Cita = mongoose.model('Cita', citaSchema);

function validateCita(cita) {
  const schema = {
    //name: Joi.string().min(5).max(50).required(),
    motivo: Joi.string().max(255).required(),
    fecha_cita: Joi.date().required(),

  };

  return Joi.validate(cita, schema);
}


exports.Cita = Cita; 
exports.validate = validateCita;