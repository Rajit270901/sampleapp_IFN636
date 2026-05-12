const chai = require('chai'); // chai is used for test assertions
const sinon = require('sinon'); // sinon is used for stubs and spies
const mongoose = require('mongoose'); // used to create fake mongodb ids https://www.w3schools.com/nodejs/nodejs_mongodb.asp
const bcrypt = require('bcrypt'); // used here to fake password comparison
const jwt = require('jsonwebtoken'); // used here to fake token creation
const User = require('../models/User'); // importing user model https://www.w3schools.com/nodejs/nodejs_modules.asp
const {
  registerUser,
  loginUser,
  getProfile,
  updateUserProfile,
} = require('../controllers/authController'); // importing auth controller functions for testing

const { expect } = chai; // using expect style from chai

describe('Auth Controller Test', () => { // groups all auth controller tests
  afterEach(() => {
    sinon.restore(); // resets all stubs after each test
  });

  // register tests
  describe('registerUser', () => {
    it('should register a new user successfully', async () => {
      const req = {
        body: {
          name: 'Rajit',
          email: 'rajit@example.com',
          password: 'secret123',
          address: 'Queen Street',
        },
      };

      const createdUser = {
        id: new mongoose.Types.ObjectId(), // fake user id for test
        name: 'Rajit',
        email: 'rajit@example.com',
        role: 'patient',
        address: 'Queen Street',
      };

      sinon.stub(User, 'findOne').resolves(null); // fake that no user exists with this email
      sinon.stub(User, 'create').resolves(createdUser); // fake creating user
      sinon.stub(jwt, 'sign').returns('fake.jwt.token'); // fake jwt token instead of creating real one

      const res = {
        status: sinon.stub().returnsThis(), // allows res.status().json() chaining
        json: sinon.spy(), // checks what json response is sent
      };

      await registerUser(req, res); // runs the register controller

      expect(res.status.calledWith(201)).to.be.true; // should return created status
      expect(res.json.calledOnce).to.be.true;
      const responseBody = res.json.firstCall.args[0];
      expect(responseBody).to.have.property('token', 'fake.jwt.token');
      expect(responseBody).to.have.property('email', 'rajit@example.com');
    });

    it('should return 400 if user already exists', async () => {
      const req = {
        body: { name: 'Rajit', email: 'rajit@example.com', password: 'secret123' },
      };

      sinon.stub(User, 'findOne').resolves({ id: new mongoose.Types.ObjectId() }); // fake existing user

      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy(),
      };

      await registerUser(req, res);

      expect(res.status.calledWith(400)).to.be.true; // duplicate user should be bad request
      expect(res.json.calledWithMatch({ message: 'User already exists' })).to.be.true;
    });
  });

  // login tests
  describe('loginUser', () => {
    it('should log in successfully with correct credentials', async () => {
      const req = { body: { email: 'rajit@example.com', password: 'secret123' } };

      const fakeUser = {
        id: new mongoose.Types.ObjectId(),
        name: 'Rajit',
        email: 'rajit@example.com',
        password: 'hashedpassword',
        role: 'patient',
        address: 'Queen Street',
      };

      sinon.stub(User, 'findOne').resolves(fakeUser); // fake user found by email
      sinon.stub(bcrypt, 'compare').resolves(true); // fake correct password
      sinon.stub(jwt, 'sign').returns('fake.jwt.token'); // fake token returned

      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy(),
      };

      await loginUser(req, res);

      expect(res.json.calledOnce).to.be.true;
      const responseBody = res.json.firstCall.args[0];
      expect(responseBody).to.have.property('token', 'fake.jwt.token');
    });

    it('should return 401 with wrong password', async () => {
      const req = { body: { email: 'rajit@example.com', password: 'wrongpass' } };

      sinon.stub(User, 'findOne').resolves({
        id: new mongoose.Types.ObjectId(),
        password: 'hashedpassword',
      });
      sinon.stub(bcrypt, 'compare').resolves(false); // fake wrong password

      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy(),
      };

      await loginUser(req, res);

      expect(res.status.calledWith(401)).to.be.true; // wrong login should be unauthorized
      expect(res.json.calledWithMatch({ message: 'Invalid email or password' })).to.be.true;
    });
  });

  // profile tests
  describe('getProfile', () => {
    it('should return the user profile', async () => {
      const userId = new mongoose.Types.ObjectId();
      const req = { user: { id: userId.toString() } };

      sinon.stub(User, 'findById').resolves({
        id: userId,
        name: 'Rajit',
        email: 'rajit@example.com',
        role: 'patient',
        address: 'Queen Street',
      }); // fake logged in user profile

      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy(),
      };

      await getProfile(req, res);

      expect(res.status.calledWith(200)).to.be.true; // profile found successfully
      expect(res.json.calledOnce).to.be.true;
    });

    it('should return 404 if user not found', async () => {
      const req = { user: { id: new mongoose.Types.ObjectId().toString() } };

      sinon.stub(User, 'findById').resolves(null); // fake no user found

      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy(),
      };

      await getProfile(req, res);

      expect(res.status.calledWith(404)).to.be.true; // user profile not found
    });
  });
});