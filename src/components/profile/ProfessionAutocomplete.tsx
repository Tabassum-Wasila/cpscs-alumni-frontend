
import React, { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

const DEFAULT_PROFESSIONS = [
  'Software Engineer', 'Data Scientist', 'Product Manager', 'Designer',
  'Marketing Manager', 'Sales Manager', 'Business Analyst', 'Consultant',
  'Teacher', 'Doctor', 'Engineer', 'Architect', 'Lawyer', 'Accountant',
  'Project Manager', 'Research Scientist', 'Entrepreneur', 'Writer',
  'Journalist', 'Photographer', 'Artist', 'Musician'
];

interface ProfessionAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const ProfessionAutocomplete: React.FC<ProfessionAutocompleteProps> = ({
  value,
  onChange,
  placeholder = "e.g., Software Engineer",
  className
}) => {
  const [inputValue, setInputValue] = useState(value);
  const [isOpen, setIsOpen] = useState(false);
  const [professions, setProfessions] = useState(DEFAULT_PROFESSIONS);
  const [filteredProfessions, setFilteredProfessions] = useState<string[]>([]);
  const [showAddButton, setShowAddButton] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Load custom professions from localStorage
  useEffect(() => {
    const savedProfessions = localStorage.getItem('custom_professions');
    if (savedProfessions) {
      try {
        const customProfessions = JSON.parse(savedProfessions);
        const allProfessions = Array.from(new Set([...DEFAULT_PROFESSIONS, ...customProfessions]));
        setProfessions(allProfessions);
      } catch (error) {
        console.error('Error loading custom professions:', error);
      }
    }
  }, []);

  // Update input value when prop value changes
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  // Filter professions and check if we should show add button
  useEffect(() => {
    if (inputValue.trim()) {
      const filtered = professions.filter(profession =>
        profession.toLowerCase().includes(inputValue.toLowerCase())
      );
      setFilteredProfessions(filtered);
      
      // Show add button if input doesn't match any existing profession exactly
      const exactMatch = professions.some(profession => 
        profession.toLowerCase() === inputValue.toLowerCase()
      );
      setShowAddButton(!exactMatch && inputValue.trim().length > 2);
    } else {
      setFilteredProfessions([]);
      setShowAddButton(false);
    }
  }, [inputValue, professions]);

  // Handle clicks outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    setIsOpen(true);
    onChange(newValue); // Update parent immediately for real-time feedback
  };

  const handleInputFocus = () => {
    setIsOpen(true);
  };

  const handleSelectProfession = (profession: string) => {
    setInputValue(profession);
    onChange(profession);
    setIsOpen(false);
    inputRef.current?.blur();
  };

  const handleAddProfession = () => {
    const newProfession = inputValue.trim();
    if (newProfession && !professions.includes(newProfession)) {
      const updatedProfessions = [...professions, newProfession];
      setProfessions(updatedProfessions);
      
      // Save custom professions to localStorage
      const customProfessions = updatedProfessions.filter(p => !DEFAULT_PROFESSIONS.includes(p));
      localStorage.setItem('custom_professions', JSON.stringify(customProfessions));
      
      // Select the new profession
      onChange(newProfession);
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (showAddButton) {
        handleAddProfession();
      } else if (filteredProfessions.length > 0) {
        handleSelectProfession(filteredProfessions[0]);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <Input
        ref={inputRef}
        value={inputValue}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="pr-4"
      />
      
      {isOpen && (inputValue.length > 0) && (
        <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
          {/* Show add button first if applicable */}
          {showAddButton && (
            <Button
              variant="ghost"
              onClick={handleAddProfession}
              className="w-full justify-start p-3 text-left hover:bg-blue-50 border-b border-gray-100"
            >
              <Plus className="h-4 w-4 mr-2 text-blue-600" />
              <span className="font-medium text-blue-600">
                ADD "{inputValue.toUpperCase()}"
              </span>
            </Button>
          )}
          
          {/* Show filtered professions */}
          {filteredProfessions.length > 0 && (
            <>
              {filteredProfessions.slice(0, 8).map((profession, index) => (
                <button
                  key={profession}
                  onClick={() => handleSelectProfession(profession)}
                  className="w-full px-4 py-2 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none flex items-center justify-between"
                >
                  <span>{profession}</span>
                  {profession.toLowerCase() === inputValue.toLowerCase() && (
                    <Check className="h-4 w-4 text-green-600" />
                  )}
                </button>
              ))}
              {filteredProfessions.length > 8 && (
                <div className="px-4 py-2 text-sm text-gray-500 border-t">
                  +{filteredProfessions.length - 8} more options...
                </div>
              )}
            </>
          )}
          
          {/* Show message if no matches and can't add */}
          {filteredProfessions.length === 0 && !showAddButton && inputValue.trim().length > 0 && (
            <div className="px-4 py-3 text-sm text-gray-500">
              No matching professions found. Type more to add a custom profession.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProfessionAutocomplete;
