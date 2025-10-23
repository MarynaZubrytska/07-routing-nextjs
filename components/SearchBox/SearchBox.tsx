import React from "react";
import css from "./SearchBox.module.css";

interface SearchBoxProps {
  value: string;
  onSearch: (newQuery: string) => void;
}

export default function SearchBox({ value, onSearch }: SearchBoxProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearch(e.target.value);
  };

  return (
    <input
      className={css.input}
      type="text"
      name="search"
      aria-label="Search notes"
      placeholder="Search notes"
      value={value}
      onChange={handleChange}
    />
  );
}
