
import { Route, Routes } from 'react-router-dom'
import './App.css'
import Header from './Components/HomeComponents/Header '
import Home from './Pages/Home'
import { AuthProvider } from './Contexts/AuthContext'
import PublicRoute from './Layouts/PublicRoute'
import PublicLayout from './Layouts/PublicLayout'
import UserLayout from './Layouts/UserLayout'
import UserRoute from './Layouts/UserRoute'
import Login from './Pages/Login'
import Register from './Pages/Register'
import Projects from './Pages/Projects'
import { ProjectsProvider } from './Contexts/ProjectsContext'
import { MembersProvider } from './Contexts/MembersContext'
import { TasksProvider } from './Contexts/TasksContext'
import { ActivityProvider } from './Contexts/ActivityContext'
import ProjectDetails from './Pages/ProjectDetails'
import Tasks from './Pages/Tasks'
import { NotificationsProvider } from './Contexts/NotificationsContext'
import Notifications from './Pages/Notifications'
import { DashboardProvider } from './Contexts/DashboardContext'
import Dashboard from './Pages/Dashboard'
import { SettingsProvider } from './Contexts/SettingsContext'
import Settings from './Pages/Settings'

function App() {


  return (
    
      
    <AuthProvider>
      <ProjectsProvider>
        <MembersProvider>
          <TasksProvider>
            <ActivityProvider>
              <NotificationsProvider>
                <DashboardProvider>
                  <SettingsProvider>
      <Routes>

        <Route element={
          <PublicRoute>
            <PublicLayout/>
          </PublicRoute>
        }>

             <Route path='/' element={
        <>
          <Header/>
          <Home/>
        </>
      }/>

         <Route path='/login' element={<Login/>}/>
         <Route path='/register' element={<Register/>}/>
         

        </Route>


      <Route
      path='/user/*'
      element={
        <UserRoute>
          <UserLayout/>
        </UserRoute>
      }>

           <Route path='dashboard' element={<Dashboard/>}/>
           <Route path='projects' element={<Projects/>}/>
           <Route path='projects/:projectId' element={<ProjectDetails/>}/>
           <Route path='tasks' element={<Tasks/>}/>
           <Route path='notifications' element={<Notifications/>}/>
            <Route path='settings' element={<Settings/>}/>
         
      </Route>

      
      </Routes>

         </SettingsProvider>
      </DashboardProvider>
      </NotificationsProvider>
      </ActivityProvider>
      </TasksProvider>
      </MembersProvider>
      </ProjectsProvider>
      </AuthProvider>
    
  )
}

export default App
 