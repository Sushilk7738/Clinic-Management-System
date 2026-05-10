import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/ProtectedRoute';
import PatientDashboard from './pages/patient/PatientDashboard';
import Layout from './components/Layout';
import BookAppointment from './pages/patient/BookAppointment';
import MyAppointments from './pages/patient/MyAppointments';
import MyPrescriptions from './pages/patient/MyPrescriptions';
import DoctorDashboard from './pages/doctor/DoctorDashboard';
import ReceptionistDashboard from './pages/receptionist/ReceptionistDashboard';


const App = ()=>{
  return(
      <BrowserRouter>
        <Routes>

          // patient routes

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
            path="/patient/prescriptions"
            element={
              <ProtectedRoute role="patient">
                <Layout>
                  <MyPrescriptions/>
                </Layout>
              </ProtectedRoute>
            }
          />
          

          // doctor routes

          <Route
            path='/doctor'
            element={
              <ProtectedRoute role="doctor">
                <Layout>
                  <DoctorDashboard/>
                </Layout>
              </ProtectedRoute>
            }
          />
            
          <Route
            path='/admin'
            element={
              <ProtectedRoute role="receptionist">
                <Layout>
                  <ReceptionistDashboard/>
                </Layout>
              </ProtectedRoute>
            }
          
          />

        </Routes>
      </BrowserRouter>
  )
  
}

export default App;