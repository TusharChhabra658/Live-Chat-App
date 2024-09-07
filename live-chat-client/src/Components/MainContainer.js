import React, { createContext, useState } from 'react'
import "./style.css"
import Sidebar from './Sidebar'
import { Outlet } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
export const myContext = createContext();

function MainContainer() {
  const darkMode = useSelector((state) => state.themeKey);
  const dispatch = useDispatch();
  const [refresh, setRefresh] = useState(true);
  return (
    <div className={'main-container' + (darkMode ? " dark-main" : "")}>
      <myContext.Provider value={{ refresh: refresh, setRefresh: setRefresh }}>
        <Sidebar />
        <Outlet />
      </myContext.Provider>
    </div>
  )
}

export default MainContainer
