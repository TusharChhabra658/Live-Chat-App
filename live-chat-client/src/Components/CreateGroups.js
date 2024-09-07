import React, { useState } from "react";
import DoneOutlineRoundedIcon from "@mui/icons-material/DoneOutlineRounded";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    IconButton,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { create } from "@mui/material/styles/createTransitions";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./style.css"

function CreateGroups() {
    const darkMode = useSelector((state) => state.themeKey);
    const userData = JSON.parse(localStorage.getItem("userData"));
    const nav = useNavigate();
    if (!userData) {
        console.log("User not Authenticated");
        nav("/");
    }
    const user = userData.data;
    const [groupName, setGroupName] = useState("");
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    console.log("User Data from CreateGroups : ", userData);

    const createGroup = () => {
        const config = {
            headers: {
                Authorization: `Bearer ${user.token}`,
            },
        };

        axios.post(
            "http://localhost:8080/chat/createGroup",
            {
                name: groupName,
                users: '["647d94aea97e40a17278c7e5","647d999e4c3dd7ca9a2e6543"]',
            },
            config
        );
        nav("/app/groups");
    };
    return (
        <>
            <div>
                <Dialog
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">
                        {"Do you want to create a Group Named " + groupName}
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            This will create a create group in which you will be the admin and
                            other will be able to join this group.
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>Disagree</Button>
                        <Button
                            onClick={() => {
                                createGroup();
                                handleClose();
                            }}
                            autoFocus
                        >
                            Agree
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
            <div className={'create-groups' + (darkMode ? " dark-main" : "")}>
                <div className={'sidebar-search' + (darkMode ? " dark" : "")}>
                    <input type="text"
                        placeholder='Group name'
                        className={'group-name-box' + (darkMode ? " dark" : "")}
                        onChange={(e) => {
                            setGroupName(e.target.value);
                        }}
                    />
                    <IconButton onClick={() => {
                        handleClickOpen();
                    }}>
                        <DoneOutlineRoundedIcon className={"icon" + (darkMode ? " dark" : "")} />
                    </IconButton>
                </div>
            </div>
        </>
    )
}

export default CreateGroups
