const express = require("express");
const app = express();
const path = require("path");
const cors = require('cors')

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const config = require("./config/key");
//////////////////////////////////////몽고디비///////////////////////////////////////////////////////////////
// const mongoose = require("mongoose");
// const connect = mongoose.connect(config.mongoURI,
//   {
//     useNewUrlParser: true, useUnifiedTopology: true,
//     useCreateIndex: true, useFindAndModify: false
//   })
//   .then(() => console.log('MongoDB Connected...'))
//   .catch(err => console.log(err));

///////////////////////////////////////오라클///////////////////////////////////////////////////////////////
// const oracledb = require('oracledb'); 
// oracledb.autoCommit = true;
// const dbConfig = require("./config/dbconfig.js");

// function init() {
//   //oracle client 경로 설정 
//   oracledb.initOracleClient({ libDir: 'C:\\instantclient_21_3' }); 
// }

// var conn;
// oracledb.getConnection(dbConfig,function(err,con){
  
//   if(err){
//        console.log("DB 접속이 실패했습니다.",err);
//    }else{
//     conn = con;
//     console.log("DB 접속.");
//    }
// });


app.use(cors())

app.use(bodyParser.urlencoded({ extended: true }));//application/x-www-form-urlencoded 이렇게 되어있는걸 분석해서 가져오게함
app.use(bodyParser.json());//application/json 타입으로 된것을 분석해서 가져오게함
app.use(cookieParser());

app.use('/api/users', require('./routes/users'));
app.use('/api/upload', require('./routes/upload'));

if (process.env.NODE_ENV === "production") {

  app.use(express.static("client/build"));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../client", "build", "index.html"));
  });
}

const port = process.env.PORT || 5000

app.listen(port, () => {
  console.log(`Server Listening on ${port}`)
});