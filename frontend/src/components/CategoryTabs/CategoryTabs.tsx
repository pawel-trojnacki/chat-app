import React, { FC, useState } from 'react';
import { AppBar, Tabs, Tab } from '@material-ui/core';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';

import { categories } from '../../constants/categories';

interface CategoryTabsProps {
  handleClick: (req: string | null) => void;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      width: '90vw',
      [theme.breakpoints.up('sm')]: {
        width: '70vw',
      },
      [theme.breakpoints.up('lg')]: {
        width: '76vw',
      },
      margin: '10px auto',
      backgroundColor: theme.palette.background.paper,
    },
    tabBar: {
      position: 'static',
      backgroundColor: '#fff',
    },
  })
);

function a11yProps(index: any) {
  return {
    id: `scrollable-auto-tab-${index}`,
    'aria-controls': `scrollable-auto-tabpanel-${index}`,
  };
}

const CategoryTabs: FC<CategoryTabsProps> = ({ handleClick }) => {
  const classes = useStyles();
  const [value, setValue] = useState(0);

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };

  return (
    <div className={classes.root}>
      <AppBar position="static" color="transparent">
        <Tabs
          value={value}
          indicatorColor="primary"
          textColor="primary"
          variant="scrollable"
          scrollButtons="on"
          onChange={handleChange}
          aria-label="Choose channels category"
        >
          {categories.map((category, id) => (
            <Tab
              key={category.name}
              label={category.name}
              {...a11yProps(id)}
              onClick={() => handleClick(category.req)}
            />
          ))}
        </Tabs>
      </AppBar>
    </div>
  );
};

export default CategoryTabs;
