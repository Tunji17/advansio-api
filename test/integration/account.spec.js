const mongoose = require('mongoose');
const chai = require('chai');
const chaiHttp = require('chai-http');
const { app } = require('../../');

chai.use(chaiHttp);

const { expect } = chai;

let firstUser;
let secondUser;

before(() => {  
  it('Create first user', (done) => {
    const user = {
      name: 'tunji abioye',
      email: 'tunjia@outlook.com',
      password: 'P455word',
      accountType: 'SAVINGS'
    };
    chai
      .request(app)
      .post('/user/register')
      .send(user)
      .end((err, res) => {
        firstUser = { ...res.body.data };
        done();
      });
  });
  it('Create second user', (done) => {
    const user = {
      name: 'tunde abioye',
      email: 'tundeab@outlook.com',
      password: 'P455word',
      accountType: 'SAVINGS'
    };
    chai
      .request(app)
      .post('/user/register')
      .send(user)
      .end((err, res) => {
        secondUser = { ...res.body.data };
        done();
      });
  });
})

describe('Accounts Integration tests', () => {

  console.log(secondUser);
  console.log(firstUser);
  
  
  it('Should throw an error if account number does not exist', (done) => {
    const transaction = {
      accountNumber: 4793752739,
      amount: 5000,
    };
    chai
      .request(app)
      .post('/account/send')
      .set('Authorization', `${firstUser.token}`)
      .send(transaction)
      .end((err, res) => {
        expect(res.status).eql(400);
        expect(res.body).to.have.property('message');
        expect(res.body.message).eql('We could not validate the recieving account please verify the number');
        done();
      });
  });
  it('Should throw an error if user is sending money to his account', (done) => {
    const transaction = {
      accountNumber: firstUser.account.number,
      amount: 5000,
    };
    chai
      .request(app)
      .post('/account/send')
      .set('Authorization', `${firstUser.token}`)
      .send(transaction)
      .end((err, res) => {
        expect(res.status).eql(400);
        expect(res.body).to.have.property('message');
        expect(res.body.message).eql('You cannot perform this transaction');
        done();
      });
  });
  it('Should throw an error if user does not have sufficient balance', (done) => {
    const transaction = {
      accountNumber: secondUser.account.number,
      amount: 25000,
    };
    chai
      .request(app)
      .post('/account/send')
      .set('Authorization', `${firstUser.token}`)
      .send(transaction)
      .end((err, res) => {
        expect(res.status).eql(400);
        expect(res.body).to.have.property('message');
        expect(res.body.message).eql('You do not have sufficient balance');
        done();
      });
  });
  it('Should Successfully transfer amount', (done) => {
    const transaction = {
      accountNumber: secondUser.account.number,
      amount: 5000,
    };
    chai
      .request(app)
      .post('/account/send')
      .set('Authorization', `${firstUser.token}`)
      .send(transaction)
      .end((err, res) => {
        expect(res.status).eql(200);
        expect(res.body).to.have.property('message');
        expect(res.body.message).eql('Transfer Successfull');
        done();
      });
  });
});

after(function (done) {
  console.log('Deleting test database');
  mongoose.connection.db.dropDatabase(done);
});