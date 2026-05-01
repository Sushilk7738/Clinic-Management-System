import { useEffect, useState } from "react";
import api from "../../api";
import Navbar from "../../components/Navbar";


const PatientDashboard = ()=>{

    const [name, setName] = useState("");

    useEffect(()=> {
        api.get("/api/profile/")
            .then(res => {
                setName(res.data.first_name);
            })
    }, []);
    
    return(
    <>
        <Navbar/>
        <div>
            <h1 className="text-2xl text-center font-bold mt-5">Welcome to Patient Dashboard</h1>
            <p className="text-center font-semibold">Patient: {name}</p>
        </div>
        
    </>
    )
}

export default PatientDashboard;