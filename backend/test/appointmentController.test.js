const chai = require('chai'); // chai is used for writing test expectations
const sinon = require('sinon'); // sinon is used for stubs and spies
const mongoose = require('mongoose'); // used here to create fake mongodb object ids https://www.w3schools.com/nodejs/nodejs_mongodb.asp
const Appointment = require('../models/Appointment'); // importing appointment model https://www.w3schools.com/nodejs/nodejs_modules.asp
const Notification = require('../models/Notification'); // importing notification model
const Slot = require('../models/Slot'); // importing slot model
const Doctor = require('../models/Doctor'); // importing doctor model
const { updateAppointmentStatus } = require('../controllers/appointmentController'); // testing this controller function

const { expect } = chai; // expect style assertion from chai

describe('Appointment Controller Test', () => { // groups appointment controller tests
  afterEach(() => {
    sinon.restore(); // resets all stubs after each test so tests do not affect each other
  });

  it('should update appointment status successfully', async () => {
    const appointmentId = new mongoose.Types.ObjectId(); // fake appointment id for the test

    const req = {
      params: { id: appointmentId.toString() },
      body: { status: 'Completed' },
    };

    const savedAppointment = {
      _id: appointmentId,
      patient: new mongoose.Types.ObjectId(),
      doctor: new mongoose.Types.ObjectId(),
      slot: new mongoose.Types.ObjectId(),
      status: 'Completed',
      save: sinon.stub().resolves(), // fake save method so no real database save happens
    };

    const populatedAppointment = {
      ...savedAppointment, // copies savedAppointment fields into this object https://www.w3schools.com/react/react_es6_spread.asp
      patient: { name: 'Rajit Patient', email: 'rajitpatient@example.com', role: 'patient' },
      doctor: { name: 'Dr. Sarah Lee', specialization: 'Cardiology', email: 'doc@example.com', phone: '0412345678' },
      slot: { date: '30 March 2026', startTime: '10:00 AM', endTime: '10:30 AM', isBooked: true },
    };

    sinon.stub(Appointment, 'findById')
      .onFirstCall().resolves(savedAppointment)
      .onSecondCall().returns({
        populate: sinon.stub().returnsThis(),
      });

    const secondFind = Appointment.findById.onSecondCall().returnValue;
    secondFind.populate.onFirstCall().returnsThis();
    secondFind.populate.onSecondCall().returnsThis();
    secondFind.populate.onThirdCall().resolves(populatedAppointment);
    // fake the extra database calls used for notification data
    sinon.stub(Slot, 'findById').resolves(null);
    sinon.stub(Doctor, 'findById').resolves(null);
    sinon.stub(Notification, 'create').resolves({ _id: new mongoose.Types.ObjectId() });

    const res = {
      status: sinon.stub().returnsThis(), // allows res.status().json() style chaining
      json: sinon.spy(), // watches if json response is sent
    };

    await updateAppointmentStatus(req, res); // runs the actual controller being tested

    expect(savedAppointment.status).to.equal('Completed'); // checks status was updated
    expect(savedAppointment.save.calledOnce).to.be.true; // checks save was called once
    expect(res.status.calledWith(200)).to.be.true; // checks success status code
  });

  it('should return 404 if appointment is not found', async () => {
    const req = {
      params: { id: new mongoose.Types.ObjectId().toString() },
      body: { status: 'Completed' },
    };

    sinon.stub(Appointment, 'findById').resolves(null); // fake no appointment found

    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy(),
    };

    await updateAppointmentStatus(req, res);

    expect(res.status.calledWith(404)).to.be.true; // should return not found
    expect(res.json.calledWithMatch({ message: 'Appointment not found' })).to.be.true;
  });
});