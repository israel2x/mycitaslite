const express = require("express");
const _ = require("lodash");
const mongoose = require("mongoose");
const router = express.Router();
const { Cita, validate, validateCitaSinPaciente } = require("../models/cita");
const { User } = require("../models/user");

//traer todas las citas
router.get("/all", async (req, res) => {
  try {
    const citas = await Cita.find()
      .populate("pacienteId")
      .select("-pacienteId.password")
      .sort("-fecha_cita"); //ordenar por fecha
    //const citas = await Cita.find();
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.send(citas);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ type: "error", message: error.message });
  }
});

//traer citas por mes
router.get("/month", async (req, res) => {
  const date = new Date();
  const startDate = new Date(date.getFullYear(), date.getMonth(), 1);
  const endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  try {
    const citasMonth = await Cita.find({
      fecha_cita: { $gte: startDate, $lte: endDate },
    });
    res.send(citasMonth);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ type: "error", message: error.message });
  }
});

//traer citas por día (mes)
router.get("/month/:dia", async (req, res) => {
  const dayCitas = req.params.dia;
  const date = new Date();
  const matchDate = new Date(date.getFullYear(), date.getMonth(), dayCitas);
  try {
    const citasMonth = await Cita.find({
      fecha_cita: { $eq: matchDate },
    });

    res.send(citasMonth);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ type: "error", message: error.message });
  }
});

//traer citas por DATE , fecha completa mes y dia
router.post("/date/", async (req, res) => {
  const data = req.body.date;
  const dayCitas = new Date(data);
  const matchDate = new Date(
    dayCitas.getFullYear(),
    dayCitas.getMonth(),
    dayCitas.getDate()
  );
  try {
    const citasMonth = await Cita.find({
      fecha_cita: { $eq: matchDate },
    })
      .populate("pacienteId")
      .select("-pacienteId.password");

    res.send(citasMonth);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ type: "error", message: error.message });
  }
});

/* 
//contar citas por mes
router.get("/count", async (req, res) => {
  try {
    const countCitasMonth = await Cita.
  } catch (error) {
    console.log(error);
    return res.status(500).json({ type: "error", message: error.message });
  }
}); */

//guardar una cita, Caso 1 paciente ya existe
router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const paciente = await User.findById(req.body.pacienteId);
  if (!paciente) return res.status(400).send("No se encontro el paciente!");

  const cita = new Cita({
    pacienteId: paciente._id,
    motivo: req.body.motivo,
    fecha_cita: req.body.fecha_cita,
    sintomas: req.body.sintomas,
    hora_cita: req.body.hora_cita,
    estado_cita: req.body.estado_cita,
    doctorId: req.body.doctorId,
  });

  const res_save = await cita.save();
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.send(res_save);
});

//guardar una cita, Caso 2 paciente no existe
router.post("/new", async (req, res) => {
  //const { error } = validateCitaSinPaciente(req.body);
  //if (error) return res.status(400).send(error.details[0].message);
  console.log(req.body);
  //const paciente = await User.findById(req.body.pacienteId);
  //if (!paciente) return res.status(400).send("No se encontro el paciente!");
  const userPaciente = new User({
    name: req.body.name,
    lastname: req.body.lastname,
    gender: req.body.gender,
    email: req.body.email,
    rol: req.body.rol,
    isAdmin: false,
  });

  const cita = new Cita({
    //pacienteId: paciente._id,
    motivo: req.body.motivo,
    fecha_cita: req.body.fecha_cita,
    sintomas: req.body.sintomas,
    hora_cita: req.body.hora_cita,
    estado_cita: req.body.estado_cita,
    doctorId: req.body.doctorId,
  });

  const session = await mongoose.startSession();
  session.startTransaction();
  res.setHeader("Access-Control-Allow-Origin", "*");
  try {
    const paciente = await User.create([userPaciente], { session });
    console.log(paciente[0]);

    cita.pacienteId = paciente[0]._id;
    console.dir(cita);

    const save_cita = await Cita.create([cita], { session });

    await session.commitTransaction();

    res.send(save_cita);
  } catch (error) {
    console.log(error);
    await session.abortTransaction();

    return res.status(500).json({ type: "error", message: error.message });
  } finally {
    session.endSession();
  }
  //const res_save = await cita.save();
});

//Actulaizar una cita
router.put("/:id", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const cita = await Cita.findById(req.body.citaId);
  if (cita) return res.status(400).send("No se econtro la cita");

  const new_cita = await Cita.findByIdAndUpdate(req.params.id, {
    pacienteId: req.body.pacienteId,
    motivo: req.body.motivo,
    fecha_cita: req.body.fecha_cita,
    sintomas: req.body.sintomas,
  });
  res.send(new_cita);
});

//Guardar diagnostico
router.put("/:id", async (req, res) => {
  //validar el body con la data para diagnsitico??
  const cita = await Cita.findById(req.body.citaId);
  if (cita) return res.status(400).send("No se econtro la cita");

  const new_cita = await Cita.findByIdAndUpdate(req.params.id, {
    //pacienteId: req.body.pacienteId,
    //motivo: req.body.motivo,
    //fecha_cita: req.body.fecha_cita,
    sintomas: req.body.sintomas,
    diagnostico: req.body.diagnostico,
    receta: req.body.receta,
    fecha_cita_update: req.body.fecha_cita_update,
    proxima_cita: req.body.proxima_cita,
  });

  //validar respuesta en caso de errror
  if (!new_cita) return res.status(500).send("Erros al guardar");

  res.send(new_cita);
});

//Eliminar una cita
router.delete("/:id", async (req, res) => {
  const cita = await Cita.findByIdAndRemove(req.params.id);

  if (!cita) return res.status(404).send("No se encontro la cita");

  res.send(cita);
});

//Traer una cita by ID
router.get("/:id", async (req, res) => {
  const cita = await Cita.findById(req.params.id);

  if (!cita) return res.sendStatus(404).send("No se eonctro la cita");

  res.send(cita);
});

module.exports = router;
