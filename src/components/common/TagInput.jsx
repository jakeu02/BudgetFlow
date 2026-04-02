import { useState, useRef, useEffect } from 'react';
import { HiOutlineX } from 'react-icons/hi';

export default function TagInput({ tags = [], onChange, suggestions = [], placeholder = 'Add a tag...' }) {
  const [input, setInput] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef = useRef(null);
  const containerRef = useRef(null);

  const filteredSuggestions = input.trim()
    ? suggestions
        .filter(
          (s) =>
            s.toLowerCase().includes(input.trim().toLowerCase()) &&
            !tags.includes(s)
        )
        .slice(0, 8)
    : [];

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const addTag = (tag) => {
    const trimmed = tag.trim().toLowerCase();
    if (trimmed && !tags.includes(trimmed)) {
      onChange([...tags, trimmed]);
    }
    setInput('');
    setShowSuggestions(false);
    setHighlightedIndex(-1);
    inputRef.current?.focus();
  };

  const removeTag = (tagToRemove) => {
    onChange(tags.filter((t) => t !== tagToRemove));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      if (highlightedIndex >= 0 && filteredSuggestions[highlightedIndex]) {
        addTag(filteredSuggestions[highlightedIndex]);
      } else if (input.trim()) {
        addTag(input);
      }
    } else if (e.key === 'Backspace' && !input && tags.length > 0) {
      removeTag(tags[tags.length - 1]);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev < filteredSuggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
      setHighlightedIndex(-1);
    }
  };

  const handleInputChange = (e) => {
    const val = e.target.value;
    // If user types a comma, add the tag before the comma
    if (val.includes(',')) {
      const parts = val.split(',');
      parts.forEach((part, i) => {
        if (i < parts.length - 1 && part.trim()) {
          addTag(part);
        }
      });
      setInput(parts[parts.length - 1]);
    } else {
      setInput(val);
    }
    setShowSuggestions(true);
    setHighlightedIndex(-1);
  };

  return (
    <div ref={containerRef} className="relative">
      <div
        className="flex flex-wrap items-center gap-1.5 rounded-xl border border-surface-200 bg-white px-3 py-2.5 transition-all focus-within:border-primary-500 focus-within:ring-4 focus-within:ring-primary-500/10 dark:border-surface-600 dark:bg-surface-700"
        onClick={() => inputRef.current?.focus()}
      >
        {tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 rounded-md bg-primary-50 px-2 py-0.5 text-xs font-medium text-primary-600 dark:bg-primary-900/30 dark:text-primary-400"
          >
            {tag}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                removeTag(tag);
              }}
              className="rounded-sm text-primary-400 transition-colors hover:text-primary-600 dark:text-primary-500 dark:hover:text-primary-300"
            >
              <HiOutlineX className="h-3 w-3" />
            </button>
          </span>
        ))}
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => input.trim() && setShowSuggestions(true)}
          placeholder={tags.length === 0 ? placeholder : ''}
          className="min-w-[80px] flex-1 bg-transparent text-sm text-surface-900 outline-none placeholder:text-surface-400 dark:text-white dark:placeholder:text-surface-500"
        />
      </div>

      {/* Suggestions dropdown */}
      {showSuggestions && filteredSuggestions.length > 0 && (
        <div className="absolute left-0 right-0 z-20 mt-1 max-h-40 overflow-y-auto rounded-xl border border-surface-200 bg-white py-1 shadow-lg dark:border-surface-600 dark:bg-surface-700">
          {filteredSuggestions.map((suggestion, i) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => addTag(suggestion)}
              className={`flex w-full items-center px-3 py-2 text-left text-sm transition-colors
                ${
                  i === highlightedIndex
                    ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400'
                    : 'text-surface-700 hover:bg-surface-50 dark:text-surface-300 dark:hover:bg-surface-600'
                }`}
            >
              <span className="mr-2 inline-flex items-center rounded-md bg-primary-50 px-1.5 py-0.5 text-xs font-medium text-primary-600 dark:bg-primary-900/30 dark:text-primary-400">
                #
              </span>
              {suggestion}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
