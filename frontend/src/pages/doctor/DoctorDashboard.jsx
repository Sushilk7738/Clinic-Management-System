import React, { useEffect, useState } from 'react'
import api from '../../api'
import { toast } from 'react-toastify'

const DoctorDashboard = () => {
const [appointments, setAppointments] = useState([])
const [selectedAppt, setSelectedAppt] = useState(null)
const [medicines, setMedicines] = useState("")
const [notes, setNotes] = useState("")

useEffect(() => {
    api.get("/api/appointments/")
    .then(res => setAppointments(res.data))
    .catch(() => toast.error("Failed to load appointments"))
}, [])

const handleStatusUpdate = async (id, status) => {
    try {
    await api.patch(`/api/appointments/${id}/`, { status })
    toast.success(`Appointment ${status}`)
    setAppointments(prev =>
        prev.map(appt =>
        appt.id === id ? { ...appt, status } : appt
        )
    )
    } catch {
    toast.error("Failed to update status")
    }
}

const handleCreatePrescription = async () => {
    if (!medicines) {
    toast.error("Medicines required")
    return
    }

    try {
    await api.post("/api/prescriptions/", {
        appointment: selectedAppt,
        medicines,
        notes,
    })

    toast.success("Prescription created")

    setAppointments(prev =>
        prev.map(appt =>
        appt.id === selectedAppt
            ? { ...appt, prescription: true }
            : appt
        )
    )

    setSelectedAppt(null)
    setMedicines("")
    setNotes("")
    } catch (err) {
    console.log(err.response?.data)
    toast.error("Failed to create prescription")
    }
}

return (
    <div className='p-6'>
    <h1 className='text-2xl font-bold mb-6'>Doctor Dashboard</h1>

    <div className='bg-white p-6 shadow-md rounded-xl'>
        <div className='space-y-3'>
        {appointments.map((appt) => (
            <div
            key={appt.id}
            className='bg-slate-50 p-4 rounded-lg'
            >
            <div className='flex justify-between items-center'>
                <div>
                <p className='font-semibold text-slate-800'>
                    {appt.patient_name}
                </p>
                <p className='text-sm text-slate-500'>
                    {appt.date} at {appt.time}
                </p>
                </div>

                <div className='flex items-center gap-3'>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    appt.status === "pending"
                    ? "bg-yellow-100 text-yellow-700"
                    : appt.status === "confirmed"
                    ? "bg-green-100 text-green-700"
                    : appt.status === "completed"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-red-100 text-red-700"
                }`}>
                    {appt.status}
                </span>

                {appt.status === "pending" && (
                    <button
                    onClick={() => handleStatusUpdate(appt.id, "confirmed")}
                    className="px-3 py-1 bg-green-600 text-white text-xs rounded-lg"
                    >
                    Confirm
                    </button>
                )}

                {appt.status === "confirmed" && (
                    <button
                    onClick={() => handleStatusUpdate(appt.id, "completed")}
                    className="px-3 py-1 bg-blue-600 text-white text-xs rounded-lg"
                    >
                    Complete
                    </button>
                )}

                {appt.status !== "completed" && appt.status !== "cancelled" && (
                    <button
                    onClick={() => handleStatusUpdate(appt.id, "cancelled")}
                    className="px-3 py-1 bg-red-600 text-white text-xs rounded-lg"
                    >
                    Cancel
                    </button>
                )}

                {appt.status === "completed" && !appt.prescription && (
                    <button
                    onClick={() => setSelectedAppt(appt.id)}
                    className="px-3 py-1 bg-purple-600 text-white text-xs rounded-lg"
                    >
                    Add
                    </button>
                )}
                </div>
            </div>

            {appt.prescription_data && (
                <div className="mt-3 bg-white border rounded-lg p-3">
                <p className="text-sm font-semibold text-slate-700">Medicines</p>
                <p className="text-sm text-slate-600">{appt.prescription_data.medicines}</p>
                <p className="text-sm font-semibold text-slate-700 mt-2">Notes</p>
                <p className="text-sm text-slate-600">
                    {appt.prescription_data.notes || "No notes"}
                </p>
                </div>
            )}
            </div>
        ))}
        </div>

        {selectedAppt && (
        <div className="mt-6 bg-white p-6 rounded-xl shadow-md">
            <textarea
            placeholder="Medicines"
            value={medicines}
            onChange={(e) => setMedicines(e.target.value)}
            className="w-full p-3 border rounded-lg mb-3"
            />

            <textarea
            placeholder="Notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full p-3 border rounded-lg mb-3"
            />

            <button
            onClick={handleCreatePrescription}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg"
            >
            Save
            </button>
        </div>
        )}
    </div>
    </div>
)
}

export default DoctorDashboard;