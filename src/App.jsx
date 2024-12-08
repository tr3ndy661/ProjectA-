import React from 'react'
import Sidebar from './components/Sidebar/Sidebar.jsx'
import Main from './components/Main/Main.jsx'
import Modal from './components/Modal/Modal.jsx'

const App = () => {
  return (
    <>
    {/* mounting  */}
      <Sidebar />
      <Main />
      <Modal />
    </>
  )
}

export default App
