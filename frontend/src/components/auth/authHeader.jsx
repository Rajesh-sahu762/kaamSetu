import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";


const AuthHeader = ({
  showBack = true,
  title = "KAAMSETU",
}) => {

const navigate = useNavigate();

  return (
    
   <header className="border-b border-[#d3e4fe] bg-white">
        <div className="max-w-6xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 border border-[#d3e4fe] flex items-center justify-center rounded"
          >
            <FaArrowLeft />
          </button>

          <h1 className="tracking-[0.25em] text-sm font-medium">
            KAAMSETU
          </h1>

          <button className="text-sm font-medium">
            Support
          </button>
        </div>
      </header>
  );
};

export default AuthHeader;