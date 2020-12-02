import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    linkElement: {
      textTransform: 'none',
      textDecoration: 'none',
      color: theme.palette.text.primary,
      display: 'flex',
      alignItems: 'center',
    },
    icon: {
      color: theme.palette.text.primary,
    },
    subtitle: {
      textAlign: 'center',
      margin: '20px auto',
    },
    channelTitle: {
      textAlign: 'center',
      width: '100%',
    },
  })
);
