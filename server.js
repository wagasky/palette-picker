const express = require('express'); // bring in express for the express server
const app = express(); // a new instance of express
const bodyParser = require('body-parser'); // middleware to allow for access to the body in a post call
const environment = process.env.NODE_ENV || 'development'; // establishing the node environment and defaulting to the development environment
const configuration = require('./knexfile')[environment]; // configuring the knex file to the dev environment
const database = require('knex')(configuration); // a new instance of database that has access to knex methods

app.use(express.static('public')) // points to the public file path
app.use(bodyParser.json()); // use bodyParser for all endpoints in the app
app.set('port', process.env.PORT || 3000); // establishes a port that is independent of the environment and defaults to 3000 if no environment is specified
app.locals.title = "Palette Picker"; //gives the app a name

app.get('/', (request, response) => { // intentionally empty

});

app.get('/api/v1/projects', (request, response) => { //endpoint for fetching all projects
  
  database('projects').select() // selects the database called projects
    .then(project => {
      response.status(200).json(project) // when successful, response is sent to app as json
    })
    .catch(error => {
      response.status(500).json({ error }) // if there is an error, catch it and send a 500 status
    })
});

app.post('/api/v1/projects', (request, response) => { //endpoint for posting a project
  const projects = request.body // grabs the content of the body in the post request
  for(let requiredParameter of ['name']) { // parameter of name is required in body
    if(!projects[requiredParameter]) {
      return response
        .status(422)
        .send({ error: `You're missing a "${requiredParameter}"`}) // send error if parameter is missing
    }
  }

  database('projects').insert(projects, 'id') // for the database called projects, insert the project and id from the body of the post request 
    .then(projects => {
      response.status(201).json({ id: projects[0] }) // send a successful response of 201 if the database successfully posts the project
    })
    .catch(error => {
      response.status(500).json({ error }); // catch any errors and send a response of 500 if the database unsuccessfully posts the project
    });
});

app.get('/api/v1/palettes', (request, response) => {//endpoint for fetching all palettes
  database('palettes').select() // selects the database called palettes
    .then(project => {
      response.status(200).json(project) // when successful, response is sent to app as json
    })
    .catch(error => {
      response.status(500).json({ error }) // if there is an error, catch it and send a 500 status
    })
});

app.post('/api/v1/palettes', (request, response) => { //endpoint for posting a palette
  const palette = request.body; // grabs the content of the body in the post request
  for(let requiredParameter of ['name', 'project_id', 'colors']) { // parameter of name, id, and colors are required in body
    if(!palette[requiredParameter]) {
      return response
        .status(422)
        .send({ error: `You're missing a "${requiredParameter}"`}) // send error if parameter is missing and list the required parameter
    }
    }
  }
  database('palettes').insert(palette, 'id') // for the database called palettes, insert the palette and id from the body of the post request 
    .then(palette => {
      console.log('post palettes being called')
      response.status(201).json({ id: palette[0] }) // send a successful response of 201 if the database successfully posts the palette
    })
    .catch(error => {
      response.status(500).json({ error }); // catch any errors and send a response of 500 if the database unsuccessfully posts the palette
    });
});

app.delete('/api/v1/palettes/:id', (request, response) => { //endpoint for deleting a palette
  const { id } = request.params // grabs the id of the palette from the body in the delete request
  
  database('palettes').where("id", id).del() // find the palette with the corresponding id and delete is using the .del method
    .then( deleted => {
      if (!deleted) {
        return response.status(404).json({error: 'no palette to delete'}) // if nothing is deleted, return a 404 error message from the database
      }
      response.status(204).json(deleted) // if it is successfully deleted, return a 204 from the database
    })
    .catch( error => { 
      response.status(500).json({ error }) // catch any errors and send a response of 500 if the database can't successfully delete the palette
    });
});

app.delete('/api/v1/projects/:id', (request, response) => { //endpoint for deleting a project
  const { id } = request.params // grabs the id of the project from the body in the delete request
  
  database('projects').where("id", id).del() // find the project with the corresponding id and delete is using the .del method
    .then( deleted => {
      if (!deleted) {
        return response.status(404).json({error: 'no project to delete'}) // if nothing is deleted, return a 404 error message from the database
      }
      response.status(204).json(deleted) // if it is successfully deleted, return a 204 from the database
    })
    .catch( error => { 
      response.status(500).json({ error }) // catch any errors and send a response of 500 if the database can't successfully delete the project
    });
});

app.listen(app.get('port'), () => { // listen for the server on the port variable declared above
  console.log(`${app.locals.title} is running on ${app.get('port')}`) // console log within the terminal the port the server is running on
});

module.exports = app; // export server app for testing