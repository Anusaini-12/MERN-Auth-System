import robo from "../assets/header_img.png";
import hand_wave from "../assets/hand_wave.png";

const Header = () => {

  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-6">
       <img src={robo} alt="robo" className="w-50 rounded-full mb-6" />

       <span className="flex gap-2">
       <h1 className="text-4xl font-bold text-gray-700">Hey {user?.name || "User"}!</h1>
       <img src={hand_wave} alt="hand_wave" className="w-10"/>
       </span>

       <p className="text-lg text-gray-600 mt-2 text-center">
        Welcome to your secure space. Let's get started!
       </p>

        <button 
          className="px-6 py-2 mt-8 border border-gray-700 text-black rounded-full hover:bg-gray-700 hover:text-white cursor-pointer transition-all"
        >
          Get Started
        </button>
    </div>
  )
}

export default Header
