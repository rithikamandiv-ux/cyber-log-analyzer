import { motion } from "framer-motion";
import type { Variants } from "framer-motion";

interface AnimatedTextProps {
  text: string;
  className?: string;
  /** Delay before the animation starts, in seconds */
  delay?: number;
  /** Duration of each character animation, in seconds */
  charDuration?: number;
  /** Delay between each character animation, in seconds */
  stagger?: number;
}

export const AnimatedText = ({
  text,
  className = "",
  delay = 0,
  charDuration = 0.4,
  stagger = 0.03,
}: AnimatedTextProps) => {
  const words = text.split(" ");

  const containerVariants: Variants = {
    hidden: {
      opacity: 0,
    },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: stagger,
        delayChildren: delay,
      },
    },
  };

  const characterVariants: Variants = {
    hidden: {
      opacity: 0,
      y: 20,
      filter: "blur(8px)",
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration: charDuration,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  return (
    <motion.div
      className={`flex flex-wrap gap-x-3 ${className}`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      aria-label={text}
      role="heading"
    >
      {words.map((word, wordIndex) => (
        <span
          key={`${word}-${wordIndex}`}
          className="inline-flex whitespace-nowrap"
          aria-hidden="true"
        >
          {word.split("").map((character, characterIndex) => (
            <motion.span
              key={`${wordIndex}-${characterIndex}-${character}`}
              variants={characterVariants}
              className="inline-block"
            >
              {character}
            </motion.span>
          ))}
        </span>
      ))}
    </motion.div>
  );
};