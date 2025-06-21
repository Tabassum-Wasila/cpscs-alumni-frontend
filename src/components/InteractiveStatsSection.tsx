
import React from 'react';
import FlipCard from './FlipCard';
import { Users, Globe, UserCheck, GraduationCap, Heart, Calendar, DollarSign, Clock, BookOpen, Baby } from 'lucide-react';

const InteractiveStatsSection = () => {
  const statsData = [
    {
      frontContent: {
        value: "6,200+",
        label: "Verified Members in Alumni Directory",
        icon: <Users className="h-10 w-10" />
      },
      backContent: {
        description: "Discover and connect with thousands of verified CPSCS alumni worldwide through our real-time, ever-growing directory."
      }
    },
    {
      frontContent: {
        value: "75+",
        label: "Countries Connected",
        icon: <Globe className="h-10 w-10" />
      },
      backContent: {
        description: "Our alumni span over 75 countries—building a truly global community rooted in shared memories and values."
      }
    },
    {
      frontContent: {
        value: "400+",
        label: "Active Alumni Mentors",
        icon: <UserCheck className="h-10 w-10" />
      },
      backContent: {
        description: "Experienced alumni have stepped up to guide the next generation—offering advice, mentorship, and career support."
      }
    },
    {
      frontContent: {
        value: "10,000+",
        label: "Students Inspired",
        icon: <GraduationCap className="h-10 w-10" />
      },
      backContent: {
        description: "Through mentorship, events, and outreach, our alumni have impacted over 10,000 students—lighting the path for future leaders."
      }
    },
    {
      frontContent: {
        value: "15,000+",
        label: "Alumni Connections Made",
        icon: <Heart className="h-10 w-10" />
      },
      backContent: {
        description: "Our platform has facilitated thousands of professional and personal connections—mentorships, collaborations, and lifelong friendships."
      }
    },
    {
      frontContent: {
        value: "150+",
        label: "Events & Reunions Hosted",
        icon: <Calendar className="h-10 w-10" />
      },
      backContent: {
        description: "From grand reunions to small meetups—our events bring together generations of CPSCS alumni in one table."
      }
    },
    {
      frontContent: {
        value: "৳30+ Lakh",
        label: "Alumni Contributions",
        icon: <DollarSign className="h-10 w-10" />
      },
      backContent: {
        description: "Your generosity has helped fund scholarships, upgrade facilities, and support community initiatives that uplift CPSCS-AA."
      }
    },
    {
      frontContent: {
        value: "SSC 1981",
        label: "Our First Batch",
        icon: <Clock className="h-10 w-10" />
      },
      backContent: {
        description: "Our legacy began in 1981 with our first SSC batch—marking over four decades of alumni excellence."
      }
    },
    {
      frontContent: {
        value: "44+",
        label: "Alumni Batches United",
        icon: <BookOpen className="h-10 w-10" />
      },
      backContent: {
        description: "We've brought together over 44 SSC and HSC batches—creating one unified, intergenerational alumni family."
      }
    },
    {
      frontContent: {
        value: "600+",
        label: "Alumni Children Enrolled",
        icon: <Baby className="h-10 w-10" />
      },
      backContent: {
        description: "The CPSCS legacy lives on—over 600 alumni have chosen the same school for their children's future."
      }
    }
  ];

  return (
    <section className="py-16 bg-cpscs-light">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-cpscs-blue">
          Join Our Growing Community
        </h2>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          Discover the strength of our global CPSCS alumni network through these inspiring statistics
        </p>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {statsData.map((stat, index) => (
            <FlipCard
              key={index}
              frontContent={stat.frontContent}
              backContent={stat.backContent}
              autoFlipDelay={2000 + (index * 200)} // Stagger the auto-flip timing
              className="h-48 md:h-52"
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default InteractiveStatsSection;
