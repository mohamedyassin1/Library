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
  it('get / endpoint', (done) => {
    chai.request(app)
    .get('/')
    .end((err, res) => {
      expect(res).to.have.status(200);
      done();
    });
    
  });

  it('get /api/books endpoint', (done) => {
    chai.request(app)
    .get('/api/books')
    .end((err, res) => {
      expect(res).to.have.status(200);
      expect(res.body).to.be.a('array');
      done();
          
    });
    
  });

  it('get /api/books/:ID endpoint with ID = 1', (done) => {
    chai.request(app)
    .get('/api/books/1')
    .end((err, res) => {
      expect(res).to.have.status(200);
      expect(res.body.ID).to.be.equal(1);
      done();
    });
    
  });

});
//}