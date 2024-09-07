import React, { useEffect } from 'react';
import "./App.css";
import MainContainer from './Components/MainContainer';
import Login from './Components/Login';
import { Route, Routes } from 'react-router-dom';
import Welcome from './Components/Welcome';
import ChatArea from './Components/ChatArea';
import OnlineUsers from './Components/OnlineUsers';
import CreateGroups from './Components/CreateGroups';
import Groups from './Components/Groups';
import { useSelector } from 'react-redux';

function App() {
  const darkMode = useSelector((state) => state.themeKey);
  useEffect(() => {
    document.title = "Live Chat App"
  }, [])
  return (
    <div className={'app' + (darkMode ? " dark-app" : "")}>
      {/* <MainContainer /> */}
      {/* <Login /> */}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="app" element={<MainContainer />}>
          <Route path="welcome" element={<Welcome />}></Route>
          <Route path="chat" element={<ChatArea />}></Route>
          <Route path="online-users" element={<OnlineUsers />}></Route>
          <Route path="groups" element={<Groups />}></Route>
          <Route path="create-group" element={<CreateGroups />}></Route>
        </Route>
      </Routes>
    </div>
  )
}

export default App
