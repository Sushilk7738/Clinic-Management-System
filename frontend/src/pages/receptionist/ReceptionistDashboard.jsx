import React, { useEffect, useState } from "react";
import api from "../../api";
import { toast } from "react-toastify";




const ReceptionistDashboard = ()=>{
    const [appointments, setAppointments] = useState([]);
    const [searchTerm, setSearchTerm]  = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedDate, setSelectedDate] = useState("");
    const [sortOrder, setSortOrder] = useState("latest");

    const appointmentsPerPage = 5;
    
    useEffect(()=> {
        api.get("/api/appointments/")
            .then(res => {
                setAppointments(res.data);
            })
            .catch(()=> {
                toast.error("Failed to load appointments");
            });
    }, []);


    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, statusFilter]);

    
    const pendingAppointments = appointments.filter(
        appt => appt.status === 'pending'
    );

    const confirmedAppointments = appointments.filter(
        appt => appt.status === 'confirmed'
    )

    const completedAppointments = appointments.filter(
        appt => appt.status === 'completed'
    )
    
    
    const handleStatusUpdate =async (id, status)=>{
        try{
            await api.patch(`/api/appointments/${id}/`, {status});

            toast.success(`Appointment ${status}`);

            setAppointments( prev =>
                prev.map(appt =>
                    appt.id === id
                    ? {...appt, status}
                    : appt
                )
            );
        } catch {
            toast.error("Failed to update status");
        }
    }

    const filteredAppointments = appointments.filter( appt =>{
        const matchesSearch = appt.patient_name
                .toLowerCase()
                .includes(searchTerm.toLowerCase());
                
                const matchesStatus = statusFilter === 'all' || appt.status === statusFilter;
                const mathchesDate = selectedDate === "" || appt.date === selectedDate;
        
        return matchesSearch && matchesStatus && mathchesDate;
    });

    
    const sortedAppointments = [...filteredAppointments].sort((a, b) =>{
        const dateA = new Date(`${a.date} ${a.time}`);
        const dateB = new Date(`${b.date} ${b.time}`);
        
        return sortOrder === 'latest'
        ? dateB - dateA
        : dateA - dateB;
    });
    
    const lastIndex = currentPage * appointmentsPerPage;

    const firstIndex = lastIndex - appointmentsPerPage;

    const currentAppointments = sortedAppointments.slice(
        firstIndex,
        lastIndex
    );

    return(
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-md">
                <h1 className="text-2xl font-bold text-slate-800">
                    Receptionist Dashboard
                </h1>

                <p className="text-slate-500 mt-1">
                    Manage appointments and clinic workflow
                </p>
            </div>

            <div className="p-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

                <div className="bg-blue-500 text-white p-5 rounded-xl shadow-md">
                    <h2 className="text-sm font-medium">
                        Total Appointments
                    </h2>

                    <p className="text-3xl font-bold mt-2">
                        {appointments.length}
                    </p>
                </div>
                <div className="bg-yellow-500 text-white p-5 rounded-xl shadow-md">
                    <h2 className="text-sm font-medium">
                        Pending Appointments
                    </h2>

                    <p className="text-3xl font-bold mt-2">
                        {pendingAppointments.length}
                    </p>
                </div>
                <div className="bg-green-500 text-white p-5 rounded-xl shadow-md">
                    <h2 className="text-sm font-medium">
                        Confirmed
                    </h2>

                    <p className="text-3xl font-bold mt-2">
                        {confirmedAppointments.length}
                    </p>
                </div>
                <div className="bg-cyan-500 text-white p-5 rounded-xl shadow-md">
                    <h2 className="text-sm font-medium">
                        Completed
                    </h2>

                    <p className="text-3xl font-bold mt-2">
                        {completedAppointments.length}
                    </p>
                </div>

            </div>

            <div className="p-6 bg-white shadow-md rounded-xl">
                <h1 className="text-2xl font-bold text-slate-800 mb-4">
                    All Appointments
                </h1>

                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Search Patient..."
                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={searchTerm}
                        onChange={(e)=> setSearchTerm(e.target.value)}
                    />

                    <select 
                        value={statusFilter}
                        onChange={(e)=>setStatusFilter(e.target.value)}
                        className="w-full mt-3 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="all">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                    </select>

                    <input
                        type="date"
                        value={selectedDate}
                        onChange={(e)=> setSelectedDate(e.target.value)}
                        className="w-full p-3 mt-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    <select 
                        value={sortOrder}
                        onChange={(e)=> setSortOrder(e.target.value)}
                        className="w-full p-3 mt-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"    
                    >
                        <option value="latest">Latest First</option>
                        <option value="oldest">Oldest First</option>
                    </select>
                </div>

                <div className="space-y-3">
                    {
                        filteredAppointments.length === 0 ? (
                            <p className="text-slate-500 text-2xl text-center font-semibold py-6">
                                No appointments found
                            </p>
                        )
                        : (
                            currentAppointments.map((appt) => (
                                <div
                                    key={appt.id}
                                    className="bg-slate-50 p-4 rounded-lg flex justify-between items-center"
                                >
                                    <div>
                                        <p className="font-semibold text-slate-800">
                                            {appt.patient_name}
                                        </p>

                                        <p className="text-xs text-slate-600">
                                            {appt.doctor_name}
                                        </p>
                                        
                                        <p className="text-xs text-slate-600">
                                            {appt.date} at {appt.time}
                                        </p>
                                    </div>
                                    
                                    <div className="flex items-center gap-3">
                                        <span
                                            className={`text-sm font-semibold ${
                                                appt.status === 'pending'
                                                ? "text-yellow-500"
                                                : appt.status === 'confirmed'
                                                ? "text-green-400"
                                                : appt.status === 'completed'
                                                ? "text-blue-500"
                                                : "text-red-500"
                                            }`}
                                        >   
                                            {appt.status}
                                        </span>

                                        <div className="flex gap-2">
                                            {
                                                appt.status === 'pending' && (
                                                    <button 
                                                        className="px-3 py-1 bg-green-600 text-white text-xs rounded-lg"
                                                        onClick={()=> handleStatusUpdate(appt.id, "confirmed")}
                                                    >
                                                        Confirm
                                                    </button>
                                            )}
                                            
                                            {
                                                appt.status === 'confirmed' && (
                                                    <button className="px-3 py-1 bg-blue-500 text-white text-xs rounded-lg"
                                                        onClick={()=> handleStatusUpdate(appt.id, "completed")}
                                                    >
                                                        Complete
                                                    </button>
                                            )}
                                            
                                            {appt.status !== "completed" && appt.status !== "cancelled" && (
                                                <button 
                                                    className="px-3 py-1 bg-red-600 text-white text-xs rounded-lg"
                                                    onClick={()=>handleStatusUpdate(appt.id, "cancelled")}
                                                >
                                                    Cancel
                                                </button>
                                            )}
                                        </div>
                                        
                                    </div>
                                    
                                </div>
                        ))
                    ) 
                    }
                </div>
                    <div className="flex justify-center gap-2 mt-6">
                        <button
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(prev => prev - 1)}
                            className="px-4 py-2 bg-slate-200 rounded-lg disabled:opacity-50"
                        >
                            Prev
                        </button>

                        <button
                            disabled={lastIndex >= filteredAppointments.length}
                            onClick={() => setCurrentPage(prev => prev + 1)}
                            className="px-4 py-2 bg-slate-200 rounded-lg disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
            </div>
        </div>
    )
}

export default ReceptionistDashboard;