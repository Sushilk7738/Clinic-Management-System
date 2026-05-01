console.log("BookAppointment page loaded");
import { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import api from "../../api";
import { toast } from "react-toastify";



const BookAppointment = ()=>{
    const [doctors, setDoctors] = useState([]);
    const [selectedDoctor, setSelectedDoctor] = useState("");
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [reason, setReason] = useState("");

    useEffect(()=> {
        api.get("/api/doctors/")
            .then(res => {
                setDoctors(res.data)

                if (res.data.length > 0) {
                    toast.success("Doctors loaded");
                } else {
                    toast.info("No doctors available");
                }
            })
            .catch(err => {
                toast.error("Failed to load doctors");
            });
    }, [])  
    

    const handleSubmit = async ()=>{
        if (!selectedDoctor || !date || !time) {
            toast.error("Please fill all the fields");
            return;
        }

        try{
            await api.post("/api/appointments/", {
                doctor: selectedDoctor,
                date : date,
                time : time,
                reason: reason,
            });

            toast.success("Appointment booked successfully!");

            //resetting form
            setSelectedDoctor("");
            setDate("");
            setTime("");
            setReason("");
        }
        catch (err) {
            toast.error("Failed to book appointment");
        }
    }
    
    
    return(
        <div className="space-y-4">
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-6">
                    Book Appointment
                </h1>

                <div className="bg-white shadow-md rounded-xl p-6">
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-2">
                            Select Doctor
                        </label>

                        <select
                            value={selectedDoctor}
                            onChange={(e) => setSelectedDoctor(e.target.value)}
                            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">-- Choose Doctor --</option>
                            {
                                doctors.map((doc) => (
                                    <option key={doc.id} value={doc.id}>
                                        {doc.name} ({doc.speciality})
                                    </option>
                                ))
                            }
                        </select>

                    </div>


                    <div className="mb-4 ">
                        <label className="block text-sm font-medium mb-2">
                            Select Date
                        </label>

                        <input
                            type="date"
                            value={date}
                            min = { new Date().toISOString().split("T")[0]}
                            onChange={(e) => setDate(e.target.value)}
                            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-2">
                            Select Time
                        </label>

                        <select
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">-- Choose Time --</option>

                            <option value="09:00">09:00 AM</option>
                            <option value="10:00">10:00 AM</option>
                            <option value="11:00">11:00 AM</option>
                            <option value="12:00">12:00 PM</option>
                            <option value="14:00">02:00 PM</option>
                            <option value="15:00">03:00 PM</option>
                            <option value="16:00">04:00 PM</option>
                        </select>
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-2">
                            Reason (optional)
                        </label>

                        <textarea
                            value={reason}
                            onChange={(e)=> setReason(e.target.value)}
                            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Describe your issue..."
                        />
                    </div>

                    <button
                        onClick={handleSubmit}
                        disabled = {!selectedDoctor || !date || !time}
                        // className="w-full py-3 font-semibold bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition"
                        className={`w-full py-3 rounded-lg font-semibold transition ${
                            !selectedDoctor || !date || !time
                            ? "bg-gray-400 text-white cursor-not-allowed"
                            :"bg-blue-600 hover:bg-blue-700 text-white"
                        }`}
                    >
                        Book Appointment
                    </button>
                </div>
            </div>
        </div>
    )
}

export default BookAppointment;