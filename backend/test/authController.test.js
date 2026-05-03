const chai = require('chai');
const sinon = require('sinon');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const {
  registerUser,
  loginUser,
  getProfile,
  updateUserProfile,
} = require('../controllers/authController');

const { expect } = chai;

describe('Auth Controller Test', () => {
  afterEach(() => {
    sinon.restore();
  });

  // ─── Register ──────────────────────────────────────────────
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
        id: new mongoose.Types.ObjectId(),
        name: 'Rajit',
        email: 'rajit@example.com',
        role: 'patient',
        address: 'Queen Street',
      };

      sinon.stub(User, 'findOne').resolves(null);
      sinon.stub(User, 'create').resolves(createdUser);
      sinon.stub(jwt, 'sign').returns('fake.jwt.token');

      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy(),
      };

      await registerUser(req, res);

      expect(res.status.calledWith(201)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
      const responseBody = res.json.firstCall.args[0];
      expect(responseBody).to.have.property('token', 'fake.jwt.token');
      expect(responseBody).to.have.property('email', 'rajit@example.com');
    });

    it('should return 400 if user already exists', async () => {
      const req = {
        body: { name: 'Rajit', email: 'rajit@example.com', password: 'secret123' },
      };

      sinon.stub(User, 'findOne').resolves({ id: new mongoose.Types.ObjectId() });

      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy(),
      };

      await registerUser(req, res);

      expect(res.status.calledWith(400)).to.be.true;
      expect(res.json.calledWithMatch({ message: 'User already exists' })).to.be.true;
    });
  });

  // ─── Login ─────────────────────────────────────────────────
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

      sinon.stub(User, 'findOne').resolves(fakeUser);
      sinon.stub(bcrypt, 'compare').resolves(true);
      sinon.stub(jwt, 'sign').returns('fake.jwt.token');

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
      sinon.stub(bcrypt, 'compare').resolves(false);

      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy(),
      };

      await loginUser(req, res);

      expect(res.status.calledWith(401)).to.be.true;
      expect(res.json.calledWithMatch({ message: 'Invalid email or password' })).to.be.true;
    });
  });

  // ─── Profile ───────────────────────────────────────────────
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
      });

      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy(),
      };

      await getProfile(req, res);

      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledOnce).to.be.true;
    });

    it('should return 404 if user not found', async () => {
      const req = { user: { id: new mongoose.Types.ObjectId().toString() } };

      sinon.stub(User, 'findById').resolves(null);

      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy(),
      };

      await getProfile(req, res);

      expect(res.status.calledWith(404)).to.be.true;
    });
  });
});