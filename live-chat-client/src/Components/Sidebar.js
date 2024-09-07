import React, { useContext, useEffect, useState } from 'react'
import "./style.css"
import ConversationItem from "./ConversationItem"
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import PersonAddAltRoundedIcon from '@mui/icons-material/PersonAddAltRounded';
import GroupAddRoundedIcon from '@mui/icons-material/GroupAddRounded';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded';
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import LightModeIcon from '@mui/icons-material/LightMode';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import { IconButton } from "@mui/material"
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toggleTheme } from '../Features/themeSlice';
import { myContext } from "./MainContainer";
import axios from "axios";

function Sidebar() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const darkMode = useSelector((state) => state.themeKey);
    const { refresh, setRefresh } = useContext(myContext);
    console.log("Context API : refresh : ", refresh);
    const [conversations, setConversations] = useState([]);
    const userData = JSON.parse(localStorage.getItem("userData"));
    const nav = useNavigate();
    if (!userData) {
        console.log("User not Authenticated");
        nav("/");
    }

    const user = userData.data;
    useEffect(() => {
        const config = {
            headers: {
                Authorization: `Bearer ${user.token}`,
            },
        };

        axios.get("http://localhost:8080/chat/", config).then((response) => {
            console.log("Data refresh in sidebar ", response.data);
            setConversations(response.data);
        });
    }, [refresh]);
    return (
        <div className={'sidebar-container' + (darkMode ? " dark-main" : "")}>
            <div className={"sidebar-header" + (darkMode ? " dark" : "")}>
                <div className='sidebar-header-icons'>
                    <IconButton
                        onClick={() => {
                            nav("/app/welcome");
                        }}
                    >
                        <AccountCircleRoundedIcon className={"icon" + (darkMode ? " dark" : "")} />
                    </IconButton>
                </div>
                <div className='sidebar-header-icons'>
                    <IconButton onClick={() => { navigate('online-users') }}>
                        <PersonAddAltRoundedIcon className={"icon" + (darkMode ? " dark" : "")} />
                    </IconButton>
                    <IconButton onClick={() => { navigate('groups') }}>
                        <GroupAddRoundedIcon className={"icon" + (darkMode ? " dark" : "")} />
                    </IconButton>
                    <IconButton onClick={() => { navigate('create-group') }}>
                        <AddCircleIcon className={"icon" + (darkMode ? " dark" : "")} />
                    </IconButton>
                    <IconButton onClick={() => { dispatch(toggleTheme()) }}>
                        {!darkMode && <DarkModeRoundedIcon className={"icon" + (darkMode ? " dark" : "")} />}
                        {darkMode && <LightModeIcon className={"icon" + (darkMode ? " dark" : "")} />}
                    </IconButton>
                    <IconButton
                        onClick={() => {
                            localStorage.removeItem("userData");
                            navigate("/");
                        }}
                    >
                        <ExitToAppIcon className={"icon" + (darkMode ? " dark" : "")} />
                    </IconButton>
                </div>
            </div>
            <div className={'sidebar-search' + (darkMode ? " dark" : "")}>
                <IconButton>
                    <SearchRoundedIcon className={"icon" + (darkMode ? " dark" : "")} />
                </IconButton>
                <input type="text" placeholder='Search' className={'searchbox' + (darkMode ? " dark" : "")} />
            </div>
            <div className={'sidebar-conversations' + (darkMode ? " dark" : "")}>
                {conversations.map((conversation, index) => {
                    if (conversation.users.length === 1) {
                        return <div key={index}></div>;
                    }
                    if (conversation.latestMessage === undefined) {
                        return (
                            <div
                                key={index}
                                onClick={() => {
                                    console.log("Refresh fired from sidebar");
                                    setRefresh(!refresh);
                                }}
                            >
                                <div
                                    key={index}
                                    className="conversation-container"
                                    onClick={() => {
                                        navigate(
                                            "chat/" +
                                            conversation._id +
                                            "&" +
                                            conversation.users[1].name
                                        );
                                    }}
                                >
                                    <p className={"con-icon" + (darkMode ? " dark" : "")}>
                                        {conversation.users[1].name[0]}
                                    </p>
                                    <p className={"con-title" + (darkMode ? " dark" : "")}>
                                        {conversation.users[1].name}
                                    </p>

                                    <p className="con-lastMessage">
                                        No previous Messages, click here to start a new chat
                                    </p>
                                    {/* <p className={"con-timeStamp" + (lightTheme ? "" : " dark")}>
                {conversation.timeStamp}
              </p> */}
                                </div>
                            </div>
                        );
                    } else {
                        return (
                            <div
                                key={index}
                                className="conversation-container"
                                onClick={() => {
                                    navigate(
                                        "chat/" +
                                        conversation._id +
                                        "&" +
                                        conversation.users[1].name
                                    );
                                }}
                            >
                                <p className={"con-icon" + (darkMode ? " dark" : "")}>
                                    {conversation.users[1].name[0]}
                                </p>
                                <p className={"con-title" + (darkMode ? " dark" : "")}>
                                    {conversation.users[1].name}
                                </p>

                                <p className="con-lastMessage">
                                    {conversation.latestMessage.content}
                                </p>
                                {/* <p className={"con-timeStamp" + (lightTheme ? "" : " dark")}>
                {conversation.timeStamp}
              </p> */}
                            </div>
                        );
                    }
                })}
            </div>
        </div>
    )
}

export default Sidebar
