import asyncHandler from 'express-async-handler'
import User from '../models/userModel.js'
import generateToken from '../utils/generateToken.js'

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body

    const user = await User.findOne({ email })

    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: generateToken(user._id),
        })
    } else {
        res.status(401)
        throw new Error('Invalid email or password')
    }
})


const getUserProfile = asyncHandler(async (req, res) => {
    //validating with JWT 

    const user = await User.findById(req.user._id)

    if (user) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
        })
    } else {
        res.status(404)
        throw new Error('User not found')
    }
})



const registerUser = asyncHandler(async (req, res) => {
    const {
        name,
        email,
        password,
        mobile,
        dob,
        gender,
        qualifications,
        skills,
        image,
        address,
        city,
        state,
        country
    } = req.body

    const userExists = await User.findOne({ email })

    if (userExists) {
        res.status(400)
        throw new Error('User already exists')
    }

    const user = await User.create({
        name,
        email,
        password,
        mobile,
        dob,
        gender,
        qualifications,
        skills,
        image,
        address,
        city,
        state,
        country

    })

    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: generateToken(user._id),

        })
    } else {
        res.status(400)
        throw new Error('Invalid user data')
    }
})



const getUsers = asyncHandler(async (req, res) => {
    const user = await User.find({})
    res.send(user)

})


const deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id)

    if (user) {
        await user.remove()
        res.json({ message: 'User removed' })
    } else {
        res.status(404)
        throw new Error('User not found')
    }
})

const getUserById = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id).select('-password')

    if (user) {
        res.json(user)
    }
    else {
        res.status(404)
        throw new Error('User not found')
    }
})

const updateUser = asyncHandler(async (req, res) => {
    const {
        name,
        email,
        mobile,
        dob,
        gender,
        image,
        qualifications,
        skills,
        address,
        city,
        state,
        country } = req.body

    const user = await User.findById(req.params.id)

    if (user) {
        user.name = name,
            user.email = email,
            user.mobile = mobile,
            user.dob = dob,
            user.gender = gender,
            user.image = image,
            user.qualifications = qualifications,
            user.skills = skills,
            user.address = address,
            user.city = city,
            user.state = state,
            user.country = country

        const updatedUser = await user.save()

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin,
        })
    } else {
        res.status(404)
        throw new Error('User not found')
    }
})

export {
    loginUser, getUserProfile,
    registerUser, getUsers, deleteUser,
    getUserById, updateUser
}