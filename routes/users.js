const _ = require("lodash");
const express = require("express");
const router = express.Router();
const { User, validate } = require("../models/user");
const bcrypt = require("bcrypt");

//traer usurio by id
router.get("/me", async (req, res) => {
  if (req.user._id == null || req.user._id == "")
    return res.status(400).send("Usuario no encontrado.");
  const user = await User.findById(req.user._id).select("-password");
  res.send(user);
});

//guardar un usuario
router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("Usuario ya existe");

  user = new User(
    _.pick(req.body, ["name", "email", "password", "cedula", "isAdmin", "rol"])
  );
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  await user.save(); //manejar mejor esta respuesta, devuelve un objeto
  res.send(_.pick(user, ["_id", "name", "email"]));
});

//traer usuarios que son DOCTORES
router.get("/doctors", async (req, res) => {
  const rol_user = "DOCTOR";
  try {
    let doctors = await User.find({ rol: rol_user }).select("-password");
    console.log(doctors);
    res.send(doctors);
  } catch (error) {
    console.log(error);
    res.status(500).send("No se pudo traer los Doctores");
  }
});

//traer usuarios que son PACIENTES
router.get("/patients", async (req, res) => {
  const rol_user = "PACIENTE";
  try {
    let patients = await User.find({ rol: rol_user }).select("-password");
    console.log(patients); // cambiar el nombre de la variable para generar un error
    res.send(patients);
  } catch (error) {
    console.log(error);
    res.status(500).send("No se pudo traer los Pacientes");
  }
});

module.exports = router;
