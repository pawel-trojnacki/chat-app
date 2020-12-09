import React, { FC, ReactNode } from 'react';
import { Card as MaterialCard, Box } from '@material-ui/core';
import { motion } from 'framer-motion';

const Card: FC<{ children: ReactNode; withoutPadding?: boolean }> = ({
  children,
  withoutPadding,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      style={{ paddingBottom: '30px' }}
    >
      <MaterialCard>
        <Box
          paddingX={withoutPadding ? 0 : 4}
          paddingY={withoutPadding ? 0 : 5}
        >
          {children}
        </Box>
      </MaterialCard>
    </motion.div>
  );
};

export default Card;
