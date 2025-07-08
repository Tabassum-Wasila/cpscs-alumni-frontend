import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, X, GraduationCap, Edit2, Check } from 'lucide-react';
import { EducationEntry } from '@/services/userService';

interface EducationTimelineProps {
  education: EducationEntry[];
  onChange: (education: EducationEntry[]) => void;
  sscYear?: string;
  hscYear?: string;
  className?: string;
}

const DEGREE_OPTIONS = [
  'SSC', 'HSC', 'BSc', 'BSc Engineering', 'BBA', 'BA', 'BSS',
  'MSc', 'MSc Engineering', 'MBA', 'MA', 'MSS', 'MPhil',
  'PhD', 'Diploma', 'Certificate', 'Other'
];

const EducationTimeline: React.FC<EducationTimelineProps> = ({
  education = [],
  onChange,
  sscYear,
  hscYear,
  className = ""
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newEntry, setNewEntry] = useState({
    degree: '',
    institution: '',
    graduationYear: ''
  });

  // Initialize with default SSC and HSC entries if not present
  React.useEffect(() => {
    if (education.length === 0 && (sscYear || hscYear)) {
      const defaultEducation: EducationEntry[] = [];
      
      if (sscYear) {
        defaultEducation.push({
          id: 'default-ssc',
          degree: 'SSC',
          institution: 'Cantonment Public School and College, Saidpur',
          graduationYear: sscYear,
          isDefault: true
        });
      }
      
      if (hscYear) {
        defaultEducation.push({
          id: 'default-hsc',
          degree: 'HSC',
          institution: 'Cantonment Public School and College, Saidpur',
          graduationYear: hscYear,
          isDefault: true
        });
      }
      
      onChange(defaultEducation);
    }
  }, [sscYear, hscYear, education.length, onChange]);

  const addEducation = () => {
    if (!newEntry.degree || !newEntry.institution || !newEntry.graduationYear) return;

    const entry: EducationEntry = {
      id: `edu-${Date.now()}`,
      ...newEntry
    };

    const updatedEducation = [...education, entry].sort((a, b) => 
      parseInt(b.graduationYear) - parseInt(a.graduationYear)
    );
    
    onChange(updatedEducation);
    setNewEntry({ degree: '', institution: '', graduationYear: '' });
  };

  const removeEducation = (id: string) => {
    onChange(education.filter(edu => edu.id !== id));
  };

  const updateEducation = (id: string, updates: Partial<EducationEntry>) => {
    const updated = education.map(edu => 
      edu.id === id ? { ...edu, ...updates } : edu
    );
    onChange(updated.sort((a, b) => parseInt(b.graduationYear) - parseInt(a.graduationYear)));
    setEditingId(null);
  };

  const getYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let year = currentYear + 5; year >= 1980; year--) {
      years.push(year.toString());
    }
    return years;
  };

  const sortedEducation = [...education].sort((a, b) => 
    parseInt(b.graduationYear) - parseInt(a.graduationYear)
  );

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <Label className="text-base font-medium flex items-center gap-2">
          <GraduationCap className="h-5 w-5" />
          Education History
        </Label>
        <Badge variant="outline" className="text-xs">
          {education.length} {education.length === 1 ? 'degree' : 'degrees'}
        </Badge>
      </div>

      {/* Education Timeline */}
      <div className="space-y-3">
        {sortedEducation.map((edu, index) => (
          <Card key={edu.id} className="relative">
            <CardContent className="p-4">
              {editingId === edu.id ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <Select 
                      value={edu.degree} 
                      onValueChange={(value) => updateEducation(edu.id, { degree: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select degree" />
                      </SelectTrigger>
                      <SelectContent>
                        {DEGREE_OPTIONS.map((degree) => (
                          <SelectItem key={degree} value={degree}>{degree}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    <Input
                      value={edu.institution}
                      onChange={(e) => updateEducation(edu.id, { institution: e.target.value })}
                      placeholder="Institution name"
                    />
                    
                    <Select 
                      value={edu.graduationYear} 
                      onValueChange={(value) => updateEducation(edu.id, { graduationYear: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Graduation year" />
                      </SelectTrigger>
                      <SelectContent>
                        {getYearOptions().map((year) => (
                          <SelectItem key={year} value={year}>{year}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex justify-end space-x-2">
                    <Button size="sm" variant="outline" onClick={() => setEditingId(null)}>
                      Cancel
                    </Button>
                    <Button size="sm" onClick={() => setEditingId(null)}>
                      <Check className="h-4 w-4 mr-1" />
                      Save
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 rounded-full bg-primary"></div>
                      <div>
                        <h4 className="font-medium">{edu.degree}</h4>
                        <p className="text-sm text-muted-foreground">{edu.institution}</p>
                        <p className="text-xs text-muted-foreground">Graduated {edu.graduationYear}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {edu.isDefault && (
                      <Badge variant="secondary" className="text-xs">Default</Badge>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingId(edu.id)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    {!edu.isDefault && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeEducation(edu.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              )}
              
              {/* Timeline connector */}
              {index < sortedEducation.length - 1 && (
                <div className="absolute left-6 top-12 w-0.5 h-8 bg-border"></div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add new education */}
      <Card className="border-dashed border-2 border-primary/20 hover:border-primary/40 transition-colors">
        <CardContent className="p-4">
          <div className="space-y-3">
            <Label className="text-sm font-medium text-primary">Add Education</Label>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Select value={newEntry.degree} onValueChange={(value) => setNewEntry({...newEntry, degree: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select degree" />
                </SelectTrigger>
                <SelectContent>
                  {DEGREE_OPTIONS.map((degree) => (
                    <SelectItem key={degree} value={degree}>{degree}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Input
                value={newEntry.institution}
                onChange={(e) => setNewEntry({...newEntry, institution: e.target.value})}
                placeholder="Institution name"
              />
              
              <Select 
                value={newEntry.graduationYear} 
                onValueChange={(value) => setNewEntry({...newEntry, graduationYear: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Graduation year" />
                </SelectTrigger>
                <SelectContent>
                  {getYearOptions().map((year) => (
                    <SelectItem key={year} value={year}>{year}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <Button 
              onClick={addEducation}
              disabled={!newEntry.degree || !newEntry.institution || !newEntry.graduationYear}
              className="w-full"
              size="sm"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Education
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EducationTimeline;