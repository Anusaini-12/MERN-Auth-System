import { useState } from "react"
import { registerUser } from "../api/api";
import { toast } from "react-toastify";
import LoadingButton from "../components/LoadingButton";

const Register = () => {
  
  const [formData, setFormData] = useState({
    name: "",
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
      setLoading(true);

      if (!formData.name.trim()) {
        toast.error("Please enter your name.");
        setLoading(false);
        return;
      }

      if (!formData.email.trim()) {
        toast.error("Please enter your email.");
        setLoading(false);
        return;
      }

      if (!formData.password.trim()) {
        toast.error("Password is required!");
        setLoading(false);
      return;
      }

      const passCheck = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[_]).{8,}$/;
          if (!passCheck.test(formData.password)) {
            toast.error(
            "Password must contain a-z, A-Z, 0-9, '_' and be 8+ characters long."
          );
          setLoading(false);
          return;
      }

      try{
        const data = await registerUser(formData);
        toast.success(data.message || "Registration successful!");
        setFormData({
         name: "",
         email: "",
         password: "",
        });
      } catch (err) {
        toast.error(err.response?.data?.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-500 to-blue-900 px-10">
      <div className="bg-white p-8 md:p-12 rounded-md shadow-lg w-full max-w-md">
         <h2 className="text-2xl md:text-3xl font-bold text-center mb-10 text-gray-700">Register</h2>


         <form onSubmit={handleOnSubmit} className="flex flex-col gap-1">
           <label className="block mb-2 font-medium text-gray-600">
             Full Name <span className="text-red-600 text-md">*</span>
           </label>
           <input 
             type="text"
             name="name"
             value={formData.name}
             placeholder="Name"
             className="p-2 md:p-3 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-400 mb-4"
             onChange={handleOnChange}
           />

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
           <p className="text-red-500 text-xs md:text-sm">
           Password must contain a-z, A-Z, 0-9, "_", and be 8+ characters.
          </p>
          )}

          <LoadingButton loading={loading}>
            Register
          </LoadingButton>
         </form>

         <p className="mt-3 text-center text-gray-600">
          Already have an account?{" "}
          <a href="/login" className="text-blue-500 font-semibold hover:underline">
            Login
          </a>
         </p>
      </div>
    </div>
  )
}

export default Register
