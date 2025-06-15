import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import isMobile from "../utils/IsMobile";

export default function Login() {
  const [cpf, setCpf] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();


    const authUser = () => {
      const login = async()=>{
        const response = await fetch('http://localhost:3000/api/login/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            password: password,
            cpf: cpf,
          }),
        });
        const data = await response.json();
        localStorage.setItem('id', data.user._id)
        console.log(data);

        if (response.ok && data.token) {
          localStorage.setItem('token', data.token);
          navigate('/dashboard');
        } else {
          console.error('Erro de login:', data.message || data.error);
        }
      }
      login()
    };

  return (
    <div className="flex h-screen">
      {!isMobile() && <img src="./unig-fachada.webp" alt="Fachada da UNIG NI" className="w-2/3" />}

      <div
        className={`flex flex-col items-center py-4 ${isMobile() ? 'w-full bg-[url(/unig-fachada.webp)] bg-center bg-cover bg-no-repeat' : 'bg-[#0E3860] w-1/3 border-l-3 border-white'}`}
      >
        <img
          src="./LOGO.jpg"
          alt="Logo da Universidade"
          className="rounded-full border-2 border-white"
        />
        <p
          className={`text-3xl mt-6 font-semibold ${isMobile() ? 'bg-white px-4 py-1 text-[#0E3860] rounded-xl' : 'text-white '}`}
        >
          SIGA
        </p>
        <input
          type="text"
          className={`text-white ${isMobile() ? 'bg-white placeholder:text-[#0E3860] selected:border-[#0E3860] w-3/4' : 'placeholder:text-white w-1/2'} border-2 border-white p-2 rounded-lg mt-12 mb-4`}
          placeholder="Informe seu CPF"
          value={cpf}
          onChange={(e) => setCpf(e.target.value)}
        />
        <input
          type="text"
          className={`text-white ${isMobile() ? 'bg-white placeholder:text-[#0E3860] selected:border-[#0E3860] w-3/4' : 'placeholder:text-white w-1/2'} border-2 border-white p-2 rounded-lg mb-12`}
          placeholder="Informe sua senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          onClick={authUser}
          className="cursor-pointer p-2 bg-white border-2 rounded-lg text-[#0E3860] w-1/2 rounded-lg hover:bg-[#0E3860] hover:text-white hover:border-white transition-all duration-300"
        >
          Acessar
        </button>
        <Link
          to="/forgot-password"
          className={`${isMobile() ? 'font-bold bg-[#0E3860] px-2 py-1 rounded' : ''} text-white underline text-sm mt-1`}
        >
          Esqueci minha senha
        </Link>
      </div>
    </div>
  );
}
