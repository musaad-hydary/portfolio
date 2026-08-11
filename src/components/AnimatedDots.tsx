import { useEffect, useState } from "react";

export default function AnimatedDots() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setCount((c) => (c + 1) % 4), 500);
    return () => clearInterval(id);
  }, []);
  return <span>{".".repeat(count)}</span>;
}
