
import React, { useState, useEffect, useRef } from 'react';
import { Compass, Handshake, GraduationCap, Globe, Heart, Lightbulb, Users, Rocket, Building, TrendingUp, Star, Trophy, Map, Play, Pause, RotateCcw } from 'lucide-react';

const AboutSection = () => {
  const [currentMode, setCurrentMode] = useState('explore'); // explore, story, challenge
  const [progress, setProgress] = useState(0);
  const [discoveredItems, setDiscoveredItems] = useState(new Set());
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedStory, setSelectedStory] = useState(null);
  const canvasRef = useRef(null);

  const values = [
    {
      id: 'belonging',
      icon: <Handshake className="h-8 w-8" />,
      title: "Belonging",
      description: "Rooted in shared history, open to every voice.",
      story: "In 1985, when Rashid first walked through CPSCS gates, he felt the warmth of belonging that would last decades...",
      color: "from-blue-500 to-purple-600",
      position: { x: 20, y: 30 }
    },
    {
      id: 'legacy',
      icon: <GraduationCap className="h-8 w-8" />,
      title: "Legacy",
      description: "Honoring the past by investing in the future.",
      story: "The scholarship fund started with just 50 taka from the class of '92. Today, it supports 200+ students...",
      color: "from-emerald-500 to-blue-600",
      position: { x: 70, y: 20 }
    },
    {
      id: 'unity',
      icon: <Globe className="h-8 w-8" />,
      title: "Unity",
      description: "Diverse journeys, one community.",
      story: "From Silicon Valley to rural Bangladesh, alumni unite every Pohela Boishakh in a virtual celebration...",
      color: "from-orange-500 to-red-600",
      position: { x: 80, y: 70 }
    },
    {
      id: 'integrity',
      icon: <Compass className="h-8 w-8" />,
      title: "Integrity",
      description: "Leading with truth, always.",
      story: "When corruption was rampant, CPSCS alumni led by example, forming the 'Truth Brigade' in their workplaces...",
      color: "from-teal-500 to-green-600",
      position: { x: 30, y: 80 }
    },
    {
      id: 'service',
      icon: <Heart className="h-8 w-8" />,
      title: "Service",
      description: "Giving back with heart and purpose.",
      story: "During the 2020 floods, alumni organized relief efforts reaching 10,000 families within 48 hours...",
      color: "from-pink-500 to-rose-600",
      position: { x: 50, y: 50 }
    }
  ];

  const InteractiveCanvas = () => {
    const [hoveredItem, setHoveredItem] = useState(null);
    const [pulseAnimation, setPulseAnimation] = useState({});

    useEffect(() => {
      const interval = setInterval(() => {
        setPulseAnimation(prev => {
          const newPulse = {};
          values.forEach(value => {
            if (!discoveredItems.has(value.id)) {
              newPulse[value.id] = Math.random() > 0.7;
            }
          });
          return newPulse;
        });
      }, 2000);
      return () => clearInterval(interval);
    }, [discoveredItems]);

    const handleItemClick = (item) => {
      const newDiscovered = new Set(discoveredItems);
      newDiscovered.add(item.id);
      setDiscoveredItems(newDiscovered);
      setSelectedStory(item);
      setProgress((newDiscovered.size / values.length) * 100);
    };

    return (
      <div className="relative w-full h-96 bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 rounded-3xl overflow-hidden">
        {/* Animated background particles */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-white/20 rounded-full animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 4}s`,
                animationDuration: `${4 + Math.random() * 4}s`
              }}
            />
          ))}
        </div>

        {/* Interactive nodes */}
        {values.map((value, index) => (
          <div
            key={value.id}
            className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-500 ${
              pulseAnimation[value.id] ? 'animate-pulse' : ''
            } ${discoveredItems.has(value.id) ? 'scale-110' : 'hover:scale-125'}`}
            style={{
              left: `${value.position.x}%`,
              top: `${value.position.y}%`
            }}
            onClick={() => handleItemClick(value)}
            onMouseEnter={() => setHoveredItem(value.id)}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <div className={`relative p-4 rounded-2xl bg-gradient-to-r ${value.color} shadow-2xl ${
              discoveredItems.has(value.id) ? 'ring-4 ring-white/50' : ''
            }`}>
              <div className="text-white">
                {value.icon}
              </div>
              
              {hoveredItem === value.id && (
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-black/80 text-white text-sm rounded-lg whitespace-nowrap">
                  {value.title}
                </div>
              )}
              
              {discoveredItems.has(value.id) && (
                <div className="absolute -top-1 -right-1 bg-yellow-400 rounded-full p-1">
                  <Star className="h-3 w-3 text-yellow-800" />
                </div>
              )}
            </div>

            {/* Connection lines to center */}
            <svg className="absolute inset-0 pointer-events-none" style={{ width: '400px', height: '300px', left: '-200px', top: '-150px' }}>
              <line
                x1="200"
                y1="150"
                x2={value.position.x * 4}
                y2={value.position.y * 3}
                stroke="rgba(255,255,255,0.2)"
                strokeWidth="1"
                className={`transition-opacity duration-500 ${hoveredItem === value.id ? 'opacity-60' : 'opacity-20'}`}
              />
            </svg>
          </div>
        ))}

        {/* Center hub */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="w-16 h-16 bg-gradient-to-r from-cpscs-gold to-yellow-400 rounded-full flex items-center justify-center shadow-2xl">
            <span className="text-cpscs-blue font-bold text-sm">CPSCS</span>
          </div>
        </div>

        {/* Progress indicator */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className="bg-white/20 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-cpscs-gold to-yellow-400 h-2 rounded-full transition-all duration-1000"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-white/80 text-xs mt-1">Discovery Progress: {Math.round(progress)}%</p>
        </div>
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

        {/* Story navigation */}
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
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-cpscs-blue via-purple-600 to-cpscs-blue bg-clip-text text-transparent mb-8 leading-tight">
            CPSCS Alumni Universe
          </h2>
          
          <p className="text-gray-700 text-xl font-light max-w-4xl mx-auto mb-8">
            Explore our vibrant community through interactive stories, challenges, and discoveries. 
            Every click reveals new connections, every interaction builds understanding.
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
            <div className="grid lg:grid-cols-2 gap-8 items-start">
              <div>
                <InteractiveCanvas />
              </div>
              <div className="space-y-6">
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl">
                  <h3 className="text-2xl font-bold text-cpscs-blue mb-4">Discover Our Values</h3>
                  <p className="text-gray-600 mb-4">
                    Click on the glowing nodes to unlock stories and achievements. 
                    Each discovery brings you closer to understanding what makes CPSCS special.
                  </p>
                  <div className="text-sm text-gray-500">
                    💡 Tip: Watch for pulsing nodes - they have special stories waiting!
                  </div>
                </div>

                {selectedStory && (
                  <div className="bg-gradient-to-r from-white to-cpscs-light/50 rounded-3xl p-8 shadow-xl animate-fade-in">
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-xl bg-gradient-to-r ${selectedStory.color} text-white flex-shrink-0`}>
                        {selectedStory.icon}
                      </div>
                      <div>
                        <h4 className="text-xl font-bold text-cpscs-blue mb-2">{selectedStory.title}</h4>
                        <p className="text-gray-600 mb-3">{selectedStory.description}</p>
                        <p className="text-gray-700 leading-relaxed">{selectedStory.story}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {currentMode === 'story' && <StoryMode />}
          {currentMode === 'challenge' && <ChallengeMode />}
        </div>

        {/* Achievement indicators */}
        {discoveredItems.size > 0 && (
          <div className="mt-12 text-center">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-cpscs-gold to-yellow-400 text-cpscs-blue px-6 py-3 rounded-full font-semibold shadow-lg">
              <Trophy className="h-5 w-5" />
              You've discovered {discoveredItems.size} / {values.length} values!
              {discoveredItems.size === values.length && " 🎉 Master Explorer!"}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default AboutSection;
