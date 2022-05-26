const jwt = require('jsonwebtoken');
const getConnection = require('../middleware/dbuser');

let auth = (req, res, next) => {
  //인증 처리 하는곳
  //클라이언트 쿠키에서 토큰을 가져온다.
  //routes/users.js에서 res.cookie("w_auth", req.body.USER_TOKEN) 로 저장했기떄문에 w_auth로 받음
  let token = req.cookies.w_auth;

   //복호화
   jwt.verify(token,'secret',function(err, decoded){
    
    //유저 아이디를 이용해서 유저를 찾은 다음에
    //클라이언트에서 가져온 토큰과 DB에 보관된 토큰이 일치하는지 확인
    //req.body.find({"_id":decoded, "token":token}, function(err, user){
    getConnection((conn) => {
        conn.execute("SELECT USER_ID, USER_PW, USER_MAIL, USER_NM, USER_OFFICE, USER_DEPT, FILE_NM  FROM LKH_USER_INFO WHERE USER_ID = '"+decoded+ "' AND USER_TOKEN = '"+token+ "' ",[],async function(err,user){
        console.log("=====middleware=====USER_ID : "+user.rows);
            if (err) throw err;

            if (user.rows==""){
              return res.json({isAuth: false, error: true});
            }else{
              //res.json({isAuth: true, user: user});
                //request받아서 사용할 수 있도록 넣어줌
                req.token = token;
                req.user = user;
                req.USER_ID = user.rows[0][0];
                req.USER_PW = user.rows[0][1];
                req.USER_MAIL = user.rows[0][2];
                req.USER_NM = user.rows[0][3];
                req.USER_OFFICE = user.rows[0][4];
                req.USER_DEPT = user.rows[0][5];
                req.USER_IMG = user.rows[0][6];
                //middleware에서 갇히지 않고 다음으로 넘어가도록
               
            }
            next();
        })
      })
   })

  //토큰을 복호화 한 후 유저를 찾는다.
  // User.findByToken(token, (err, user) => {
  //   if (err) throw err;
  //   if (!user)
  //     return res.json({
  //       isAuth: false,
  //       error: true
  //     });

  //   //request받아서 사용할 수 있도록 넣어줌
  //   req.token = token;
  //   req.user = user;
  //   //middleware에서 갇히지 않고 다음으로 넘어가도록
  //   next();
  // });
};

module.exports = { auth };
