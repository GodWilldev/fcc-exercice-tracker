require('dotenv').config(); //import and load .env variables

//Install and Set Up Mongoose
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI, 
  { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

//DATABASE INITIALISATION
//Create a Model
let exerciceSchema  = new mongoose.Schema({
    user_id: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true}, //reference to corresponding user
    description: { type: 'String', required: true },
    duration: { type: 'Number', required: true },
    date: { type: 'Date', default: new Date() }
});
const Exercice = mongoose.model('Exercice', exerciceSchema);
  
//Create and Save a Record of a Model
const createAndSaveExercice = async (user_id, description, duration, date) => {
    let newExercice = new Exercice({
        user_id: user_id,
        description: description,
        duration: duration,
        //date: new Date(date)
    });
    let date_conv = new Date(date);
    if(!isNaN(date_conv)) newExercice.date = date_conv; //handle Invalid Date
    try {
      return await newExercice.save();
    } catch (error) {
      console.log(`Could not save items ${error}`);
    }
};

//find all
const getAll = async () => {
    try {
      return await Exercice.find();
    } catch (error) {
      console.log(`Could not find items ${error}`);
    }
};

//find by user_id
const findExerciceByUser = async (user_id) => {
    try {
      return await Exercice.findOne({user_id: user_id});
    } catch (error) {
      console.log(`Could not find item ${error}`);
    }
};

//remove by regex
const removeByRegex = async (regex = /.*/) => { //by default match anything
  try {
    return await Exercice.deleteMany({description: { $regex : regex }});
  } catch (error) {
    console.log(`Could not remove item ${error}`);
  }
};


exports.Exercice = Exercice;
exports.createAndSaveExercice = createAndSaveExercice;
exports.getAll = getAll;
exports.findExerciceByUser = findExerciceByUser;
exports.removeByRegex = removeByRegex;