import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { resetPassword } from "../api/api.js";
import { toast } from "react-toastify";
import LoadingButton from "../components/LoadingButton.jsx";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const handleSubmit = async(e) => {
    e.preventDefault();
    setLoading(true);

    if (!password.trim()) {
      toast.error("Password is required!");
      setLoading(false);
      return;
    }

    const passCheck = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[_]).{8,}$/;
    if (!passCheck.test(password)) {
      toast.error(
        "Password must contain: a-z, A-Z, 0-9, underscore (_), and be 8+ characters."
      );
      setLoading(false);
      return;
    }

      if (password !== confirmPassword) {
       toast.error("Passwords do not match!");
       setLoading(false);
      return;
    }

    try {
      const data = await resetPassword(token, password);
      toast.success("Password reset successfully!");
      setPassword("");
      setConfirmPassword("");

      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid or expired link.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-500 to-blue-900 px-4">
      <div className="bg-white shadow-lg rounded-md p-8 w-full max-w-md">
        <h1 className="text-xl md:text-2xl font-bold text-gray-800 mt-4 mb-6 text-center">
          Reset Password
        </h1>

        <form onSubmit={handleSubmit}>
          <label className="block mb-2 font-medium text-gray-600">
            New Password <span className="text-red-600 text-md">*</span>
          </label>

          <div className="relative w-full mb-2">
          <input
            type={showPassword ? "text" : "password"}
            className="w-full p-2 border rounded-md"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
          
          />

          <i
           className={`fa-regular ${showPassword ? "fa-eye-slash" : "fa-eye"} 
           absolute right-4 top-1/2 -translate-y-1/2 text-lg text-gray-500 cursor-pointer hover:text-green-500`}
           onClick={() => setShowPassword(!showPassword)}
          ></i>
          </div>

          {password && !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[_]).{8,}$/.test(password) && (
          <p className="text-red-500 text-xs md:text-sm">
            Password must contain a-z, A-Z, 0-9, "_", and be 8+ characters.
          </p>
          )}

          <label className="block mb-2 font-medium text-gray-600 mt-6">
            Confirm Password <span className="text-red-600 text-md">*</span>
          </label>

          <div className="relative w-full mb-4">
          <input
            type={showConfirmPassword ? "text" : "password"}
            className="w-full p-2 border rounded-md"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Re-enter password"
            
          />
          
          <i
           className={`fa-regular ${showConfirmPassword ? "fa-eye-slash" : "fa-eye"} 
           absolute right-3 top-1/2 -translate-y-1/2 text-lg text-gray-500 cursor-pointer hover:text-green-500`}
           onClick={() =>  setShowConfirmPassword(!showConfirmPassword)}
          ></i>
          </div>

          <LoadingButton loading={loading}>
            Login
          </LoadingButton>
        </form>

      </div>
    </div>
  );
};

export default ResetPassword;
