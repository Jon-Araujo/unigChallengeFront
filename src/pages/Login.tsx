import { useState } from "react";
import { useNavigate } from "react-router-dom";
import isMobile from "../utils/IsMobile";
import { formatCpf } from '../utils/formatCpf';
import { toast } from "sonner";

export default function Login() {
  const [cpf, setCpf] = useState('');
  const [password, setPassword] = useState('');
  const [loadingController, setLoadingController] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const navigate = useNavigate();


    const authUser = () => {
      const login = async()=>{
        try {
          const response = await fetch('https://unigchallengebackend.onrender.com/api/login/', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ cpf, password }),
          });

          const data = await response.json();

          if (response.ok && data.token) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('id', data.user._id);
            navigate('/dashboard');
          } else {
            toast.error(data.message || 'Usuário e/ou senha incorreto(s). Tente novamente!');
            console.error('Erro no login:', data);
          }
        } catch (error) {
          toast.error('Erro de conexão com o servidor. Tente novamente mais tarde.');
          console.error('Erro de requisição:', error);
        } finally {
          setLoadingController(false);
        }
      }

      setLoadingController(true);
      login()
    };

  return (
    <div className="flex h-screen">
      {!isMobile() && <img src="./unig-fachada.webp" alt="Fachada da UNIG NI" className="w-2/3" />}

      {loadingController ? (
        <img
          src="/loading.svg"
          alt="Imagem animada de carregamento"
          className={`absolute bg-white/60 ${isMobile() ? 'w-[40%] h-[15%] bottom-4 left-[30%]' : 'w-[10%] h-[15%] left-[45%] top-[35%]'}`}
        />
      ) : null}

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
          className={`${isMobile() ? 'text-[#0E3860] bg-white placeholder:text-[#0E3860] selected:border-[#0E3860] w-3/4' : 'text-white placeholder-white w-1/2'} border-2 border-white p-2 rounded-lg my-6`}
          placeholder="Informe seu CPF"
          value={cpf}
          onChange={(e) => setCpf(formatCpf(e.target.value))}
        />

        <div className={`flex justify-between border-2 border-white p-2 rounded-lg mb-12 bg-white ${isMobile()? 'w-3/4':'w-1/2'}`}>
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Informe sua senha"
            className={`${isMobile() ? 'text-[#0E3860] placeholder:text-[#0E3860] selected:border-[#0E3860]' : 'text-white placeholder-white'}`}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="button"
            onClick={()=>{setShowPassword(!showPassword);}}
            className=" flex items-center px-2 text-gray-600 hover:text-gray-800 cursor-pointer"
          >
            {showPassword ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.956 9.956 0 012.385-3.658m3.286-2.43A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.542 7a9.978 9.978 0 01-4.193 5.232M15 12a3 3 0 00-3-3m0 0a3 3 0 013 3m-3-3L3 3"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
            )}
          </button>
        </div>
        <button
          onClick={authUser}
          className="cursor-pointer p-2 bg-white border-2 rounded-lg text-[#0E3860] w-1/2 rounded-lg hover:bg-[#0E3860] hover:text-white hover:border-white active:scale-95 active:bg-gray-300 transition-all duration-300"
        >
          Acessar
        </button>
        <button
          onClick={()=>{alert('Parte não desenvolvida!');}}
          className={`${isMobile() ? 'font-bold bg-[#0E3860] px-2 py-1 rounded' : ''} text-white underline text-sm mt-1`}
        >
          Esqueci minha senha
        </button>
      </div>
    </div>
  );
}
