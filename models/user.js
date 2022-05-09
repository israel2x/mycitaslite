const Joi = require('joi');
const config = require('config');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50
  },
  email: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 255,
      unique: true
    },
  password: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 1024
  },
  cedula: {
    type: String,
    required: true,
    minlength: 10,
    maxlength: 11
  },
  isAdmin: Boolean,
  rol: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50
  }
});

userSchema.methods.generateAuthToken = function() {
  const token = jwt.sign({ _id: this._id , isAdmin: this.isAdmin }, config.get('jwtPrivateKey'));
  return token;
} 

const User = mongoose.model('User', userSchema);

function validateUser(user) {
  const schema = Joi.object({
    name: Joi.string().min(5).max(50).required(),
    email: Joi.string().min(6).max(255).required().email(),
    password: Joi.string().min(5).max(255).required(),
    cedula: Joi.string().min(10).max(11).required(),
    isAdmin: Joi.boolean().required(),
    rol: Joi.string().required(),
  });

  return schema.validate(user);
}

//exports.genreSchema = genreSchema;
exports.User = User; 
exports.validate = validateUser;