import React, { useContext, useEffect, useRef, useState } from 'react'
import "./style.css"
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';
import MessageOthers from './MessageOthers';
import MessageSelf from './MessageSelf';
import axios from "axios";
import { IconButton, Skeleton } from "@mui/material"
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { myContext } from './MainContainer';
import io from "socket.io-client";

const ENDPOINT = "http://localhost:8080";
var socket, chat;
function ChatArea() {
    const darkMode = useSelector((state) => state.themeKey);
    const { refresh, setRefresh } = useContext(myContext);
    const [messageContent, setMessageContent] = useState("");
    const [chat_id, chat_user] = dyParams._id.split("&");
    const [allMessages, setAllMessages] = useState([]);
    const [loaded, setloaded] = useState(false);
    const [allMessagesCopy, setAllMessagesCopy] = useState([]);
    const [socketConnectionStatus, setSocketConnectionStatus] = useState(false);
    const messagesEndRef = useRef(null);
    const dyParams = useParams();
    const userData = JSON.parse(localStorage.getItem("userData"));

    const sendMessage = () => {
        var data = null;
        const config = {
            headers: {
                Authorization: `Bearer ${userData.data.token}`,
            },
        };
        axios
            .post(
                "http://localhost:8080/message/",
                {
                    content: messageContent,
                    chatId: chat_id,
                },
                config
            )
            .then(({ response }) => {
                data = response;
                console.log("Message Fired");
            });
        socket.emit("newMessage", data);
    };

    useEffect(() => {
        socket = io(ENDPOINT);
        socket.emit("setup,userData");
        socket.on("connection", () => {
            setSocketConnectionStatus(!socketConnectionStatus);
        })
    }, []);

    useEffect(() => {
        socket.on("message received", (newMessage) => {
            if (!allMessagesCopy || allMessagesCopy._id !== newMessage._id) {
                //setAllMessages([...allMessages],newMessage);
            }
            else {
                setAllMessages([...allMessages], newMessage);
            }
        });
    })

    useEffect(() => {
        console.log("Users refreshed");
        const config = {
            headers: {
                Authorization: `Bearer ${userData.data.token}`,
            },
        };
        axios
            .get("http://localhost:8080/message/" + chat_id, config)
            .then(({ data }) => {
                setAllMessages(data);
                setloaded(true);
                socket.emit("join chat", chat_id);
            });
        setAllMessagesCopy(allMessages);
    }, [refresh, chat_id, userData.data.token, allMessages]);
    if (!loaded) {
        return (
            <div
                style={{
                    border: "20px",
                    padding: "10px",
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                }}
            >
                <Skeleton
                    variant="rectangular"
                    sx={{ width: "100%", borderRadius: "10px" }}
                    height={60}
                />
                <Skeleton
                    variant="rectangular"
                    sx={{
                        width: "100%",
                        borderRadius: "10px",
                        flexGrow: "1",
                    }}
                />
                <Skeleton
                    variant="rectangular"
                    sx={{ width: "100%", borderRadius: "10px" }}
                    height={60}
                />
            </div>
        );
    }
    else {
        return (
            <div className={'chatArea-container' + (darkMode ? " dark-main" : "")}>
                <div className={'chatArea-header' + (darkMode ? " dark" : "")}>
                    <div className={'conversation-container' + (darkMode ? " dark" : "")}>
                        <p className='con-icon'>{chat_user[0]}</p>
                        <p className='con-title'>{chat_user}</p>
                        <p className='coN-timeStamp'></p>
                        <p className='con-lastMessage'></p>
                    </div>
                    <div className='del-icon'>
                        <IconButton>
                            <DeleteIcon />
                        </IconButton>
                    </div>
                </div>
                <div className={'messages-container' + (darkMode ? " dark" : "")}>
                    {
                        allMessages
                            .slice(0)
                            .reverse()
                            .map((message, index) => {
                                const sender = message.sender;
                                const self_id = userData.data._id;
                                if (sender._id === self_id) {
                                    return <MessageSelf props={message} key={index} />;
                                } else {
                                    return <MessageOthers props={message} key={index} />;
                                }
                            })}
                </div>
                <div ref={messagesEndRef} className="BOTTOM" />
                <div className={'text-input-area' + (darkMode ? " dark" : "")}>
                    <input
                        type="text"
                        placeholder='Message'
                        className={'message-input' + (darkMode ? " dark" : "")}
                        value={messageContent}
                        onChange={(e) => {
                            setMessageContent(e.target.value);
                        }}
                        onKeyDown={(event) => {
                            if (event.code == "Enter") {
                                sendMessage();
                                setMessageContent("");
                                setRefresh(!refresh);
                            }
                        }}
                    />
                    <div className='del-icon'>
                        <IconButton onClick={() => {
                            sendMessage();
                            setRefresh(!refresh);
                        }}>
                            <SendIcon className={"icon" + (darkMode ? " dark" : "")}
                            />
                        </IconButton>
                    </div>
                </div>
            </div>
        )
    }
}

export default ChatArea
