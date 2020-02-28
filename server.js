const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex')

const postgres = knex({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    user : 'postgres',
    password : '',
    database : 'smart_brain'
  }
});

postgres.select('*').from('users');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const database = {
	users: [
		{
			id: '123',
			name: 'Grace', 
			password: 'cookies',
			email: 'grace@gmail.com',
			entries: 0,
			joined: new Date()
		},
		{
			id: '321',
			name: 'Peter', 
			password: 'bananas',
			email: 'peter@gmail.com',
			entries: 0,
			joined: new Date()
		}
	],
	login: [
		{
			id: '987',
			hash: '',
			email: 'grace@gmail.com'
		}
	]
}

app.get('/', (req, res) => {
	res.send(database.users);
})


app.post('/signin', (req, res) => {
	// Load hash from your password DB.
	bcrypt.compare("apples", "$2a$10$XOCrdAnpyjBOBNRzC3s3A.l/DLssEvhZX.yCOD2gY5yUG5Xpe/TP6", function(err, res) {
	    console.log('first guess', res)
	});
	bcrypt.compare("veggies", "$2a$10$XOCrdAnpyjBOBNRzC3s3A.l/DLssEvhZX.yCOD2gY5yUG5Xpe/TP6", function(err, res) {
	    console.log('second guess', res)
	});


	if (req.body.email === database.users[0].email && 
		req.body.password === database.users[0].password) {
		res.json(database.users[0]);
	} else {
		res.status(400).json('error logging in');
	}
	res.json('signing');
})

app.post('/register', (req, res) => {
	const { email, name, password } = req.body;
	database.users.push({
		id: '125',
		name: name, 
		email: email,
		entries: 0,
		joined: new Date()
	})
	res.json(database.users[database.users.length-1]);
})

app.get('/profile/:id', (req, res) => {
	const { id } = req.params;
	let found = false;
	database.users.forEach(user => {
		if (user.id === id) {
			found = true;
			return res.json(user);
		} 
	})
	if (!found) {
		res.status(400).json('not found');
	}
})



app.put('/image', (req, res) => {
	const { id } = req.body;
	let found = false;
	database.users.forEach(user => {
		if (user.id === id) {
			found = true;
			user.entries++;
			return res.json(user.entries);
		} 
	})
	if (!found) {
		res.status(400).json('not found');
	}
})

app.listen(3001, ()=> {
	console.log('app is running on port 3001');
})



/* Idea what we want to create
/ --> res = thie is working
/signIn --> POST = success/fail
/register --> POST = user
/profile/:userId --> GET = user
/image --> PUT --> user
*/