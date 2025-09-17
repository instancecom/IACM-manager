import { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format, parse, isValid } from "date-fns";
import { cn } from "@/lib/utils";

interface DateInputProps {
  value?: Date;
  onChange: (date: Date | undefined) => void;
  placeholder?: string;
  disabled?: (date: Date) => boolean;
  className?: string;
}

export const DateInput = ({ 
  value, 
  onChange, 
  placeholder = "dd/mm/aaaa", 
  disabled,
  className 
}: DateInputProps) => {
  const [inputValue, setInputValue] = useState(
    value ? format(value, "dd/MM/yyyy") : ""
  );
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let input = e.target.value;
    
    // Remove caracteres não numéricos exceto barras
    input = input.replace(/[^\d/]/g, "");
    
    // Adiciona barras automaticamente
    if (input.length >= 2 && !input.includes("/")) {
      input = input.slice(0, 2) + "/" + input.slice(2);
    }
    if (input.length >= 5 && input.split("/").length === 2) {
      const parts = input.split("/");
      input = parts[0] + "/" + parts[1].slice(0, 2) + "/" + parts[1].slice(2);
    }
    
    // Limita o tamanho
    if (input.length > 10) {
      input = input.slice(0, 10);
    }
    
    setInputValue(input);
    
    // Tenta fazer parse da data quando tiver formato completo
    if (input.length === 10) {
      try {
        const parsedDate = parse(input, "dd/MM/yyyy", new Date());
        if (isValid(parsedDate)) {
          onChange(parsedDate);
        } else {
          onChange(undefined);
        }
      } catch {
        onChange(undefined);
      }
    } else {
      onChange(undefined);
    }
  };

  const handleCalendarSelect = (date: Date | undefined) => {
    if (date) {
      setInputValue(format(date, "dd/MM/yyyy"));
      onChange(date);
    }
    setIsOpen(false);
  };

  const handleInputBlur = () => {
    // Se o input não estiver vazio mas não tiver data válida, mantém o valor
    if (inputValue && !value) {
      // Valor inválido, mas mantém para o usuário ver o erro
    }
  };

  return (
    <div className={cn("relative", className)}>
      <div className="flex">
        <Input
          ref={inputRef}
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          placeholder={placeholder}
          className="pr-10"
        />
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
              type="button"
            >
              <CalendarIcon className="h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={value}
              onSelect={handleCalendarSelect}
              disabled={disabled}
              initialFocus
              className="pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};