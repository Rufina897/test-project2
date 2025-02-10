import { Input, InputGroup, InputRightElement, Spinner } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useDebounce } from "../hooks/useDebounce";

interface SearchBarProps {
  onSearch: (query: string) => void;
  isLoading?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch, isLoading }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  useEffect(() => {
    onSearch(debouncedSearchQuery);
  }, [debouncedSearchQuery, onSearch]);

  return (
    <InputGroup maxW="500px">
      <Input
        placeholder="Поиск по адресу / номеру наряда"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        color="black"
      />
      {isLoading && (
        <InputRightElement>
          <Spinner size="sm" color="orange.500" />
        </InputRightElement>
      )}
    </InputGroup>
  );
};
