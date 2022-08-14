const express = require('express');
const app = express();
const cors = require('cors');

const user =  require('./models/user');
const userCtrl = require('./controllers/user.controller');
const exerciceCtrl = require('./controllers/exercice.controller');

let bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false})); //Use body-parser to Parse POST Requests

app.use(cors());
app.use(express.static('public'));
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});


//POST USER
app.post('/api/users', userCtrl.apiCreateAndSaveUser);

//GET ALL USERS
app.get('/api/users', userCtrl.apiGetAll);

//POST Exercice
app.post('/api/users/:_id/exercises', exerciceCtrl.apiCreateAndSaveExercice);

//GET USER WITH THEIR EXERCICES: logs
app.get('/api/users/:_id/logs', userCtrl.apiGetUserWithExercices);


/**************************************/
//REMOVE USERS
app.get('/api/users/rem/', userCtrl.apiRemoveByRegex);

//GET ALL Exercices
app.get('/api/exercices', exerciceCtrl.apiGetAll);


//REMOVE EXERCICES
app.get('/api/exercices/rem/', exerciceCtrl.apiRemoveAll);

//populate users test
app.get('/api/users/:id/popu', (req, res) => {
  user.User.findById(req.params.id)
  .populate('exercices')
  .exec(function (err, newUser) {
    if (err) res.json(err);
    console.log('The author is %s', newUser.exercices[0].description);
    res.json(newUser);
  });
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})


/* 
//POST USER
app.post('/api/users', (req, res) => {  
  user.findUserByName(req.body.username)
  .then(userFound => {
    if(userFound){ //if user exist
      res.status(200).json({username: userFound.username, _id: userFound._id});
    }
    else{
        let newUsername = req.body.username;
        let newUser = new user.User({
          username: newUsername,
        });
      const data = user.createAndSaveUser(newUsername);
      res.status(200).json(data);
      /*
      newUser.save(function(){
        user.findUserByName(req.body.username)
        .then(newUser =>{
          //console.log(newUser);
          res.status(200).json({username: newUser.username, _id: newUser._id});
        })
        .catch((error) => res.status(404).json(error));
      });*\
    }
  })
  .catch((error) => res.status(404).json(error));
});
 */