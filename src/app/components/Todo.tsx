//src/app/components/Todo.tsx

import { useState, useRef, useEffect } from "react";
import Countdown from "./Countdown";

interface TodoProps {
  name: string;
  description: string;
  completed: boolean;
  datetime: string | null;
  id: string;
  toggleTaskCompleted:(id:string) => void;
  deleteTask:(id:string)=>void;
  editTask:(id:string, newName?:string, newDescription?:string)=>void;
  

}

function usePrevious<T>(value:T): T | undefined {
  const ref = useRef<T | undefined>(undefined);
  useEffect(()=>{
    ref.current = value;
  });
  return ref.current;
}

export default function Todo(props: TodoProps){
    const [isEditing, setEditing] = useState(false);
    const [newName, setNewName] = useState(props.name);
    const [newDescription, setNewDescription] = useState(props.description);

    const editFieldRef = useRef<HTMLInputElement>(null);
    const editButtonRef = useRef<HTMLButtonElement>(null);

    const wasEditing = usePrevious(isEditing);

    function handleChangeName(e: React.ChangeEvent<HTMLInputElement>){
      setNewName(e.target.value)
    }
    function handleChangeDescription(e: React.ChangeEvent<HTMLTextAreaElement>){
      setNewDescription(e.target.value)
    }

    console.log("todo datetime",props.datetime);

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
      e.preventDefault();
      props.editTask(
         props.id,
         newName !== props.name ? newName : undefined, 
         newDescription !== props.description ? newDescription : undefined
        );
      // props.editDescription(props.id, newDescription);
      // setNewName("");
      // setNewDescription("");
      setEditing(false);
    }

    const editingTemplate = (
      <form className="stack-small" onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="todo-label" htmlFor={props.id}>
            New name for {props.name}
          </label>
          <input 
           id={props.id} 
           className="todo-text" 
           type="text" 
           value={newName}
           onChange ={handleChangeName}
           ref={editFieldRef}
          />
          <h2 className="label-wrapper">
            <label htmlFor="detail-task" className="label__lg">
              new Description
            </label>
          </h2>
          <textarea
          id={props.id}
          className='todo-text'
          value={newDescription}
          onChange={handleChangeDescription}
          ></textarea>
        </div>
        <div className="btn-group">
          <button 
            type="button" 
            className="btn todo-cancel"
            onClick={()=> setEditing(false)}
          >
            Cancel
            <span className="visually-hidden">renaming {props.name}</span>
          </button>
          <button type="submit" className="btn btn__primary todo-edit">
            Save
            <span className="visually-hidden">new name for {props.name}</span>
          </button>
        </div>
      </form>
    );
    const viewTemplate = (
      <div className="stack-small">
        <div className="c-cb">
          <input
            id={props.id}
            type="checkbox"
            defaultChecked={props.completed}
            onChange={() => props.toggleTaskCompleted(props.id)}
          />
          <label className="todo-label" htmlFor={props.id}>
            {props.name}
          </label>
           <div className="ml-[20px]">
              {props.datetime && (
                <span>
                  Fecha límite: {new Date(props.datetime).toLocaleDateString()} {new Date(props.datetime).toLocaleTimeString()}
                </span>
              )}
            </div>
        </div>
       
        <div className="text-5xl font-bold">
          {/* ... otros elementos ... */}
          <Countdown 
            deadline={props.datetime} 
            taskId={props.id}
            taskName={props.name}
          />
          {/* ... otros elementos ... */}
        </div>
        
        <div className={`mt-5 ${props.description ? 'border-2 border-[#000]' :'hidden'} `}>
            {props.description}
          </div>
        <div className="btn-group">
          <button 
            type="button" 
            className="btn"
            onClick={()=> setEditing(true)}
            ref={editButtonRef}
          >
            Edit <span className="visually-hidden">{props.name}</span>
          </button>
          <button
            type="button"
            className="btn btn__danger"
            onClick={() => props.deleteTask(props.id)}>
            Delete <span className="visually-hidden">{props.name}</span>
          </button>
        </div>
      </div>
    );

    useEffect(()=>{
      if(!wasEditing && isEditing){
        editFieldRef.current?.focus();
      }else if(wasEditing && !isEditing){
        editButtonRef.current?.focus();
      }
    },[wasEditing, isEditing]);
    

    return <li className="todo">{isEditing ? editingTemplate : viewTemplate}</li>
}