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
  it('get test homepage', (done) => {
    chai.request(app)
    .get('/')
    .end((err, res) => {
      expect(res).to.have.status(200);
      done();
    });
    
  });

  it('get test homepage', (done) => {
    chai.request(app)
    .get('/api/books')
    .end((err, res) => {
      expect(res).to.have.status(200);
      expect(res.body).to.be.a('array');
      done();
          
    });
    
  });

});
//}