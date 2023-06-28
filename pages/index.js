import { AiOutlinePlus } from "react-icons/ai";
import { MdDeleteForever } from "react-icons/md";
import { GoSignOut } from "react-icons/go";
import { useYourAuth } from "@/firebase/auth";
import { useRouter } from "next/router";
import Loader from "@/components/Loader";
import { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  query,
  where,
  deleteDoc,
  updateDoc,
  doc,
  getDocs,
} from "firebase/firestore";
import { db } from "@/firebase/firebase";



export default function Home() {
  const { authUser, authSignOut, isLoading } = useYourAuth();
  const router = useRouter();
  const [todos, setTodos] = useState([]);
  const [todoInput, setTodoInput] = useState("");

  useEffect(() => {
    if (!isLoading && !authUser) {
      router.push("/login");
    }
    if(!!authUser){
        fetchUser(authUser.uid)
    }
  }, [authUser, isLoading]);

  const addToDo = async () => {
    if (!todoInput) {
      alert("Type To Do first");
      return;
    }
    try {
      const docRef = await addDoc(collection(db, "todos"), {
        owner: authUser.uid,
        content: todoInput,
        completed: false,
      });
      console.log("Document written with ID: ", docRef.id);
      setTodoInput("")
      fetchUser(authUser.uid)
    } catch (error) {
      console.error(error);
    }

  };

  const onKeyEnter = (event)=>{
    if(event.key==="Enter"&&todoInput.length>0){
      addToDo()
    }
  }
  const fetchUser = async (uid) => {
    try {
      const q = query(collection(db, "todos"), where("owner", "==", uid));

      const querySnapshot = await getDocs(q);
      let data =[]
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        console.log(doc.id, " => ", doc.data());
        data.push({...doc.data(),id:doc.id})
      });
      setTodos(data)
    } catch (error) {
        console.error(error)
    }
  };
  const deleteToDo = async(docId)=>{
    try {
        await deleteDoc(doc(db,"todos",docId))
        fetchUser(authUser.uid)
    } catch (error) {
        console.error(error)
    }
  }

  const markAsCompleted = async (event,docId)=>{
    try {
      const docRef = doc(db,"todos",docId)
      await updateDoc(docRef,{
        completed:event.target.checked
      })
      fetchUser(authUser.uid)
    } catch (error) {
      console.error(error)
    }

  }

  return isLoading ? (
    <Loader />
  ) : (
    <main className="">
      <div
        className="bg-black text-white w-44 py-4 mt-10 rounded-lg transition-transform hover:bg-black/[0.8] active:scale-90 flex items-center justify-center gap-2 font-medium shadow-md fixed bottom-5 right-5 cursor-pointer"
        onClick={authSignOut}
      >
        <GoSignOut size={18} />
        <span>Logout</span>
      </div>
      <div className="max-w-3xl mx-auto mt-10 p-8">
        <div className="bg-white -m-6 p-3 sticky top-0">
          <div className="flex justify-center flex-col items-center">
            <span className="text-7xl mb-10">📝</span>
            <h1 className="text-5xl md:text-6xl font-bold">ToooDooo's</h1>
          </div>
          <div className="flex items-center gap-2 mt-10">
            <input
              placeholder={`👋 Hello ${authUser?.username?authUser?.username:""}, What to do Today?`}
              type="text"
              className="font-semibold placeholder:text-gray-500 border-[2px] border-black h-[60px] grow shadow-sm rounded-md px-4 focus-visible:outline-yellow-400 text-lg transition-all duration-300"
              autoFocus
              value={todoInput}
              onChange={(e) => setTodoInput(e.target.value)}
              onKeyUp={onKeyEnter}
            />
            <button
              className="w-[60px] h-[60px] rounded-md bg-black flex justify-center items-center cursor-pointer transition-all duration-300 hover:bg-black/[0.8]"
              onClick={addToDo}
            >
              <AiOutlinePlus size={30} color="#fff" />
            </button>
          </div>
        </div>
        <div className="my-10">
          {todos?.length>0&& todos?.map((todo, index) => (
            <div key={todo.id} className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-3">
                <input
                  id={`todo-${todo.id}`}
                  type="checkbox"
                  className="w-4 h-4 accent-green-400 rounded-lg"
                  checked={todo.completed}
                  onChange={(e)=>markAsCompleted(e,todo.id)}
                />
                <label htmlFor={`todo-${todo.id}`} className={`font-medium ${todo.completed?"line-through":""}`}>
                  {todo.content}
                </label>
              </div>

              <div className="flex items-center gap-3" onClick={()=>deleteToDo(todo.id)}>
                <MdDeleteForever
                  size={24}
                  className="text-red-400 hover:text-red-600 cursor-pointer"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
