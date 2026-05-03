import { useState, useEffect } from "react";
import api from '../../api';
import Layout from '../../components/Layout';
import { toast } from 'react-toastify';


import React from 'react'

const MyPrescriptions = () => {
    const [prescriptions, setPrescriptions] = useState([]);

    useEffect(()=>{
        api.get("/api/prescriptions/")
            .then(res => {
                setPrescriptions(res.data);
            })
            .catch(() => {
                toast.error("Failed to load prescriptions");
            })
    }, []);
    
    
return (
    <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">
            My Prescriptions
        </h1>

        <div className="bg-white shadow-md rounded-xl p-6">
            {
                prescriptions.length === 0 ? (
                    <p className="text-slate-600 font-medium">
                        No prescriptions yet
                    </p>
                ) : (
                    <div className="space-y-4">
                        {
                            prescriptions.map((presc) => (
                                <div
                                    key={presc.id}
                                    className="bg-slate-50 p-4 rounded-lg"
                                >
                                    <p className="font-semibold text-slate-800">
                                        Medicines:
                                    </p>
                                    
                                    <p className="text-slate-600 mb-2">
                                        {presc.medicines}
                                    </p>

                                    <p className="font-semibold text-slate-800">
                                        Notes:
                                    </p>
                                    <p className="text-slate-600">
                                        {presc.notes || "No notes"}
                                    </p>
                                </div>
                            ))
                        }
                    </div>
                )
            }
        </div>
    </div>
)
}

export default MyPrescriptions