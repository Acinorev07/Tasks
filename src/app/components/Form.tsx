//src/app/components/Form.tsx

'use client'

import { FormEvent, ChangeEvent } from 'react';
import { useState } from "react";


interface FormProps {
   addTask: (name: string) => void; // Función que recibe un string y no devuelve nada
}

export default function Form(props:FormProps){

    const [name, setName] = useState("");

    function handleSubmit(event:FormEvent<HTMLFormElement>){
        event.preventDefault();
        props.addTask(name);
        setName("");
    }

    //near the top of `For` component
    function handleChange(event: ChangeEvent<HTMLInputElement>) {
        setName(event.target.value)
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
        name="text"
        autoComplete="off"
        value={name}
        onChange={handleChange}
      />
      <button type="submit" className="btn btn__primary btn__lg">
        Add
      </button>
    </form>
  );
}