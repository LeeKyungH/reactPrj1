import React, { useState, useCallback } from "react";
import moment from "moment";
import { Formik } from 'formik';
import * as Yup from 'yup';
import { registerUser } from "../../../_actions/user_actions";
import { idChk } from "../../../_actions/user_actions";
import { useDispatch } from "react-redux";
import Dropzone from 'react-dropzone';

import {
  Form,
  Input,
  Button,
} from 'antd';
import Axios from "axios";

function RegisterPage(props){
  
  const dispatch = useDispatch();
  const [USER_ID, setID] = useState("")
  const [USER_ID_CHK, setIDCHK] = useState("")
  const [USER_MAIL, setEmail] = useState("")
  const [USER_NM, setName] = useState("")
  const [USER_PW, setPassword] = useState("")
  const [ConfirmPassword, setConfirmPassword] = useState("")
  const [ConfirmPassword_CHK, setConfirmPasswordCHK] = useState("")
  const [USER_OFFICE, setOffice] = useState("")
  const [USER_DEPT, setDept] = useState("")
  const [USER_TOKEN, setTOKEN] = useState("")
  const [USER_TOKENEXP, setTOKENEXP] = useState("")
  const [EAMIL_CHK, setMAILCHECK] = useState("")
  const [USER_IMG, setIMG] = useState("")

  const onIDHandler = (event) => {
    setID(event.currentTarget.value)
  }

  const onIDCHKHandler = (event) => {
    //아이디 중복체크
    let body = {
      USER_ID:USER_ID
    }

    dispatch(idChk(body))
            .then(response => {
                if(response.payload.success){
                  if(response.payload.userId != ""){
                    setIDCHK("* 사용할 수 없는 ID입니다.");
                  }else{
                    setIDCHK("");
                  }
                }else{
                  alert("ID 중복체크 도중 오류가 발생하였습니다.");
                }
            })
 
  }

  const onEmailHandler = (event) => {
    setEmail(event.currentTarget.value);    
  }

  const onNameHandler = (event) => {
    setName(event.currentTarget.value)
  }
  
  const onPasswordHandler = (event) => {
    setPassword(event.currentTarget.value)
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

  const onDrop= (files) => {

    let formData =new FormData;
    const config = {
      header : {'content-type' : 'multipart/form-data'}
    }
    formData.append("file", files[0])

    Axios.post('/api/upload/uploadfile',formData, config)
        .then(response => {
            if(response.data.success){
                setIMG(response.data.fileName)
            }else{
              alert("이미지 업로드 실패")
            }
        })
  }


  const onSubmitHandler = (event) => {
    //preventDefault안써주면 아무것도 하기전에 refresh가 되어버리기 때문에 이를 막아주기 위함
    event.preventDefault();

    if(ConfirmPassword != USER_PW){
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    let body = {
      USER_ID:USER_ID,
      USER_NM:USER_NM,
      USER_MAIL:USER_MAIL,
      USER_PW:USER_PW,
      USER_OFFICE:USER_OFFICE,
      USER_DEPT:USER_DEPT,
      USER_TOKEN:USER_TOKEN,
      USER_TOKENEXP:USER_TOKENEXP,
      USER_IMG:USER_IMG
    }

    //Axios.post('/api/users/register', body)

    //redux사용 React Componet -> (Dispatch(action)) -> Action -> Reducer -> Store -> (Subscribe) -> React Component
    //_action폴더안에 user_action.js
    dispatch(registerUser(body))
          .then(response => {
              if(response.payload.success){
                alert("회원가입에 성공하였습니다.");
                props.history.push("/login")
              }else{
                alert("회원가입 하는 도중 오류가 발생하였습니다.");
              }
          })

  }


  return(   
   
     <div  style={{display:'flex', justifyContent:'center', alignItems:'center',width:'100%', height:'100vh'}}>
    
      <form style={{flexDirection:'column'}} onSubmit={onSubmitHandler}> 

        <label>ID</label>
        <input type="text" style={{marginLeft:'80px'}} value={USER_ID} onChange={onIDHandler} onBlur={onIDCHKHandler}/>
        <div className="input-feedback2">{USER_ID_CHK}</div>
        <br />
        
        <label>비밀번호</label>
        <input type="password" style={{marginLeft:'40px'}} value={USER_PW} onChange={onPasswordHandler} />
        <div className="input-feedback2"></div>
        <br />

        <label>비밀번호 확인</label>
        <input type="password" style={{marginLeft:'10px'}} value={ConfirmPassword} onChange={onConfirmPasswordHandler} onKeyUp={onConfirmPasswordCHKHandler} onBlur={onPasswordCHKHandler}/>
        <div className="input-feedback2" style={{display:'flex', justifyContent:'space-between'}}>{ConfirmPassword_CHK}</div>
        <br />

        <label>이름</label>
        <input type="text" style={{marginLeft:'70px', width:'400px'}} value={USER_NM} onChange={onNameHandler}/>
        <div className="input-feedback2"></div>
        <br />

        <label>Email</label>
        <input type="text" style={{marginLeft:'65px', width:'400px'}} value={USER_MAIL} onChange={onEmailHandler} />
        <div className="input-feedback2">{EAMIL_CHK}</div>
        <br />

        <label>회사명</label>
        <input type="text" style={{marginLeft:'55px', width:'400px'}} value={USER_OFFICE} onChange={onOfficeHandler} />
        <div className="input-feedback2"></div>
        <br />

        <label>부서명</label>
        <input type="text" style={{marginLeft:'55px', width:'400px'}} value={USER_DEPT} onChange={onDeptHandler} />
        <div className="input-feedback2"></div>
        <br />
        <label>파일 업로드</label>
        <div>
            <Dropzone onDrop={onDrop} multiple={false} maxSize={100000000}>
                 {({getRootProps, getInputProps}) => (
                 <div style={{width:'200px', height:'30px', border:'1px solid lightgray'}}
                   {...getRootProps()}>
                   <input {...getInputProps()} />
                 </div>
               )}
            </Dropzone>
        </div>
        <div>{USER_IMG}</div>
        <br />
         <button type="submit">
          신청
        </button> 

      </form>

    </div>
  )
}


// const formItemLayout = {
//   labelCol: {
//     xs: { span: 24 },
//     sm: { span: 8 },
//   },
//   wrapperCol: {
//     xs: { span: 24 },
//     sm: { span: 16 },
//   },
// };
// const tailFormItemLayout = {
//   wrapperCol: {
//     xs: {
//       span: 24,
//       offset: 0,
//     },
//     sm: {
//       span: 16,
//       offset: 8,
//     },
//   },
// };

// function RegisterPage(props) {
//   const dispatch = useDispatch();
  
//   // const validatePW = useCallback((_, value) => {
//   //   if (!value) { return Promise.reject(new Error('닉네임은 필수 항목입니다.')); } 
//   //   if (/\s/.test(value)) { return Promise.reject(new Error('닉네임은 공백을 포함 할 수 없습니다.')); }

//   //       const regExp = /[^a-zA-Z0-9가-힣_]/; 
//   //       if (regExp.test(value)) { return Promise.reject(new Error('닉네임은 한글, 영문, 숫자, _ 만 사용할 수 있습니다.')); }
//   //        return Promise.resolve(); 
//   // }, []);


//   return (

//     <Formik
//       initialValues={{
//         id: '',
//         password: '',
//         confirmPassword: '',
//         name: '',
//         email: '',
//         office:'',
//         dept:''
//       }}

//       validationSchema={Yup.object().shape({
//         id: Yup.string()
//           .required('ID is required'),
//         //password: Yup.string()
//          //.min(6, 'Password must be at least 6 characters')
//          //.required('Password is required'),
//         confirmPassword: Yup.string()
//           .oneOf([Yup.ref('password'), null], 'Passwords must match')
//           .required('Confirm Password is required'),
//         name: Yup.string()
//           .required('Name is required'),
//         email: Yup.string()
//           .email('Email is invalid')
//           .required('Email is required'),
//         office: Yup.string()
//           .required('office is required'),
//         dept: Yup.string()
//           .required('dept is required')
       
//       })}

//       onSubmit={(values, { setSubmitting }) => {
//         setTimeout(() => {

//           let dataToSubmit = {
//             USER_MAIL: values.email,
//             USER_PW: values.password,
//             USER_NM: values.name,
//             USER_ID: values.id,
//             USER_OFFICE: values.office,
//             USER_DEPT: values.dept,
//             image: `http://gravatar.com/avatar/${moment().unix()}?d=identicon`
//           };

//           dispatch(registerUser(dataToSubmit)).then(response => {
//             if (response.payload.success) {
//               props.history.push("/login");
//             } else {
//               alert(response.payload.err.errmsg)
//             }
//           })

//           setSubmitting(false);
//         }, 500);
//       }}
//     >

//       {props => {
//         const {
//           values,
//           touched,
//           errors,
//           dirty,
//           isSubmitting,
//           handleChange,
//           handleBlur,
//           handleSubmit,
//           handleReset,
//         } = props;
//         return (
//           <div className="app">

//             <h2>회원가입</h2>
//             <Form style={{ minWidth: '375px' }} {...formItemLayout} onSubmit={handleSubmit} >

//               <Form.Item required label="ID">
//                 <Input
//                   id="id"
//                   placeholder="Enter your ID"
//                   type="text"
//                   value={values.id}
//                   onChange={handleChange}
//                   onBlur={handleBlur}
//                   className={
//                      errors.id && touched.id ? 'text-input error' : 'text-input'
//                    }
//                 />
//                 {errors.id && touched.id && (
//                   <div className="input-feedback">{errors.id}</div>
//                 )}
//               </Form.Item>

//               <Form.Item required label="비밀번호" hasFeedback validateStatus={errors.password && touched.password ? "error" : 'success'}>
//                 <Input
//                   id="password"
//                   placeholder="Enter your password"
//                   type="password"
//                   value={values.password}
//                   onChange={handleChange}
//                   onBlur={handleBlur}

//                   className={
//                     errors.password && touched.password ? 'text-input error' : 'text-input'
//                   }
//                 />
//                 {errors.password && touched.password && (
//                   <div className="input-feedback">{errors.password}</div>
//                 )}
//               </Form.Item>

//               <Form.Item required label="비밀번호 확인" hasFeedback>
//                 <Input
//                   id="confirmPassword"
//                   placeholder="Enter your confirmPassword"
//                   type="password"
//                   value={values.confirmPassword}
//                   onChange={handleChange}
//                   onBlur={handleBlur}
//                   className={
//                     errors.confirmPassword && touched.confirmPassword ? 'text-input error' : 'text-input'
//                   }
//                 />
//                 {errors.confirmPassword && touched.confirmPassword && (
//                   <div className="input-feedback">{errors.confirmPassword}</div>
//                 )}
//               </Form.Item>

//               <Form.Item required label="이름" >
//                 <Input
//                   id="name"
//                   placeholder="Enter your name"
//                   type="text"
//                   value={values.name}
//                   onChange={handleChange}
//                   onBlur={handleBlur}
//                   className={
//                     errors.name && touched.name ? 'text-input err' : 'text-input'
//                   }
//                 />
//                 {errors.name && touched.name && (
//                   <div className="input-feedback">{errors.name}</div>
//                 )}
//               </Form.Item>

//               <Form.Item required label="메일주소" hasFeedback validateStatus={errors.email && touched.email ? "error" : 'success'}>
//                 <Input
//                   id="email"
//                   placeholder="Enter your Email"
//                   type="email"
//                   value={values.email}
//                   onChange={handleChange}
//                   onBlur={handleBlur}
//                   className={
//                     errors.email && touched.email ? 'text-input error' : 'text-input'
//                   }
//                 />
//                 {errors.email && touched.email && (
//                   <div className="input-feedback">{errors.email}</div>
//                 )}
//               </Form.Item>

//               <Form.Item required label="회사명">
//                 <Input
//                   id="office"
//                   placeholder="Enter your office"
//                   type="text"
//                   value={values.office}
//                   onChange={handleChange}
//                   onBlur={handleBlur}
//                   className={
//                     errors.office && touched.office ? 'text-input error' : 'text-input'
//                   }
//                 />
//                 {errors.office && touched.office && (
//                   <div className="input-feedback">{errors.office}</div>
//                 )}
//               </Form.Item>

//               <Form.Item required label="부서명">
//                 <Input
//                   id="dept"
//                   placeholder="Enter your dept"
//                   type="text"
//                   value={values.dept}
//                   onChange={handleChange}
//                   onBlur={handleBlur}
//                   className={
//                     errors.dept && touched.dept ? 'text-input error' : 'text-input'
//                   }
//                 />
//                 {errors.dept && touched.dept && (
//                   <div className="input-feedback">{errors.dept}</div>
//                 )}
//               </Form.Item>
              

//               <Form.Item {...tailFormItemLayout}>
//                 <Button onClick={handleSubmit} type="primary" disabled={isSubmitting}>
//                   Submit
//                 </Button>
//               </Form.Item>
//             </Form>
//           </div>
//         );
//       }}
//     </Formik>
//   );
// };


export default RegisterPage
