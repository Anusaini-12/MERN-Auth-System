const Navbar = () => {

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    window.location.href = "/login"; 
  };

  return (
    <div className="w-full flex justify-end items-center p-6 md:p-6 md:px-20 fixed top-0 bg-gradient-to-r from-green-500 to-blue-900 z-50">
      
      <div className="nav-links flex gap-6 md:gap-8">
      {!token ? (
      <>
      <a
        href="/login"
        className="text-sm md:text-lg text-white hover:text-gray-200 transition-all"
      >
        Login
      </a>
      <a
        href="/register"
        className="text-sm md:text-lg text-white hover:text-gray-200 transition-all"
      >
        Register
      </a>
      </>
      ) : (
        <>
         <button
          onClick={handleLogout}
          className=" text-sm md:text-lg text-white hover:text-gray-100 transition"
         >
           Logout
           <i className="fa-solid fa-arrow-right-from-bracket text-xs md:text-sm p-2"></i>
         </button>
        </>
      )}
      </div>
  
    </div>
  );
};

export default Navbar;
