import { Card, Avatar, Col, Typography, Row } from 'antd';
//import Meta from 'antd/lib/card/Meta';
import Axios from 'axios';
import React, {useEffect, useState} from 'react'
import { FaCode } from "react-icons/fa";
import moment from 'moment';
const {Title} = Typography;
const {Meta} = Card;


function LandingPage() {

    return (
       <div style={{display:'flex', justifyContent:'center', alignItems:'center',width:'100%', height:'100vh'}}>
           <h2>시작 페이지</h2>
       </div>
    )
}

export default LandingPage
