import React from 'react';
import { motion } from 'framer-motion';
import classes from './Four04.module.css'; // Import the CSS file
import {Link} from 'react-router-dom'
const animations = {
  initial: { opacity: 0, y: 100 },
  animate: { opacity: 1, y: 0 }
};

const Four04 = () => {
  return (
    <motion.div
      className={classes.container}
      initial="initial"
      animate="animate"
      variants={animations}
    >
      <h1 className={classes.errorc_ode}>404</h1>
      <p className={classes.error_message}>Page Not Found</p>
      <Link to="/" className={classes.home_link}>Go Back Home</Link>
    </motion.div>
  );
};

export default Four04;
