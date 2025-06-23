import { DATA } from "@/app/api/data";
import { nanoid } from "nanoid";

interface Task {
  id: string;
  name: string;
  completed: boolean;
}

export async function GET() {
  return Response.json(DATA);
}

export async function POST(request: Request) {
  try {
    // Parsear el cuerpo de la petición
    const { name, completed }: Partial<Task> = await request.json();
    
    // Validar los datos recibidos
    if (!name || typeof completed !== 'boolean') {
      return new Response(JSON.stringify({ error: "Invalid task data" }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    // Crear nueva tarea
    const newTask: Task = {
      id: `todo-${nanoid()}`,
      name,
      completed,
    };

    // Agregar a DATA (en un caso real usarías una base de datos)
    DATA.push(newTask);

    // Devolver respuesta exitosa
    return new Response(JSON.stringify(newTask), {
      status: 201, // 201 Created es más apropiado para POST exitosos
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    // Manejo de errores
    return new Response(JSON.stringify({ error: "Invalid JSON format" }), {
      status: 400,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}

