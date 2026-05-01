import { useEffect, useState } from "react";
import api from "../../api";
import Navbar from "../../components/Navbar";
import { useNavigate } from "react-router-dom";
import { CalendarPlus, ClipboardList, FileText } from "lucide-react";


const PatientDashboard = ()=>{
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [appointments, setAppointments] = useState([]);

    useEffect(()=> {
        api.get("/api/profile/")
            .then(res => {
                setName(res.data.first_name);
            });

        api.get("/api/appointments/")
            .then(res => {
                console.log(res.data);
                setAppointments(res.data);
            });

    }, []);

    const statusColors = {
        pending: "text-yellow-600",
        confirmed: "text-green-600",
        completed: "text-blue-600",
        cancelled: "text-red-600",
    };

    const upcoming = appointments
        .filter(
            (appt)=> appt.status === "pending"  || appt.status === 'confirmed'
        )
        .slice(0, 3);

    return(
        <div className="space-y-6">

            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition">
                <h2 className="text-2xl font-bold text-slate-800">
                    Welcome, {name} 👋
                </h2>

                <p className="text-slate-500 mt-1">
                    Manage your appointments easily
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-4">
                    <div 
                        className="bg-blue-500 hover:bg-blue-600 text-white p-5 rounded-xl shadow-md hover:shadow-lg hover:scale-105 transition cursor-pointer flex items-center gap-3 hover:brightness-110"
                        onClick={()=>navigate("/patient/book")}
                    >
                        <CalendarPlus size={28} />
                        <h3 className="text-lg font-semibold">
                            Book Appointment
                        </h3>
                    </div>
                    
                    <div 
                        className="bg-green-500 hover:bg-green-600 text-white p-5 rounded-xl shadow-md hover:shadow-lg hover:scale-105 transition cursor-pointer flex items-center gap-3 hover:brightness-110"
                        onClick={()=>navigate("/patient/appointments")}
                    >
                        <ClipboardList size={28}/>
                        <h3 className="text-lg font-semibold">
                            My Appointments
                        </h3>
                    </div>

                    <div className="bg-purple-500 hover:bg-purple-600 text-white p-5 rounded-xl shadow-md hover:shadow-lg hover:scale-105 transition cursor-pointer flex items-center gap-3 hover:brightness-110"
                        onClick={()=>navigate("/patient/prescriptions")}
                    >
                        <FileText size={28}/>
                        <h3 className="text-lg font-semibold">
                            My Prescriptions
                        </h3>
                    </div>

                </div>

                    <div className="bg-white p-6 rounded-xl shadow-md">
                        <h3 className="text-lg font-semibold text-slate-800 mb-4">
                            Upcoming Appointments
                        </h3>

                        { upcoming.length === 0 ? (
                            <p className="text-slate-500">
                                No upcoming appointments
                            </p>

                        ) : (
                            <div className="space-y-3">
                                {appointments.map((appt) => (
                                    <div 
                                        key={appt.id}
                                        className="bg-slate-50 p-4 rounded-lg flex justify-between items-center  hover:bg-slate-100 transition"
                                    >
                                        <div>
                                            <p className="font-semibold text-slate-800">
                                                Dr. {appt.doctor_name}
                                            </p>
                                            <p className="text-sm text-slate-500">
                                                {appt.date} at {appt.time}
                                            </p>
                                        </div>

                                        <span className= {`text-sm font-medium ${statusColors[appt.status]}`}>
                                            {appt.status.charAt(0).toUpperCase() + appt.status.slice(1)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="text-right font-bold mt-4">
                            <button
                                onClick={()=> navigate("/patient/appointments")}
                                className="text-blue-600 text-sm font-medium hover:underline"
                            >   
                                View All➡️
                            </button>
                        </div>

                    </div>
            </div>
        </div>
    )
}

export default PatientDashboard;