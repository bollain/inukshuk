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
        firstName: 'Miguelito',
        lastName: 'Lopez',
        phoneNumber: '+17785583029',
        email: 'bollain@gmail.com',
        password: 'miguelito'
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

    it('it should NOT create a with an invalid phoneNumber', (done) => {
      let newUser = {
        firstName: 'Miguelito',
        lastName: 'Lopez',
        phoneNumber: '911',
        email: 'bollain6@gmail.com',
        password: 'miguelito'
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

    it('it should NOT create a with an invalid email', (done) => {
      let newUser = {
        firstName: 'Miguelito',
        lastName: 'Lopez',
        phoneNumber: '911',
        email: 'bollaingmail.com',
        password: 'miguelito'
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

    it('it should NOT create a user when email exists', (done) => {
      let existingUser = new User({
        firstName: 'Papa',
        lastName: 'John',
        phoneNumber: '7785583029',
        email: 'miguel@gmail.com',
        password: 'miguelito'
      })
      existingUser.save((err, user) => {
        let duplicateUser = {
          firstName: 'Mike',
          lastName: 'Lopez',
          phoneNumber: '7785584040',
          email: 'miguel@gmail.com',
          password: 'miguelito'
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
    it('it should update a user phone correctly', (done) => {
      let existingUser = new User({
        firstName: 'Papa',
        lastName: 'John',
        phoneNumber: '7785583029',
        email: 'deezenuts@gmail.com',
        password: 'miguelito'
      })
      existingUser.save((err, user) => {
        let update = {
          id: user._id,
          firstName: 'Papa',
          lastName: 'John',
          phoneNumber: '7785564040',
          email: 'deezenuts@gmail.com',
          password: 'miguelito'
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

    it('it should update a user\'s email', (done) => {
      let existingUser = new User({
        firstName: 'Papa',
        lastName: 'John',
        phoneNumber: '7785583029',
        email: 'bollain@gmail.com',
        password: 'miguelito'
      })
      existingUser.save((err, user) => {
        let update = {
          id: user._id,
          firstName: 'Papa',
          lastName: 'John',
          phoneNumber: '7785583029',
          email: 'papaj@gmail.com',
          password: 'miguelito'
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
              res.body.should.have.property('email').eql('papaj@gmail.com')
              if (err) {}
              done()
            })
      })
    })

    it('it should not update with an invalid email', (done) => {
      let existingUser = new User({
        firstName: 'Papa',
        lastName: 'John',
        phoneNumber: '7785583029',
        email: 'rekt@gmail.com',
        password: 'miguelito'
      })
      existingUser.save((err, user) => {
        let update = {
          id: user._id,
          firstName: 'Papa',
          lastName: 'John',
          phoneNumber: '7785583029',
          email: 'papajgmail.com',
          password: 'miguelito'
        }
        if (err) {}
        chai.request(index)
              .put('/users')
              .send(update)
              .end((err, res) => {
                res.should.have.status(400)
                if (err) {}
              })
        done()
      })
    })

    it('it should not update with an invalid phoneNumber', (done) => {
      let existingUser = new User({
        firstName: 'Papa',
        lastName: 'John',
        phoneNumber: '7785583029',
        email: 'bollain@gmail.com',
        password: 'miguelito'
      })
      existingUser.save((err, user) => {
        let update = {
          id: user._id,
          firstName: 'Papa',
          lastName: 'John',
          phoneNumber: '69',
          email: 'bollain@gmail.com'
        }
        if (err) {}
        chai.request(index)
              .put('/users')
              .send(update)
              .end((err, res) => {
                res.should.have.status(400)
                if (err) {}
              })
        done()
      })
    })

    it('it should not update with a non existing user ID', (done) => {
      let fakeUser = {
        id: 69,
        firstName: 'Papa',
        lastName: 'John',
        phoneNumber: '7785583029',
        email: 'bollain@gmail.com',
        password: 'miguelito'
      }
      chai.request(index)
            .put('/users')
            .send(fakeUser)
            .end((err, res) => {
              res.should.have.status(404)
              if (err) {}
            })
      done()
    })

    it('should not update with email that already exists', (done) => {
      let firstUser = new User({
        firstName: 'Papa',
        lastName: 'John',
        phoneNumber: '7785583029',
        email: 'bollain@gmail.com',
        password: 'miguelito'
      })
      firstUser.save((err, user) => {
        if (err) { console.log(err) }
          // Do nothing with user
        if (user) {}
        let secondUser = new User({
          firstName: 'Miguel',
          lastName: 'Lopez',
          phoneNumber: '7785584040',
          email: 'miguel@gmail.com',
          password: 'miguelito'
        })
        secondUser.save((err, user) => {
          let update = {
            id: user._id,
            firstName: 'Miguel',
            lastName: 'Lopez',
            phoneNumber: '7785584040',
            email: 'bollain@gmail.com',
            password: 'miguelito'
          }
          if (err) {}
          chai.request(index)
                .put('/users')
                .send(update)
                .end((err, res) => {
                  res.should.have.status(400)
                  if (err) {}
                })
          done()
        })
      })
    })
  })

  // Test GET
  describe('/GET user', () => {
    it('it should get an existing user', (done) => {
      let existingUser = new User({
        firstName: 'Papa',
        lastName: 'John',
        phoneNumber: '7785583029',
        email: 'bollain@gmail.com',
        password: 'miguelito'
      })
      existingUser.save((err, user) => {
        if (err) {}
        chai.request(index)
            .get('/users/' + user._id)
            .end((err, res) => {
              res.should.have.status(200)
              res.body.should.have.property('firstName').eql('Papa')
              res.body.should.have.property('lastName').eql('John')
              res.body.should.have.property('phoneNumber').eql('7785583029')
              res.body.should.have.property('email').eql('bollain@gmail.com')
              if (err) {}
              done()
            })
      })
    })

    it('it should fail on non-existent user', (done) => {
      chai.request(index)
          .get('/users/' + 420)
          .end((err, res) => {
            res.should.have.status(404)
            if (err) {}
            done()
          })
    })
  })

  // TEST DELETE
  describe('/DELETE user', () => {
    it('it should delete a user', (done) => {
      let existingUser = new User({
        firstName: 'Papa',
        lastName: 'John',
        phoneNumber: '7785583029',
        email: 'bollain@gmail.com',
        password: 'miguelito'
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
