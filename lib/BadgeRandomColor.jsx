'use client';
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";

const colors = [
  "#EF4444", // Merah
  "#3B82F6", // Biru
  "#10B981", // Hijau
  "#F59E0B", // Kuning
  "#8B5CF6", // Ungu
  "#EC4899", // Pink
  "#6366F1", // Indigo
  "#14B8A6", // Teal
];

const BadgeRandomColor = ({ text = "Badge" }) => {
  const [randomColor, setRandomColor] = useState("");

  useEffect(() => {
    const getRandomColor = () =>
      colors[Math.floor(Math.random() * colors.length)];
    setRandomColor(getRandomColor());
  }, []);

  return (
    <Badge style={{ backgroundColor: randomColor, color: "white" }}>
      {text}
    </Badge>
  );
};

export default BadgeRandomColor;
