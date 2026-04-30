import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';
import { toast } from 'react-toastify';
import 'animate.css';


const Register = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        role: 'patient',
        first_name: '',
        last_name: '',
        username: '',
        email: '',
        phone: '',
        password: '',
        speciality: ''
    });

    
    const handleChange = (e)=>{
        setForm({
            ...form,
            [e.target.name] : e.target.value
        });
    };

    const handleRegister =async (e)=>{
        e.preventDefault();

        try{
            await api.post('/api/register/', form);

            toast.success("Account Created !");
            navigate('/login');
        } catch(err){
            toast.error("Registration Failed");
        }
    };

    
return (
    <div className='h-screen flex items-center justify-center bg-slate-100'>
        <div className='w-full max-w-md bg-white p-8 rounded-xl shadow-md animate__animated animate__fadeInDown'>
            <h1 className='text-2xl font-bold text-center text-slate-800 mb-6'>
                Create Account
            </h1>

            <form className='space-y-4' onSubmit={handleRegister}>
                <select 
                    name="role" 
                    value={form.role}
                    onChange={handleChange}
                    className="w-full p-3 rounded-lg focus:outline-none focus:ring-blue-500"
                >
                    <option value="patient">Patient </option>
                    <option value="doctor">Doctor</option>
                </select>

                <div className='grid grid-cols-2 gap-4'>
                    <input 
                        type="text" 
                        name='first_name'
                        value={form.first_name}
                        onChange={handleChange}
                        placeholder='First Name'
                        className='p-3 border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500'
                    />
                    <input 
                        type="text" 
                        name='last_name'
                        value={form.last_name}
                        onChange={handleChange}
                        placeholder='Last Name'
                        className='p-3 border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500'
                    />

                </div>
                    <input 
                        type="text" 
                        name='username'
                        value={form.username}
                        onChange={handleChange}
                        placeholder='Username'
                        className='w-full p-3 border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500'
                    />
                    
                    <input 
                        type="email" 
                        name='email'
                        value={form.email}
                        onChange={handleChange}
                        placeholder='Email'
                        className='w-full p-3 border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500'
                    />

                    <input
                        type="text"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="Phone"
                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />

                    <input
                        type="password"
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        placeholder="Password"
                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />


                    {
                        form.role ==='doctor' && (
                            <input
                                type='text'
                                name='speciality'
                                value={form.speciality}
                                onChange={handleChange}
                                placeholder='Speciality'
                                className='w-full p-3 border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500'
                            />
                        )
                    }

                    <button
                        type='submit'
                        className='w-full font-medium bg-blue-700 text-white py-3 rounded-lg hover:bg-blue-800 transition'
                    >
                        Register
                    </button>
                    
            </form>
            
            <p className='text-center font-semibold text-sm text-slate-500 mt-4'>
                Already have an account?{' '}
                <Link to='/login' className='text-blue-700 hover:underline'>
                    Login
                </Link>

            </p>
            
        </div>
    </div>
)
}

export default Register;