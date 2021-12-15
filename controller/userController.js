require('dotenv').config()

const express = require('express');
const User = require('../models/user');

const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')




const route = express.Router();      


const index = (req,res,next)  => {
	User.find()
	.then(users  => {
		res.json(users)
	})
	.catch(error  =>{
		res.json({
			message: "an error occured when displaying users"
		})
	})
}

//authentification
const register = (req,res,next) => {
	bcrypt.hash(req.body.password,10,function(err,hashedPass) {

		if (err) {
			console.log('erreur password hash');
			res.json({
				error: err
			})
		}
		var verifemail = req.body.email

		User.findOne({$or: [{email:verifemail}]})
		.then(user => {
			if (user) {//user found
				res.status(201).send(JSON.stringify({
					message:'User exist'
				}))
			}else{//no user found
				let user = new User({
					firstName: req.body.firstName,
					lastName: req.body.lastName,
					email: req.body.email,
					password: hashedPass,
                    vignettes:[]
				})
				user.save().then(user =>{
					res.status(200).send(JSON.stringify({
						message:'User Added Successfully!'
					}))
				})
				.catch(error => {
					res.json({
						message: "An error occured when adding user!"
					})
				})
			}//end else
		})//end then 
	})//end hash
}

const login = (req,res,next) => {
	var email = req.body.email
	var password = req.body.password

	User.findOne({$or: [{email:email},{phone:email}]})
	.then(user => {
		if (user) {
			bcrypt.compare(password,user.password,function(err,result) {
				if (err) {
					res.json({error:err})
				}
				if (result) {
					
					const hash = { id: user._id }
					const accessToken = generateAccessToken(hash)
	
					res.status(200).send(JSON.stringify({ //200 OK
						_id:user._id,
						firstName:user.firstName,
						lastName:user.lastName,
						email:user.email,
						password:user.password,
						token:accessToken
					}))
					
				}else{	
					res.status(401).send(JSON.stringify({ //201 incorrect password
						_id:"",
						firstName:"",
						lastName:"",
						email:"",
						password:"",
						token:""
					}))
				}
			})
		}else{
			res.status(401).send(JSON.stringify({ //202 user not found
				_id:"",
				firstName:"",
				lastName:"",
				email:"",
				password:"",
				token:""
			}))
		}
	})
}







function generateAccessToken(hash) {
    return jwt.sign(hash, process.env.ACCESS_TOKEN_SECRET)
}


route.get('/',index)


//authentification
route.post('/login',login) 
route.post('/register',register)



module.exports = route;