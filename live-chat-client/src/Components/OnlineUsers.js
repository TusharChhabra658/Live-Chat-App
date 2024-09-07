import React, { useContext, useEffect, useState } from "react";
import "./style.css";
import SearchRoundedIcon from "@mui/icons-material/Search";
import { IconButton } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import logo from "../Images/logo.png";
import { useDispatch, useSelector } from "react-redux";
import { AnimatePresence, motion } from "framer-motion";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { refreshSidebarFun } from "../Features/refreshSidebar";
import { myContext } from "./MainContainer";

function OnlineUsers() {
    const darkMode = useSelector((state) => state.themeKey);
    const { refresh, setRefresh } = useContext(myContext);
    const [users, setUsers] = useState([]);
    const userData = JSON.parse(localStorage.getItem("userData"));
    const nav = useNavigate();
    const dispatch = useDispatch();

    if (!userData) {
        console.log("User not Authenticated");
        nav(-1);
    }

    useEffect(() => {
        console.log("Users refreshed");
        const config = {
            headers: {
                Authorization: `Bearer ${userData.data.token}`,
            },
        };
        axios.get("http://localhost:8080/user/fetchUsers", config).then((data) => {
            console.log("UData refreshed in Users panel ");
            setUsers(data.data);
        });
    }, [refresh]);
    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{
                    duration: "0.3",
                }}
                className="list-container"
            >
                <div className='online-users'>
                    <div className={"online-users-header" + (darkMode ? " dark" : "")}>
                        <img className="logo" src={logo} style={{ height: "3rem", width: "3rem" }} alt="logo" />
                        <p className="online-users-title">Online Users</p>
                        <IconButton
                            className={"icon" + (darkMode ? " dark" : "")}
                            onClick={() => {
                                setRefresh(!refresh);
                            }}
                        >
                            <RefreshIcon />
                        </IconButton>
                    </div>
                    <div className={'sidebar-search' + (darkMode ? " dark" : "")}>
                        <IconButton>
                            <SearchRoundedIcon className={"icon" + (darkMode ? " dark" : "")} />
                        </IconButton>
                        <input type="text" placeholder='Search' className={'searchbox' + (darkMode ? " dark" : "")} />
                    </div>
                    <div className="online-users-list">
                        {users.map((user, index) => {
                            return (
                                <motion.div
                                    whileHover={{ scale: 1.01 }}
                                    whileTap={{ scale: 0.98 }}
                                    className={"list-item" + (darkMode ? " dark" : "")}
                                    key={index}
                                    onClick={() => {
                                        console.log("Creating chat with ", user.name);
                                        const config = {
                                            headers: {
                                                Authorization: `Bearer ${userData.data.token}`,
                                            },
                                        };
                                        axios.post(
                                            "http://localhost:8080/chat/",
                                            {
                                                userId: user._id,
                                            },
                                            config
                                        );
                                        dispatch(refreshSidebarFun());
                                    }}
                                >
                                    <p className="con-icon">{user.name[0]}</p>
                                    <p className="con-title">{user.name}</p>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    )
}

export default OnlineUsers