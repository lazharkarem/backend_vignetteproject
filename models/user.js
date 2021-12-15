const mongoose = require('mongoose');
const { vignetteSchema } = require('./vignette');

const user = new mongoose.Schema({
  firstName: {
    type: String
  },
  lastName: {
    type: String
  },
  email: {
    type: String
  },
  password: {
    type: String
  },
  vignettes:[vignetteSchema]
},{timestamps:true})

const User = mongoose.model('users', user);
module.exports = User