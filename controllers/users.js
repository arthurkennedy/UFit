const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.post('/', async (request, response) => {
    const body = request.body

    const user = new User({
        username: body.username,
        password: body.password,
        first_name: body.first_name,
        last_name: body.last_name,
        email: body.email,
        age: body.age,
        gender: body.gender,
        weight: body.weight,
    })

    const savedUser = await user.save()
    response.status(201).json(savedUser)
})

module.exports = usersRouter
