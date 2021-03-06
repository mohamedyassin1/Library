//const connection = require('../index.js');
const app = require('../index.js').app;

const assert = require('assert');
const chai = require('chai'), chaiHttp = require('chai-http');
const expect = chai.expect;


chai.use(chaiHttp);

before(function (done) {
  app.on("dbStarted", function () {
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
      .send({ email: 'john@gmail.com', username: 'john', password: '12345' })
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
      .send({ email: 'kelly@gmail.com', username: 'john', password: '12345' })
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
      .send({ email: 'john@gmail.com', username: 'kelly', password: '12345' })
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
      .send({ email: 'john@gmail.com', username: 'john', password: '12345' })
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
      .send({ email: 'admin@gmail.com', username: 'admin', password: '12345' })
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
      .send({ email: 'admin@gmail.com', username: 'user', password: '12345' })
      .end((err, res) => {
        expect(res).to.have.status(200);
        // expect(res.body).to.be.a('array');
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
      .query({ keyword: 'the' })
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
      .send({ BID: 123, R_email: 'notAValidEmail@email.ca' })
      .end((err, res) => {
        expect(res).to.have.status(400);
        done();

      });

  });

  //Test book rating is posted, by redirecting back to valid HTML page
  it('post AddBookRating', (done) => {
    chai.request(app)
      .post('/api/AddRatingForABook')
      .send({ email: 'john@gmail.com', bookrate: '4', bid: '3npm' })
      .end((err, res) => {
        expect(res).to.have.status(200);
        done();
      });
  });

  //Testing post request to add books as admin.
  it('post /api/books', (done) => {
    chai.request(app)
      .post('/api/books')
      .send({ name: 'Funny Book', genre: 'Comedy', status: 'Available' })
      .end((err, res) => {
        expect(res).to.have.status(200);
        done();
      });
  });

  //test post ('/api/books/:id') with no values
  it('put /api/books/:id endpoint with no values', (done) => {
    chai.request(app)
    .put('/api/books/:id')
    .end((err, res) => {
      expect(res).to.have.status(400);
      done();
    });
  });
  

  //test post ('/api/books/:id') with valid primary key
  it('put /api/books/:id new book status', (done) => {
    chai.request(app)
    .put('/api/books/1')
    .send({ID: 1, Status: 'Available'})
    .end((err, res) => {
      expect(res).to.have.status(200);
      done();
    });
  });

  //testing reserved books endpoint with valid email
  it('/api/reservedBooks/ valid email', (done) => {
    chai.request(app)
    .get('/api/reservedBooks/123')
    .end((err, res) => {
      expect(res).to.have.status(200);
      done();
    });
  });

  //test post ('/api/books/:id') with no values
  it('confirmReservation page render', (done) => {
    chai.request(app)
    .get('/confirmReservation?ID=1')
    .end((err, res) => {
      expect(res).to.have.status(200);
      done();
    });
  });

  //render accountInformation
  it('account information page render', (done) => {
    chai.request(app)
    .get('/accountInformation')
    .end((err, res) => {
      expect(res).to.have.status(200);
      done();
    });
  });

  //Testing patch method to edit books as admin.
  it('patch /updateBookForm', (done) => {
    chai.request(app)
      .patch('/updateBookForm')
      .send({ name: 'Funny Book', status: 'Not Available' })
      .end((err, res) => {
        expect(res).to.have.status(200);
        done();
      });
  });
  //Testing delete method to delete books as admin.
  it('delete /deleteBook', (done) => {
    chai.request(app)
      .delete('/deleteBook')
      .send({ name: 'Funny Book' })
      .end((err, res) => {
        expect(res).to.have.status(200);
        done();
      });
  });

  //test get ('/api/bookDetail/') with ID = 1
  it('get /api/bookDetail endpoint with keyword = "the"', (done) => {
    chai.request(app)
      .get('/api/bookDetail')
      .query({ ID: 1 })
      .end((err, res) => {
        expect(res).to.have.status(200);
        done();

      });

  });

  //test get ('/api/getBookDetail/') with no query params
  it('get /api/getBookDetail endpoint with keyword = "the"', (done) => {
    chai.request(app)
      .get('/api/getBookDetail')
      //.query({ ID: 1 })
      .end((err, res) => {
        expect(res).to.have.status(200);
        done();

      });

  });

  //test get ('/api/getBookDetail/') with name = "The Great Gatsby"
  it('get /api/getBookDetail endpoint with keyword = "the"', (done) => {
    chai.request(app)
      .get('/api/getBookDetail')
      .query({ name: 'The Great Gatsby' })
      .end((err, res) => {
        expect(res).to.have.status(200);
        done();

      });

  });

    //Testing delete method to delete books as admin.
    it('personal /personal render page', (done) => {
      chai.request(app)
        .get('/personal')
        .end((err, res) => {
          expect(res).to.have.status(200);
          done();
        });
    });
  
    //Testing delete method to delete books as admin.
    it('submit comment /api/submitComment', (done) => {
      chai.request(app)
        .post('/api/submitComment')
        .send({comments:'Great book', bid:'5', email:'john@gmail.com'})
        .end((err, res) => {
          expect(res).to.have.status(200);
          done();
        });
    });  

});
//}
