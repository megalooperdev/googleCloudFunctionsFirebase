/**
 * Responds to any HTTP request.
 *
 * @param {!express:Request} req HTTP request context.
 * @param {!express:Response} res HTTP response context.
 */
 
var md5 =require("md5");
var admin = require("firebase-admin");
var cors = require('cors')
var port=process.env.PORT=3000;


const express = require("express");
const app=express();
var router=express.Router();

var bodyParser=require ('body-parser');
var server =require ('http').Server(app);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use('/api',router)

admin.initializeApp({
  credential: admin.credential.cert('serempreDb.json'),
  databaseURL: "https://serempre-db-default-rtdb.firebaseio.com"
});

const db=admin.firestore();

router.route('/createUser').post(function(req,res){
	  let id=req.body.id;
	  let name=req.body.name;
	  let email=req.body.email;
	  let password=req.body.password;

	  db.collection("users")
	  .doc(id)
	  .create({ id: id, name: name,email: email, password: md5(password) 
	  }).then(post => {
		let message = 'User Created';
		res.status(200).send(message);
	  }).catch(error => { 
		return res.status(500).json(JSON.stringify(error));
	  });
  
});
router.route('/updateUser').post(function(req,res){
	  let id=req.body.id;
	  let name=req.body.name;
	  let email=req.body.email;
	  let password=req.body.password;

	  const document = db.collection("users").doc(id);
	  document.update({
		name: name,
		email: email,
		password: md5(password),
	  }).then(post => {
		let message = 'User Updated';
		res.status(200).send(message);
	  }).catch(err => { 
		  return res.status(500).json(JSON.stringify(error));
	  });
  
});
router.route('/deleteUser').post(function(req,res){
	  let id=req.body.id;
  
	  try {
		const doc = db.collection("users").doc(id);
		doc.delete();
		
		let message = 'User Deleted';
		res.status(200).send(message);
	  } catch (error) {
		return res.status(500).json(JSON.stringify(error));
	  }
  
});


router.route('/createUserPoints').post(function(req,res){
	let user_id=req.body.user_id;
  let id=req.body.id;
  let quantity=req.body.quantity;
  let reason=req.body.reason;
  const doc = db.collection("users").doc(user_id);
  
  //db.collection('users').doc(user_id).collection('points').add({
    db.collection('users').doc(user_id).collection('points').doc(id).set({
    id: id,
    quantity: quantity,
    reason: reason
  }).then(post => {
      let message = 'User Point Created';
      res.status(200).send(message);
  }).catch(err => { 
      return res.status(500).json(JSON.stringify(error));
  });
});

router.route('/updateUserPoints').post(function(req,res){
  let user_id=req.body.user_id;
  let id=req.body.id;
  let quantity=req.body.quantity;
  let reason=req.body.reason;
  var docPoint = db.collection('users').doc(user_id)
                .collection('points').doc(id);
  docPoint.update({
    id: id,
    quantity: quantity,
    reason: reason,
  }).then(post => {
    let message = 'User Point Updated';
    res.status(200).send(message);
  }).catch(err => { 
      return res.status(500).json(JSON.stringify(error));
  });;
});

router.route('/deleteUserPoints').post(function(req,res){
  let user_id=req.body.user_id;
  let id=req.body.id;
  var docPoint = db.collection('users').doc(user_id)
                .collection('points').doc(id);
  docPoint.
  delete(
  ).then(post => {
    let message = 'User Point Deleted';
    res.status(200).send(message);
  }).catch(err => { 
      return res.status(500).json(JSON.stringify(error));
  });;
	
});

router.route('/').get(function(req,res){
	res.status(200).json('---ready////');
	/*
	dbusuarios.getUsuarios().then(result=> {
		res.status(200).json(result[0]);
	})	*/
	
}) 
server.listen(port,function(){
	console.log('INICIA PUERTO 3000');
});