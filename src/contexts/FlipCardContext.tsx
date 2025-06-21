
import React, { createContext, useContext, useState, useCallback } from 'react';

interface FlipCardContextType {
  flippedCards: Set<number>;
  canFlip: (cardIndex: number) => boolean;
  flipCard: (cardIndex: number) => void;
  unflipCard: (cardIndex: number) => void;
  maxFlippedCards: number;
}

const FlipCardContext = createContext<FlipCardContextType | undefined>(undefined);

export const useFlipCard = () => {
  const context = useContext(FlipCardContext);
  if (!context) {
    throw new Error('useFlipCard must be used within FlipCardProvider');
  }
  return context;
};

interface FlipCardProviderProps {
  children: React.ReactNode;
  maxFlippedCards?: number;
}

export const FlipCardProvider: React.FC<FlipCardProviderProps> = ({ 
  children, 
  maxFlippedCards = 4 
}) => {
  const [flippedCards, setFlippedCards] = useState<Set<number>>(new Set());

  const canFlip = useCallback((cardIndex: number) => {
    return flippedCards.size < maxFlippedCards || flippedCards.has(cardIndex);
  }, [flippedCards, maxFlippedCards]);

  const flipCard = useCallback((cardIndex: number) => {
    setFlippedCards(prev => {
      if (prev.has(cardIndex) || prev.size >= maxFlippedCards) {
        return prev;
      }
      const newSet = new Set(prev);
      newSet.add(cardIndex);
      return newSet;
    });
  }, [maxFlippedCards]);

  const unflipCard = useCallback((cardIndex: number) => {
    setFlippedCards(prev => {
      const newSet = new Set(prev);
      newSet.delete(cardIndex);
      return newSet;
    });
  }, []);

  return (
    <FlipCardContext.Provider value={{
      flippedCards,
      canFlip,
      flipCard,
      unflipCard,
      maxFlippedCards
    }}>
      {children}
    </FlipCardContext.Provider>
  );
};
