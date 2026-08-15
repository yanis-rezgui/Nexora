
import { Route, Routes } from 'react-router-dom'
import './App.css'
import Header from './Components/HomeComponents/Header '
import Home from './Pages/Home'

function App() {


  return (
    
      
      <Routes>
      <Route path='/' element={
        <>
          <Header/>
          <Home/>
        </>
      }/>
      </Routes>
    
  )
}

export default App
 