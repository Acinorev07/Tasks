//src/app/api/tasks/route.ts

import { db } from "@/lib/firebase";
import {collection, getDocs, addDoc} from "firebase/firestore"
import { NextResponse } from "next/server";


export async function GET() {
  try {
    
    const querySnapshot = await getDocs(collection(db, "tasks"));
    const tasks = querySnapshot.docs.map(doc=>({
      id: doc.id,
      ...doc.data()
    }));

    return NextResponse.json(tasks);

  } catch (error) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json(
      {error: "Error al obtener tareas"},
      {status: 500}
    );
  }
  // return Response.json(DATA);
}

export async function POST(request: Request) {
  try {
    // Parsear el cuerpo de la petición
    const { name, completed=false }= await request.json();
    
    // Validar los datos recibidos
    if (!name) {
      return NextResponse.json(
        {error:"Name is required"},
        {status:400}
      );
    }

    // Crear nueva tarea
    const docRef = await addDoc(collection(db, "tasks"),{
      name,
      completed,
      createdAt: new Date()
    })

    // Devolver respuesta exitosa
    return NextResponse.json(
      {id: docRef.id, name, completed},
      {status:201}
    );

  } catch (error) {
    console.error('Error fetching tasks:', error);
    // Manejo de errores
     return NextResponse.json(
      { error: "Error al crear tarea" },
      { status: 500 }
    );
  }
}

