
import React from 'react';
import StarField from './stars/StarField';
import StarConnections from './stars/StarConnections';
import BackgroundGradient from './stars/BackgroundGradient';
import { useTwinklingLogic } from '../hooks/useTwinklingLogic';

const TwinklingStars = () => {
  const { stars, connections } = useTwinklingLogic();

  return (
    <div className="absolute inset-0 overflow-hidden">
      <BackgroundGradient />
      <StarField stars={stars} />
      <StarConnections stars={stars} connections={connections} />
    </div>
  );
};

export default TwinklingStars;
