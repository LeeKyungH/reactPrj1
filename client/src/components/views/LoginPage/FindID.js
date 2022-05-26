import React, {useState} from 'react';
import '../../../index.css';
import { useDispatch } from "react-redux";
import { findID } from "../../../_actions/user_actions";


const Modal = (props) => {
    // 열기, 닫기, 모달 헤더 텍스트를 부모로부터 받아옴
    const { open, close, header } = props;
    const dispatch = useDispatch();
    const [USER_OFFICE, setOffice] = useState("")
    const [USER_DEPT, setDept] = useState("")
    const [USER_MAIL, setEmail] = useState("")
    const [USER_ID, setID] = useState("")

    const onOfficeHandler = (event) => {
      setOffice(event.currentTarget.value)
    }
  
    const onDeptHandler = (event) => {
      setDept(event.currentTarget.value)
    }

    const onEmailHandler = (event) => {
      setEmail(event.currentTarget.value);    
    }

    const onSubmitHandler_findID = (event) => {

      event.preventDefault();
  
      let body = {
        USER_OFFICE:USER_OFFICE,
        USER_DEPT:USER_DEPT,
        USER_MAIL:USER_MAIL
      }
  
      //redux사용 React Componet -> (Dispatch(action)) -> Action -> Reducer -> Store -> (Subscribe) -> React Component
      //_action폴더안에 user_action.js
      dispatch(findID(body))
            .then(response => {
                if(response.payload.userId != ""){
                  setID("가입된 ID는 "+response.payload.userId+" 입니다.");
                }else{
                  setID("가입정보가 없거나 일치하지 않습니다.");
                }
            })
  
    }

    return (
      // 모달이 열릴때 openModal 클래스가 생성된다.
      <div className={open ? 'openModal modal' : 'modal'}>
        {open ? (
          <section>
            <header>
              {header}
              <button className="close" onClick={close}>
                &times;
              </button>
            </header>
            {/* <main>{props.children}</main> */}
            <main> 
             <div>
                <form>
                  <label>회사명</label>
                  <input type="text" style={{marginLeft:'55px'}} value={USER_OFFICE} onChange={onOfficeHandler} />
                  <br />
                  <br />
                  <label>부서명</label>
                  <input type="text" style={{marginLeft:'55px'}} value={USER_DEPT} onChange={onDeptHandler} />
                  <br />
                  <br />
                  <label>메일주소</label>
                  <input type="text" style={{marginLeft:'40px'}} value={USER_MAIL} onChange={onEmailHandler} />
                  <br />
                  <br />

                  <button onClick={onSubmitHandler_findID}>
                    ID 찾기
                  </button>
                  <div>{USER_ID}</div>

                </form>
                
              </div>

            </main>
            <footer>
              <button className="close" onClick={close}>
                close
              </button>
            </footer>
          </section>
        ) : null}
      </div>
    );
  };

  export default Modal;