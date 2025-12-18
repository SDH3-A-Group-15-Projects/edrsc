import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { db } from "../index";
import { ref, get } from "firebase/database";

const ReportSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const patientId = searchParams.get("patientId");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!patientId) {
      navigate("/risk-dashboard");
      return;
    }

    const checkPaymentAndRedirect = async () => {
      try {
        const snapshot = await get(ref(db, `payments/${patientId}`));

        if (snapshot.exists() && snapshot.val().paid) {
          // Payment confirmed, fetch patient info
          const patientSnap = await get(ref(db, `patients/${patientId}`));
          if (!patientSnap.exists()) {
            console.error("Patient not found");
            navigate("/risk-dashboard");
            return;
          }

          const patient = { id: patientId, ...patientSnap.val() };

          // Redirect to report page
          navigate("/report", { state: { patient } });
        } else {
          // Retry after 2 seconds
          setTimeout(checkPaymentAndRedirect, 2000);
        }
      } catch (err) {
        console.error("Error verifying payment:", err);
        alert("Error verifying payment. Redirecting to dashboard.");
        navigate("/risk-dashboard");
      }
    };

    checkPaymentAndRedirect();
  }, [navigate, patientId]);

  return <p>Payment successful. Redirecting to report...</p>;
};

export default ReportSuccess;
