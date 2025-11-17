import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom";
import { CheckCircle, XCircle  } from "lucide-react"; 
import { toast } from "react-toastify";

import axios from "axios";
import { verifyEmail } from "../api/api";

const VerifyEmail = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [success, setSuccess] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const verify = async () => {
      try {
        const data = await verifyEmail(token);
        setMessage(data.message);
        setSuccess(true);
        toast.success("Email verified successfully!");

      } catch (err){
        setMessage(err.response?.data?.message);
        setSuccess(false);
        toast.error("Invalid or expired token.");
      }
    };

    verify();
  }, 
  [token]);


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-500 to-blue-900">
        <div className="flex flex-col justify-center items-center bg-white py-10 px-8 md:px-10 rounded-md shadow-lg max-w-lg text-center">
          
          {success === null && (
          <>
          <div className="animate-spin rounded-full w-10 h-10 md:w-12 md:h-12 border-t-4 border-blue-500 mb-4"></div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">
             Verifying....
          </h1>
          </>
          )}

          {success === true && (
          <>   
          <CheckCircle className="w-10 h-10 md:w-18 md:h-18 text-green-500 mb-4" />
          <h1 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">
             Email Verified!
          </h1>
          
          <p className="text-sm md:text-base text-gray-600 text-center max-w-md mb-6 md:mb-10">
             {message}
          </p>
          
          <button
           onClick={() => navigate("/login")}
           className="px-4 py-3 md:px-5 md:py-3 text-xs md:text-md bg-gradient-to-r from-green-500 to-blue-900 text-white rounded-full cursor-pointer hover:scale-[1.01] transition-all"
          >
            Go to Login
          </button>
          </>
          )}
          
          {success === false && (
          <>   
          <XCircle className="w-10 h-10 md:w-18 md:h-18 text-red-500 mb-4" />
          <h1 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">
             Verification Failed!
          </h1>
          <p className="text-sm md:text-base text-gray-600 text-center max-w-md mb-6 md:mb-10">
             {message}
          </p>
          </>
          )}

        </div>
    </div>
  )
}

export default VerifyEmail
