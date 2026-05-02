import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout'
import api from '../../api';
import { toast } from 'react-toastify';


const MyAppointments = () => {
    const [appointments, setAppointments] = useState([])
    useEffect(()=>{
        api.get("/api/appointments/")
        .then(res =>{
            setAppointments(res.data);
        })
        .catch(()=> {
            toast.error("Failed to fetch appointment")
        })
    })
    

    const statusColors = {
        pending: "text-yellow-700",
        confirmed: "text-green-700",
        completed: "text-blue-700",
        cancelled: "text-red-700",
    };

    const handleCancel = async (id)=>{
        try {
            await api.delete(`/api/appointments/${id}/`);
            toast.success("Appointment Cancelled");

            // remove from UI instantly

            setAppointments(prev =>prev.filter(appt => appt.id !== id));
        } catch {
            toast.error("Failed to cancel appointment");
        }
    };

    const sortedAppointments = [...appointments].sort((a, b) =>{
        const dateA = new Date(`${a.date} ${a.time}`);
        const dateB = new Date(`${b.date} ${b.time}`);

        return dateA - dateB;
    });
    

return (
    <div className='p-6'>
        <h1
            className='text-2xl font-bold mb-6'
        >
            My Appointments
        </h1>

        <div className='bg-white shadow-md rounded-xl p-6'>

            <p className='text-slate-800'>

                {
                    appointments.length === 0 ? (

                        <div className='text-center py-10'>
                            <p className='text-slate-600 text-lg font-medium'>
                                No appointments yet
                            </p>

                            <p className='text-slate-400 text-sm mt-1'>
                                Book your appointment to get started
                            </p>

                        </div>
                    ) : (
                        <div className='space-y-3'>
                            {sortedAppointments.map((appt) => (
                                <div
                                    key={appt.id}
                                    className='bg-slate-50 p-4 rounded-lg flex justify-between items-center'
                                >
                                    <div>
                                        <p className='font-semibold text-slate-800'>
                                            Dr. {appt.doctor_name}
                                        </p>

                                        <p className='text-sm text-slate-600'>
                                            {appt.date} at {appt.time}
                                        </p>
                                    </div>

                                    
                                    <div className='flex items-center gap-4'>
                                        <span className={`text-sm font-semibold ${statusColors[appt.status]}`}>
                                            {appt.status.charAt(0).toUpperCase() + appt.status.slice(1)}
                                        </span>

                                        {
                                            appt.status === 'pending' && (
                                                <button
                                                    onClick={()=> handleCancel(appt.id)}
                                                    className='text-red-600 text-sm font-medium hover:underline'
                                                >
                                                    Cancel
                                                </button>
                                            )
                                        }
                                    </div>
                                </div>
                            ))}
                        </div>
                    )
                }

            </p>
        </div>
    </div>
)
}

export default MyAppointments;