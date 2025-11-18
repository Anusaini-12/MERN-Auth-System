import { useState } from "react"
import { loginUser } from "../api/api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import LoadingButton from "../components/LoadingButton";

const Login = () => {
   
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleOnChange = (e) => {
    setFormData({ 
      ...formData,
      [e.target.name]: e.target.value
    });
  }

  const handleOnSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;
    setLoading(true);

    if (!formData.email.trim()) {
      toast.error("Please enter your email.", { toastId: "login-email" });
      setLoading(false);
      return;
    }
    
    if (!formData.password.trim()) {
        toast.error("Password is required!", { toastId: "login-password" });
        setLoading(false);
      return;
    }
    
    const passCheck = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[_]).{8,}$/;
    if (!passCheck.test(formData.password)) {
      toast.error(
        "Password must contain a-z, A-Z, 0-9, '_' and be 8+ characters long.",
        { toastId: "login-pass-format" }
      );
      setLoading(false);
      return;
    }
      
      try{
        const data = await loginUser(formData);
        toast.success(data.message || "Login successful!", {toastId: "login-success"});

        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data));
        setTimeout(() => navigate("/"), 800);

      } catch (err) {
        console.log(err);
        toast.error(err.response?.data?.message || "Something went wrong!", {toastId: "login-fail"});

      } finally {
        setLoading(false);
      }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-500 to-blue-900 px-10">
      <div className="bg-white p-8 md:p-12 rounded-md shadow-lg w-full max-w-md">
         <h2 className="text-2xl md:text-3xl font-bold text-center mb-10 text-gray-700">Login</h2>

         <form onSubmit={handleOnSubmit} className="flex flex-col gap-1">
           <label className="block mb-2 font-medium text-gray-600">
             Email Address <span className="text-red-600 text-md">*</span>
           </label>
           <input 
             type="email"
             name="email"
             value={formData.email}
             placeholder="Email"
             className="p-2 md:p-3 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-400 mb-4"
             onChange={handleOnChange}
           />

          <div className="relative w-full">
           <label className="block mb-2 font-medium text-gray-600">
             Password <span className="text-red-600 text-md">*</span>
           </label>
           <input 
             type={showPassword ? "text" : "password"}
             name="password"
             value={formData.password}
             placeholder="Password"
             className="w-full p-2 md:p-3 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-400"
             onChange={handleOnChange}
           />
           <i
            className={`fa-regular ${showPassword ? "fa-eye-slash" : "fa-eye"} 
            absolute right-4 top-1/2 -translate-y-1/2 text-sm md:text-lg text-gray-500 cursor-pointer hover:text-green-500 mt-4`}
            onClick={() => setShowPassword(!showPassword)}
          ></i>
          </div>
           {formData.password && !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[_]).{8,}$/.test(formData.password) && (
            <p className="text-red-500 text-xs md:text-sm mb-4 ">
               Password must contain a-z, A-Z, 0-9, "_", and be 8+ characters.
            </p>
            )}
           
           <p className="text-gray-600">
           <a href="/forgot-password" className="text-sm md:text-base text-blue-500 font-semibold">
             Forgot Password?
           </a>
           </p>

          <LoadingButton loading={loading}>
            Login
          </LoadingButton>
         </form>

         <p className="mt-4 text-center text-gray-600">
          Don't have an account?{" "}
          <a href="/register" className="text-blue-500 font-semibold hover:underline">
            Register
          </a>
         </p>
      </div>
    </div>
  )
}

export default Login
