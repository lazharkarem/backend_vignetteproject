require('dotenv').config()
const express = require('express');
const router = express.Router();
var multer = require('multer');

const jwt = require('jsonwebtoken')

let p = require('python-shell');
const Vignette = require('../models/vignette').vignetteModel;

var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'public/')
    },
    filename: (req, file, cb) => {
        const fileName = file.originalname;
        cb(null, fileName);
    },
});

const upload = multer({ storage: storage });

const User = require('../models/user');


const AddVignette = (req, res) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1];
    var decoded = jwt.decode(token);

    User.findOne({'_id': decoded.id}).then((user) => {
        var options = {
            args:[req.file.originalname]
          }
        try {
           
            p.PythonShell.run('script.py', options, function  (err, results)  {
                const r = results.toString()
                var colorposition = r.indexOf('color');
                var textString =r.substr(4,colorposition-4);
                
                var g =r.substr(colorposition, r.length);
                var colorString =g.substr(6, r.length);
                var newVignette = new Vignette();
                newVignette.image_vignette = req.file.originalname;
    
                newVignette.text = textString;
                newVignette.color = colorString;
                //save the publication
                user.vignettes.push(newVignette);
                user.save(function (error) {
                    if (error) {
                        console.log('error' + error)
                    } else {
                        res.status(200).send(JSON.stringify({
                            message:'vignette added succeffully'
                        }))
                    }
                });

              });
         
        } catch (err) {
            res.json({
                status: 0,
                message: '500 Internal Server Error',
                data: {}
            })
     
        }
    })


}

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

const getVignetteById = (req,res,next)  => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1];
    var decoded = jwt.decode(token);
    
    User.findOne({'_id': decoded.id}).then((user) => {
        res.json(user.vignettes);
    })


    
}

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.status(401).send(JSON.stringify({msg:"no token in headers"}))
    
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) return res.status(403).send(JSON.stringify({msg:"erreur in token"}))
      req.user = user
      next()
    })
}

router.post('/AddVignette',upload.single('file'), authenticateToken ,AddVignette );
router.get('/getVignettes', authenticateToken, getVignetteById)
router.get('/',index);

module.exports = router;