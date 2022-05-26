import React, { useState } from "react";
import { withRouter } from "react-router-dom";
import { loginUser } from "../../../_actions/user_actions";
import { useDispatch } from "react-redux";
import Modal from './FindID';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';



function LoginPage(props){

  const dispatch = useDispatch();
  const LoginIMG = "/images/login.jpg" //src폴더에 넣으면 상대경로로 바로 접근할 수 없음. public 폴더에 저장.
  const [USER_ID, setID] = useState("")
  const [USER_PW, setPassword] = useState("")
  const [modalOpen, setModalOpen] = useState(false);

  const onIDHandler = (event) => {
    setID(event.currentTarget.value)
  }

  const onPasswordHandler = (event) => {
    setPassword(event.currentTarget.value)
  }
  
  const onSubmitHandler_login = (event) => {
    //preventDefault안써주면 아무것도 하기전에 refresh가 되어버리기 때문에 이를 막아주기 위함
    event.preventDefault();

    let body = {
      USER_ID:USER_ID,
      USER_PW:USER_PW
    }

    //redux사용 React Componet -> (Dispatch(action)) -> Action -> Reducer -> Store -> (Subscribe) -> React Component
    //_action폴더안에 user_action.js
    dispatch(loginUser(body))
          .then(response => {
              if(response.payload.loginSuccess){
                //화면이동
                alert("로그인에 성공하였습니다.");
                 props.history.push('/loginSucs')
              }else{
                alert(response.payload.message);
              }
          })

  }
 
 const onSubmitHandler_reg = (event) => {
    props.history.push("/register")
 }

 const onSubmitHandler_Modal = (event) => {
  event.preventDefault();
  setModalOpen(true);
};

const closeModal = (event) => {
  event.preventDefault();
  setModalOpen(false);
};

  return(
    <div  style={{display:'flex', justifyContent:'center', alignItems:'center',width:'100%', height:'100vh'}}>
     
      <form>
        <img src={LoginIMG} />
        <br />
        <br />
        <TextField variant="outlined" label="ID" value={USER_ID} style={{display:'flex'}} onChange={onIDHandler}/>
        <br />
        <TextField variant="outlined" label="Password" type="password" value={USER_PW} style={{display:'flex'}} onChange={onPasswordHandler}/>
        <br />

        <Stack spacing={3} direction="row">
          <Button variant="contained" onClick={onSubmitHandler_login}>
            Login
          </Button>

          <Button variant="outlined" onClick={onSubmitHandler_reg}>
            회원가입
          </Button>

          <React.Fragment>
            <Button variant="text" onClick={onSubmitHandler_Modal}>ID 찾기</Button>
            <Modal open={modalOpen} close={closeModal} header="ID 찾기"> </Modal> 
          </React.Fragment>
        </Stack>


      </form>
      
    </div>


  )
}

export default withRouter(LoginPage);


