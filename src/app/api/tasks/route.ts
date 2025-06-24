//src/app/api/tasks/route.ts

import { db } from "@/lib/firebase";
import {collection, getDocs, addDoc, serverTimestamp} from "firebase/firestore"
import { NextResponse } from "next/server";


export async function GET() {
  try {
    
    const querySnapshot = await getDocs(collection(db, "tasks"));
    const tasks = querySnapshot.docs.map(doc=>{
      
      const data= doc.data();
      return {
        id: doc.id,
        name: data.name,
        description: data.description,
        completed: data.completed,
        // Convertir Timestamp de Firestore a string ISO
        datetime: data.datetime?.toDate().toISOString() || null,
        createdAt: data.createdAt?.toDate().toISOString()
      };

    });

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
    const { name, description, datetime, completed=false }= await request.json();
    
    // Validar los datos recibidos
    if (!name && !description) {
      return NextResponse.json(
        {error:"Name is required"},
        {status:400}
      );
    }

    // Convertir el string datetime a un objeto Date de Firebase
    const taskDatetime = datetime ? new Date(datetime) : null;

    // Crear nueva tarea
    const docRef = await addDoc(collection(db, "tasks"),{
      name,
      description,
      datetime: taskDatetime,
      completed,
      createdAt: serverTimestamp()
    })

    // Devolver respuesta exitosa
    return NextResponse.json({
        id: docRef.id, 
        name, 
        description, 
        datetime:taskDatetime?.toISOString(), // Devuelve como string ISO
        completed},
      {status:201}
    );

  } catch (error) {
    console.error('Error fetching tasks:', error);
    // Manejo de errores
     return NextResponse.json(
      { error:  `Error al crear tarea: ${error instanceof Error ? error.message : String(error)}`  },
      { status: 500 }
    );
  }
}

