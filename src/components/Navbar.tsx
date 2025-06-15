import { useNavigate } from "react-router-dom";
import isMobile from "../utils/IsMobile";

export default function Navbar() {
    const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div className={`w-full bg-slate-600 h-1/10 flex items-center ${isMobile() ? 'px-2' : 'px-8'}`}>
      <img src="/logo2.jpg" alt="Logo UNIG" className="w-28 h-20" />
      <p className="text-white text-2xl mx-auto">
        {isMobile() ? 'SIGA' : 'SIGA - sistema integrado de gestão acadêmica'}
      </p>
      <button onClick={logout}>
        <img
          src="/logout.svg"
          alt="Icone de logout"
          className={`${isMobile() ? 'w-8' : 'size-10'} cursor-pointer`}
        />
      </button>
    </div>
  );
}
