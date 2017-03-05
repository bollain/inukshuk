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
      if (err) {}
      done()
    })
  })
/*
  * Test the /GET route
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
    it('it should NOT create a with invald email', (done) => {
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
    it('it should NOT create a with invald phoneNumber', (done) => {
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
})
