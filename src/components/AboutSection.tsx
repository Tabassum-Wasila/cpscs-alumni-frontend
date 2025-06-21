
import React from 'react';
import { Compass, Handshake, GraduationCap, Globe, Heart, Lightbulb, Users, Rocket, Building, TrendingUp } from 'lucide-react';

const AboutSection = () => {
  const values = [
    {
      icon: <Handshake className="h-8 w-8 text-cpscs-blue" />,
      title: "Belonging",
      description: "Rooted in shared history, open to every voice."
    },
    {
      icon: <GraduationCap className="h-8 w-8 text-cpscs-blue" />,
      title: "Legacy",
      description: "Honoring the past by investing in the future."
    },
    {
      icon: <Globe className="h-8 w-8 text-cpscs-blue" />,
      title: "Unity",
      description: "Diverse journeys, one community."
    },
    {
      icon: <Compass className="h-8 w-8 text-cpscs-blue" />,
      title: "Integrity",
      description: "Leading with truth, always."
    },
    {
      icon: <Heart className="h-8 w-8 text-cpscs-blue" />,
      title: "Service",
      description: "Giving back with heart and purpose."
    }
  ];

  const goals = [
    {
      icon: <Lightbulb className="h-8 w-8 text-cpscs-gold" />,
      title: "Inspire Growth",
      description: "For students, alumni, and the school."
    },
    {
      icon: <Users className="h-8 w-8 text-cpscs-gold" />,
      title: "Strengthen Bonds",
      description: "Across batches, borders, and generations."
    },
    {
      icon: <Rocket className="h-8 w-8 text-cpscs-gold" />,
      title: "Fuel Impact",
      description: "Through knowledge, action, and giving."
    },
    {
      icon: <Building className="h-8 w-8 text-cpscs-gold" />,
      title: "Build Together",
      description: "Infrastructure, opportunity, and legacy."
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-cpscs-gold" />,
      title: "Evolve Forward",
      description: "Digitally, socially, and sustainably."
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-white via-cpscs-light/30 to-white">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-cpscs-blue mb-8 leading-tight">
            About Our Alumni Association
          </h2>
          
          <div className="max-w-4xl mx-auto space-y-6 text-lg text-gray-700 leading-relaxed">
            <p>
              The CPSCS Alumni Association is a vibrant and growing community of graduates from 
              Cantonment Public School and College, Saidpur. Founded to foster lifelong connections, 
              our association serves as a bridge between generations—celebrating achievements, 
              supporting professional growth, and giving back to the school that shaped us.
            </p>
            
            <p>
              Whether you're reconnecting with old friends, mentoring the next generation, or 
              contributing to school initiatives, the alumni association is your home base for 
              all things CPSCS. Together, we preserve legacy, inspire impact, and build a 
              future of shared excellence.
            </p>
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-cpscs-blue mb-4 flex items-center justify-center gap-3">
              <Compass className="h-8 w-8" />
              Our Values
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              The core principles that guide our community and define who we are
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {values.map((value, index) => (
              <div 
                key={index} 
                className="neumorphic-card p-6 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="mb-4 flex justify-center group-hover:scale-110 transition-transform duration-300">
                  {value.icon}
                </div>
                <h4 className="font-semibold text-cpscs-blue mb-3 text-lg">
                  {value.title}
                </h4>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Goals Section */}
        <div>
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-cpscs-blue mb-4 flex items-center justify-center gap-3">
              <Rocket className="h-8 w-8 text-cpscs-gold" />
              Our Goals
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              The ambitious objectives we're working toward as a united community
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {goals.map((goal, index) => (
              <div 
                key={index} 
                className="neumorphic-card p-6 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group bg-gradient-to-br from-white to-cpscs-gold/5"
                style={{ animationDelay: `${(index + 5) * 100}ms` }}
              >
                <div className="mb-4 flex justify-center group-hover:scale-110 transition-transform duration-300">
                  {goal.icon}
                </div>
                <h4 className="font-semibold text-cpscs-blue mb-3 text-lg">
                  {goal.title}
                </h4>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {goal.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
