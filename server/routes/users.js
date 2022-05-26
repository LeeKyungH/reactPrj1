//const oracledb = require('oracledb'); 
//oracledb.autoCommit = true;
const express = require('express');
const router = express.Router();
const { auth } = require("../middleware/auth");
const moment = require("moment");
//const dbConfig = require("../config/dbconfig.js");
const bcrypt = require('bcrypt');
const saltRounds = 10; //Salt를 이용해서 비밀번호를 암호화함. saltRounds:salt가 몇글자인지 설정
const jwt = require('jsonwebtoken');
const getConnection = require('../middleware/dbuser');
//=================================
//             User
//=================================

// function init() {
//    //oracle client 경로 설정 
//    oracledb.initOracleClient({ libDir: 'C:\\instantclient_21_3' }); 
// }

// var conn;
// oracledb.getConnection(dbConfig,function(err,con){
//     if(err){
//         console.log("DB 접속이 실패했습니다.",err);
//     }
//     conn = con;
// });

router.get("/auth", auth, (req, res) => {
    //여기까지 미들웨어를 통과해 왔다는 얘기는 Authentication이 true라는 말

    res.status(200).json({
        SES_USER_ID: req.USER_ID,
        SES_USER_PW: req.USER_PW,
        SES_USER_MAIL: req.USER_MAIL,
        SES_USER_NM: req.USER_NM,
        SES_USER_OFFICE: req.USER_OFFICE,
        SES_USER_DEPT: req.USER_DEPT,
        SES_USER_IMG: req.USER_IMG,
        //isAdmin: req.user.role === 0 ? false : true,
        isAuth: true,
        //mage: req.body.user.image,
    });
});

router.post("/register", (req, res) => {
    //정보들을 DB 안에 넣기
    //req.body안에 json형태로 들어있음. {Id : “Hello”}
    //body-parser를 이용해서 req.body로 client정보를 받아줌
  
    //비밀번호를 암호화
    bcrypt.genSalt(saltRounds, function(err, salt){
        if(err) return next(err);
    
        //bcrypt.hash(입력한 비밀번호, salt, function)
        bcrypt.hash(req.body.USER_PW, salt, function(err, hash){
            if(err) return next(err);

            //hash된 비밀번호로 바꿔줌
            getConnection((conn) => {
                conn.execute("INSERT INTO LKH_USER_INFO(USER_NM,USER_ID,USER_PW,USER_MAIL,USER_OFFICE,USER_DEPT,FILE_NM)"+
                            "VALUES('"+req.body.USER_NM+"','"+req.body.USER_ID+"','"+hash+"','"+req.body.USER_MAIL+"','"+req.body.USER_OFFICE+"','"+req.body.USER_DEPT+"','"+req.body.USER_IMG+"')",function(err,result){
                    if(err){
                        return res.json({ success: false, err });
                    }else{
                        console.log("result : ",result);
                        return res.status(200).send({ success: true});
                    }
                });
                conn.release();
            })
        })
    })
});

router.post("/updateUser", (req, res) => {
    //정보들을 DB 안에 넣기
    //req.body안에 json형태로 들어있음. {Id : “Hello”}
    //body-parser를 이용해서 req.body로 client정보를 받아줌
  
    bcrypt.genSalt(saltRounds, function(err, salt){
        if(err)  return next(err);
    
        //bcrypt.hash(입력한 비밀번호, salt, function)
        //bcrypt.hash(req.body.USER_PW, salt, function(err, hash){
        //    if(err)  return next(err);

            //hash된 비밀번호(hash)로 바꿔줌
            getConnection((conn) => {
                conn.execute("UPDATE LKH_USER_INFO SET USER_NM = '"+req.body.USER_NM+"' ,USER_MAIL='"+req.body.USER_MAIL+
                                "',USER_OFFICE = '"+req.body.USER_OFFICE+"',USER_DEPT = '"+req.body.USER_DEPT+
                                "'WHERE USER_ID = '"+req.body.USER_ID+"'",function(err,result){

                    if(err){
                        console.log("UPDATE LKH_USER_INFO err : ",err);
                        return res.json({ success: false, err });
                    }else{
                        return res.status(200).send({ success: true});
                    }
                });
                conn.release();
            })
       // })
    })

});


