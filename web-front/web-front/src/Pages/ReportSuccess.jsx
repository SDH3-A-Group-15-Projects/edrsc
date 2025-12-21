import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ReportSuccess = () => {
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(window.location.search);
  const patientId = searchParams.get("patientId");
  const [status, setStatus] = useState("Verifying payment...");

  useEffect(() => {
    const verifyPaymentAndFetchReport = async () => {
      if (!patientId) {
        navigate("/risk-dashboard");
        return;
      }

      try {
        let paymentVerified = false;
        let attempts = 0;
        const maxAttempts = 15; 

        while (!paymentVerified && attempts < maxAttempts) {
          try {
            const paymentCheck = await fetch(
              `http://localhost:3001/api/web/payments/verify/${patientId}`
            );
            
            if (paymentCheck.ok) {
              const paymentData = await paymentCheck.json();
              if (paymentData.paid) {
                paymentVerified = true;
                setStatus("Payment confirmed! Loading report...");
                break;
              }
            }
          } catch (err) {
            console.log("Payment verification attempt failed:", err);
          }

          await new Promise(resolve => setTimeout(resolve, 1000));
          attempts++;
          setStatus(`Verifying payment... (${attempts}/${maxAttempts})`);
        }

        if (!paymentVerified) {
          setStatus("Payment verification timeout. Please contact support.");
          setTimeout(() => navigate("/risk-dashboard"), 3000);
          return;
        }
        const response = await fetch(
          `http://localhost:3001/api/report/patient/${patientId}`
        );
        
        if (!response.ok) throw new Error("Patient not found or backend error");
        
        const patient = await response.json();
        navigate("/report", { state: { patient } });
      } catch (err) {
        console.error(err);
        setStatus("Error loading report. Redirecting...");
        setTimeout(() => navigate("/risk-dashboard"), 2000);
      }
    };

    verifyPaymentAndFetchReport();
  }, [navigate, patientId]);

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      fontSize: '18px',
      color: '#344862',
      flexDirection: 'column',
      gap: '20px'
    }}>
      <p>{status}</p>
      <div style={{
        width: '50px',
        height: '50px',
        border: '5px solid #f3f3f3',
        borderTop: '5px solid #344862',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }}></div>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default ReportSuccess;