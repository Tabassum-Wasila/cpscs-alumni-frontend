
import React, { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { countryCodes } from '@/data/countryCodes';

interface CountryCodeSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  className?: string;
}

const CountryCodeSelect: React.FC<CountryCodeSelectProps> = ({ value, onValueChange, className }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCountries = countryCodes.filter(country =>
    country.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
    country.code.includes(searchTerm)
  );

  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className={className}>
        <SelectValue placeholder="+880" />
      </SelectTrigger>
      <SelectContent className="max-h-60">
        <div className="p-2">
          <Input
            placeholder="Search country..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mb-2"
          />
        </div>
        {filteredCountries.map((country) => (
          <SelectItem key={country.code} value={country.code}>
            <div className="flex items-center space-x-2">
              <span>{country.flag}</span>
              <span className="font-mono">{country.code}</span>
              <span className="text-sm text-gray-600">{country.country}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default CountryCodeSelect;
