/* eslint-disable react/no-array-index-key */
/* eslint-disable no-unused-vars */
/* eslint-disable no-param-reassign */
import React from 'react';
import { WithWizard } from 'react-albus';
import { Button } from 'reactstrap';

export default function BottomNavigation ({
  className,
  onClickPrev,
  prevLabel,
  onClickNext,
  nextLabel,
  enableNext
}) {

  return (
    <WithWizard
      render={({ next, previous, step, steps, push }) => (
        <div className={`wizard-buttons ${className} pt-3`}>
          <Button
            color="primary"
            className={`mr-1 ${steps.indexOf(step) <= 0 ? 'disabled' : ''}`}
            onClick={() => {
              onClickPrev(previous, steps, step, push);
            }}
          >
            {prevLabel}
          </Button>

          <Button
            color="primary"
            className={
              steps.indexOf(step) >= steps.length - 1 || !enableNext ? 'disabled' : ''
            }
            onClick={() => {
                enableNext && onClickNext(next, steps, step, push);
            }}
          >
            {nextLabel}
          </Button>
        </div>
      )}
    />
  );
};
