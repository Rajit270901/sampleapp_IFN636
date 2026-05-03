const chai = require('chai');
const sinon = require('sinon');
const mongoose = require('mongoose');
const Notification = require('../models/Notification');
const {
  getMyNotifications,
  getUnreadCount,
  markAsRead,
  deleteNotification,
} = require('../controllers/notificationController');

const { expect } = chai;

describe('Notification Controller Test', () => {
  afterEach(() => {
    sinon.restore();
  });

  it('should return notifications for the current user', async () => {
    const userId = new mongoose.Types.ObjectId();
    const fakeNotifications = [
      { _id: new mongoose.Types.ObjectId(), recipient: userId, message: 'Booked' },
    ];

    sinon.stub(Notification, 'find').returns({
      populate: sinon.stub().returnsThis(),
      sort: sinon.stub().resolves(fakeNotifications),
    });

    const req = { user: { id: userId.toString() } };
    const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

    await getMyNotifications(req, res);

    expect(res.status.calledWith(200)).to.be.true;
    expect(res.json.calledWith(fakeNotifications)).to.be.true;
  });

  it('should return unread count', async () => {
    sinon.stub(Notification, 'countDocuments').resolves(3);

    const req = { user: { id: new mongoose.Types.ObjectId().toString() } };
    const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

    await getUnreadCount(req, res);

    expect(res.status.calledWith(200)).to.be.true;
    expect(res.json.calledWithMatch({ count: 3 })).to.be.true;
  });

  it('should mark notification as read', async () => {
    const userId = new mongoose.Types.ObjectId();
    const fakeNotification = {
      _id: new mongoose.Types.ObjectId(),
      recipient: userId,
      isRead: false,
      save: sinon.stub().resolvesThis(),
    };

    sinon.stub(Notification, 'findById').resolves(fakeNotification);

    const req = {
      params: { id: fakeNotification._id.toString() },
      user: { id: userId.toString() },
    };
    const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

    await markAsRead(req, res);

    expect(fakeNotification.isRead).to.be.true;
    expect(res.status.calledWith(200)).to.be.true;
  });

  it('should return 404 if notification not found on delete', async () => {
    sinon.stub(Notification, 'findById').resolves(null);

    const req = {
      params: { id: new mongoose.Types.ObjectId().toString() },
      user: { id: new mongoose.Types.ObjectId().toString() },
    };
    const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

    await deleteNotification(req, res);

    expect(res.status.calledWith(404)).to.be.true;
  });
});