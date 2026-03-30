"use client";
import React from "react";
import { motion } from "framer-motion";

interface BlurTextProps {
  text: string;
  delay?: number;
  className?: string;
  as?: React.ElementType;
}

export function BlurText({ text, delay = 0, className = "", as: Tag = "h1" }: BlurTextProps) {
  const words = text.split(" ");
  const MotionTag = motion(Tag as any);

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: delay },
    },
  };

  const child = {
    visible: {
      opacity: [0, 0.5, 1],
      y: [50, -5, 0],
      filter: ["blur(10px)", "blur(5px)", "blur(0px)"],
      transition: {
        duration: 0.35,
        ease: "easeOut"
      },
    },
    hidden: {
      opacity: 0,
      y: 50,
      filter: "blur(10px)",
    },
  };

  return (
    <MotionTag
      className={className}
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
    >
      {words.map((word, index) => (
        <motion.span
          variants={child}
          style={{ display: "inline-block", marginRight: "0.25em" }}
          key={index}
        >
          {word}
        </motion.span>
      ))}
    </MotionTag>
  );
}
