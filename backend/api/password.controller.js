const Password = require('../db/user/password.model');
const PasswordSharingRequest = require('../db/user/passwordSharingRequest.model');
const User = require('../db/user/user.model');

const createPassword = async (req, res) => {
  try {
    const { userId } = req.user;
    const { url, password } = req.body;
    const newPassword = await Password.create({ userId, url, password });
    res.status(200).json({ message: 'Password created successfully', newPassword });
  } catch (error) {
    console.error('Password creation failed:', error);
    res.status(500).json({ message: 'Password creation failed. Please try again later.' });
  }
};

const getPasswordsByUserId = async (req, res) => {
  try {
    const { userId } = req.user;
    const passwords = await Password.find({ userId });
    res.status(200).json({ passwords });
  } catch (error) {
    console.error('Error fetching passwords:', error);
    res.status(500).json({ error: 'Error fetching passwords.' });
  }
};

const sharePassword = async (req, res) => {
  try {
    const { username } = req.body;
    const { userId } = req.user;

    const targetUser = await User.findOne({ username });
    if (!targetUser) {
      return res.status(400).json({ error: 'Target user not found.' });
    }

    if (targetUser._id.toString() === userId) {
      return res.status(400).json({ error: 'Cannot share password with yourself.' });
    }

    await PasswordSharingRequest.create({ requesterId: userId, recipientId: targetUser._id });

    res.status(200).json({ message: `Password sharing request sent to ${username}.` });
  } catch (error) {
    console.error('Error sharing password:', error);
    res.status(500).json({ error: 'Error sharing password.' });
  }
};

const updatePassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { url, password } = req.body;

    // Check if the password exists
    const existingPassword = await Password.findById(id);
    if (!existingPassword) {
      return res.status(404).json({ error: 'Password not found.' });
    }

    // Update the password
    existingPassword.url = url;
    existingPassword.password = password;
    await existingPassword.save();

    res.status(200).json({ message: 'Password updated successfully', updatedPassword: existingPassword });
  } catch (error) {
    console.error('Error updating password:', error);
    res.status(500).json({ error: 'Error updating password.' });
  }
};

const deletePassword = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if the password exists
    const existingPassword = await Password.findById(id);
    if (!existingPassword) {
      return res.status(404).json({ error: 'Password not found.' });
    }

    // Delete the password
    await existingPassword.remove();

    res.status(200).json({ message: 'Password deleted successfully' });
  } catch (error) {
    console.error('Error deleting password:', error);
    res.status(500).json({ error: 'Error deleting password.' });
  }
};

module.exports = {
  createPassword,
  getPasswordsByUserId,
  sharePassword,
  updatePassword,
  deletePassword,
};