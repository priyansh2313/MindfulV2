import React, { useEffect, useState } from "react";
import "../styles/FloatingLeaves.css";

const FloatingLeaves = () => {
  interface Leaf {
    id: number;
    left: number;
    delay: number;
    duration: number;
    size: number;
  }

  const [leaves, setLeaves] = useState<Leaf[]>([]);

  useEffect(() => {
    const newLeaves = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      left: Math.random() * 80, // %
      delay: Math.random() * 5,
      duration: 10 + Math.random() * 8,
      size: 20 + Math.random() * 30,
    }));
    setLeaves(newLeaves);
  }, []);

  return (
    <div className="leafContainer">
      {leaves.map((leaf) => (
        <div
          key={leaf.id}
          className="leaf"
          style={{
            left: `${leaf.left}%`,
            animationDelay: `${leaf.delay}s`,
            animationDuration: `${leaf.duration}s`,
            width: `${leaf.size}px`,
            height: `${leaf.size}px`,
          }}
        />
      ))}
    </div>
  );
};

export default FloatingLeaves;
