/* eslint-env mocha */
/* eslint-disable handle-callback-err: "error" */
var chai = require('chai')
var chaiHttp = require('chai-http')
var should = chai.should() // eslint-disable-line
var index = require('../index.js')
var User = require('../models/User')

chai.use(chaiHttp)

describe('/Login', () => {
  it('Should Log in an existing user with correct password', (done) => {
    var existingUser = new User({
      firstName: 'Michael',
      lastName: 'Jackson',
      email: 'mj@gmail.com',
      phoneNumber: '7785583029',
      password: 'smoothcriminal'
    })
    existingUser.save((err, user) => {
      if (err) { console.log(err) }

      var authRequest = {
        email: 'mj@gmail.com',
        password: 'smoothcriminal'
      }
      chai.request(index)
          .post('/login')
          .send(authRequest)
          .end((err, res) => {
            if (err) { console.log(err) }
            res.should.have.status(200)
            res.body.should.be.a('object')
            res.body.should.have.property('firstName').eql('Michael')
            res.body.should.have.property('lastName').eql('Jackson')
            done()
          })
    })
  })

  it('Should fail on an incorrect password', (done) => {
    var existingUser = new User({
      firstName: 'Michael',
      lastName: 'Jackson',
      email: 'mj@gmail.com',
      phoneNumber: '7785583029',
      password: 'smoothcriminal'
    })
    existingUser.save((err, user) => {
      if (err) { console.log(err) }

      var authRequest = {
        email: 'mj@gmail.com',
        password: 'jam'
      }
      chai.request(index)
          .post('/login')
          .send(authRequest)
          .end((err, res) => {
            if (err) { console.log(err) }
            res.should.have.status(401)

            done()
          })
    })
  })

  it('Should fail when user does not exist', (done) => {
    var authRequest = {
      email: 'fakeUser@gmail.com',
      password: 'stringy'
    }
    chai.request(index)
        .post('/login')
        .send(authRequest)
        .end((err, res) => {
          if (err) { console.log(err) }
          res.should.have.status(400)

          done()
        })
  })
})
