import React from 'react';
import { Link } from 'react-router-dom';
import { FeaturedAlumni } from '@/services/homeAlumniService';
import { Building2, GraduationCap } from 'lucide-react';

interface AlumniCardProps {
  alumni: FeaturedAlumni;
  className?: string;
}

const AlumniCard = ({ alumni, className = '' }: AlumniCardProps) => {
  return (
    <Link 
      to={`/alumni-directory-preview`}
      className={`block min-w-[280px] max-w-[280px] ${className}`}
    >
      <div className="group relative backdrop-blur-sm bg-card/80 border border-border/50 rounded-2xl p-6 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/20 hover:scale-[1.03] hover:border-primary/30 hover:bg-card/90 overflow-hidden">
        
        {/* Animated Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Glassmorphic Edge Glow */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/20 via-transparent to-secondary/20 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500 -z-10" />
        
        <div className="relative z-10">
          {/* Profile Picture */}
          <div className="flex justify-center mb-4">
            <div className="relative">
              <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-primary/20 group-hover:border-primary/50 transition-all duration-300 shadow-lg group-hover:shadow-xl group-hover:shadow-primary/20">
                <img 
                  src={alumni.profilePicture} 
                  alt={alumni.fullName}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
              </div>
              {/* Profile Glow Ring */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/30 to-secondary/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-md -z-10" />
            </div>
          </div>

          {/* Content */}
          <div className="text-center space-y-3">
            {/* Name */}
            <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors duration-300 line-clamp-1">
              {alumni.fullName}
            </h3>

            {/* Batch Years */}
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="flex items-center gap-1.5 bg-primary/10 hover:bg-primary/20 px-3 py-1.5 rounded-xl transition-all duration-300">
                <GraduationCap className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">
                  SSC {alumni.sscYear}
                </span>
              </div>
              <div className="flex items-center gap-1.5 bg-secondary/15 hover:bg-secondary/25 px-3 py-1.5 rounded-xl transition-all duration-300">
                <span className="text-sm font-medium text-secondary-foreground">
                  HSC {alumni.hscYear}
                </span>
              </div>
            </div>

            {/* Profession */}
            <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-xl p-3 group-hover:from-primary/10 group-hover:to-secondary/10 transition-all duration-300">
              <p className="font-semibold text-primary text-sm line-clamp-1 mb-1">
                {alumni.profession}
              </p>
              
              {/* Organization */}
              <div className="flex items-center justify-center gap-2">
                <Building2 className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                  {alumni.organization}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Accent Line */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-primary-glow to-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
    </Link>
  );
};

export default AlumniCard;