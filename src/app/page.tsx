// src/app/page.tsx
'use client'

import Todo from "./components/Todo";
import Form from "./components/Form";
import FilterButton from "./components/FilterButton";
import { useState, useRef, useEffect } from "react";


function usePrevious<T>(value:T): T | undefined {
  const ref = useRef<T | undefined>(undefined);
  useEffect(()=>{
    ref.current = value;
  });
  return ref.current;
}


interface Task {
  id:string;
  name: string;
  completed: boolean;
}

const FILTER_MAP: {
  All: () => boolean;
  Active: (task: Task) => boolean;
  Completed: (task : Task) => boolean;
} = {
  All: () => true,
  Active: (task) => !task.completed,
  Completed: (task) => task.completed,
};

const FILTER_NAMES = Object.keys(FILTER_MAP)

// const res = await fetch('http://localhost:3000/api/tasks');
// const data = await res.json();

export default function Home() {

  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState("All");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
 
  
  const listHeadingRef = useRef<HTMLHeadingElement>(null);

   // Cargar tareas al montar el componente
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await fetch('http://localhost:3000/api/tasks');
        if (!res.ok) {
          throw new Error('Error al cargar las tareas');
        }
        const data = await res.json();
        setTasks(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTasks();
  }, []);

  

  //Definir si una tarea esta completa o no
  async function toggleTaskCompleted(id:string) {
    
    try {
    // Actualización optimista (cambia el estado inmediatamente)
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );

    const response = await fetch(`http://localhost:3000/api/tasks/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        completed: !tasks.find(t => t.id === id)?.completed
      }),
    });

    if (!response.ok) {
      throw new Error('Error al actualizar la tarea');
    }

    // Si la API devuelve la tarea actualizada, úsala:
    const updatedTask = await response.json();

    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === id ? updatedTask : task
      )
    );

  } catch (error) {
    console.error('Error:', error);
    setError('No se pudo actualizar el estado de la tarea');
    // Revertir el cambio si falla
    setTasks(tasks);
  }

    
  }

  async function deleteTask(id:string) {

    try{

      const response = await fetch(`http://localhost:3000/api/tasks/${id}`,{
        method:'DELETE',
      });

      if (!response.ok){
        throw new Error('Error al eliminar la tarea');
      }

      const remainingTasks= tasks.filter((task)=> id !== task.id);
      setTasks(remainingTasks);

    }catch (error) {
    console.error('Error:', error);
    setError('No se pudo eliminar la tarea');
    }
    
    console.log(id);

  }

  async function editTask(id: string, newName: string){

    try{
      const response = await fetch (`http://localhost:3000/api/tasks/${id}`,
        {
          method:'PUT',
          headers:{
            'Content-Type':'application/json',
          },
          body: JSON.stringify({
            name: newName
          }),
        });
        if(!response.ok){
          throw new Error ('Error al editar la tarea');
        }

        const updatedTask = await response.json();

        // Actualizar el estado local
        setTasks(prevTasks => 
          prevTasks.map(task => 
            task.id === id ? updatedTask : task
          )
        );


    }catch (error) {
    console.error('Error:', error);
    setError('No se pudo editar la tarea');
  }
   
  }


 const taskList = tasks
 .filter(FILTER_MAP[filter as keyof typeof FILTER_MAP])
 .map((task)=>(
 
    <Todo
       key={`${task.id}-${task.completed}`}
       id={task.id}
       name={task.name}
       completed={task.completed}
       toggleTaskCompleted={toggleTaskCompleted}
       deleteTask={deleteTask}
       editTask={editTask}
    />
  ));

  async function addTask(name:string){
    try{
      const response = await fetch('http://localhost:3000/api/tasks',{
        method: 'POST',
        headers:{
          'Content-Type':'application/json',
        },
        body: JSON.stringify({
          name,
          completed:false
        }),
      });

      if(!response.ok){
        throw new Error ('Error al añadir la tarea');
      }

      const newTask = await response.json();
      console.log('New Task:', newTask);
      setTasks([...tasks, newTask])
    }catch(error){
      console.error('Error: ', error);
      setError('No se pudo añadir la tarea');
    }
    // const newTask = {id: `todo-${nanoid()}`, name, completed: false};
    // setTasks([...tasks, newTask]);

  }

  const filterList = FILTER_NAMES.map((name) =>(

    <FilterButton 
      key={name} 
      name={name}
      isPressed = {name===filter}
      setFilter ={setFilter}
      />
  ));



 

  const tasksNoun = taskList.length !== 1 ? "tasks" : "task";
  const headingText = `${taskList.length} ${tasksNoun} remaining`;

  
  console.log("Datos", taskList);

  const prevTaskLength = usePrevious(tasks.length);

  useEffect(()=>{
    if(prevTaskLength !== undefined && tasks.length < prevTaskLength){
      listHeadingRef.current?.focus();
    }
  }, [tasks.length, prevTaskLength])

  // Mostrar estados de carga/error
  if (isLoading) {
    return <div className="loading">Cargando tareas...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
      <div className="todoapp stack-large">
         <h1>TodoMatic</h1>
          <Form  addTask={addTask}/>
         <div className="filters btn-group stack-exception">
          {filterList}
         </div>
         <h2 id="list-heading" tabIndex={-1} ref={listHeadingRef}>{headingText}</h2>
         <ul
          role="list"
          className="todo-list stack-large stack-exception"
          aria-labelledby="list-heading"
         >
          {taskList}
         </ul>
      </div>
  );
}
