
import React, { useState, useEffect, useRef } from 'react';
import { Compass, Handshake, GraduationCap, Globe, Heart, Lightbulb, Users, Rocket, Building, TrendingUp, Star, Trophy, Map, Play, Pause, RotateCcw, ChevronRight, Sparkles } from 'lucide-react';
import { soundManager } from '../services/soundManager';
import ParticleSystem from './ParticleSystem';

const AboutSection = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [discoveredItems, setDiscoveredItems] = useState(new Set());
  const [gameComplete, setGameComplete] = useState(false);
  const [expandedValue, setExpandedValue] = useState(null);
  const [showParticles, setShowParticles] = useState({ active: false, x: 0, y: 0 });

  const values = [
    {
      id: 'belonging',
      icon: <Handshake className="h-6 w-6" />,
      title: "Belonging",
      description: "Rooted in shared history, open to every voice. A place where every alumnus feels welcomed and valued.",
      color: "from-blue-500 to-purple-600",
      position: { x: 20, y: 45 },
      order: 0
    },
    {
      id: 'legacy',
      icon: <GraduationCap className="h-6 w-6" />,
      title: "Legacy",
      description: "Honoring the past by investing in the future. Building bridges between generations of scholars.",
      color: "from-emerald-500 to-blue-600",
      position: { x: 35, y: 25 },
      order: 1
    },
    {
      id: 'unity',
      icon: <Globe className="h-6 w-6" />,
      title: "Unity",
      description: "Diverse journeys, one community. Connecting hearts across continents and cultures.",
      color: "from-orange-500 to-red-600",
      position: { x: 50, y: 50 },
      order: 2
    },
    {
      id: 'integrity',
      icon: <Compass className="h-6 w-6" />,
      title: "Integrity",
      description: "Leading with truth, always. The moral compass that guides our actions and decisions.",
      color: "from-teal-500 to-green-600",
      position: { x: 65, y: 30 },
      order: 3
    },
    {
      id: 'service',
      icon: <Heart className="h-6 w-6" />,
      title: "Service",
      description: "Giving back with heart and purpose. The cornerstone of our alumni commitment to society.",
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
        {/* Enhanced animated star background */}
        <div className="absolute inset-0">
          {/* Main stars representing alumni */}
          {[...Array(50)].map((_, i) => (
            <div
              key={`star-${i}`}
              className="absolute w-1 h-1 bg-white rounded-full alumni-star"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `starTwinkle ${2 + Math.random() * 4}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 6}s`,
                opacity: 0.3 + Math.random() * 0.7,
                transform: `scale(${0.5 + Math.random() * 1.5})`
              }}
            />
          ))}

          {/* Connecting lines between stars */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
            {[...Array(15)].map((_, i) => {
              const x1 = Math.random() * 100;
              const y1 = Math.random() * 100;
              const x2 = Math.random() * 100;
              const y2 = Math.random() * 100;
              return (
                <line
                  key={`connection-${i}`}
                  x1={`${x1}%`}
                  y1={`${y1}%`}
                  x2={`${x2}%`}
                  y2={`${y2}%`}
                  stroke="#ffffff"
                  strokeWidth="0.5"
                  strokeDasharray="2,4"
                  className="alumni-connection"
                  style={{
                    animation: `connectionPulse ${4 + Math.random() * 4}s ease-in-out infinite`,
                    animationDelay: `${Math.random() * 8}s`
                  }}
                />
              );
            })}
          </svg>
        </div>

        {/* Game connection lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
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

        {/* Interactive nodes */}
        {values.map((value) => {
          const isActive = value.order === currentStep && !gameComplete;
          const isDiscovered = discoveredItems.has(value.id);

          return (
            <div
              key={value.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-500 ease-in-out z-20"
              style={{
                left: `${value.position.x}%`,
                top: `${value.position.y}%`,
                transform: `translate(-50%, -50%) scale(${isDiscovered ? 1.1 : isActive ? 1.05 : 0.85})`
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

                {/* Active indicator */}
                {isActive && (
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

        {/* Fixed-position expanded content with higher z-index */}
        {expandedValue && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
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

        {/* Game guidance */}
        {!gameComplete && currentValue && (
          <div className="absolute bottom-3 left-3 bg-black/70 text-white px-3 py-1 rounded-full text-sm flex items-center gap-2 z-30">
            <ChevronRight className="h-3 w-3" />
            Click the glowing <span className="font-semibold text-yellow-400">{currentValue.title}</span>
          </div>
        )}

        {/* Progress indicator */}
        <div className="absolute bottom-3 right-3 bg-white/80 rounded-full px-3 py-1 z-30">
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

        {/* Completion overlay */}
        {gameComplete && (
          <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-40">
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

  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 via-white to-cpscs-light/50 overflow-hidden">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Main Alumni Association Section */}
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-cpscs-blue via-purple-600 to-cpscs-blue bg-clip-text text-transparent mb-6 leading-tight">
            Our Alumni Association
          </h2>
          
          <div className="max-w-4xl mx-auto text-gray-700 text-lg leading-relaxed space-y-4">
            <p>
              The CPSCS Alumni Association is a vibrant and growing community of graduates from Cantonment Public School and College, Saidpur. Founded to foster lifelong connections, our association serves as a bridge between generations—celebrating achievements, supporting professional growth, and giving back to the school that shaped us.
            </p>
            <p>
              Whether you're reconnecting with old friends, mentoring the next generation, or contributing to school initiatives, the alumni association is your home base for all things CPSCS. Together, we preserve legacy, inspire impact, and build a future of shared excellence.
            </p>
          </div>
        </div>

        {/* Game Section */}
        <div className="text-center mb-12">
          <h3 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cpscs-blue via-purple-600 to-cpscs-blue bg-clip-text text-transparent mb-4 leading-tight">
            Let's play a Game
          </h3>
          
          <p className="text-gray-700 text-xl font-light max-w-2xl mx-auto">
            Discover our values through this fun little game.
          </p>
        </div>

        {/* Interactive Game */}
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-center">
            <EnhancedInteractiveCanvas />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
