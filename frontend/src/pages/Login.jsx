import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import { useState } from "react";
import api from '../api';
import 'animate.css';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';

const Login = ()=>{
    const navigate = useNavigate();
    const [form, setForm] = useState({username: '', password: ''});
    
    
    
    const handleChange= (e)=>{
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    }

    const handleLogin = async(e)=>{
        e.preventDefault();
        try {
            const res = await api.post('/api/token/', form);
            localStorage.setItem(ACCESS_TOKEN, res.data.access);
            localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
            toast.success("Login success");

            const profileRes = await api.get('/api/profile/');
            const role = profileRes.data.role;

            if (role === 'patient') navigate('/patient');
            else if (role === 'doctor') navigate('/doctor');
            else navigate('/admin')
            
        } catch (err){
            toast.error("Invalid username or password");
        }
    }

    
    return(
        <div className="h-screen flex items-center justify-center bg-slate-100">
            <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-md animate__animated animate__fadeInDown">
                <h2 className="text-2xl font-bold text-center text-slate-800 mb-6">
                    Clinic Login
                </h2>

                <form onSubmit={handleLogin}  className="space-y-4">
                    <input
                        type="text"
                        name="username"
                        value={form.username}
                        onChange={handleChange}
                        placeholder="Username"
                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    
                    <input
                        type="password"
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        placeholder="Password"
                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    <button
                        type="submit"
                        className="w-full text-lg font-semibold bg-blue-700 text-white py-3 rounded-lg hover:bg-blue-800 transition"
                    >
                        Login
                    </button>
                </form>

                <p className="text-center font-semibold text-sm text-slate-500 mt-4">
                    No account?{' '}
                    <Link to="/register" className="text-blue-700 hover:underline" >
                        Register
                    </Link>
                </p>
            </div>
        </div>
    )
}


export default Login;