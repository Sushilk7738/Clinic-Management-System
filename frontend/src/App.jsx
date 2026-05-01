import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/ProtectedRoute';
import PatientDashboard from './pages/patient/PatientDashboard';


const App = ()=>{
  return(
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route 
            path="/patient" 
            element={
              <ProtectedRoute role="patient">
                <PatientDashboard/>
              </ProtectedRoute>
            } 
          />

          <Route
            path='/doctor'
            element={
              <ProtectedRoute role="doctor">
                <h1>Doctor Dashboard</h1>
              </ProtectedRoute>
            }
          />
            
          <Route
            path='/admin'
            element={
              <ProtectedRoute role="receptionist">
                <h1>Admin Dashboard</h1>
              </ProtectedRoute>
            }
          
          />

        </Routes>
      </BrowserRouter>
  )
  
}

export default App;