router.post("/login", (req, res) => {

    getConnection((conn) => {
        conn.execute("SELECT LOCK_YN FROM LKH_USER_INFO WHERE USER_ID = '"+req.body.USER_ID + "' ",[], function(err,user){
            if(err) return res.json({ success: false, err });

            if(user.rows == "Y"){
                return res.status(200).send({ success: false, message:"로그인 5회이상 실패하여 계정이 잠겼습니다.\n관리자에게 문의해주세요."});
            }else{

                conn.execute("SELECT USER_PW FROM LKH_USER_INFO WHERE USER_ID = '"+req.body.USER_ID + "' ",[],async function(err,user){

                    if(user.rows == ""){
                        return res.json({ loginSuccess: false, message:"해당하는 아이디가 없습니다." });
                    }else{
                        //비밀번호 암호화해서 DB데이터와 확인해야함
                        //bcrypt.compare(plainPassword(화면), 암호화된 패스워드(DB), callback function)
                        //bcrypt.compare(req.body.USER_PW, user.rows, function(err, isMatch)
                        var check = await bcrypt.compare(req.body.USER_PW.toString(),user.rows.toString());
        
                        if (!check){ 
                           //비밀번호 입력 5회 이상 실패 할 경우 계정이 잠기로 로그인이 되지 않도록 처리
                            conn.execute("UPDATE LKH_USER_INFO SET LOCK_CNT= (SELECT NVL(LOCK_CNT,0)+1 FROM LKH_USER_INFO WHERE USER_ID = '"+req.body.USER_ID+"')"
                                                                  +",LOCK_YN = (CASE WHEN LOCK_CNT > 3 THEN 'Y' ELSE 'N' END) "
                                                                  +"WHERE USER_ID = '"+req.body.USER_ID+"' ",function(err,result){
        
                                if(err) return res.json({ loginSuccess: false, err});
                               
                                return res.json({ loginSuccess: false, message: "비밀번호가 일치하지 않습니다. \n 5번 이상 로그인 실패시 계정이 잠깁니다." });
                            })
                        }else{ 
                            //비밀번호 맞으면 토큰생성
                            //USER_ID + 'secret'(아무 문구나 써도됨) 로 토큰을 만들고 나중에 'secret'을 가지고 user._id를 뽑아냄
                            var token =  jwt.sign(req.body.USER_ID.toString(),'secret')
                            //var oneHour = moment().add(1, 'hour').valueOf();
                            
                            req.body.USER_TOKEN = token;
                            //req.body.USER_TOKENEXP = oneHour;
        
                            conn.execute("UPDATE LKH_USER_INFO SET USER_TOKEN='"+req.body.USER_TOKEN+"' WHERE USER_ID = '"+req.body.USER_ID+"' ",function(err,result){
        
                                if(err){
                                    //conn.release();
                                    return res.json({ loginSuccess: false, message:"generate token error" });
                                }else{
                                         //쿠키에 토큰 저장하는 방법
                                        //res.cookie("w_authExp", req.body.USER_TOKENEXP);
                                        res
                                            //쿠키에 w_auth라는 이름으로 토큰 저장
                                            .cookie("w_auth", req.body.USER_TOKEN)
                                            //성공했다는 표시
                                            .status(200)
                                            //json으로 데이터 보냄
                                            .json({
                                                loginSuccess: true, userId: req.body.USER_ID
                                            });
                                }
                                
                            })
                        }
        
                    }
                })

            }
        });
    })
});



//로그인된 상태이기 때문에 auth 미들웨어를 넣어주면됨
router.get("/logout", auth, (req, res) => {

    getConnection((conn) => {
        conn.execute("UPDATE LKH_USER_INFO SET USER_TOKEN='' WHERE USER_ID = '"+req.USER_ID+"' ",function(err,result){
            if(err){
                return res.json({ success: false, err });
            }else{
                return res.status(200).send({ success: true});
            }
        });
        conn.release();
    })   

});

router.post("/idChk", (req, res) => {

    getConnection((conn) => {
        conn.execute("SELECT USER_ID FROM LKH_USER_INFO WHERE USER_ID = '"+req.body.USER_ID + "' ",[], function(err,user){
            if(err){
                return res.json({ success: false, err });
            }else{
                return res.status(200).send({ success: true, userId: user.rows});
            }
        });
        conn.release();
    })   

});


router.post("/findID", (req, res) => {

    getConnection((conn) => {
        conn.execute("SELECT USER_ID FROM LKH_USER_INFO WHERE USER_MAIL = '"+req.body.USER_MAIL + "' "
                                                      +"AND USER_OFFICE = '"+req.body.USER_OFFICE + "' AND USER_DEPT = '"+req.body.USER_DEPT + "' " ,[], function(err,user){
            if(err){
                return res.json({ success: false, err });
            }else{
                return res.status(200).send({ success: true, userId: user.rows});
            }
        });
        conn.release();
    })   

});

module.exports = router;
