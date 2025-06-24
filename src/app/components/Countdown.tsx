// src/app/components/Countdown.tsx
'use client'

import { useEffect, useState } from "react";

interface CountdownProps {
  deadline: string | null;
  taskId: string;
  taskName: string;
}

export default function Countdown({ deadline, taskId, taskName }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState<string>("");
  const [expired, setExpired] = useState<boolean>(false);

  useEffect(() => {
    if (!deadline) return;

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const target = new Date(deadline).getTime();
      const distance = target - now;

      if (distance < 0) {
        clearInterval(interval);
        setExpired(true);
        setTimeLeft("¡Tiempo agotado!");
        // Aquí podrías llamar a una API para enviar la notificación
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
    }, 1000);

    return () => clearInterval(interval);
  }, [deadline, taskId]);

  if (!deadline) return null;

  return (
    <div className={`mt-2 text-3xl ${expired ? 'text-red-500 font-bold' : 'text-gray-600'}`}>
      {expired ? (
        <span>{timeLeft}</span>
      ) : (
        <span>Tiempo restante para la tarea {taskName}: {timeLeft}</span>
      )}
    </div>
  );
}