import React from 'react'
import logo from "../Images/logo.png"
import "./style.css"
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

function Welcome() {
    const darkMode = useSelector((state) => state.themeKey);
    const userData = JSON.parse(localStorage.getItem("userData"));
    console.log(userData);
    const nav = useNavigate();
    if (!userData) {
        console.log("User not Authenticated");
        nav("/");
    }
    return (
        <div className={'Welcome-container' + (darkMode ? " dark-main" : "")}>
            <img src={logo} alt="Live Chat" className='logo' />
            <b>Hi , {userData.data.name} 👋</b>
            <p>Text with people and make new friends 😉</p>
        </div>
    )
}

export default Welcome
