var express = require('express');
var router = express.Router();
let db = require('../database/models');
const { Op } = require("sequelize");

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'DH Movies' });
});

router.get('/movies', function (req, res) {
  // devolver todas las peliculas - Ejercicio 1
  db.movies.findAll()
    .then(movies => {
      res.render('movies/index', { movies: movies });
    })
    .catch(error => {
      res.render('error.js', { error: error });
    })
})

router.get('/movies/create', function (req, res) {
  // buscar la lista de todos los generos para visualizar en el formulario
  db.genres.findAll()
    .then(genres => {
      res.render('movies/create', { genres: genres });
    })
    .catch(error => {
      res.render('error.js', { error: error });
    })
})

router.get('/movies/new', function (req, res) {
  // devolver las últimas 5 películas ordenadas según fecha de estreno - Ejercicio 3
  db.movies.findAll({
    order: [['release_date', 'DESC']],
    limit: 5
  })
    .then(movies => {
      res.render('movies/new', { movies: movies })
    })
})

router.get('/movies/recommended', function (req, res) {
  // devolver las películas cuyo rating sea mayor o igual a 8 - Ejercicio 4
  db.movies.findAll({
    where:  {
      rating: { [Op.gte]: 8 }
    }
  })
    .then(movies => {
      res.render('movies/recommended', { movies: movies })
    })
})

router.get('/movies/search', function (req, res) {
  // devuelve la página de búsqueda de películas - Ejercicio 5
  res.render('movies/search');
})

router.post('/movies/search', function (req, res) {
  // devolver el resultado de la búsqueda de películas - Ejercicio 5
  console.log(req.body);
  db.movies.findAll({
    where:  {
      title: { [Op.like]: '%' + req.body.title +'%' },
    },
    order: [['title', req.body.order]]
  })
    .then(movies => {
      // Deberia agregar un IF acá para bifurcar en caso de que no haya resultados para la búsqueda?
      res.render('movies/searchresults', { movies: movies });
    })
    .catch(error => {
      res.render('error', {error: error});
    })
})

router.get('/movies/:id', function (req, res) {
  // devolver solo la pelicula especificada por el id - Ejercicio 2
  db.movies.findByPk(req.params.id)
    .then(movie => {
      res.render('movies/show', { movie: movie })
    })
    .catch(error => {
      res.render('error', { error: error });
    })
})

router.get('/movies/:id/edit', function (req, res) {
  // Creo que tengo que hacer 2 .then? O primero buscar la película, con eso buscar el genre_id y después mostrarlo? (Consultar a Ale/Agus)
  db.movies.findByPk(req.params.id)
    .then(movie => {
      res.render('movies/edit', { genres: [], movie: movie})
    })
})

// ***************************************************

router.patch('/movies/:id', function (req, res) {
  // No estoy muy seguro de lo que hace el método patch
  res.redirect('/movies')
})

router.delete('/movies/:id', function (req, res) {
  // devolver solo la pelicula especificada por el id
})

module.exports = router;
