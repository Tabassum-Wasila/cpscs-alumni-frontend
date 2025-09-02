import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import FlowingRow from './alumni/FlowingRow';
import { HomeAlumniService } from '@/services/homeAlumniService';
import { Users, ArrowRight } from 'lucide-react';

const OurAlumniMembers = () => {
  const { data: alumniData, isLoading, error } = useQuery({
    queryKey: ['featured-alumni'],
    queryFn: () => HomeAlumniService.getAlumniForFlowingRows(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  const LoadingSkeleton = () => (
    <div className="space-y-6">
      <div className="flex gap-6 overflow-hidden">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="min-w-[300px] max-w-[300px]">
            <div className="bg-card border border-border rounded-xl p-4">
              <div className="flex items-start gap-4">
                <Skeleton className="w-16 h-16 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <div className="flex gap-2">
                    <Skeleton className="h-5 w-16 rounded-full" />
                    <Skeleton className="h-5 w-16 rounded-full" />
                  </div>
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-2/3" />
                  <Skeleton className="h-8 w-full" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex gap-6 overflow-hidden">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="min-w-[300px] max-w-[300px]">
            <div className="bg-card border border-border rounded-xl p-4">
              <div className="flex items-start gap-4">
                <Skeleton className="w-16 h-16 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <div className="flex gap-2">
                    <Skeleton className="h-5 w-16 rounded-full" />
                    <Skeleton className="h-5 w-16 rounded-full" />
                  </div>
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-2/3" />
                  <Skeleton className="h-8 w-full" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const ErrorState = () => (
    <div className="text-center py-12">
      <div className="mb-4">
        <Users className="w-12 h-12 text-muted-foreground mx-auto" />
      </div>
      <p className="text-muted-foreground mb-4">
        Unable to load alumni members at the moment
      </p>
      <Button variant="outline" onClick={() => window.location.reload()}>
        Try Again
      </Button>
    </div>
  );

  const EmptyState = () => (
    <div className="text-center py-12">
      <div className="mb-4">
        <Users className="w-12 h-12 text-muted-foreground mx-auto" />
      </div>
      <p className="text-muted-foreground mb-4">
        No qualified alumni members to display yet
      </p>
      <Button asChild>
        <Link to="/alumni-directory-preview">
          Browse All Alumni
        </Link>
      </Button>
    </div>
  );

  return (
    <section className="py-16 bg-background relative overflow-hidden group">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Users className="w-8 h-8 text-primary" />
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Our Alumni Members
            </h2>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
            Meet our accomplished registered members who have completed their profiles 
            and are actively contributing to various fields around the world.
          </p>
          <Button asChild className="group/btn">
            <Link to="/alumni-directory-preview" className="inline-flex items-center gap-2">
              Explore Alumni Directory
              <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
            </Link>
          </Button>
        </div>

        {/* Content */}
        {isLoading && <LoadingSkeleton />}
        
        {error && <ErrorState />}
        
        {alumniData && alumniData.topRow.length === 0 && alumniData.bottomRow.length === 0 && (
          <EmptyState />
        )}
        
        {alumniData && (alumniData.topRow.length > 0 || alumniData.bottomRow.length > 0) && (
          <div className="space-y-8">
            {/* Top Row - Left to Right Flow */}
            {alumniData.topRow.length > 0 && (
              <FlowingRow 
                alumni={alumniData.topRow}
                direction="left"
                className="mb-8"
              />
            )}
            
            {/* Bottom Row - Right to Left Flow */}
            {alumniData.bottomRow.length > 0 && (
              <FlowingRow 
                alumni={alumniData.bottomRow}
                direction="right"
              />
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default OurAlumniMembers;