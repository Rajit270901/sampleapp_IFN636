const chai = require('chai'); // chai is used for test assertions
const sinon = require('sinon'); // sinon is used for stubs and spies
const mongoose = require('mongoose'); // used to make fake mongodb ids https://www.w3schools.com/nodejs/nodejs_mongodb.asp
const Doctor = require('../models/Doctor'); // importing doctor model https://www.w3schools.com/nodejs/nodejs_modules.asp
const {
  createDoctor,
  getDoctors,
  getDoctorById,
  updateDoctor,
  deleteDoctor,
} = require('../controllers/doctorController'); // importing doctor controller functions for testing

const { expect } = chai; // using expect style from chai

describe('Doctor Controller Test', () => { // groups all doctor controller tests
  afterEach(() => {
    sinon.restore(); // clears all stubs after every test
  });

  // create doctor test
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

    const createdDoctor = { _id: new mongoose.Types.ObjectId(), ...req.body }; // spread copies req.body fields https://www.w3schools.com/react/react_es6_spread.asp

    const createStub = sinon.stub(Doctor, 'create').resolves(createdDoctor); // fake doctor creation

    const res = {
      status: sinon.stub().returnsThis(), // allows res.status().json() chaining
      json: sinon.spy(), // checks json response
    };

    await createDoctor(req, res); // runs the controller

    expect(createStub.calledOnceWith(req.body)).to.be.true;
    expect(res.status.calledWith(201)).to.be.true; // 201 means created
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

    sinon.stub(Doctor, 'create').throws(new Error('DB Error')); // fake database error https://www.w3schools.com/js/js_errors.asp

    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy(),
    };

    await createDoctor(req, res);

    expect(res.status.calledWith(500)).to.be.true; // should return server error
    expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;
  });

  // get all doctors test
  it('should return all doctors successfully', async () => {
    const fakeDoctors = [
      { _id: new mongoose.Types.ObjectId(), name: 'Dr. Sarah Lee' },
      { _id: new mongoose.Types.ObjectId(), name: 'Dr. John Doe' },
    ];

    sinon.stub(Doctor, 'find').resolves(fakeDoctors); // fake list of doctors

    const req = {};
    const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

    await getDoctors(req, res);

    expect(res.status.calledWith(200)).to.be.true; // success response
    expect(res.json.calledWith(fakeDoctors)).to.be.true;
  });

  // get doctor by id test
  it('should return 404 if doctor by ID is not found', async () => {
    const req = { params: { id: new mongoose.Types.ObjectId().toString() } };

    sinon.stub(Doctor, 'findById').resolves(null); // fake doctor not found

    const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

    await getDoctorById(req, res);

    expect(res.status.calledWith(404)).to.be.true; // not found response
    expect(res.json.calledWithMatch({ message: 'Doctor not found' })).to.be.true;
  });

  // update doctor test
  it('should update a doctor successfully', async () => {
    const fakeDoctor = {
      _id: new mongoose.Types.ObjectId(),
      name: 'Dr. Sarah Lee',
      specialization: 'Cardiology',
      email: 'sarah@old.com',
      phone: '0412345678',
      isAvailable: true,
      save: sinon.stub().resolvesThis(), // fake save and return same object
    };

    sinon.stub(Doctor, 'findById').resolves(fakeDoctor); // fake finding doctor by id

    const req = {
      params: { id: fakeDoctor._id.toString() },
      body: { email: 'sarah@new.com' },
    };
    const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

    await updateDoctor(req, res);

    expect(fakeDoctor.email).to.equal('sarah@new.com'); // checks email was changed
    expect(res.status.calledWith(200)).to.be.true;
  });

  // delete doctor test
  it('should delete a doctor successfully', async () => {
    const fakeDoctor = {
      _id: new mongoose.Types.ObjectId(),
      deleteOne: sinon.stub().resolves(), // fake delete method
    };

    sinon.stub(Doctor, 'findById').resolves(fakeDoctor); // fake doctor exists

    const req = { params: { id: fakeDoctor._id.toString() } };
    const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

    await deleteDoctor(req, res);

    expect(fakeDoctor.deleteOne.calledOnce).to.be.true; // checks delete was called
    expect(res.status.calledWith(200)).to.be.true;
    expect(res.json.calledWithMatch({ message: 'Doctor deleted successfully' })).to.be.true;
  });
});