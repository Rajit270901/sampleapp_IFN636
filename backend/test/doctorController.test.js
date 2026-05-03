const chai = require('chai');
const sinon = require('sinon');
const mongoose = require('mongoose');
const Doctor = require('../models/Doctor');
const {
  createDoctor,
  getDoctors,
  getDoctorById,
  updateDoctor,
  deleteDoctor,
} = require('../controllers/doctorController');

const { expect } = chai;

describe('Doctor Controller Test', () => {
  afterEach(() => {
    sinon.restore();
  });

  // ─── Create (existing tests, unchanged) ──────────────────
  it('should create a new doctor successfully', async () => {
    const req = {
      body: {
        name: 'Dr. Sarah Lee',
        specialization: 'Cardiology',
        email: 'sarah.lee@meditrack.com',
        phone: '0412345678',
        isAvailable: true,
      },
    };

    const createdDoctor = { _id: new mongoose.Types.ObjectId(), ...req.body };

    const createStub = sinon.stub(Doctor, 'create').resolves(createdDoctor);

    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy(),
    };

    await createDoctor(req, res);

    expect(createStub.calledOnceWith(req.body)).to.be.true;
    expect(res.status.calledWith(201)).to.be.true;
    expect(res.json.calledWith(createdDoctor)).to.be.true;
  });

  it('should return 500 if doctor creation fails', async () => {
    const req = {
      body: {
        name: 'Dr. Sarah Lee',
        specialization: 'Cardiology',
        email: 'sarah.lee@meditrack.com',
        phone: '0412345678',
        isAvailable: true,
      },
    };

    sinon.stub(Doctor, 'create').throws(new Error('DB Error'));

    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy(),
    };

    await createDoctor(req, res);

    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;
  });

  // ─── Get all ──────────────────────────────────────────────
  it('should return all doctors successfully', async () => {
    const fakeDoctors = [
      { _id: new mongoose.Types.ObjectId(), name: 'Dr. Sarah Lee' },
      { _id: new mongoose.Types.ObjectId(), name: 'Dr. John Doe' },
    ];

    sinon.stub(Doctor, 'find').resolves(fakeDoctors);

    const req = {};
    const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

    await getDoctors(req, res);

    expect(res.status.calledWith(200)).to.be.true;
    expect(res.json.calledWith(fakeDoctors)).to.be.true;
  });

  // ─── Get by ID ────────────────────────────────────────────
  it('should return 404 if doctor by ID is not found', async () => {
    const req = { params: { id: new mongoose.Types.ObjectId().toString() } };

    sinon.stub(Doctor, 'findById').resolves(null);

    const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

    await getDoctorById(req, res);

    expect(res.status.calledWith(404)).to.be.true;
    expect(res.json.calledWithMatch({ message: 'Doctor not found' })).to.be.true;
  });

  // ─── Update ───────────────────────────────────────────────
  it('should update a doctor successfully', async () => {
    const fakeDoctor = {
      _id: new mongoose.Types.ObjectId(),
      name: 'Dr. Sarah Lee',
      specialization: 'Cardiology',
      email: 'sarah@old.com',
      phone: '0412345678',
      isAvailable: true,
      save: sinon.stub().resolvesThis(),
    };

    sinon.stub(Doctor, 'findById').resolves(fakeDoctor);

    const req = {
      params: { id: fakeDoctor._id.toString() },
      body: { email: 'sarah@new.com' },
    };
    const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

    await updateDoctor(req, res);

    expect(fakeDoctor.email).to.equal('sarah@new.com');
    expect(res.status.calledWith(200)).to.be.true;
  });

  // ─── Delete ───────────────────────────────────────────────
  it('should delete a doctor successfully', async () => {
    const fakeDoctor = {
      _id: new mongoose.Types.ObjectId(),
      deleteOne: sinon.stub().resolves(),
    };

    sinon.stub(Doctor, 'findById').resolves(fakeDoctor);

    const req = { params: { id: fakeDoctor._id.toString() } };
    const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

    await deleteDoctor(req, res);

    expect(fakeDoctor.deleteOne.calledOnce).to.be.true;
    expect(res.status.calledWith(200)).to.be.true;
    expect(res.json.calledWithMatch({ message: 'Doctor deleted successfully' })).to.be.true;
  });
});