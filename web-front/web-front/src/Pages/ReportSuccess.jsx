import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ReportSuccess = () => {
    const navigate = useNavigate();

    useEffect(() => {
        navigate("/report");
    }, []);

    return <p>Payment successful. Redirecting to report...</p>;

};

export default ReportSuccess;