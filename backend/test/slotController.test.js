const chai = require('chai');
const sinon = require('sinon');
const mongoose = require('mongoose');
const Slot = require('../models/Slot');
const {
  createSlot,
  getAvailableSlots,
  getSlotById,
  updateSlot,
  deleteSlot,
} = require('../controllers/slotController');

const { expect } = chai;

describe('Slot Controller Test', () => {
  afterEach(() => {
    sinon.restore();
  });

  // ─── Create (existing tests) ──────────────────────────────
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

    const createdSlot = { _id: new mongoose.Types.ObjectId(), ...req.body };

    const createStub = sinon.stub(Slot, 'create').resolves(createdSlot);

    const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

    await createSlot(req, res);

    expect(createStub.calledOnceWith(req.body)).to.be.true;
    expect(res.status.calledWith(201)).to.be.true;
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

    sinon.stub(Slot, 'create').throws(new Error('DB Error'));

    const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

    await createSlot(req, res);

    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;
  });

  // ─── Get available ────────────────────────────────────────
  it('should return available slots only', async () => {
    const fakeSlots = [
      { _id: new mongoose.Types.ObjectId(), isBooked: false },
    ];

    sinon.stub(Slot, 'find').returns({
      populate: sinon.stub().resolves(fakeSlots),
    });

    const req = {};
    const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

    await getAvailableSlots(req, res);

    expect(res.status.calledWith(200)).to.be.true;
    expect(res.json.calledWith(fakeSlots)).to.be.true;
  });

  // ─── Update ───────────────────────────────────────────────
  it('should update a slot successfully', async () => {
    const fakeSlot = {
      _id: new mongoose.Types.ObjectId(),
      doctor: new mongoose.Types.ObjectId(),
      date: '30 March 2026',
      startTime: '10:00 AM',
      endTime: '10:30 AM',
      isBooked: false,
      save: sinon.stub().resolvesThis(),
    };

    sinon.stub(Slot, 'findById').resolves(fakeSlot);

    const req = {
      params: { id: fakeSlot._id.toString() },
      body: { isBooked: true },
    };
    const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

    await updateSlot(req, res);

    expect(fakeSlot.isBooked).to.be.true;
    expect(res.status.calledWith(200)).to.be.true;
  });

  // ─── Delete ───────────────────────────────────────────────
  it('should return 404 when deleting non-existent slot', async () => {
    sinon.stub(Slot, 'findById').resolves(null);

    const req = { params: { id: new mongoose.Types.ObjectId().toString() } };
    const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

    await deleteSlot(req, res);

    expect(res.status.calledWith(404)).to.be.true;
  });
});