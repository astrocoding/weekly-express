const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { generateToken } = require('../config/jwt');

const register = (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 8);
    User.create(username, hashedPassword, (err, result) => {
        if (err) return res.status(500).json({ message: 'Error registering user' });
        res.status(201).json({ message: 'User registered successfully' });
    });
};

const login = (req, res) => {
    const { username, password } = req.body;
    User.findByUsername(username, (err, results) => {
        if (err || results.length === 0) return res.status(404).json({ message: 'User not found' });
        const user = results[0];
        const passwordIsValid = bcrypt.compareSync(password, user.password);
        if (!passwordIsValid) return res.status(401).json({ accessToken: null, message: 'Invalid Password' });
        const token = generateToken(user);
        res.status(200).json({ id: user.id, username: user.username, accessToken: token });
    });
};

module.exports = { register, login };
