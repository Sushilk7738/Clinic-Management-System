import React, { useEffect, useState } from 'react'
import logo from '../assets/logo.png'
import api from '../api';
import { ACCESS_TOKEN } from '../constants';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();

    const [open , setOpen] = useState(false);
    const [name, setName] = useState("");
    const [role, setRole] = useState("");

    useEffect(()=>{
        const token = localStorage.getItem(ACCESS_TOKEN);

        if (!token) return;
        
        api.get("/api/profile/")
            .then(res => {
                setName(res.data.first_name);
                setRole(res.data.role);
            })
            .catch(()=> {
                console.log("Unauthorized or token issue")
            })
    }, [])

    const handleLogout = ()=>{
        setOpen(false);
        localStorage.clear();
        navigate("/login");
    }
    
return (
    <nav className="bg-white shadow-md px-4 sm:px-6 py-4 flex justify-between items-center">

        <div className='flex items-center gap-2 cursor-pointer'>

            <img 
                src={logo} 
                alt="logo" 
                className='w-9 h-9 object-contain'
            />
            
            <h1 className='text-2xl font-bold text-slate-800 hover:text-blue-600 transition cursor-pointer'>
                MediFlow
            </h1>
        </div>

        <div className='relative'>
            <button 
                onClick={() => setOpen(!open)}
                className="flex items-center gap-2 bg-slate-100 px-3 py-2 sm:px-4 rounded-lg hover:bg-slate-200 transition"
            >
                <div className="w-8 h-8 bg-blue-500 text-white flex items-center justify-center rounded-full">
                    {name ? name[0] : "U"}
                </div>

                <span className="text-sm font-medium text-slate-700 hidden sm:block">
                    {name}
                </span>
            </button>
            {
                open && (
                    <div className="absolute right-0 mt-2 w-40 sm:w-44  bg-white shadow-lg rounded-lg p-2">
                        <p className='px-3 py-2 font-medium text-sm text-slate-500 border-b mb-2'>
                            {role.charAt(0).toUpperCase()+ role.slice(1)}
                        </p>

                        <p className="px-3 py-2 font-medium text-sm text-slate-700 hover:bg-slate-100 rounded cursor-pointer">
                            Profile
                        </p>

                        <p 
                            onClick={handleLogout} 
                            className="px-3 py-2 font-medium text-sm text-red-600 hover:bg-red-50 rounded cursor-pointer"
                        >
                            Logout
                        </p>

                    </div>
                )
            }
        </div>
    </nav>
)
}

export default Navbar;