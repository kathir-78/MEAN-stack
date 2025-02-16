const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user')


exports.createUser = async (req, res) => {

    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    try {

        const finduser = await User.findOne({email: req.body.email});

        if(finduser) {
            return res.status(409).json({message: 'email is already exists'});
        }

        const user = await User.create({
            email: req.body.email,
            password: hashedPassword
        })

        res.status(201).json({message: 'user created successfully', user});
    } catch (error) {
        res.status(400).json({message: 'user Creation Failed'});
    }
}


exports.loginUser = async (req, res) => {
    try {
       const user = await User.findOne({
            email: req.body.email,
        })
        if(!user) {
            return res.status(404).json({message: 'user not found'});
        }

        const userFound = await bcrypt.compare(req.body.password, user.password)  // return true or false

        if(!userFound) {
            return res.status(401).json({message: 'invalid user or password'})
        }

        const token = jwt.sign({id: user._id, email: user.email}, process.env.JWT_SECRET )

        res.status(200).json({message: 'user found', token, userid: user._id});

    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
}