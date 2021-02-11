const express = require('express')
const app = express()
const bcrypt = require('bcrypt')

app.use(express.json())

//for testing only!!
const users = []

app.get('/users', (req, res) => {
    res.json(users)
}) 

app.post('/users', async (req, res) => {
    try {
        const salt = await bcrypt.genSalt()
        const hashedPassword = await bcrypt.hash(req.body.password, salt)
        
        const user = {username: req.body.username, password: hashedPassword}
        users.push(user)
        res.status(201).send()
    } catch {
        res.status(500)
    }
})

app.post('/users/login', async (req, res) =>{
    const user = users.find(user => user.username === req.body.username)
    if(user == null) {
        return res.status(400).send('Cannot find user')
    }
    try {
       if(await bcrypt.compare(req.body.password, user.password)) {
           res.send('Login successful')
       }
       else {
           res.send('Login failed')
       }
    } catch {
        res.status(500)
    }
})

app.listen(3000)