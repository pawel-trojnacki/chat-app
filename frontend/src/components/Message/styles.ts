import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      marginTop: theme.spacing(4),
    },
    rootGrid: {
      flexWrap: 'nowrap',
    },
    gridContainer: {
      alignItems: 'flex-end',
    },
    gridItem: {
      paddingRight: '10px',
    },
    date: {
      paddingBottom: '1px',
    },
    grey: {
      color: theme.palette.grey[600],
    },
  })
);
