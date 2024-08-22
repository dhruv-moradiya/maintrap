import { motion } from "framer-motion";

export default function FlowingShapes({ color, size, top, left, delay }) {
  return (
    <motion.div
      className={`absolute rounded-full ${color} ${size} opacity-20 blur-xl`}
      style={{ top, left }}
      animate={{
        y: ["0%", "100%", "0%"],
        x: ["0%", "100%", "0%"],
        rotate: [0, 360],
      }}
      transition={{
        duration: 5,
        repeat: Infinity,
        ease: "linear",
        delay,
      }}
      aria-hidden:true
    />
  );
}
