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
      className={`block min-w-[200px] max-w-[200px] ${className}`}
    >
      <div className="group relative backdrop-blur-sm bg-card/80 border border-border/50 rounded-xl p-4 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 hover:scale-[1.02] hover:border-primary/40 hover:bg-card/95 overflow-hidden">
        
        {/* Animated Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/3 via-transparent to-secondary/3 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <div className="relative z-10">
          {/* Profile Picture */}
          <div className="flex justify-center mb-3">
            <div className="relative">
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-primary/20 group-hover:border-primary/40 transition-all duration-300 shadow-md">
                <img 
                  src={alumni.profilePicture} 
                  alt={alumni.fullName}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="text-center space-y-2">
            {/* Name */}
            <h3 className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors duration-300 line-clamp-1 leading-tight">
              {alumni.fullName}
            </h3>

            {/* Batch Years - Compact */}
            <div className="flex items-center justify-center gap-2">
              <div className="flex items-center gap-1 bg-primary/8 px-2 py-1 rounded-lg">
                <GraduationCap className="w-3 h-3 text-primary" />
                <span className="text-xs font-medium text-primary">
                  {alumni.sscYear}
                </span>
              </div>
              <div className="flex items-center gap-1 bg-secondary/10 px-2 py-1 rounded-lg">
                <span className="text-xs font-medium text-secondary-foreground">
                  {alumni.hscYear}
                </span>
              </div>
            </div>

            {/* Profession */}
            <div className="space-y-1">
              <p className="font-medium text-primary text-xs line-clamp-1">
                {alumni.profession}
              </p>
              
              {/* Organization - Single line with ellipsis */}
              <div className="flex items-center justify-center gap-1">
                <Building2 className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                <p className="text-xs text-muted-foreground line-clamp-1 max-w-[140px]" title={alumni.organization}>
                  {alumni.organization}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Accent Line */}
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary via-primary-glow to-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
    </Link>
  );
};

export default AlumniCard;