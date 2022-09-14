import React from 'react';
import {Stepper, Step, StepLabel} from '@mui/material';
const Checkout = ({activeStep = 0}) => {
  return (
    <Stepper activeStep={activeStep} alternativeLabel>
      {
        ['Login', 'Shipping Address', 'Payment Method', 'Place Order'].map((step) => (
            <Step key={step}>
                <StepLabel>
                    {step}
                </StepLabel>
            </Step>
        ))
      }
    </Stepper>
  )
}

export default Checkout
