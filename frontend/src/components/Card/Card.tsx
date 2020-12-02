import React, { FC, ReactNode } from 'react';
import { Card as MaterialCard, Box } from '@material-ui/core';

const Card: FC<{ children: ReactNode; withoutPadding?: boolean }> = ({
  children,
  withoutPadding,
}) => {
  return (
    <MaterialCard>
      <Box paddingX={withoutPadding ? 0 : 4} paddingY={withoutPadding ? 0 : 5}>
        {children}
      </Box>
    </MaterialCard>
  );
};

export default Card;
