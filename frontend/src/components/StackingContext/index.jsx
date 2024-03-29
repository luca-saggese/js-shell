import React from 'react';
import './style.css';

const StackingContext = (props = {}) => {
  const {
    className,
    children,
    ...propsRest
  } = props;

  return (
    <div
      {...propsRest}
      className={`zd-stacking-context ${className ? className : ''}`}
      id='desktopArea'
    >
      {
        children
      }
    </div>
  )
};

export default StackingContext;