const chai = require('chai');
const sinon = require('sinon');
const mongoose = require('mongoose');
const Appointment = require('../models/Appointment');
const Notification = require('../models/Notification');
const Slot = require('../models/Slot');
const Doctor = require('../models/Doctor');
const { updateAppointmentStatus } = require('../controllers/appointmentController');

const { expect } = chai;

describe('Appointment Controller Test', () => {
  afterEach(() => {
    sinon.restore();
  });

  it('should update appointment status successfully', async () => {
    const appointmentId = new mongoose.Types.ObjectId();

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
      save: sinon.stub().resolves(),
    };

    const populatedAppointment = {
      ...savedAppointment,
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
    // Stub the new dependencies introduced by the NotificationFactory wiring
    sinon.stub(Slot, 'findById').resolves(null);
    sinon.stub(Doctor, 'findById').resolves(null);
    sinon.stub(Notification, 'create').resolves({ _id: new mongoose.Types.ObjectId() });

    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy(),
    };

    await updateAppointmentStatus(req, res);

    expect(savedAppointment.status).to.equal('Completed');
    expect(savedAppointment.save.calledOnce).to.be.true;
    expect(res.status.calledWith(200)).to.be.true;
  });

  it('should return 404 if appointment is not found', async () => {
    const req = {
      params: { id: new mongoose.Types.ObjectId().toString() },
      body: { status: 'Completed' },
    };

    sinon.stub(Appointment, 'findById').resolves(null);

    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy(),
    };

    await updateAppointmentStatus(req, res);

    expect(res.status.calledWith(404)).to.be.true;
    expect(res.json.calledWithMatch({ message: 'Appointment not found' })).to.be.true;
  });
});