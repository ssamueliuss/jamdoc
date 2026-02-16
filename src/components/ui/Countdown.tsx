import React, { useEffect, useState } from 'react';

type CountdownProps = {
  deadline?: string | Date | null;
};

export const Countdown: React.FC<CountdownProps> = ({ deadline }) => {
  const [remaining, setRemaining] = useState(0);

  useEffect(() => {
    if (!deadline) return;
    const target = new Date(deadline).getTime();
    const tick = () => {
      const now = Date.now();
      setRemaining(Math.max(0, target - now));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [deadline]);

  if (!deadline) return null;

  if (remaining <= 0) return <span className="text-sm text-red-600">Finalizada</span>;

  const days = Math.floor(remaining / (1000 * 60 * 60 * 24));
  const hours = Math.floor((remaining / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((remaining / (1000 * 60)) % 60);
  const seconds = Math.floor((remaining / 1000) % 60);

  return (
    <span className="text-sm text-gray-700">{days}d {hours}h {minutes}m {seconds}s</span>
  );
};

export default Countdown;
