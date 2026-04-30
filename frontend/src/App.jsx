import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/ProtectedRoute';


const App = ()=>{
  return(
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route 
            path="/patient" 
            element={
              <ProtectedRoute>
                <h1>Patient Dashboard</h1>
              </ProtectedRoute>
            } 
          />

          <Route
            path='/doctor'
            element={
              <ProtectedRoute>
                <h1>Doctor Dashboard</h1>
              </ProtectedRoute>
            }
          />
            
        </Routes>
      </BrowserRouter>
  )
  
}

export default App;