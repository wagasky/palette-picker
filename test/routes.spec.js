const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
const server = require('../server');

chai.use(chaiHttp);

describe('Client Routes', () => {
   it('should return the homepage', () => {
    return chai.request(server)
    .get('/')
    .then(response => {
      response.should.have.status(200);
      response.should.be.html;
    })
    .catch(err => {
      throw err;
    });
  });

  it('should return a 404 for a route that does not exist', () => {
    return chai.request(server)
    .get('/badURL')
    .then(response => {
      response.should.have.status(404);
    })
    .catch(err => {
      throw err;
    });
  });
});

describe('API Routes', () => {

  describe('GET /api/v1/projects', () => {
    it('should return all of the projects', () => {
      return chai.request(server)
      .get('/api/v1/projects')
      .then(response => {
        response.should.have.status(200);
        response.should.be.json;
        response.body.should.be.a('array');
        response.body.length.should.equal(2);
        response.body[0].should.have.property('name')
        response.body[0].name.should.equal('Bright Project')
      })
      .catch(err => {
        throw err;
      });
    });
  });

    describe('POST /api/v1/projects', () => {
      it('should create a new project within the database', () => {
      return chai.request(server)
      .post('/api/v1/projects')
      .send({                  
        name: 'Test',
      })
      .then(response => {
        response.should.have.status(201); 
        response.body.should.be.a('object');
        response.body.should.have.property('id');
        response.body.id.should.equal('4');
        response.body.should.have.property('name');
        response.body.name.should.equal('Testy');
      })
      .catch(err => {
        throw err;
      });
    });
  });
});
