const chai = require('chai'); // chai is used for test assertions
const sinon = require('sinon'); // sinon is used for stubs and spies
const mongoose = require('mongoose'); // used to create fake mongodb object ids https://www.w3schools.com/nodejs/nodejs_mongodb.asp
const Slot = require('../models/Slot'); // importing slot model https://www.w3schools.com/nodejs/nodejs_modules.asp
const {
  createSlot,
  getAvailableSlots,
  getSlotById,
  updateSlot,
  deleteSlot,
} = require('../controllers/slotController'); // importing slot controller functions for testing

const { expect } = chai; // using expect style from chai

describe('Slot Controller Test', () => { // groups all slot controller tests
  afterEach(() => {
    sinon.restore(); // clears stubs after each test
  });

  // create slot test
  it('should create a new slot successfully', async () => {
    const req = {
      body: {
        doctor: new mongoose.Types.ObjectId(),
        date: '30 March 2026',
        startTime: '10:00 AM',
        endTime: '10:30 AM',
        isBooked: false,
      },
    };

    const createdSlot = { _id: new mongoose.Types.ObjectId(), ...req.body }; // spread copies req.body into createdSlot https://www.w3schools.com/react/react_es6_spread.asp

    const createStub = sinon.stub(Slot, 'create').resolves(createdSlot); // fake slot creation

    const res = { status: sinon.stub().returnsThis(), json: sinon.spy() }; // fake express response object

    await createSlot(req, res); // runs the controller

    expect(createStub.calledOnceWith(req.body)).to.be.true;
    expect(res.status.calledWith(201)).to.be.true; // 201 means created
    expect(res.json.calledWith(createdSlot)).to.be.true;
  });

  it('should return 500 if slot creation fails', async () => {
    const req = {
      body: {
        doctor: new mongoose.Types.ObjectId(),
        date: '30 March 2026',
        startTime: '10:00 AM',
        endTime: '10:30 AM',
        isBooked: false,
      },
    };

    sinon.stub(Slot, 'create').throws(new Error('DB Error')); // fake database error https://www.w3schools.com/js/js_errors.asp

    const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

    await createSlot(req, res);

    expect(res.status.calledWith(500)).to.be.true; // should return server error
    expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;
  });

  // get available slots test
  it('should return available slots only', async () => {
    const fakeSlots = [
      { _id: new mongoose.Types.ObjectId(), isBooked: false },
    ];

    sinon.stub(Slot, 'find').returns({
      populate: sinon.stub().resolves(fakeSlots),
    }); // fake mongoose find and populate chain

    const req = {};
    const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

    await getAvailableSlots(req, res);

    expect(res.status.calledWith(200)).to.be.true; // success response
    expect(res.json.calledWith(fakeSlots)).to.be.true;
  });

  // update slot test
  it('should update a slot successfully', async () => {
    const fakeSlot = {
      _id: new mongoose.Types.ObjectId(),
      doctor: new mongoose.Types.ObjectId(),
      date: '30 March 2026',
      startTime: '10:00 AM',
      endTime: '10:30 AM',
      isBooked: false,
      save: sinon.stub().resolvesThis(), // fake save and return same object
    };

    sinon.stub(Slot, 'findById').resolves(fakeSlot); // fake finding slot by id

    const req = {
      params: { id: fakeSlot._id.toString() },
      body: { isBooked: true },
    };
    const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

    await updateSlot(req, res);

    expect(fakeSlot.isBooked).to.be.true; // checks booked value was changed
    expect(res.status.calledWith(200)).to.be.true;
  });

  // delete slot test
  it('should return 404 when deleting non-existent slot', async () => {
    sinon.stub(Slot, 'findById').resolves(null); // fake slot not found

    const req = { params: { id: new mongoose.Types.ObjectId().toString() } };
    const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

    await deleteSlot(req, res);

    expect(res.status.calledWith(404)).to.be.true; // should return not found
  });
});