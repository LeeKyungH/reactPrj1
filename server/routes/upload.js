const express = require('express');
const router = express.Router();
const { auth } = require("../middleware/auth");
const multer = require("multer");
const getConnection = require('../middleware/dbuser');
//=================================
//             Upload
//=================================


let storage = multer.diskStorage({
    destination : (req, file, cb) => {
        cb(null, 'uploads');
    },
    filename:(req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`);
    },
    fileFilter : (req, file, cb) => {
        const ext = path.extnmae(file.originalname)
        if(ext != '.png' || ext != '.jpg'){
            return cb(res.status(400).end('only jpg, png is allowed'), false);
        }
        cb(null, true)
    }
});

const upload = multer({storage:storage}).single("file");

router.post("/uploadfile", (req, res) => {

    upload(req, res, err => {
        if(err){
            return res.json({success:false, err})
        }
        return res.json({success:true, url:res.req.file.path,fileName:res.req.file.filename})
    })    

});

module.exports = router;
