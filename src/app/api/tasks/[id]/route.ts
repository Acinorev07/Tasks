import { DATA } from "@/app/api/data";
import { NextResponse } from "next/server";

export async function PUT(request: Request,  {params}:{params:{id:string}}){
  try{

    const {id}=params;
    const {completed, name} = await request.json();

    //Encontrar y actualizar la tarea (en un caso real, usarias una base de datos)
    const taskIndex = DATA.findIndex(task => task.id === id);

    if(taskIndex === -1){
      return new Response(JSON.stringify({error: "Task not found"}),{
        status: 404,
        headers: {
          "Content-Type":"application/json",
        },
      });
    }
    //Actualizar solo los campos proporcionados
    if(completed !== undefined){

        DATA[taskIndex].completed = completed;
    }

    if(name !== undefined){
        DATA[taskIndex].name =name;
    }
    
    return new Response(JSON.stringify(DATA[taskIndex]),{
      status:200,
      headers:{
        "Content-Type":"application/json",
      },
    });
  }catch(error){
    return new Response(JSON.stringify({error:"Invalid request"}),{
      status:400,
      headers: {
        "Content-Type":"application/json",
      },
    });
  }
}


export async function DELETE(request:Request, {params}:{params:{id:string}}){

    try{
    const {id}= params;

    //Encontrar la tarea a eliminar
    const taskIndex = DATA.findIndex(task => task.id === id);

     if (taskIndex === -1) {
      return NextResponse.json(
        { error: "Task not found" },
        { status: 404 }
      );
    }

     // Eliminar la tarea y guardar cambios
    const deletedTask = DATA.splice(taskIndex, 1)[0];

     // Devolver solo la tarea eliminada (o mensaje de éxito)
    return NextResponse.json(
      { message: "Task deleted successfully", task: deletedTask },
      { status: 200 }
    );
     }catch(error){
         return NextResponse.json(
      { error: "Invalid request" },
      { status: 400 }
    );
    }

}