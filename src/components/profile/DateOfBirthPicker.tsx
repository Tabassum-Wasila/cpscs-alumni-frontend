import React from 'react';
import ReactDatePicker, { registerLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

type Props = {
  value?: Date | undefined;
  onChange: (date: Date | undefined) => void;
};

const CustomInput = React.forwardRef<HTMLButtonElement, any>(({ value, onClick }, ref) => {
  return (
    <Button
      variant="outline"
      onClick={onClick}
      ref={ref}
      className={cn(
        'w-full justify-start text-left font-normal',
        !value && 'text-muted-foreground'
      )}
    >
      <CalendarIcon className="mr-2 h-4 w-4" />
      {value ? value : <span>Pick a date</span>}
    </Button>
  );
});
CustomInput.displayName = 'CustomInput';

export default function DateOfBirthPicker({ value, onChange }: Props) {
  return (
    <div className="space-y-2">
      <Label>Date of Birth</Label>
      <ReactDatePicker
        selected={value ?? null}
        onChange={(d: Date | null) => onChange(d ?? undefined)}
        customInput={<CustomInput />}
        showMonthDropdown
        showYearDropdown
        dropdownMode="select"
        maxDate={new Date()}
        minDate={new Date('1950-01-01')}
        dateFormat="PPP"
        className="w-full"
      />
    </div>
  );
}
