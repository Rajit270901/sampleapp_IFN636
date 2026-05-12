const chai = require('chai'); // chai is used for test assertions
const sinon = require('sinon'); // sinon is used for stubs and spies
const mongoose = require('mongoose'); // used to create fake mongodb object ids https://www.w3schools.com/nodejs/nodejs_mongodb.asp
const Notification = require('../models/Notification'); // importing notification model https://www.w3schools.com/nodejs/nodejs_modules.asp
const {
  getMyNotifications,
  getUnreadCount,
  markAsRead,
  deleteNotification,
} = require('../controllers/notificationController'); // importing notification controller functions for testing

const { expect } = chai; // using expect style from chai

describe('Notification Controller Test', () => { // groups all notification controller tests
  afterEach(() => {
    sinon.restore(); // clears stubs after each test so tests stay separate
  });

  it('should return notifications for the current user', async () => {
    const userId = new mongoose.Types.ObjectId(); // fake user id for the test
    const fakeNotifications = [
      { _id: new mongoose.Types.ObjectId(), recipient: userId, message: 'Booked' },
    ];

    sinon.stub(Notification, 'find').returns({
      populate: sinon.stub().returnsThis(),
      sort: sinon.stub().resolves(fakeNotifications),
    }); // fake chained mongoose query

    const req = { user: { id: userId.toString() } };
    const res = { status: sinon.stub().returnsThis(), json: sinon.spy() }; // fake express response object

    await getMyNotifications(req, res); // runs the controller

    expect(res.status.calledWith(200)).to.be.true; // checks success status
    expect(res.json.calledWith(fakeNotifications)).to.be.true;
  });

  it('should return unread count', async () => {
    sinon.stub(Notification, 'countDocuments').resolves(3); // fake 3 unread notifications

    const req = { user: { id: new mongoose.Types.ObjectId().toString() } };
    const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

    await getUnreadCount(req, res);

    expect(res.status.calledWith(200)).to.be.true;
    expect(res.json.calledWithMatch({ count: 3 })).to.be.true; // checks count is returned
  });

  it('should mark notification as read', async () => {
    const userId = new mongoose.Types.ObjectId();
    const fakeNotification = {
      _id: new mongoose.Types.ObjectId(),
      recipient: userId,
      isRead: false,
      save: sinon.stub().resolvesThis(), // fake save so database is not used
    };

    sinon.stub(Notification, 'findById').resolves(fakeNotification); // fake notification found by id

    const req = {
      params: { id: fakeNotification._id.toString() },
      user: { id: userId.toString() },
    };
    const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

    await markAsRead(req, res);

    expect(fakeNotification.isRead).to.be.true; // checks read status changed
    expect(res.status.calledWith(200)).to.be.true;
  });

  it('should return 404 if notification not found on delete', async () => {
    sinon.stub(Notification, 'findById').resolves(null); // fake notification not found

    const req = {
      params: { id: new mongoose.Types.ObjectId().toString() },
      user: { id: new mongoose.Types.ObjectId().toString() },
    };
    const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

    await deleteNotification(req, res);

    expect(res.status.calledWith(404)).to.be.true; // should return not found
  });
});