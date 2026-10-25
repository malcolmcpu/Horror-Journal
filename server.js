require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const Review = require('./app/models/Review');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use('/public', express.static(path.join(__dirname, 'public')));

mongoose
  .connect(process.env.myUrl)
  .then(() => {
    app.listen(3000, () => {
      const database = mongoose.connection.name;
      console.log('Listening on Port 3000!');
      console.log(`Database connected to: ${database} !`);
    });
  })
  .catch((err) => {
    console.log(err);
  });

// ALL API TOUCHING LOGIC BELOW

// LOGIC FOR SERVING UP THE HOME PAGE
app.get('/', async (req, res) => {
  // db.collection('movies')
  //   .find()
  //   .toArray((err, result) => {
  //     if (err) return console.log(err);
  //     console.log(result);
  //     res.render('index.html'); //rendering the ejs as an HTML file
  //   });
  const reviews = await Review.find().sort({ createdAt: -1 });
  res.render('index', { reviews });
});

//LOGIC FOR SERVING UP ADD REVIEW PAGE
app.get('/add', (req, res) => {
  res.render('addReview', { review: {} });
});

//LOGIC FOR ADDING A NEW REVIEW TO THE DATABASE
app.post('/add-review', async (req, res) => {
  try {
    await Review.create({
      title: req.body.title,
      year: req.body.year,
      posterUrl: req.body.posterUrl,
      subgenre: req.body.subgenre,
      scareFactor: req.body.scareFactor,
      watchedOn: req.body.watchedOn,
      review: req.body.review,
    });
    console.log('New movie added to database!');
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.status(400).render('form', { review: req.body });
  }
});

//LOGIC FOR RETRIEVING AND UPDATING AN EXISTING REVIEW
//
//
//
///////////REVIEW RETRIEVAL
app.get('/edit/:id', async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).send('Can not find review');
    }
    res.render('addReview', { review });
  } catch (err) {
    console.error(err);
    res.status(404).send('Can not find review');
  }
});
//
//
//
//////////REVIEW UPDATE
app.post('/edit/:id', async (req, res) => {
  try {
    await Review.findByIdAndUpdate(
      req.params.id,
      {
        title: req.body.title,
        year: req.body.year,
        posterUrl: req.body.posterUrl,
        subgenre: req.body.subgenre,
        scareFactor: req.body.scareFactor,
        watchedOn: req.body.watchedOn || undefined,
        review: req.body.review,
      },
      { runValidators: true },
    );
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res
      .status(400)
      .render('form', { review: { ...req.body, _id: req.params.id } });
  }
});

//LOGIC FOR DELETING A CURRENT REVIEW
app.delete('/delete/:id', async (req, res) => {
  try {
    const deleteThisReview = await Review.findByIdAndDelete(req.params.id);
    if (!deleteThisReview) {
      return res.status(404).json({ message: 'Review not found' });
    }
    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});
