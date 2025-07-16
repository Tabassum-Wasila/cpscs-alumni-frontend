import React, { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProfessionAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

// Comprehensive list of professions common in Bangladesh
const DEFAULT_PROFESSIONS = [
  // Medical & Healthcare
  'Doctor', 'Physician', 'Surgeon', 'Dentist', 'Pharmacist', 'Nurse', 'Medical Technologist',
  'Physiotherapist', 'Veterinarian', 'Medical Researcher', 'Healthcare Administrator',
  
  // Engineering & Technology
  'Software Engineer', 'Web Developer', 'Mobile App Developer', 'Data Scientist', 'Data Analyst',
  'Civil Engineer', 'Mechanical Engineer', 'Electrical Engineer', 'Electronics Engineer',
  'Computer Engineer', 'Chemical Engineer', 'Textile Engineer', 'Marine Engineer',
  'Architect', 'Network Engineer', 'Cybersecurity Specialist', 'DevOps Engineer',
  'UI/UX Designer', 'Graphic Designer', 'Product Manager', 'Project Manager',
  
  // Business & Finance
  'Entrepreneur', 'Business Owner', 'CEO', 'Managing Director', 'Business Analyst',
  'Financial Analyst', 'Accountant', 'Chartered Accountant', 'Banker', 'Investment Banker',
  'Insurance Agent', 'Stock Broker', 'Financial Advisor', 'Auditor', 'Tax Consultant',
  'Marketing Manager', 'Sales Manager', 'Business Development Manager',
  
  // Government & Public Service
  'Government Officer', 'Civil Servant', 'BCS Officer', 'Deputy Commissioner',
  'Upazila Nirbahi Officer', 'Police Officer', 'Magistrate', 'Judge', 'Lawyer',
  'Public Prosecutor', 'Customs Officer', 'Tax Officer', 'Bank Officer',
  
  // Education & Research
  'Teacher', 'Professor', 'Lecturer', 'Principal', 'Educational Administrator',
  'Research Scientist', 'Academic Researcher', 'School Teacher', 'College Teacher',
  'University Professor', 'Librarian', 'Education Consultant',
  
  // Media & Communication
  'Journalist', 'News Reporter', 'Editor', 'Content Writer', 'Copywriter',
  'Television Producer', 'Radio Presenter', 'Social Media Manager', 'PR Specialist',
  'Photographer', 'Videographer', 'Documentary Filmmaker',
  
  // Agriculture & Environment
  'Agricultural Officer', 'Farmer', 'Agricultural Scientist', 'Livestock Specialist',
  'Environmental Scientist', 'Forest Officer', 'Fisheries Officer',
  
  // Manufacturing & Industry
  'Factory Manager', 'Production Manager', 'Quality Control Engineer',
  'Industrial Engineer', 'Textile Worker', 'Garment Worker', 'RMG Professional',
  
  // Transportation & Logistics
  'Pilot', 'Ship Captain', 'Maritime Officer', 'Logistics Manager',
  'Supply Chain Manager', 'Transportation Coordinator',
  
  // Arts & Culture
  'Artist', 'Musician', 'Actor', 'Writer', 'Poet', 'Cultural Activist',
  'Art Director', 'Creative Director', 'Interior Designer',
  
  // Sports & Fitness
  'Professional Athlete', 'Sports Coach', 'Fitness Trainer', 'Sports Journalist',
  
  // Social Services
  'Social Worker', 'NGO Worker', 'Development Worker', 'Community Organizer',
  'Human Rights Activist', 'Volunteer Coordinator',
  
  // Other Professions
  'Consultant', 'Freelancer', 'Self-Employed', 'Retired', 'Homemaker',
  'Real Estate Agent', 'Travel Agent', 'Tour Guide', 'Chef', 'Restaurant Owner',
  'Shop Owner', 'Trader', 'Import/Export Business'
];

const ProfessionAutocomplete: React.FC<ProfessionAutocompleteProps> = ({
  value,
  onChange,
  placeholder = "Select or type your profession...",
  className
}) => {
  const [open, setOpen] = useState(false);
  const [customProfessions, setCustomProfessions] = useState<string[]>([]);
  
  // Load custom professions from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('custom_professions');
    if (stored) {
      try {
        setCustomProfessions(JSON.parse(stored));
      } catch (error) {
        console.error('Error loading custom professions:', error);
      }
    }
  }, []);

  // Save custom profession to localStorage
  const saveCustomProfession = (profession: string) => {
    if (!DEFAULT_PROFESSIONS.includes(profession) && !customProfessions.includes(profession)) {
      const updated = [...customProfessions, profession];
      setCustomProfessions(updated);
      localStorage.setItem('custom_professions', JSON.stringify(updated));
    }
  };

  const allProfessions = [...DEFAULT_PROFESSIONS, ...customProfessions].sort();
  
  // Check if current input is a new profession not in the list
  const isNewProfession = value && !allProfessions.includes(value);
  
  const handleSelect = (selectedValue: string) => {
    onChange(selectedValue);
    saveCustomProfession(selectedValue);
    setOpen(false);
  };

  const handleCustomInput = (customValue: string) => {
    if (customValue && customValue !== value) {
      onChange(customValue);
      saveCustomProfession(customValue);
    }
  };

  const handleAddNew = () => {
    if (value && !allProfessions.includes(value)) {
      saveCustomProfession(value);
      setOpen(false);
    }
  };

  return (
    <div className={className}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            {value || placeholder}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command>
            <CommandInput 
              placeholder="Search professions..." 
              onValueChange={(searchValue) => {
                // Allow typing custom professions
                if (searchValue && !allProfessions.some(p => 
                  p.toLowerCase().includes(searchValue.toLowerCase())
                )) {
                  // This is a potential custom profession
                }
              }}
            />
            <CommandList>
              <CommandEmpty>
                <div className="p-2 text-sm">
                  <p className="text-muted-foreground mb-2">No profession found.</p>
                  <Button
                    size="sm"
                    onClick={() => {
                      const input = document.querySelector('[cmdk-input]') as HTMLInputElement;
                      if (input?.value) {
                        handleCustomInput(input.value);
                      }
                    }}
                    className="w-full"
                  >
                    Add "{(document.querySelector('[cmdk-input]') as HTMLInputElement)?.value}"
                  </Button>
                </div>
              </CommandEmpty>
              
              {DEFAULT_PROFESSIONS.length > 0 && (
                <CommandGroup heading="Common Professions">
                  {DEFAULT_PROFESSIONS.map((profession) => (
                    <CommandItem
                      key={profession}
                      value={profession}
                      onSelect={() => handleSelect(profession)}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          value === profession ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {profession}
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
              
              {customProfessions.length > 0 && (
                <CommandGroup heading="Recently Added">
                  {customProfessions.map((profession) => (
                    <CommandItem
                      key={profession}
                      value={profession}
                      onSelect={() => handleSelect(profession)}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          value === profession ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {profession}
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default ProfessionAutocomplete;
