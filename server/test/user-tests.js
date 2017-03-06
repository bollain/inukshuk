/* eslint-env mocha */
/* eslint-disable handle-callback-err: "error" */
var chai = require('chai')
var chaiHttp = require('chai-http')
var index = require('../index.js')
var should = chai.should() // eslint-disable-line
var User = require('../models/User')

chai.use(chaiHttp)

describe('Users', () => {
  beforeEach((done) => { // Before each test we empty the database
    User.remove({}, (err) => {
      if (err) {} // I dont like this hack but the linter complains
      done()
    })
  })
/*
  * Test the /POST route
  */
  describe('/POST user', () => {
    it('it should create a User', (done) => {
      let newUser = {
        userName: 'Miguelito85',
        firstName: 'Miguelito',
        lastName: 'Lopez',
        phoneNumber: '+17785583029',
        email: 'bollain@gmail.com'
      }
      chai.request(index)
            .post('/users')
            .send(newUser)
            .end((err, res) => {
              if (err) {}
              res.should.have.status(200)
              res.body.should.be.a('object')
              res.body.should.have.property('_id')

              done()
            })
    })
  })

  describe('/POST user', () => {
    it('it should NOT create user a with invald email', (done) => {
      let newUser = {
        userName: 'Miguelito85',
        firstName: 'Miguelito',
        lastName: 'Lopez',
        phoneNumber: '+17785583029',
        email: 'bollaingmail.com'
      }
      chai.request(index)
            .post('/users')
            .send(newUser)
            .end((err, res) => {
              res.should.have.status(401)
              if (err) {}
              done()
            })
    })
  })

  describe('/POST user', () => {
    it('it should NOT create a with an invalid phoneNumber', (done) => {
      let newUser = {
        userName: 'Miguelito85',
        firstName: 'Miguelito',
        lastName: 'Lopez',
        phoneNumber: '911',
        email: 'bollain@gmail.com'
      }
      chai.request(index)
            .post('/users')
            .send(newUser)
            .end((err, res) => {
              res.should.have.status(401)
              if (err) {}
              done()
            })
    })
  })

  describe('/POST user', () => {
    it('it should NOT create a user when userName exists', (done) => {
      let newUser = {
        userName: 'Miguelito85',
        firstName: 'Miguelito',
        lastName: 'Lopez',
        phoneNumber: '7785583029',
        email: 'bollain@gmail.com'
      }
      chai.request(index)
            .post('/users')
            .send(newUser)
            .end((err, res) => {
              res.should.have.status(200)
              if (err) {}
            })

      let duplicateUser = {
        userName: 'Miguelito85',
        firstName: 'Mike',
        lastName: 'Lopez',
        phoneNumber: '7785583029',
        email: 'mikey@gmail.com'
      }

      chai.request(index)
            .post('/users')
            .send(duplicateUser)
            .end((err, res) => {
              res.should.have.status(401)
              if (err) {}
              done()
            })
    })
  })

  describe('/POST user', () => {
    it('it should NOT create a user when email exists', (done) => {
      let existingUser = new User({
        userName: 'papaJohn',
        firstName: 'Papa',
        lastName: 'John',
        phoneNumber: '7785583029',
        email: 'bollain@gmail.com'
      })
      existingUser.save((err, user) => {
        let duplicateUser = {
          userName: 'Miguelito85',
          firstName: 'Mike',
          lastName: 'Lopez',
          phoneNumber: '7785584040',
          email: 'bollain@gmail.com'
        }
        if (err) {}
        chai.request(index)
              .post('/users')
              .send(duplicateUser)
              .end((err, res) => {
                res.should.have.status(422)
                if (err) {}
                done()
              })
      })
    })
  })

  // Test the PUT endpoint
  describe('/PUT user', () => {
    it('it should update a user correctly', (done) => {
      let existingUser = new User({
        userName: 'papaJohn',
        firstName: 'Papa',
        lastName: 'John',
        phoneNumber: '7785583029',
        email: 'bollain@gmail.com'
      })
      existingUser.save((err, user) => {
        let update = {
          id: user._id,
          userName: 'papaJohn',
          firstName: 'Papa',
          lastName: 'John',
          phoneNumber: '7785564040',
          email: 'bollain@gmail.com'
        }
        if (err) {}
        chai.request(index)
            .put('/users')
            .send(update)
            .end((err, res) => {
              res.should.have.status(200)
              if (err) {}
              done()
            })
      })
    })
  })

  describe('/PUT user', () => {
    it('it should not update a user\'s email', (done) => {
      let existingUser = new User({
        userName: 'papaJohn',
        firstName: 'Papa',
        lastName: 'John',
        phoneNumber: '7785583029',
        email: 'bollain@gmail.com'
      })
      existingUser.save((err, user) => {
        let update = {
          id: user._id,
          userName: 'papaJohn',
          firstName: 'Papa',
          lastName: 'John',
          phoneNumber: '7785583029',
          email: 'papaJ@gmail.com'
        }
        if (err) {}
        chai.request(index)
            .put('/users')
            .send(update)
            .end((err, res) => {
              res.should.have.status(200)
              if (err) {}
            })
        chai.request(index)
            .get('/users/' + user._id)
            .end((err, res) => {
              res.should.have.status(200)
              res.body.should.have.property('email').eql('bollain@gmail.com')
              if (err) {}
              done()
            })
      })
    })
  })

  // Test GET
  describe('/GET user', () => {
    it('it should get an existing user', (done) => {
      let existingUser = new User({
        userName: 'papaJohn',
        firstName: 'Papa',
        lastName: 'John',
        phoneNumber: '7785583029',
        email: 'bollain@gmail.com'
      })
      existingUser.save((err, user) => {
        if (err) {}
        chai.request(index)
            .get('/users/' + user._id)
            .end((err, res) => {
              res.should.have.status(200)
              res.body.should.have.property('userName').eql('papaJohn')
              res.body.should.have.property('firstName').eql('Papa')
              res.body.should.have.property('lastName').eql('John')
              res.body.should.have.property('phoneNumber').eql('7785583029')
              res.body.should.have.property('email').eql('bollain@gmail.com')
              if (err) {}
              done()
            })
      })
    })
  })

  // TEST DELETE
  describe('/DELETE user', () => {
    it('it should delete a user', (done) => {
      let existingUser = new User({
        userName: 'papaJohn',
        firstName: 'Papa',
        lastName: 'John',
        phoneNumber: '7785583029',
        email: 'bollain@gmail.com'
      })
      existingUser.save((err, user) => {
        if (err) {}
        chai.request(index)
            .delete('/users/' + user._id)
            .end((err, res) => {
              res.should.have.status(200)
              if (err) {}
              done()
            })
      })
    })
  })
})
