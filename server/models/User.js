const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
//Salt를 이용해서 비밀번호를 암호화함. saltRounds:salt가 몇글자인지 설정
const saltRounds = 10;
const jwt = require('jsonwebtoken');
const moment = require("moment");

const userSchema = mongoose.Schema({
    name: {
        type:String,
        maxlength:50
    },
    email: {
        type:String,
        trim:true,
        unique: 1 
    },
    password: {
        type: String,
        minglength: 5
    },
    lastname: {
        type:String,
        maxlength: 50
    },
    role : {
        type:Number,
        default: 0 
    },
    image: String,
    token : {
        type: String,
    },
    tokenExp :{
        type: Number
    }
})

//.pre : .save()로 DB에 저장하기 전에 실행. 실행 후 next로 저장함수 실행
// userSchema.pre('save', function( next ) {
//     //userSchema를 가르킴
//     var user = this;
    
//     //암호화
//     //password가 변경될때만 실행
//     if(user.isModified('password')){    
//         //비밀번호를 암호화 시킨다.
//         bcrypt.genSalt(saltRounds, function(err, salt){
//             if(err) return next(err);
    
//             //bcrypt.hash( 입력한 비밀번호 : userSchema의 password,  bcrypt.genSalt(saltRounds, function(err, salt) 의 salt, function)
//             bcrypt.hash(user.password, salt, function(err, hash){
//                 if(err) return next(err);
//                 //hash된 비밀번호로 바꿔줌
//                 user.password = hash 
//                 next()
//             })
//         })
//     } else {
//         next()
//     }
// });

// userSchema.methods.comparePassword = function(plainPassword,cb){
//     //패스워드 복호화할 수 없음. 암호화해서 DB데이터와 확인해야함
//     //bcrypt.compare(plainPassword(화면), 암호화된 패스워드(DB), callback function)
//     bcrypt.compare(plainPassword, this.password, function(err, isMatch){
//         if (err) return cb(err);
//         cb(null, isMatch)
//     })
// }

// userSchema.methods.generateToken = function(cb) {
   
//     var user = this;

//     //user._id + 'secret'(아무 문구나 써도됨) 로 토큰을 만들고 나중에 'secret'을 가지고 user._id를 뽑아냄
//     //
//     var token =  jwt.sign(user._id.toHexString(),'secret')
//     var oneHour = moment().add(1, 'hour').valueOf();

//     user.tokenExp = oneHour;
//     user.token = token;
//     user.save(function (err, user){
//         if(err) return cb(err)
//         //여기의 user 정보가 users.js의 user정보로 감
//         cb(null, user);
//     })
// }

userSchema.statics.findByToken = function (token, cb) {
    var user = this;

    //복호화
    jwt.verify(token,'secret',function(err, decode){
        //유저 아이디를 이용해서 유저를 찾은 다음에
        //클라이언트에서 가져온 토큰과 DB에 보관된 토큰이 일치하는지 확인
        user.findOne({"_id":decode, "token":token}, function(err, user){
            if(err) return cb(err);
            cb(null, user);
        })
    })
}

const User = mongoose.model('User', userSchema);

module.exports = { User }