const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();
const port = 3001;

// configure body-parser
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// configure mongoose
mongoose.connect("mongodb+srv://Raji:R%40ji1234@movies.xmtip6t.mongodb.net/movies?retryWrites=true&w=majority", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// define movie schema
const MovieSchema = new mongoose.Schema({
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
app.get('/getAllMovies', async (req, res) => {
  try {
    const movies = await Movie.find();
    res.send(movies);
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving movies."
    });
  }
});

app.post('/addNewMovie', async (req, res) => {
  try {
    const movie = new Movie({
      title: req.body.title,
      director: req.body.director,
      genre: req.body.genre,
      year: req.body.year
    });
    const data = await movie.save();
    res.send(data);
  } catch (err) {
    if (err instanceof SyntaxError) {
        res.status(400).send({ message: "Invalid JSON format." });
      } else {
        res.status(500).send({
          message: err.message || "Some error occurred while creating the Movie."
        });
      }
    }
  });
app.put('/editMovie/:id', async (req, res) => {
  try {
    const movie = await Movie.findByIdAndUpdate(req.params.id, {
      title: req.body.title,
      director: req.body.director,
      genre: req.body.genre,
      year: req.body.year
    }, { new: true });
    if (!movie) {
      return res.status(404).send({
        message: "Movie not found with id " + req.params.id
      });
    }
    res.send(movie);
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return res.status(404).send({
        message: "Movie not found with id " + req.params.id
      });
    }
    return res.status(500).send({
      message: "Error updating movie with id " + req.params.id
    });
  }
});

app.delete('/deleteMovie/:id', async (req, res) => {
  try {
    const movie = await Movie.findByIdAndRemove(req.params.id);
    if (!movie) {
      return res.status(404).send({
        message: "Movie not found with id " + req.params.id
      });
    }
    res.send({ message: "Movie deleted successfully!" });
  } catch (err) {
    if (err.kind === 'ObjectId' || err.name === 'NotFound') {
      return res.status(404).send({
        message: "Movie not found with id " + req.params.id
      });
    }
    return res.status(500).send({
      message: "Could not delete movie with id " + req.params.id
    });
  }
});

// start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}.`);
});
