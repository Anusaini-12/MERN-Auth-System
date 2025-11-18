import { useState } from "react";
import { forgotPassword } from "../api/api.js";
import { toast } from "react-toastify";
import LoadingButton from "../components/LoadingButton.jsx";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;
    setLoading(true);

    if (!email) {
      setLoading(false);
      toast.error("Email is required!", { toastId: "forgot-email" });
      return;
    }

    try {
      const data = await forgotPassword(email);
      setMessage(data.message);
      setError(false);
      toast.success(data.message, { toastId: "forgot-success" });
      
    } catch (err) {
      setMessage(err.response?.data?.message);
      setError(true);
      toast.error(err.response?.data?.message || "Something went wrong.", { toastId: "forgot-error" });

    } finally {
       setLoading(false);
        setEmail("");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-500 to-blue-900 px-4">
      <div className="bg-white shadow-lg rounded-md p-8 w-full max-w-md">
        <h1 className="text-xl md:text-2xl font-bold text-gray-800 mt-4 mb-6 text-center">
          Forgot Password?
        </h1>

        <form onSubmit={handleSubmit}>
          <label className="block mb-2 font-medium text-gray-600">
            Email Address <span className="text-red-600 text-md">*</span>
          </label>
       
        <div className="relative w-full mb-4">
        <i className="fa-regular fa-envelope absolute text-md left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>

        <input
         type="email"
         className="w-full p-2 pl-10 border rounded-md"
         value={email}
         onChange={(e) => setEmail(e.target.value)}
         placeholder="Enter your email"
        />
        </div>

        <LoadingButton loading={loading}>
          Send Reset Link
        </LoadingButton>
        </form>

        {message && (
          <p
            className={`text-center mt-3 text-sm md:text-md ${
              error ? "text-red-600" : "text-green-600"
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
