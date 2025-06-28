const admin = require('../Firebase/FirebaseAdmin');
const User = require('../models/user.model');

exports.registerToken = async (req, res) => {
  const { userId, token } = req.body;

  try {
    const user = await User.findByIdAndUpdate(userId, { fcmToken: token });
    res.status(200).json({ success: true, message: 'Token saved' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error saving token' });
  }
};

exports.sendPushNotification = async (req, res) => {
  const { userId, title, body } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user?.fcmToken) {
      return res.status(400).json({ success: false, message: 'No token found' });
    }

    const message = {
      notification: {
        title,
        body,
      },
      token: user.fcmToken,
    };

    const response = await admin.messaging().send(message);
    res.status(200).json({ success: true, response });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to send notification' });
  }
};