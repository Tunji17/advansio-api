const chai = require('chai');
const chaiHttp = require('chai-http');
const { app } = require('../../');

chai.use(chaiHttp);

const { expect } = chai;

describe('Auth Integration tests', () => {

  it('Should successfully register a user', (done) => {
    const user = {
      name: 'tunji abioye',
      email: 'tunjiabioye@outlook.com',
      password: 'P455word',
      accountType: 'SAVINGS'
    };
    chai
      .request(app)
      .post('/user/register')
      .send(user)
      .end((err, res) => {
        expect(res.status).eql(200);
        expect(res.body).to.have.property('data');
        expect(res.body.message).eql('User registeration successfull, An email has been sent to you with your account details');
        done();
      });
  });
  it('Should throw 400 if a user tries to register with the same email twice', (done) => {
    const user = {
      name: 'tunji abioye',
      email: 'tunjiabioye@outlook.com',
      password: 'P455word',
      accountType: 'SAVINGS'
    };
    chai
      .request(app)
      .post('/user/register')
      .send(user)
      .end((err, res) => {
        expect(res.status).eql(400);
        expect(res.body).to.have.property('message');
        expect(res.body.message).eql('An account with this Email already exists!');
        done();
      });
  });
  it('Should successfully throw an error is a field is missing', (done) => {
    const user = {
      name: 'tunji abioye',
      email: 'tunjiabioye@outlook.com',
      password: 'P455word',
    };
    chai
      .request(app)
      .post('/user/register')
      .send(user)
      .end((err, res) => {
        expect(res.status).eql(400);
        expect(res.body).to.have.property('message');
        expect(res.body.message).eql('"accountType" is required');
        done();
      });
  });
  it('Should successfully login a user', (done) => {
    const user = {
      email: 'tunjiabioye@outlook.com',
      password: 'P455word',
    };
    chai
      .request(app)
      .post('/user/login')
      .send(user)
      .end((err, res) => {
        expect(res.status).eql(200);
        expect(res.body).to.have.property('data');
        expect(res.body.message).eql('User login successful');
        done();
      });
  });
  it('Should throw 400 if email does not exist', (done) => {
    const user = {
      email: 'tunji@outlook.com',
      password: 'P455word',
    };
    chai
      .request(app)
      .post('/user/login')
      .send(user)
      .end((err, res) => {
        expect(res.status).eql(400);
        expect(res.body).to.have.property('message');
        expect(res.body.message).eql('Invalid Login Credentials');
        done();
      });
  });
  it('Should throw 400 if password is incorrect', (done) => {
    const user = {
      email: 'tunjiabioye@outlook.com',
      password: 'P4ssword',
    };
    chai
      .request(app)
      .post('/user/login')
      .send(user)
      .end((err, res) => {
        expect(res.status).eql(400);
        expect(res.body).to.have.property('message');
        expect(res.body.message).eql('Invalid Login Credentials');
        done();
      });
  });
});