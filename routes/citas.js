const express = require("express");
const _ = require("lodash");
const router = express.Router();
const { Cita, validate } = require("../models/cita");
const { User } = require("../models/user");

//traer todas las citas
router.get("/all", async (req, res) => {
  try {
    const citas = await Cita.find()
      .populate("pacienteId")
      .select("-pacienteId.password")
      .sort("-fecha_cita"); //ordenar por fecha
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.send(citas);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ type: "error", message: error.message });
  }
});

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
  });

  const res_save = await cita.save();
  res.send(res_save);
});

//guardar una cita, Caso 2 paciente no existe

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
