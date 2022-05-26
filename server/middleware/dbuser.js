const oracledb = require('oracledb'); 
oracledb.autoCommit = true;
const dbConfig = require("../config/dbconfig.js");


function init() {
    //oracle client 경로 설정 
    oracledb.initOracleClient({ libDir: 'C:\\instantclient_21_3' }); 
}

function getConnection(callback){
    oracledb.getConnection(dbConfig,function(err,con){
     
        if(err){
             console.log("DB 접속이 실패했습니다.",err);
         }else{
              //console.log("DB 접속.");
              callback(con);
         }
      });
}

  
module.exports = getConnection;
