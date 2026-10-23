//import express so i can create my server and handle the requests to my site
const express = require('express');
//import the data file which stores all my 5 projects
const data = require('./data.json');
// Create my Express application so I can use its routes and middleware
const app = express();

//Get the projects array from data.json so I can access the project objects
const projects = data.projects;

// set pug as my view engine so express can render my pug remplates into html
app.set('view engine', 'pug');

app.use('/static', express.static('public'));

//Display my projects on the home page this will render my indexpug template to display the homepage
app.get('/', (req, res) => {
  res.render('index', { projects });
});
//Display my about page will also render appget to handle the get requests to the about
app.get('/about', (req, res) => {
  res.render('about');
});

//this displays individual project pages and the id is the parameter that identifies which project soemeone requested
app.get('/project/:id', (req, res, next) => {
  const project = projects.find(
    item => item.id === Number(req.params.id)
  );
  //send missing projects to the 404 handler if the project does not exist and next continues to the next middleware
  if (!project) {
    return next();
  }
  res.render('project', { project });
});

//catch pages that don't exist this is the response because it was not found
app.use((req, res, next) => {
  const err = new Error('Page not found');
  err.status = 404;
  console.log(err.message, err.status);
  next(err);
});

// Handle errors and send a response to the browser
app.use((err, req, res, next) => {
  err.status = err.status || 500;
  err.message = err.message || 'Something went wrong';
  console.log(err.message, err.status);
    if (err.status === 404) {
  res.status(err.status).send(err.message);
    } else{
        res.status(err.status).send('Something went wrong');
    }
});

// Start my server on port 3000 listen for the incoming requests
app.listen(3000, () => {
  console.log('Server running on port 3000');
});
