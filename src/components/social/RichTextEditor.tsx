
import React, { useState, useRef, useEffect } from 'react';
import { Bold, Italic, Underline, List, ListOrdered, Link, Palette, Highlighter, Type } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = "Share your thoughts...",
  className
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  // Toolbar buttons configuration
  const toolbarButtons = [
    { command: 'bold', icon: Bold, title: 'Bold (Ctrl+B)' },
    { command: 'italic', icon: Italic, title: 'Italic (Ctrl+I)' },
    { command: 'underline', icon: Underline, title: 'Underline (Ctrl+U)' },
    { command: 'insertUnorderedList', icon: List, title: 'Bullet List' },
    { command: 'insertOrderedList', icon: ListOrdered, title: 'Numbered List' },
    { command: 'createLink', icon: Link, title: 'Insert Link' },
  ];

  const headingButtons = [
    { command: 'formatBlock', value: 'h1', label: 'H1' },
    { command: 'formatBlock', value: 'h2', label: 'H2' },
    { command: 'formatBlock', value: 'h3', label: 'H3' },
    { command: 'formatBlock', value: 'p', label: 'P' },
  ];

  const colorButtons = [
    { color: '#000000', label: 'Black' },
    { color: '#e74c3c', label: 'Red' },
    { color: '#3498db', label: 'Blue' },
    { color: '#2ecc71', label: 'Green' },
    { color: '#f39c12', label: 'Orange' },
    { color: '#9b59b6', label: 'Purple' },
  ];

  const highlightColors = [
    { color: '#ffff00', label: 'Yellow' },
    { color: '#00ff00', label: 'Green' },
    { color: '#00ffff', label: 'Cyan' },
    { color: '#ff00ff', label: 'Magenta' },
    { color: '#ffc0cb', label: 'Pink' },
  ];

  // Execute rich text commands
  const executeCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      editorRef.current.focus();
      handleContentChange();
    }
  };

  // Handle content changes
  const handleContentChange = () => {
    if (editorRef.current) {
      const content = editorRef.current.innerHTML;
      onChange(content);
    }
  };

  // Handle keyboard shortcuts
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case 'b':
          e.preventDefault();
          executeCommand('bold');
          break;
        case 'i':
          e.preventDefault();
          executeCommand('italic');
          break;
        case 'u':
          e.preventDefault();
          executeCommand('underline');
          break;
      }
    }
  };

  // Handle link creation
  const handleLinkCommand = () => {
    const url = prompt('Enter URL:');
    if (url) {
      executeCommand('createLink', url);
    }
  };

  // Initialize editor content
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  return (
    <div className={cn("border rounded-lg overflow-hidden bg-white", className)}>
      {/* Toolbar */}
      <div className="border-b bg-gray-50 p-2">
        <div className="flex flex-wrap gap-1 items-center">
          {/* Heading buttons */}
          <div className="flex gap-1 mr-2">
            {headingButtons.map((btn) => (
              <Button
                key={btn.value}
                variant="ghost"
                size="sm"
                className="h-8 px-2 text-xs font-medium"
                onClick={() => executeCommand(btn.command, btn.value)}
              >
                {btn.label}
              </Button>
            ))}
          </div>

          <div className="w-px h-6 bg-gray-300 mx-1" />

          {/* Formatting buttons */}
          <div className="flex gap-1 mr-2">
            {toolbarButtons.map((btn) => (
              <Button
                key={btn.command}
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                title={btn.title}
                onClick={() => 
                  btn.command === 'createLink' ? handleLinkCommand() : executeCommand(btn.command)
                }
              >
                <btn.icon className="h-4 w-4" />
              </Button>
            ))}
          </div>

          <div className="w-px h-6 bg-gray-300 mx-1" />

          {/* Text color */}
          <div className="flex gap-1 mr-2">
            <div className="flex items-center gap-1">
              <Type className="h-4 w-4 text-gray-600" />
              {colorButtons.map((color) => (
                <button
                  key={color.color}
                  className="w-6 h-6 rounded border border-gray-300 hover:scale-110 transition-transform"
                  style={{ backgroundColor: color.color }}
                  title={`Text color: ${color.label}`}
                  onClick={() => executeCommand('foreColor', color.color)}
                />
              ))}
            </div>
          </div>

          <div className="w-px h-6 bg-gray-300 mx-1" />

          {/* Highlight color */}
          <div className="flex gap-1">
            <div className="flex items-center gap-1">
              <Highlighter className="h-4 w-4 text-gray-600" />
              {highlightColors.map((color) => (
                <button
                  key={color.color}
                  className="w-6 h-6 rounded border border-gray-300 hover:scale-110 transition-transform"
                  style={{ backgroundColor: color.color }}
                  title={`Highlight: ${color.label}`}
                  onClick={() => executeCommand('hiliteColor', color.color)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        className={cn(
          "min-h-[200px] p-4 outline-none",
          "prose prose-sm max-w-none",
          "focus:bg-blue-50/30 transition-colors",
          !value && "text-gray-400"
        )}
        style={{
          wordBreak: 'break-word',
          overflowWrap: 'break-word'
        }}
        onInput={handleContentChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onKeyDown={handleKeyDown}
        suppressContentEditableWarning
        data-placeholder={placeholder}
      />

      {/* Editor hint */}
      {isFocused && (
        <div className="px-4 py-2 text-xs text-gray-500 bg-gray-50 border-t">
          💡 Use Ctrl+B for bold, Ctrl+I for italic, Ctrl+U for underline
        </div>
      )}
    </div>
  );
};

export default RichTextEditor;
