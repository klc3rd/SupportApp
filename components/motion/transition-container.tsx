/****************************************************************
 * This container provides an animation to any component
 * that it is wrapped around
 ****************************************************************/

import { motion } from "framer-motion";

interface iMotionContainer {
  children: React.ReactElement;
}

const TransitionContainer: React.FC<iMotionContainer> = (props) => {
  const { children } = props;

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {
          opacity: 0,
        },
        visible: {
          opacity: 1,
          transition: {
            delay: 0.2,
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
};

export default TransitionContainer;
