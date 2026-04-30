import { Navigate } from "react-router-dom";
import { ACCESS_TOKEN } from "../constants";

const ProtectedRoute = ({childern})=>{
    const token = localStorage.getItem(ACCESS_TOKEN);

    if (!token){
        return <Navigate to= "/login"/>;
    }
    
    return childern;
};

export default ProtectedRoute;