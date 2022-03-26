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

  //Test HTML GET request returns an OK(200) status for login page
  it('get test login', (done) => {
    chai.request(app)
    .get('/login')
    .end((err, res) => {
      expect(res).to.have.status(200);
      // expect(res.body).to.be.a('array');
      done();  
    });
  });

  //Test can login with verified email, username and password
  it('post test login', (done) => {
    chai.request(app)
    .post('/api/login')
    .send({email: 'john@gmail.com', username:'john', password:'12345'})
    .end((err, res) => {
      expect(res).to.have.status(200);
      // expect(res.body).to.be.a('array');
      done();  
    });
  });

  //Test rejects invalid email, by redirecting back to valid HTML page
  it('post test login', (done) => {
    chai.request(app)
    .post('/api/login')
    .send({email: 'kelly@gmail.com', username:'john', password:'12345'})
    .end((err, res) => {
      expect(res).to.have.status(200);
      // expect(res.body).to.be.a('array');
      done();  
    });
  });

  //Test rejects invalid username, by redirecting back to valid HTML page
  it('post test login', (done) => {
    chai.request(app)
    .post('/api/login')
    .send({email: 'john@gmail.com', username:'kelly', password:'12345'})
    .end((err, res) => {
      expect(res).to.have.status(200);
      // expect(res.body).to.be.a('array');
      done();  
    });
  });

  //Test sign-up page valid HTML OK(200) request
  it('get test sign-up', (done) => {
    chai.request(app)
    .get('/signUp')
    .end((err, res) => {
      expect(res).to.have.status(200);
      // expect(res.body).to.be.a('array');
      done();  
    });
  });

   //Test rejects already used username, by redirecting back to valid HTML page
  it('post test sign-up', (done) => {
    chai.request(app)
    .post('/api/signUp')
    .send({email: 'john@gmail.com', username:'john', password:'12345'})
    .end((err, res) => {
      expect(res).to.have.status(200);
      // expect(res.body).to.be.a('array');
      done();  
    });
  });

  //Test logout redirection to HTML OK(200) Page
  it('get test logout', (done) => {
    chai.request(app)
    .get('/logout')
    .end((err, res) => {
      expect(res).to.have.status(200);
      done();
    });
  });

  //Test valid admin email, by redirecting back to valid HTML page
  it('post test login', (done) => {
    chai.request(app)
    .post('/api/login')
    .send({email: 'admin@gmail.com', username:'admin', password:'12345'})
    .end((err, res) => {
      expect(res).to.have.status(200);
      // expect(res.body).to.be.a('array');
      done();  
    });
  });

  //Test rejects invalid admin email, by redirecting back to valid HTML page
  it('post test login', (done) => {
    chai.request(app)
    .post('/api/login')
    .send({email: 'admin@gmail.com', username:'user', password:'12345'})
    .end((err, res) => {
      expect(res).to.have.status(200);
      // expect(res.body).to.be.a('array');
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