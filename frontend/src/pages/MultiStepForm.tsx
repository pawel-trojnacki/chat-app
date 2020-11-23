import React, { FC, useState } from 'react';
import {
  Card,
  CardContent,
  Box,
  Button,
  Stepper,
  Step,
  StepLabel,
} from '@material-ui/core';
import { Formik, Form, Field, FormikConfig, FormikValues } from 'formik';
import { TextField, CheckboxWithLabel } from 'formik-material-ui';
import { object, mixed, number, string } from 'yup';

interface InitialValues {
  name: string;
  lastName: string;
  isMillionaire: boolean;
  money: number | null;
  details: string;
}

const MultiStepForm: FC<{}> = () => {
  const initialValues: InitialValues = {
    name: '',
    lastName: '',
    isMillionaire: false,
    money: 0,
    details: '',
  };
  return (
    <div className="MultiStepForm">
      <Box marginY={20} marginX={33}>
        <Card>
          <CardContent>
            <FormikStepper
              initialValues={initialValues}
              onSubmit={(values) => {
                console.log({ values });
              }}
            >
              <FormikStep label="Personal details">
                <Box paddingBottom={3}>
                  <Field
                    fullWidth
                    name="name"
                    component={TextField}
                    label="First name"
                  />
                </Box>
                <Box paddingBottom={3}>
                  <Field
                    fullWidth
                    name="lastName"
                    component={TextField}
                    label="Last name"
                  />
                </Box>
                <Box paddingBottom={3}>
                  <Field
                    name="isMillionaire"
                    type="checkbox"
                    component={CheckboxWithLabel}
                    Label={{ label: 'I am a millionaire' }}
                  />
                </Box>
              </FormikStep>
              <FormikStep
                label="Account"
                validationSchema={object({
                  money: mixed().when('isMillionaire', {
                    is: true,
                    then: number()
                      .required()
                      .min(1_000_000, 'You said you are a millionaire'),
                    otherwise: number().required('Required'),
                  }),
                })}
              >
                <Box paddingBottom={3}>
                  <Field
                    fullWidth
                    name="money"
                    type="number"
                    component={TextField}
                    label="All my money"
                  />
                </Box>
              </FormikStep>
              <FormikStep label="More details">
                <Box paddingBottom={3}>
                  <Field
                    fullWidth
                    name="details"
                    component={TextField}
                    label="Details"
                  />
                </Box>
              </FormikStep>
            </FormikStepper>
          </CardContent>
        </Card>
      </Box>
    </div>
  );
};

export default MultiStepForm;

export interface FormikStepProps
  extends Pick<FormikConfig<FormikValues>, 'children' | 'validationSchema'> {
  label: string;
}

export const FormikStep = ({ children }: FormikStepProps) => {
  return <>{children}</>;
};

export const FormikStepper = ({
  children,
  ...props
}: FormikConfig<FormikValues>) => {
  const childernArray = React.Children.toArray(children) as React.ReactElement<
    FormikStepProps
  >[];
  const [step, setStep] = useState(0);
  const currentChild = childernArray[step] as React.ReactElement<
    FormikStepProps
  >;
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
      <Form autoComplete="off">
        <Stepper alternativeLabel activeStep={step}>
          {childernArray.map((child) => (
            <Step key={child.props.label}>
              <StepLabel>{child.props.label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        {currentChild}
        <br />
        {step > 0 && (
          <Button
            variant="contained"
            color="secondary"
            onClick={() => setStep((prevStep) => prevStep - 1)}
          >
            Back
          </Button>
        )}
        <Button variant="contained" color="primary" type="submit">
          {isLastStep() ? 'Save' : 'Next'}
        </Button>
      </Form>
    </Formik>
  );
};
