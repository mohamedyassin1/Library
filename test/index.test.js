//const connection = require('../index.js');
const app = require('../index.js').app;

const assert = require('assert');
const chai = require('chai'), chaiHttp = require('chai-http');
const expect = chai.expect;


chai.use(chaiHttp);

before(function (done) {
  app.on("dbStarted", function(){
      done();
  });
});

//function beginTest(){
describe('index.js test', () => {
  //test get('/')
  it('get / endpoint', (done) => {
    chai.request(app)
    .get('/')
    .end((err, res) => {
      expect(res).to.have.status(200);
      done();
    });
    
  });

  //test get ('/api/books/')
  it('get /api/books endpoint', (done) => {
    chai.request(app)
    .get('/api/books')
    .end((err, res) => {
      expect(res).to.have.status(200);
      expect(res.body).to.be.a('array');
      done();
          
    });
    
  });

  //test get ('api/books/bookID')
  it('get /api/books/:ID endpoint with ID = 1', (done) => {
    chai.request(app)
    .get('/api/books/1')
    .end((err, res) => {
      expect(res).to.have.status(200);
      expect(res.body.ID).to.be.equal(1);
      done();
    });
    
  });

  //test get ('/search')
  it('get /search endpoint', (done) => {
    chai.request(app)
    .get('/search')
    .end((err, res) => {
      expect(res).to.have.status(200);
      done();
    });
    
  });

  //test get ('/api/books/') with query params
  it('get /api/books endpoint with keyword = "the"', (done) => {
    chai.request(app)
    .get('/api/books')
    .query({keyword: 'the'})
    .end((err, res) => {
      expect(res).to.have.status(200);
      done();
          
    });
    
  });

  //test post ('/api/borrowing/') with no values
  it('post /api/borrowing endpoint with no values', (done) => {
    chai.request(app)
    .post('/api/borrowing')
    .end((err, res) => {
      expect(res).to.have.status(400);
      done();
          
    });
    
  });

  //test post ('/api/borrowing/') with invalid values
  it('post /api/borrowing endpoint with no values', (done) => {
    chai.request(app)
    .post('/api/borrowing')
    .send({BID: 123, R_email: 'notAValidEmail@email.ca'})
    .end((err, res) => {
      expect(res).to.have.status(400);
      done();
          
    });
    
  });



});
//}