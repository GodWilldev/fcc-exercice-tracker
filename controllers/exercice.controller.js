const exercice =  require('../models/exercice');
const user =  require('../models/user');

//Create and Save a Record of a Model
const apiCreateAndSaveExercice = (req, res) => {
    exercice.createAndSaveExercice(req.params._id, req.body.description, req.body.duration, req.body.date)
    .then(createdExercice => {
        if(!createdExercice) console.log("Enregistrement vide " + createdExercice);
        else{
            console.log('Exercice save successfully');
            
            //Add it to the user's exercices field
            user.User.findByIdAndUpdate(
                createdExercice.user_id, 
                {$push: { exercices: createdExercice._id} },
                {new: true},
                function (err, newUser) {
                  if (err) res.json(err);
                  console.log('User updated successfully');
                  exercice.Exercice.findById(createdExercice._id)
                  .populate('user_id')
                  .exec(function(err, popuExercice){
                    if(err) res.status(500).json({error: err});
                    res.json({_id: popuExercice.user_id._id, username: popuExercice.user_id.username, description: popuExercice.description, duration: popuExercice.duration, date: popuExercice.date.toDateString()});
                  });
                }
            )
        }
    })   
    .catch (error =>{
        console.log('save Exercice failed '+ error);
        res.status(500).json({error: error});
    });
};

//GET ALL
const apiGetAll = (req, res) => {
    exercice.getAll()
      .then(exercices => {
        if(exercices && exercices.length>0){ //if exercices exist
          res.status(200).json(exercices);
        }else{
          res.status(404).json("There are no entries");
        }
      })
      .catch((error) => res.status(404).json({error: error}));
};

//removeAll
const apiRemoveAll = (req, res) => {
    exercice.removeByRegex()
      .then(data => {
        if(data){ //if exercices exist
          res.status(200).json(data);
        }else{
          res.status(404).json("no data to remove");
        }
      })
      .catch((error) => res.status(404).json({error: error}));
};


exports.apiCreateAndSaveExercice = apiCreateAndSaveExercice;
exports.apiGetAll = apiGetAll;
exports.apiRemoveAll = apiRemoveAll;