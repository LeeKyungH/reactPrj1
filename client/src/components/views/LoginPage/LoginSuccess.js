import React, { useState, useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";
import { auth } from '../../../_actions/user_actions';
import { updateUser } from "../../../_actions/user_actions";
import axios from 'axios';
import { USER_SERVER } from '../../Config.js';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
function LoginSuccess(props){
  
  const dispatch = useDispatch();

  const [USER_ID, setID] = useState("")
  const [USER_PW, setPassword] = useState("")
  const [USER_NM, setName] = useState("")
  const [USER_MAIL, setEmail] = useState("")
  const [ConfirmPassword, setConfirmPassword] = useState("")
  const [ConfirmPassword_CHK, setConfirmPasswordCHK] = useState("")
  const [USER_OFFICE, setOffice] = useState("")
  const [USER_DEPT, setDept] = useState("")
  const [EAMIL_CHK, setMAILCHECK] = useState("")
  const [USER_IMG, setIMG] = useState("")

    //[] : 화면에 가장 처음 렌더링 될 떄 한 번만 실행
    useEffect(() => {
        dispatch(auth()).then(response => {
            setID(response.payload.SES_USER_ID);
            setEmail(response.payload.SES_USER_MAIL);
            setName(response.payload.SES_USER_NM);
            setOffice(response.payload.SES_USER_OFFICE);
            setDept(response.payload.SES_USER_DEPT);
            setIMG("http://localhost:3000/uploads/"+response.payload.SES_USER_IMG);
           //USER_ID 가져오는 방법 : response.payload.user_id.metaData[0].name
        })
      },[]);

  const onPasswordHandler = (event) => {
    setPassword(event.currentTarget.value)
  }

  const onNameHandler = (event) => {
    setName(event.currentTarget.value)
  }

  const onEmailHandler = (event) => {
    setEmail(event.currentTarget.value);    
  }
 
  const onConfirmPasswordHandler = (event) => {
    setConfirmPassword(event.currentTarget.value)
  }

  const onConfirmPasswordCHKHandler = (event) => {
    
    if(ConfirmPassword != USER_PW){
      setConfirmPasswordCHK("* 비밀번호가 일치하지 않습니다.");
    }else{
      setConfirmPasswordCHK("");
    }

  }


  const onPasswordCHKHandler = (event) => {

    //var reg = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
    var reg = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[#?!@$%^&*-])/;

    if(false === reg.test(USER_PW)) {
      setConfirmPasswordCHK('* 비밀번호는 대문자/소문자/특수문자를 모두 포함해야 합니다.');
    }

  }

  const onOfficeHandler = (event) => {
    setOffice(event.currentTarget.value)
  }

  const onDeptHandler = (event) => {
    setDept(event.currentTarget.value)
  }


  const onSubmitHandler = (event) => {
    //preventDefault안써주면 아무것도 하기전에 refresh가 되어버리기 때문에 이를 막아주기 위함
    event.preventDefault();

    if(ConfirmPassword != USER_PW){
      alert("비밀번호가 일치하지 않습니다.");
    }

  }

  const updateHandler = (event) => {
    event.preventDefault();

    // if(ConfirmPassword != USER_PW){
    //   alert("비밀번호가 일치하지 않습니다.");
    // }

    let body = {
      USER_ID:USER_ID,
      USER_NM:USER_NM,
      USER_MAIL:USER_MAIL,
      //USER_PW:USER_PW,
      USER_OFFICE:USER_OFFICE,
      USER_DEPT:USER_DEPT
    }

    dispatch(updateUser(body))
            .then(response => {
                if(response.payload.success){
                  alert("회원정보가 업데이트 되었습니다.");
                  props.history.push("/LoginSucs")
                }else{
                  alert("회원정보 업데이트 도중 오류가 발생하였습니다.");
                }
            })

  };

  const logoutHandler = (event) => {
    event.preventDefault();

     axios.get(`${USER_SERVER}/logout`).then(response => {
         props.history.push("/login");
     });
  };


  return(   
   
     <div  style={{display:'flex', justifyContent:'center', alignItems:'center',width:'100%', height:'100vh'}}>
    
      <form style={{flexDirection:'column'}}> 

        <label>ID</label>
        <TextField id="filled-basic" variant="filled" value={USER_ID}  style={{marginLeft:'80px'}}  readOnly/>
        <div className="input-feedback2"></div>
        <br />
        
        <label>비밀번호</label>
        {/* <TextField variant="Standard" value={USER_PW}  style={{marginLeft:'40px'}} onChange={onPasswordHandler} /> */}
        <input type="password" style={{marginLeft:'40px'}} value={USER_PW} onChange={onPasswordHandler} />
        <div className="input-feedback2"></div>
        <br />

        <label>비밀번호 확인</label>
        <input type="password" style={{marginLeft:'10px'}} value={ConfirmPassword} onChange={onConfirmPasswordHandler} onKeyUp={onConfirmPasswordCHKHandler} onBlur={onPasswordCHKHandler}/>
        <div className="input-feedback2">{ConfirmPassword_CHK}</div>
        <br />

        <label>이름</label>
        <TextField  variant="standard" value={USER_NM}  style={{marginLeft:'70px', width:'400px'}} onChange={onNameHandler} />
        <div className="input-feedback2"></div>
        <br />

        <label>Email</label>
        <TextField  variant="standard" value={USER_MAIL}  style={{marginLeft:'65px', width:'400px'}} onChange={onEmailHandler} />
        <div className="input-feedback2">{EAMIL_CHK}</div>
        <br />

        <label>회사명</label>
        <TextField  variant="standard" value={USER_OFFICE}  style={{marginLeft:'55px', width:'400px'}} onChange={onOfficeHandler} />
        <div className="input-feedback2"></div>
        <br />

        <label>부서명</label>
        <TextField  variant="standard" value={USER_DEPT}  style={{marginLeft:'55px', width:'400px'}} onChange={onDeptHandler} />
        <div className="input-feedback2"></div>
        <br />
        <label>사진</label>
        <TextField  variant="standard" value={USER_IMG}  style={{marginLeft:'55px', width:'400px'}} onChange={onDeptHandler} />
        <img src={USER_IMG} />
        <br />
        <br />
        <Stack spacing={2} direction="row">
          <Button variant="contained" onClick={updateHandler}>
            변경
          </Button> 
          <Button  variant="outlined" onClick={logoutHandler}>
            로그아웃
          </Button> 
        </Stack>

      </form>

    </div>
  )
}

export default LoginSuccess
