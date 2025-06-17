import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../components/ui/dialog';
import { toast } from 'sonner';
import isMobile from '../utils/IsMobile';
import type { User } from '../types/User';
import capitalizeWord from '../utils/capitalizeWord';

export default function Dashboard() {
  const [user, setUser] = useState<User>();
  const [subjects, setSubjects] = useState<string[]>([]);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [controller, setController] = useState<boolean>(false);

  useEffect(() => {
    const getUser = async () => {
      const id = localStorage.getItem('id');
      const response = await fetch(`https://unigchallengebackend.onrender.com/api/user/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      setUser(data);
    };

    getUser();
  }, [controller]);

  useEffect(() => {
    const findSubjects = async () => {
      const response = await fetch('https://unigchallengebackend.onrender.com/api/courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          course: user?.course,
        }),
      });

      const data = await response.json();
      console.log(data.subjects);
      setSubjects(data.subjects);
    };

    findSubjects();
  }, [user]);

  const SubjectChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;

    if (checked) {
      setSelectedSubjects([...selectedSubjects, value]);
    } else {
      setSelectedSubjects(selectedSubjects.filter((subject) => subject !== value));
    }
  };

  const saveRegister = () => {
    const updateUser = async () => {
      let editedSubjects = [...(user?.subjects || []), ...selectedSubjects];

      try {
        const response = await fetch(
          `https://unigchallengebackend.onrender.com/api/edit-user/${user?._id}`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              _id: user?._id,
              name: user?.name,
              type_user: user?.type_user,
              course: user?.course,
              password: user?.password,
              cpf: user?.cpf,
              subjects: editedSubjects,
            }),
          }
        );

        const data = await response.json();
        console.log(data.subjects);
        setController(!controller);

        toast.success('Usuário atualizado com sucesso!', {
          description: 'Os dados foram salvos com sucesso.',
          className: 'bg-green-500 text-white',
        });
      } catch (error) {
        console.error('Erro ao atualizar usuário: ', error);
      }
    };
    updateUser();
  };

  const deleteSubject = (subject:string) => {
    const fetchEdit = async () => {
      try {
        const editedSubjects = user?.subjects.filter((s)=> s !== subject);

        const response = await fetch(
          `https://unigchallengebackend.onrender.com/api/edit-user/${user?._id}`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              _id: user?._id,
              name: user?.name,
              type_user: user?.type_user,
              course: user?.course,
              password: user?.password,
              cpf: user?.cpf,
              subjects: editedSubjects,
            }),
          }
        );

        const data = await response.json();
        console.log(data);

        
        setController(!controller);

        toast.success('Disciplina removida com sucesso!');
      } catch (error) {
        console.error('Erro ao editar conta:', error);
        toast.error('Ocorreu um erro ao remover a disciplina!');
      }
    }

    fetchEdit();
  }

  return (
    <>
      <Navbar />
      <div className={`w-full flex items-center justify-center ${isMobile() ? 'flex-col' : ''}`}>
        <Dialog>
          <DialogTrigger
            className={`px-8 py-4 border-4 rounded-lg cursor-pointer overflow-hidden ${isMobile() ? 'my-8' : 'mt-[10%] mr-12 hover:mt-[6%] transform-all duration-300'}`}
          >
            <img
              src="/disciplinas.png"
              alt="Disciplinas icone"
              className="size-48 hover:scale-130
hover:scale-130 transform-all duration-600"
            />
          </DialogTrigger>
          <DialogContent className="h-2/3 overflow-hidden">
            <DialogHeader>
              <DialogTitle>Olá, {capitalizeWord(user?.name ?? '')}</DialogTitle>
              <DialogDescription className="text-start">
                {'Aqui estão as disciplinas matriculadas até o momento no seu curso de ' +
                  capitalizeWord(user?.course ?? '')}
                :
                <ul className="overflow-y-auto max-h-84 mt-2 pr-2">
                  {user?.subjects.map((d, index) => (
                    <li key={index} className="w-full border-2 p-1 my-2">
                      <div className="w-full flex px-2 justify-between">
                        <p className="mr-4">{d}</p>
                        <button className="cursor-pointer" onClick={() => deleteSubject(d)}>
                          <img src="/trash.svg" alt="Icone de lixeira" />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>

        <Dialog>
          <DialogTrigger
            className={`px-8 py-4 border-4 rounded-lg cursor-pointer overflow-hidden ${isMobile() ? 'm-0' : 'mt-[10%] mr-12 hover:mt-[6%] transform-all duration-300'}`}
          >
            <img
              src="/inscrevase.png"
              alt="Inscreva-se icone"
              className="size-48 hover:scale-130
hover:scale-130 transform-all duration-600"
            />
          </DialogTrigger>
          <DialogContent className="max-h-2/3 overflow-hidden">
            <DialogHeader>
              <DialogTitle>Disciplinas disponiveis para o curso de {user?.course}:</DialogTitle>
              <DialogDescription className="max-h-[80%]">
                <ul className="overflow-y-auto max-h-[60%]">
                  {(subjects ?? []).map((s, index) => (
                    <li
                      key={index}
                      className={`w-full border-2 p-1 my-2 ${user?.subjects?.includes(s) ? 'border-green-200 bg-green-200' : ''}`}
                    >
                      <label className="w-full flex px-2 cursor-pointer">
                        <input
                          type="checkbox"
                          value={s}
                          onChange={(e) => SubjectChange(e)}
                          disabled={user?.subjects?.includes(s)}
                          className="mr-4"
                        />
                        {s} {user?.subjects?.includes(s) ? ' - Disciplina já matriculada' : ''}
                      </label>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={saveRegister}
                  className="mt-[1.5%] rounded-lg cursor-pointer text-white font-semibold py-1 bg-slate-600 mx-[25%] w-1/2 hover:w-[80%] hover:mx-[10%] transform-all duration-300"
                >
                  Confirmar Inscrição
                </button>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}
