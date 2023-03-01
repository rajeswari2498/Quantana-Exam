const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();
const port = 3000;

// configure body-parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// configure mongoose
mongoose.Promise = global.Promise;
mongoose.connect("mongodb+srv://Raji:" + encodeURIComponent("R@ji1234") + "@movies.xmtip6t.mongodb.net/movies?retryWrites=true&w=majority", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// define movie schema
const MovieSchema = mongoose.Schema({
  title: String,
  director: String,
  genre: String,
  year: Number
}, {
  timestamps: true
});

// define movie model
const Movie = mongoose.model('Movie', MovieSchema);

// define CRUD APIs
app.get('/getAllMovies', (req, res) => {
  Movie.find()
    .then(movies => {
      res.send(movies);
    }).catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving movies."
      });
    });
});

app.post('/addNewMovie', (req, res) => {
  const movie = new Movie({
    title: req.body.title,
    director: req.body.director,
    genre: req.body.genre,
    year: req.body.year
  });

  movie.save()
    .then(data => {
      res.send(data);
    }).catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the Movie."
      });
    });
});

app.put('/editMovie/:id', (req, res) => {
  Movie.findByIdAndUpdate(req.params.id, {
    title: req.body.title,
    director: req.body.director,
    genre: req.body.genre,
    year: req.body.year
  }, { new: true })
    .then(movie => {
      if (!movie) {
        return res.status(404).send({
          message: "Movie not found with id " + req.params.id
        });
      }
      res.send(movie);
    }).catch(err => {
      if (err.kind === 'ObjectId') {
        return res.status(404).send({
          message: "Movie not found with id " + req.params.id
        });
      }
      return res.status(500).send({
        message: "Error updating movie with id " + req.params.id
      });
    });
});

app.delete('/deleteMovie/:id', (req, res) => {
  Movie.findByIdAndRemove(req.params.id)
    .then(movie => {
      if (!movie) {
        return res.status(404).send({
          message: "Movie not found with id " + req.params.id
        });
      }
      res.send({ message: "Movie deleted successfully!" });
    }).catch(err => {
      if (err.kind === 'ObjectId' || err.name === 'NotFound') {
        return res.status(404).send({
          message: "Movie not found with id " + req.params.id
        });
      }
      return res.status(500).send({
        message: "Could not delete movie with id " + req.params.id
      });
    });
});

// start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}.`);
});
