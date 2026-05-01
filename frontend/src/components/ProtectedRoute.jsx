import { Navigate } from "react-router-dom";
import { ACCESS_TOKEN, USER_ROLE } from "../constants";

const ProtectedRoute = ({children, role})=>{
    const token = localStorage.getItem(ACCESS_TOKEN);
    const userRole = localStorage.getItem(USER_ROLE);
    

    if (!token){
        return <Navigate to= "/login"/>;
    }

    if (role && userRole !== role){
        return <Navigate to="/login"/>;
    }
    
    return children;
};

export default ProtectedRoute;