
import React from 'react';
import FlipCard from './FlipCard';
import { FlipCardProvider } from '../contexts/FlipCardContext';
import { statsConfig, getIconComponent } from '../data/statsData';

const InteractiveStatsSection = () => {
  return (
    <section className="py-16 bg-cpscs-light">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-cpscs-blue">
          Join Our Growing Community
        </h2>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          Discover the strength of our global CPSCS alumni network through these inspiring statistics
        </p>
        
        <FlipCardProvider maxFlippedCards={4}>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {statsConfig.map((stat, index) => {
              const IconComponent = getIconComponent(stat.iconName);
              
              return (
                <FlipCard
                  key={index}
                  cardIndex={index}
                  frontContent={{
                    value: stat.statNumber,
                    label: stat.subtitle,
                    icon: <IconComponent className="h-10 w-10" />
                  }}
                  backContent={{
                    description: stat.description
                  }}
                  autoFlipDelay={3000 + (index * 200)}
                  className="h-48 md:h-52"
                />
              );
            })}
          </div>
        </FlipCardProvider>
      </div>
    </section>
  );
};

export default InteractiveStatsSection;
