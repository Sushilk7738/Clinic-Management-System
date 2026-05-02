import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/ProtectedRoute';
import PatientDashboard from './pages/patient/PatientDashboard';
import Layout from './components/Layout';
import BookAppointment from './pages/patient/BookAppointment';
import MyAppointments from './pages/patient/MyAppointments';


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
                <Layout>
                  <PatientDashboard/>
                </Layout>
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/patient/book"
            element={
              <ProtectedRoute role="patient">
                <Layout>
                  <BookAppointment />
                </Layout>
              </ProtectedRoute>
            }
          />
          
          <Route 
            path="/patient/appointments"
            element={
              <ProtectedRoute role="patient">
                <Layout>
                  <MyAppointments />
                </Layout>
              </ProtectedRoute>
            }
          />
          

          <Route
            path='/doctor'
            element={
              <ProtectedRoute role="doctor">
                <Layout>
                  {/* <DoctorDashboard/> */}
                </Layout>
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