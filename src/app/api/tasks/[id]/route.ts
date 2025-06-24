//src/app/api/tasks/[id]/route.ts

import { db } from "@/lib/firebase"
import {doc, updateDoc, deleteDoc, getDoc} from "firebase/firestore"
import { NextResponse } from "next/server";



export async function PUT(request: Request){
  try{

    const url = new URL(request.url);
    const id = url.pathname.split("/").pop();
    const {completed, name, description} = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: "ID is required" },
        { status: 400 }
      );
    }

    //Encontrar y actualizar la tarea (en un caso real, usarias una base de datos)
    const taskRef = doc(db, "tasks", id);
    
    const updateData: { [key: string]: unknown, updatedAt: Date } = {
  updatedAt: new Date()
};
   
    // Actualiza solo los campos proporcionados
    if (completed !== undefined) updateData.completed = completed;
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;

    await updateDoc(taskRef, updateData);
    
    // Obtener y devolver el documento completo actualizado
    const updatedDoc = await getDoc(taskRef);
    if (!updatedDoc.exists()) {
      return NextResponse.json(
        { error: "Task not found after update" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      id: updatedDoc.id,
      ...updatedDoc.data()
    }, { status: 200 });
   
  }catch(error){
    console.error('Error fetching tasks:', error);
    return NextResponse.json(
      { error: "Error al actualizar tarea" },
      { status: 500 }
    );
  }
}


export async function DELETE(request: Request) {
    try {
        const url = new URL(request.url);
        const pathSegments = url.pathname.split("/");
        const id = pathSegments[pathSegments.length - 1] as string; // Forzamos el tipo

        if (!id) {
            return NextResponse.json(
                { error: "ID is required" },
                { status: 400 }
            );
        }

        await deleteDoc(doc(db, "tasks", id));
        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        console.error('Error deleting task:', error);
        return NextResponse.json(
            { error: "Error al eliminar tarea" },
            { status: 500 }
        );
    }
}