const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const vignetteSchema = new Schema({

     image_vignette: {
        type: String,
         
    },
    text: {
        type: String,
         
    },
    color: {
        type: String,
         
    },
    createdAt:Date,
    
    },{timestamps:true}
);



var vignetteModel = mongoose.model('vignettes', vignetteSchema);
module.exports = {
    vignetteModel : vignetteModel,
    vignetteSchema : vignetteSchema
};