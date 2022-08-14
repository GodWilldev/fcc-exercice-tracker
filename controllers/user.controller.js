const user =  require('../models/user');


//Create and Save a Record of a Model
const apiCreateAndSaveUser = (req, res) => {
    user.findUserByName(req.body.username)
    .then((userFound) => {
        if(userFound){ //if user exist
            res.status(200).json({username: userFound.username, _id: userFound._id});
        }
        else{
            user.createAndSaveUser(req.body.username)
            .then(createdUser => {
                console.log('Enregistrement réussi !');
                res.json({username: createdUser.username, _id: createdUser._id});
            })   
            .catch (error =>{
                console.log('Enregistrement échoué !');
                res.status(500).json({error: error});
            });
        }
    })
    .catch(error => res.status(404).json(error)); 
};

//GET ALL
const apiGetAll = (req, res) => {
    user.getAll()
      .then(users => {
        if(users && users.length>0){ //if users exist
          res.status(200).json(users);
        }else{
          res.status(404).json("There are no entries");
        }
      })
      .catch((error) => res.status(404).json({error: error}));
};

//GET USERS WITH EXERCICES

//function to filter exos according to url queries
function filterExercises(exos, from, to){
  return exos.filter((exo) =>{
    const fromTest = (!from || isNaN(new Date(from)))? true : exo.date >= new Date(from);
    const toTest = (!to || isNaN(new Date(to)))? true : exo.date <= new Date(to);
    return fromTest && toTest;
  });
}

const apiGetUserWithExercices = (req, res) => {
  user.User.findById(req.params._id)
  .populate('exercices', 'description duration date')
  .exec(function (err, userWithExercice) {
    if (err) res.json(err);
    var exos = userWithExercice.exercices;
    //filter according to url query parameters
    exos = filterExercises(exos, req.query.from, req.query.to);
    //limit logs
    var limit = (req.query.limit && !isNaN(req.query.limit))? parseInt(req.query.limit): exos.length;
    exos = exos.slice(0, limit);
    //change date format
    exos = exos.map(exo => {
      return {description: exo.description, duration: exo.duration, date: exo.date.toDateString()};
    });
    res.json({username: userWithExercice.username, _id: userWithExercice._id, count: userWithExercice.exercices.length,
              log: exos
            });
  });
};


//remove by name
const apiRemoveByName = (req, res) => {
    user.removeByName(req.params.rem)
      .then(data => {
        if(data){ //if users exist
          res.status(200).json(data);
        }else{
          res.status(404).json("no data to remove");
        }
      })
      .catch((error) => res.status(404).json({error: error}));
};

//remove by regex(All)
const apiRemoveByRegex = (req, res) => {
    user.removeByRegex(/.*/)
      .then(data => {
        if(data){ //if users exist
          res.status(200).json(data);
        }else{
          res.status(404).json("no data to remove");
        }
      })
      .catch((error) => res.status(404).json({error: error}));
};


exports.apiCreateAndSaveUser = apiCreateAndSaveUser;
exports.apiGetAll = apiGetAll;
exports.apiGetUserWithExercices = apiGetUserWithExercices;
exports.apiRemoveByName = apiRemoveByName;
exports.apiRemoveByRegex = apiRemoveByRegex;