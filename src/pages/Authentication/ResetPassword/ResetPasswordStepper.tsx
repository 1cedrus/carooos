import { Step, StepLabel, Stepper, StepIconProps } from '@mui/material';
import { Check } from '@mui/icons-material';
import styled from '@emotion/styled';
import { Props } from '@/types.ts';

export enum ResetPasswordSteps {
  EnterEmail,
  VerifyEmail,
  ResetPassword,
}

const STEPS = {
  [ResetPasswordSteps.EnterEmail]: 'Enter Email',
  [ResetPasswordSteps.VerifyEmail]: 'Verify Email',
  [ResetPasswordSteps.ResetPassword]: 'Reset Password',
};

const QontoStepIconRoot = styled('div')<{ ownerState: { active?: boolean } }>(({ ownerState }) => ({
  color: '#eaeaf0',
  display: 'flex',
  height: 22,
  alignItems: 'center',
  ...(ownerState.active && {
    color: '#000',
  }),
  '& .QontoStepIcon-completedIcon': {
    color: '#000',
    zIndex: 1,
    fontSize: 18,
  },
  '& .QontoStepIcon-circle': {
    width: 8,
    height: 8,
    borderRadius: '50%',
    backgroundColor: 'currentColor',
  },
}));

function QontoStepIcon(props: StepIconProps) {
  const { active, completed, className } = props;

  return (
    <QontoStepIconRoot ownerState={{ active }} className={className}>
      {completed ? <Check className='QontoStepIcon-completedIcon' /> : <div className='QontoStepIcon-circle' />}
    </QontoStepIconRoot>
  );
}

interface ResetPasswordStepperProps extends Props {
  activeStep: number;
}

export default function ResetPasswordStepper({ activeStep }: ResetPasswordStepperProps) {
  return (
    <Stepper alternativeLabel activeStep={activeStep}>
      {Object.entries(STEPS).map(([_, label]) => (
        <Step key={label}>
          <StepLabel StepIconComponent={QontoStepIcon}>{label}</StepLabel>
        </Step>
      ))}
    </Stepper>
  );
}
