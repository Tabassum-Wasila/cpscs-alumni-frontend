
import React, { useState, useEffect } from 'react';
import { Compass, Handshake, GraduationCap, Globe, Heart, Lightbulb, Users, Rocket, Building, TrendingUp } from 'lucide-react';

const AboutSection = () => {
  const [activeItem, setActiveItem] = useState(null);
  const [hoveredNode, setHoveredNode] = useState(null);

  const values = [
    {
      id: 'belonging',
      icon: <Handshake className="h-6 w-6" />,
      title: "Belonging",
      description: "Rooted in shared history, open to every voice.",
      color: "from-blue-500 to-purple-600"
    },
    {
      id: 'legacy',
      icon: <GraduationCap className="h-6 w-6" />,
      title: "Legacy",
      description: "Honoring the past by investing in the future.",
      color: "from-emerald-500 to-blue-600"
    },
    {
      id: 'unity',
      icon: <Globe className="h-6 w-6" />,
      title: "Unity",
      description: "Diverse journeys, one community.",
      color: "from-orange-500 to-red-600"
    },
    {
      id: 'integrity',
      icon: <Compass className="h-6 w-6" />,
      title: "Integrity",
      description: "Leading with truth, always.",
      color: "from-teal-500 to-green-600"
    },
    {
      id: 'service',
      icon: <Heart className="h-6 w-6" />,
      title: "Service",
      description: "Giving back with heart and purpose.",
      color: "from-pink-500 to-rose-600"
    }
  ];

  const goals = [
    {
      id: 'inspire',
      icon: <Lightbulb className="h-6 w-6" />,
      title: "Inspire Growth",
      description: "For students, alumni, and the school.",
      color: "from-yellow-500 to-orange-600"
    },
    {
      id: 'strengthen',
      icon: <Users className="h-6 w-6" />,
      title: "Strengthen Bonds",
      description: "Across batches, borders, and generations.",  
      color: "from-indigo-500 to-purple-600"
    },
    {
      id: 'fuel',
      icon: <Rocket className="h-6 w-6" />,
      title: "Fuel Impact",
      description: "Through knowledge, action, and giving.",
      color: "from-green-500 to-teal-600"
    },
    {
      id: 'build',
      icon: <Building className="h-6 w-6" />,
      title: "Build Together",
      description: "Infrastructure, opportunity, and legacy.",
      color: "from-blue-500 to-cyan-600"
    },
    {
      id: 'evolve',
      icon: <TrendingUp className="h-6 w-6" />,
      title: "Evolve Forward",
      description: "Digitally, socially, and sustainably.",
      color: "from-purple-500 to-pink-600"
    }
  ];

  const NetworkVisualization = () => {
    const nodes = [...values, ...goals];
    
    return (
      <div className="relative w-full h-full flex items-center justify-center">
        <svg viewBox="0 0 400 400" className="w-full h-full max-w-md">
          {/* Connection lines */}
          {nodes.map((node, i) => (
            nodes.slice(i + 1).map((targetNode, j) => {
              const angle1 = (i / nodes.length) * 2 * Math.PI;
              const angle2 = ((i + j + 1) / nodes.length) * 2 * Math.PI;
              const radius = 120;
              const x1 = 200 + Math.cos(angle1) * radius;
              const y1 = 200 + Math.sin(angle1) * radius;
              const x2 = 200 + Math.cos(angle2) * radius;
              const y2 = 200 + Math.sin(angle2) * radius;
              
              return (
                <line
                  key={`${i}-${j}`}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="rgba(15, 52, 96, 0.1)"
                  strokeWidth="1"
                  className={`transition-all duration-500 ${
                    hoveredNode === node.id || hoveredNode === targetNode.id
                      ? 'stroke-cpscs-blue opacity-40'
                      : ''
                  }`}
                />
              );
            })
          )).flat()}
          
          {/* Nodes */}
          {nodes.map((node, index) => {
            const angle = (index / nodes.length) * 2 * Math.PI;
            const radius = 120;
            const x = 200 + Math.cos(angle) * radius;
            const y = 200 + Math.sin(angle) * radius;
            
            return (
              <g key={node.id}>
                <circle
                  cx={x}
                  cy={y}
                  r={hoveredNode === node.id ? "16" : "12"}
                  className={`transition-all duration-300 cursor-pointer ${
                    hoveredNode === node.id
                      ? 'fill-cpscs-gold'
                      : 'fill-cpscs-blue'
                  }`}
                  onMouseEnter={() => setHoveredNode(node.id)}
                  onMouseLeave={() => setHoveredNode(null)}
                  onClick={() => setActiveItem(activeItem === node.id ? null : node.id)}
                />
                {hoveredNode === node.id && (
                  <text
                    x={x}
                    y={y - 25}
                    textAnchor="middle"
                    className="fill-cpscs-blue text-sm font-medium"
                  >
                    {node.title}
                  </text>
                )}
              </g>
            );
          })}
          
          {/* Center hub */}
          <circle
            cx="200"
            cy="200"
            r="20"
            className="fill-gradient-to-r from-cpscs-blue to-cpscs-gold opacity-80"
          />
          <text
            x="200"
            y="205"
            textAnchor="middle"
            className="fill-white text-xs font-bold"
          >
            CPSCS
          </text>
        </svg>
      </div>
    );
  };

  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 via-white to-cpscs-light/50 overflow-hidden">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-cpscs-blue via-purple-600 to-cpscs-blue bg-clip-text text-transparent mb-8 leading-tight">
            About Our Alumni Association
          </h2>
          
          <div className="max-w-4xl mx-auto space-y-8 text-lg leading-relaxed">
            <p className="text-gray-700 text-xl font-light">
              The CPSCS Alumni Association is a vibrant and growing community of graduates from 
              Cantonment Public School and College, Saidpur. Founded to foster lifelong connections, 
              our association serves as a bridge between generations—celebrating achievements, 
              supporting professional growth, and giving back to the school that shaped us.
            </p>
            
            <p className="text-gray-600 text-lg">
              Whether you're reconnecting with old friends, mentoring the next generation, or 
              contributing to school initiatives, the alumni association is your home base for 
              all things CPSCS. Together, we preserve legacy, inspire impact, and build a 
              future of shared excellence.
            </p>
          </div>
        </div>

        {/* Interactive Split Layout */}
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left: Network Visualization */}
          <div className="relative">
            <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/20">
              <div className="h-96">
                <NetworkVisualization />
              </div>
              <p className="text-center text-sm text-gray-500 mt-4">
                Interactive community network • Hover to explore connections
              </p>
            </div>
          </div>

          {/* Right: Dynamic Content */}
          <div className="space-y-12">
            {/* Values Section */}
            <div>
              <h3 className="text-3xl font-bold text-cpscs-blue mb-8 flex items-center gap-3">
                <Compass className="h-8 w-8 text-cpscs-gold" />
                Our Values
              </h3>
              
              <div className="space-y-4">
                {values.map((value, index) => (
                  <div
                    key={value.id}
                    className={`group relative overflow-hidden rounded-2xl transition-all duration-500 cursor-pointer ${
                      activeItem === value.id
                        ? 'bg-gradient-to-r ' + value.color + ' text-white shadow-2xl transform scale-105'
                        : 'bg-white/80 hover:bg-white shadow-md hover:shadow-xl'
                    }`}
                    onClick={() => setActiveItem(activeItem === value.id ? null : value.id)}
                    onMouseEnter={() => setHoveredNode(value.id)}
                    onMouseLeave={() => setHoveredNode(null)}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="p-6 flex items-start gap-4">
                      <div className={`flex-shrink-0 p-3 rounded-xl transition-all duration-300 ${
                        activeItem === value.id
                          ? 'bg-white/20 text-white'
                          : 'bg-gradient-to-r ' + value.color + ' text-white'
                      }`}>
                        {value.icon}
                      </div>
                      
                      <div className="flex-grow">
                        <h4 className={`font-bold text-lg mb-2 transition-colors duration-300 ${
                          activeItem === value.id ? 'text-white' : 'text-cpscs-blue'
                        }`}>
                          {value.title}
                        </h4>
                        
                        <p className={`transition-all duration-300 ${
                          activeItem === value.id
                            ? 'text-white/90 text-base'
                            : 'text-gray-600 text-sm'
                        }`}>
                          {value.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Goals Section */}
            <div>
              <h3 className="text-3xl font-bold text-cpscs-blue mb-8 flex items-center gap-3">
                <Rocket className="h-8 w-8 text-cpscs-gold" />
                Our Goals
              </h3>
              
              <div className="space-y-4">
                {goals.map((goal, index) => (
                  <div
                    key={goal.id}
                    className={`group relative overflow-hidden rounded-2xl transition-all duration-500 cursor-pointer ${
                      activeItem === goal.id
                        ? 'bg-gradient-to-r ' + goal.color + ' text-white shadow-2xl transform scale-105'
                        : 'bg-white/80 hover:bg-white shadow-md hover:shadow-xl'
                    }`}
                    onClick={() => setActiveItem(activeItem === goal.id ? null : goal.id)}
                    onMouseEnter={() => setHoveredNode(goal.id)}
                    onMouseLeave={() => setHoveredNode(null)}
                    style={{ animationDelay: `${(index + 5) * 100}ms` }}
                  >
                    <div className="p-6 flex items-start gap-4">
                      <div className={`flex-shrink-0 p-3 rounded-xl transition-all duration-300 ${
                        activeItem === goal.id
                          ? 'bg-white/20 text-white'
                          : 'bg-gradient-to-r ' + goal.color + ' text-white'
                      }`}>
                        {goal.icon}
                      </div>
                      
                      <div className="flex-grow">
                        <h4 className={`font-bold text-lg mb-2 transition-colors duration-300 ${
                          activeItem === goal.id ? 'text-white' : 'text-cpscs-blue'
                        }`}>
                          {goal.title}
                        </h4>
                        
                        <p className={`transition-all duration-300 ${
                          activeItem === goal.id
                            ? 'text-white/90 text-base'
                            : 'text-gray-600 text-sm'
                        }`}>
                          {goal.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
