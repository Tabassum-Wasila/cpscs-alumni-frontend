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
      className={`block min-w-[300px] max-w-[300px] ${className}`}
    >
      <div className="group relative bg-card border border-border rounded-xl p-4 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] hover:border-primary/20">
        <div className="flex items-start gap-4">
          {/* Profile Picture */}
          <div className="relative flex-shrink-0">
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-primary/20 group-hover:border-primary/40 transition-colors">
              <img 
                src={alumni.profilePicture} 
                alt={alumni.fullName}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Name */}
            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1 mb-1">
              {alumni.fullName}
            </h3>

            {/* Batch Years */}
            <div className="flex items-center gap-2 mb-2">
              <div className="flex items-center gap-1">
                <GraduationCap className="w-3 h-3 text-muted-foreground" />
                <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                  SSC {alumni.sscYear}
                </span>
              </div>
              <span className="text-xs bg-secondary/10 text-secondary-foreground px-2 py-0.5 rounded-full">
                HSC {alumni.hscYear}
              </span>
            </div>

            {/* Profession */}
            <p className="font-medium text-primary text-sm line-clamp-1 mb-1">
              {alumni.profession}
            </p>

            {/* Organization */}
            <div className="flex items-start gap-1 mb-2">
              <Building2 className="w-3 h-3 text-muted-foreground mt-0.5 flex-shrink-0" />
              <p className="text-xs text-muted-foreground line-clamp-1">
                {alumni.organization}
              </p>
            </div>

            {/* Bio */}
            <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
              {alumni.bio}
            </p>
          </div>
        </div>

        {/* Hover Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
      </div>
    </Link>
  );
};

export default AlumniCard;