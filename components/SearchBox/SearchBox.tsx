import css from "./SearchBox.module.css";

interface SearchBoxProps {
  value: string;
  onSearch: (v: string) => void;
}

export default function SearchBox({ value, onSearch }: SearchBoxProps) {
  return (
    <input
      className={css.input}
      value={value}
      onChange={(e) => onSearch(e.target.value)}
      placeholder="Search notes..."
    />
  );
}
