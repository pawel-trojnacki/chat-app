import React, { FC, useState } from 'react';
import { Formik, Form, FormikConfig, FormikValues } from 'formik';
import {
  Button,
  Stepper,
  Step,
  StepLabel,
  Paper,
  Box,
  Typography,
} from '@material-ui/core';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { motion } from 'framer-motion';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: theme.spacing(3),
      margin: '10px auto',
      [theme.breakpoints.up('md')]: {
        padding: theme.spacing(5),
        maxWidth: '80%',
      },
      [theme.breakpoints.up('lg')]: {
        padding: theme.spacing(5),
        maxWidth: '70%',
      },
    },
    button: {
      marginLeft: theme.spacing(2),
    },
  })
);

interface FormikStepProps
  extends Pick<FormikConfig<FormikValues>, 'children' | 'validationSchema'> {
  label: string;
  helperText: string;
}

export const FormikStep: FC<FormikStepProps> = ({ children, helperText }) => {
  return (
    <Box marginY={4}>
      <Box textAlign="center" paddingTop={2} paddingBottom={4}>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Typography variant="h4" component="h2">
            {helperText}
          </Typography>
        </motion.div>
      </Box>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        {children}
      </motion.div>
    </Box>
  );
};

export const FormikStepper: FC<FormikConfig<FormikValues>> = ({
  children,
  ...props
}) => {
  const classes = useStyles();

  const childernArray = React.Children.toArray(
    children
  ) as React.ReactElement<FormikStepProps>[];
  const [step, setStep] = useState(0);
  const currentChild = childernArray[
    step
  ] as React.ReactElement<FormikStepProps>;
  const isLastStep = () => {
    return step === childernArray.length - 1;
  };

  return (
    <Formik
      {...props}
      validationSchema={currentChild.props.validationSchema}
      onSubmit={async (values, actions) => {
        if (isLastStep()) {
          await props.onSubmit(values, actions);
        } else {
          setStep((prevStep) => prevStep + 1);
        }
      }}
    >
      <Paper className={classes.root} data-testid="formik-stepper">
        <Form autoComplete="off">
          <Stepper alternativeLabel activeStep={step} data-testid="mui-stepper">
            {childernArray.map((child) => (
              <Step key={child.props.label}>
                <StepLabel>{child.props.label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          {currentChild}

          <Box textAlign="right">
            {step > 0 && (
              <Button
                className={classes.button}
                variant="contained"
                color="secondary"
                onClick={() => setStep((prevStep) => prevStep - 1)}
              >
                Back
              </Button>
            )}
            <Button
              className={classes.button}
              variant="contained"
              color="primary"
              type="submit"
              data-testid="channel-form-button"
            >
              {isLastStep() ? 'Save' : 'Next'}
            </Button>
          </Box>
        </Form>
      </Paper>
    </Formik>
  );
};
