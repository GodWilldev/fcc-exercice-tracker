require('dotenv').config(); //import and load .env variables

//Install and Set Up Mongoose
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI, 
  { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

//DATABASE INITIALISATION
//Create a Model
let userSchema  = new mongoose.Schema({
    username: { type: 'String', required: true },
    exercices : [{type: mongoose.Schema.Types.ObjectId, ref: 'Exercice'}] //reference to user's exercices
});
const User = mongoose.model('User', userSchema);
  

//Create and Save a Record of a Model
const createAndSaveUser = async (username) => {
  let newUser = new User({
      username: username,
  });
  try {
    return await newUser.save();
  } catch (error) {
    console.log(`Could not save items ${error}`);
  }
};

//find all documents
const getAll = async () => {
    try {
      return await User.find();
    } catch (error) {
      console.log(`Could not find items ${error}`);
    }
};

//find by username
const findUserByName = async (v_username) => {
    try {
      return await User.findOne({username: v_username});
    } catch (error) {
      console.log(`Could not find item ${error}`);
    }
};


//remove by name
const removeByName = async (v_username) => {
  try {
    return await User.deleteMany({username: v_username});
  } catch (error) {
    console.log(`Could not remove item ${error}`);
  }
};

//remove by regex
const removeByRegex = async (regex = /^fcc_test_/) => {
  try {
    return await User.deleteMany({username: { $regex : regex }});
  } catch (error) {
    console.log(`Could not remove item ${error}`);
  }
};


exports.User = User;
exports.createAndSaveUser = createAndSaveUser;
exports.getAll = getAll;
exports.findUserByName = findUserByName;
exports.removeByName = removeByName;
exports.removeByRegex = removeByRegex;