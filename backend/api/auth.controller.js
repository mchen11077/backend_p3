const User = require('../db/user/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const JWT_SECRET = 'ASDF*QYW(*!@#*&!_@$(&_(WQUSF(ASO<MC?"'

async function register(req, res) {
    const {username, password} = req.body;
    try {
        const existingUser = await User.findOne({username});

        if (existingUser) {
            return res.status(400).json({message: 'Username already exists'});
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({username, password: hashedPassword});

        res.status(201).json({message: 'Registration successful', user: newUser});
    } catch (error) {
        console.error('Registration failed:', error);
        res.status(500).json({message: 'Registration failed. Please try again later.'});
    }
}

async function login(req, res) {
    const {username, password} = req.body;

    try {
        const user = await User.findOne({username});

        if (!user) {
            return res.status(400).json({message: 'Invalid username or password'});
        }

        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword) {
            return res.status(400).json({message: 'Invalid username or password'});
        }

        // Generate JWT token
        const token = jwt.sign({userId: user._id}, JWT_SECRET);

        res.status(200).json({message: 'Login successful', user, token}); // Include token in the response
    } catch (error) {
        console.error('Login failed:', error);
        res.status(500).json({message: 'Login failed. Please try again later.'});
    }
}

async function logout(req, res) {
    res.clearCookie('token');
    res.status(200).json({message: 'Logout successful'});
}

module.exports = {register, login, logout};
