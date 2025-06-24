//src/app/components/Form.tsx

'use client'

import { FormEvent, ChangeEvent } from 'react';
import { useState } from "react";


interface FormProps {
   addTask: (name: string, description: string, datetime:string) => void; // Función que recibe un string y no devuelve nada
}

export default function Form(props:FormProps){

    const [name, setName] = useState("");
    const [description, setDescription]=useState("");
    const [datetime, setDateTime]=useState("")

    function handleSubmit(event:FormEvent<HTMLFormElement>){
        event.preventDefault();
        props.addTask(name, description, datetime);
        setName("");
        setDescription("");
        setDateTime("");
    }

    //near the top of `For` component
    function handleChangeName(event: ChangeEvent<HTMLInputElement>) {
        setName(event.target.value)
    }
    function handleChangeDescription(event: ChangeEvent<HTMLTextAreaElement>) {
        setDescription(event.target.value)

    }
    function handleChangeDateTime(event: ChangeEvent<HTMLInputElement>) {

      // Validar que la fecha sea futura (opcional)
        const selectedDate = new Date(event.target.value);
        const now = new Date();
        
        if (selectedDate < now) {
          alert("Please select a future date");
          return;
        }
        
        setDateTime(event.target.value)

    }

    return (
    <form onSubmit={handleSubmit}>
      <h2 className="label-wrapper">
        <label htmlFor="new-todo-input" className="label__lg">
          What needs to be done?
        </label>
      </h2>
      <input
        type="text"
        id="new-todo-input"
        className="input input__lg"
        name="task_name"
        autoComplete="off"
        value={name}
        onChange={handleChangeName}
      />
      <h2 className="label-wrapper">
        <label htmlFor="detail-task" className="label__lg">
          specify what your task requires
        </label>
      </h2>
      <textarea
       id='detail-task'
       className='input inpit__lg'
       name="task_description"
       autoComplete='off'
       value={description}
       onChange={handleChangeDescription}
       ></textarea>

       <h2 className="label-wrapper">
        <label htmlFor="new-todo-input" className="label__lg">
          Date Task Limit
        </label>
      </h2>
      <input
        type="datetime-local"
        id="datetime-task"
        className="input input__lg"
        name="task_datetime"
        value={datetime}
        onChange={handleChangeDateTime}
      />

      <button type="submit" className="btn btn__primary btn__lg">
        Add
      </button>
    </form>
  );
}