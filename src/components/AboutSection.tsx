import React, { useState, useEffect, useRef } from 'react';
import { Compass, Handshake, GraduationCap, Globe, Heart, Lightbulb, Users, Rocket, Building, TrendingUp, Star, Trophy, Map, Play, Pause, RotateCcw, ChevronRight, Sparkles } from 'lucide-react';
import { soundManager } from '../services/soundManager';
import ParticleSystem from './ParticleSystem';

const AboutSection = () => {
  const [currentMode, setCurrentMode] = useState('explore');
  const [progress, setProgress] = useState(0);
  const [discoveredItems, setDiscoveredItems] = useState(new Set());
  const [currentStep, setCurrentStep] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);
  const [expandedValue, setExpandedValue] = useState(null);
  const [showParticles, setShowParticles] = useState({ active: false, x: 0, y: 0 });
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedStory, setSelectedStory] = useState(null);

  const values = [
    {
      id: 'belonging',
      icon: <Handshake className="h-6 w-6" />,
      title: "Belonging",
      description: "Rooted in shared history, open to every voice. A place where every alumnus feels welcomed and valued.",
      story: "In 1985, when Rashid first walked through CPSCS gates, he felt the warmth of belonging that would last decades...",
      color: "from-blue-500 to-purple-600",
      position: { x: 20, y: 45 },
      order: 0
    },
    {
      id: 'legacy',
      icon: <GraduationCap className="h-6 w-6" />,
      title: "Legacy",
      description: "Honoring the past by investing in the future. Building bridges between generations of scholars.",
      story: "The scholarship fund started with just 50 taka from the class of '92. Today, it supports 200+ students...",
      color: "from-emerald-500 to-blue-600",
      position: { x: 35, y: 25 },
      order: 1
    },
    {
      id: 'unity',
      icon: <Globe className="h-6 w-6" />,
      title: "Unity",
      description: "Diverse journeys, one community. Connecting hearts across continents and cultures.",
      story: "From Silicon Valley to rural Bangladesh, alumni unite every Pohela Boishakh in a virtual celebration...",
      color: "from-orange-500 to-red-600",
      position: { x: 50, y: 50 },
      order: 2
    },
    {
      id: 'integrity',
      icon: <Compass className="h-6 w-6" />,
      title: "Integrity",
      description: "Leading with truth, always. The moral compass that guides our actions and decisions.",
      story: "When corruption was rampant, CPSCS alumni led by example, forming the 'Truth Brigade' in their workplaces...",
      color: "from-teal-500 to-green-600",
      position: { x: 65, y: 30 },
      order: 3
    },
    {
      id: 'service',
      icon: <Heart className="h-6 w-6" />,
      title: "Service",
      description: "Giving back with heart and purpose. The cornerstone of our alumni commitment to society.",
      story: "During the 2020 floods, alumni organized relief efforts reaching 10,000 families within 48 hours...",
      color: "from-pink-500 to-rose-600",
      position: { x: 80, y: 60 },
      order: 4
    }
  ];

  const EnhancedInteractiveCanvas = () => {
    const [connections, setConnections] = useState([]);
    const canvasRef = useRef(null);

    const currentValue = values.find(v => v.order === currentStep);

    const handleValueClick = (value) => {
      if (value.order !== currentStep || gameComplete) return;

      // Play discovery sound
      soundManager.playDiscoveryChime(currentStep);

      // Show particles
      setShowParticles({
        active: true,
        x: (value.position.x / 100) * 600,
        y: (value.position.y / 100) * 288
      });

      // Expand the value
      setExpandedValue(value);

      // Add to discovered items
      const newDiscovered = new Set(discoveredItems);
      newDiscovered.add(value.id);
      setDiscoveredItems(newDiscovered);

      // Update connections
      if (currentStep > 0) {
        const prevValue = values.find(v => v.order === currentStep - 1);
        if (prevValue) {
          setConnections(prev => [...prev, { from: prevValue, to: value }]);
        }
      }

      // Update progress
      const newProgress = ((currentStep + 1) / values.length) * 100;
      setProgress(newProgress);

      // Move to next step or complete
      setTimeout(() => {
        if (currentStep === values.length - 1) {
          setGameComplete(true);
          soundManager.playCompletionFanfare();
        } else {
          setCurrentStep(currentStep + 1);
        }
        setExpandedValue(null);
        setShowParticles({ active: false, x: 0, y: 0 });
      }, 2500);
    };

    const resetGame = () => {
      setCurrentStep(0);
      setGameComplete(false);
      setDiscoveredItems(new Set());
      setConnections([]);
      setProgress(0);
      setExpandedValue(null);
    };

    return (
      <div className="relative w-full h-72 bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 rounded-2xl overflow-hidden">
        {/* Optimized animated background with fewer particles */}
        <div className="absolute inset-0">
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white/20 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `pulse ${2 + Math.random() * 3}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 4}s`
              }}
            />
          ))}
        </div>

        {/* Smooth connection lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {connections.map((connection, index) => (
            <line
              key={index}
              x1={`${connection.from.position.x}%`}
              y1={`${connection.from.position.y}%`}
              x2={`${connection.to.position.x}%`}
              y2={`${connection.to.position.y}%`}
              stroke="#FFD700"
              strokeWidth="2"
              opacity="0.8"
              strokeDasharray="4,2"
              style={{
                animation: 'dashMove 2s linear infinite'
              }}
            />
          ))}
        </svg>

        {/* Interactive nodes - no jumping animations */}
        {values.map((value) => {
          const isActive = value.order === currentStep && !gameComplete;
          const isDiscovered = discoveredItems.has(value.id);
          const isExpanded = expandedValue?.id === value.id;

          return (
            <div
              key={value.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-500 ease-in-out"
              style={{
                left: `${value.position.x}%`,
                top: `${value.position.y}%`,
                transform: `translate(-50%, -50%) scale(${isDiscovered ? 1.1 : isActive ? 1.05 : 0.85})`,
                zIndex: isExpanded ? 30 : isActive ? 20 : 10,
                willChange: 'transform'
              }}
              onClick={() => handleValueClick(value)}
            >
              <div className={`relative p-4 rounded-xl bg-gradient-to-r ${value.color} shadow-lg transition-all duration-300 ${
                isDiscovered ? 'ring-2 ring-yellow-400/50 shadow-yellow-400/25' : ''
              } ${
                isActive ? 'ring-2 ring-white/50 shadow-white/25 glow-pulse' : ''
              }`}>
                <div className="text-white">
                  {value.icon}
                </div>
                
                {/* Discovery indicator */}
                {isDiscovered && (
                  <div className="absolute -top-1 -right-1 bg-yellow-400 rounded-full p-1">
                    <Star className="h-3 w-3 text-yellow-800 fill-current" />
                  </div>
                )}

                {/* Active indicator - subtle glow instead of bounce */}
                {isActive && !isExpanded && (
                  <div className="absolute -top-2 -right-2">
                    <div className="bg-white/80 rounded-full p-1 animate-pulse">
                      <ChevronRight className="h-2 w-2 text-blue-600" />
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Fixed-position expanded content - doesn't affect icon positioning */}
        {expandedValue && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="bg-white/95 backdrop-blur-sm rounded-xl p-6 shadow-2xl max-w-sm mx-4 animate-fade-in">
              <h3 className="text-xl font-bold text-gray-800 mb-2">{expandedValue.title}</h3>
              <p className="text-gray-600 leading-relaxed mb-4">{expandedValue.description}</p>
              <div className="flex items-center gap-2 text-yellow-600">
                <Sparkles className="h-4 w-4" />
                <span className="text-sm font-semibold">+20 Explorer Points</span>
              </div>
            </div>
          </div>
        )}

        {/* Particle effects */}
        <ParticleSystem 
          active={showParticles.active}
          centerX={showParticles.x}
          centerY={showParticles.y}
          color="#FFD700"
        />

        {/* Simple game guidance */}
        {!gameComplete && currentValue && (
          <div className="absolute bottom-3 left-3 bg-black/70 text-white px-3 py-1 rounded-full text-sm flex items-center gap-2">
            <ChevronRight className="h-3 w-3" />
            Click the glowing <span className="font-semibold text-yellow-400">{currentValue.title}</span>
          </div>
        )}

        {/* Minimal progress indicator */}
        <div className="absolute bottom-3 right-3 bg-white/80 rounded-full px-3 py-1">
          <div className="flex items-center gap-2 text-gray-800">
            <div className="w-16 h-1 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 transition-all duration-1000 rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-xs font-semibold">{Math.round(progress)}%</span>
          </div>
        </div>

        {/* Simple completion overlay */}
        {gameComplete && (
          <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
            <div className="text-center text-white">
              <Trophy className="h-16 w-16 text-yellow-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                You're an Amazing Alumni!
              </h2>
              <button
                onClick={resetGame}
                className="mt-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-full hover:scale-105 transition-transform duration-300 flex items-center gap-2 mx-auto"
              >
                <RotateCcw className="h-4 w-4" />
                Play Again
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  const StoryMode = () => {
    const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
    const [isAutoPlay, setIsAutoPlay] = useState(false);

    useEffect(() => {
      if (isAutoPlay) {
        const interval = setInterval(() => {
          setCurrentStoryIndex((prev) => (prev + 1) % values.length);
        }, 5000);
        return () => clearInterval(interval);
      }
    }, [isAutoPlay]);

    const currentStory = values[currentStoryIndex];

    return (
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-8 text-white">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold">Alumni Stories</h3>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAutoPlay(!isAutoPlay)}
              className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
            >
              {isAutoPlay ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </button>
            <button
              onClick={() => setCurrentStoryIndex(0)}
              className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="flex items-start gap-6">
          <div className={`p-4 rounded-2xl bg-gradient-to-r ${currentStory.color} flex-shrink-0`}>
            {currentStory.icon}
          </div>
          
          <div className="flex-grow">
            <h4 className="text-xl font-semibold mb-2">{currentStory.title}</h4>
            <p className="text-white/80 mb-4">{currentStory.description}</p>
            <p className="text-white/70 leading-relaxed">{currentStory.story}</p>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 mt-6">
          {values.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentStoryIndex(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentStoryIndex ? 'bg-cpscs-gold scale-125' : 'bg-white/30 hover:bg-white/50'
              }`}
            />
          ))}
        </div>
      </div>
    );
  };

  const ChallengeMode = () => {
    const [currentChallenge, setCurrentChallenge] = useState(0);
    const [score, setScore] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);

    const challenges = [
      {
        question: "Which value best represents CPSCS alumni working together across continents?",
        options: ["Belonging", "Unity", "Service", "Legacy"],
        correct: 1,
        explanation: "Unity represents how diverse alumni journeys create one strong community!"
      },
      {
        question: "What drives alumni to give back to current students?",
        options: ["Recognition", "Service", "Competition", "Tradition"],
        correct: 1,
        explanation: "Service is about giving back with heart and purpose!"
      }
    ];

    const currentQ = challenges[currentChallenge];

    const handleAnswer = (index) => {
      setSelectedAnswer(index);
      if (index === currentQ.correct) {
        setScore(score + 10);
      }
      setTimeout(() => {
        if (currentChallenge < challenges.length - 1) {
          setCurrentChallenge(currentChallenge + 1);
          setSelectedAnswer(null);
        }
      }, 2000);
    };

    return (
      <div className="bg-gradient-to-br from-purple-800 to-pink-800 rounded-3xl p-8 text-white">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold">Values Challenge</h3>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-400" />
              <span className="font-semibold">{score} pts</span>
            </div>
            <div className="text-sm text-white/70">
              {currentChallenge + 1} / {challenges.length}
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h4 className="text-lg font-semibold mb-4">{currentQ.question}</h4>
          <div className="space-y-3">
            {currentQ.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(index)}
                disabled={selectedAnswer !== null}
                className={`w-full p-4 text-left rounded-xl transition-all duration-300 ${
                  selectedAnswer === null
                    ? 'bg-white/20 hover:bg-white/30'
                    : selectedAnswer === index
                    ? index === currentQ.correct
                      ? 'bg-green-500'
                      : 'bg-red-500'
                    : index === currentQ.correct
                    ? 'bg-green-500'
                    : 'bg-white/10'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {selectedAnswer !== null && (
          <div className="bg-black/30 rounded-xl p-4">
            <p className="text-white/90">{currentQ.explanation}</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 via-white to-cpscs-light/50 overflow-hidden">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Updated Header */}
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-cpscs-blue via-purple-600 to-cpscs-blue bg-clip-text text-transparent mb-4 leading-tight">
            Let's play a Game
          </h2>
          
          <p className="text-gray-700 text-xl font-light max-w-3xl mx-auto mb-8">
            Discover our values through this interactive game.
          </p>

          {/* Mode selector */}
          <div className="flex items-center justify-center gap-4 mb-8">
            {[
              { id: 'explore', label: 'Explore', icon: <Map className="h-4 w-4" /> },
              { id: 'story', label: 'Stories', icon: <Play className="h-4 w-4" /> },
              { id: 'challenge', label: 'Challenge', icon: <Trophy className="h-4 w-4" /> }
            ].map((mode) => (
              <button
                key={mode.id}
                onClick={() => setCurrentMode(mode.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-full transition-all duration-300 ${
                  currentMode === mode.id
                    ? 'bg-cpscs-blue text-white shadow-lg scale-105'
                    : 'bg-white/80 text-cpscs-blue hover:bg-white shadow-md'
                }`}
              >
                {mode.icon}
                {mode.label}
              </button>
            ))}
          </div>
        </div>

        {/* Interactive Content */}
        <div className="max-w-6xl mx-auto">
          {currentMode === 'explore' && (
            <div className="flex justify-center">
              <EnhancedInteractiveCanvas />
            </div>
          )}

          {currentMode === 'story' && <StoryMode />}
          {currentMode === 'challenge' && <ChallengeMode />}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
