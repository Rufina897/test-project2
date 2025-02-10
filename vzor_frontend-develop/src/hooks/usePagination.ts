import { useState, useCallback, useMemo, useEffect } from "react";

interface UsePaginationProps {
  headers?: {
    "x-pagination-current-page"?: string;
    "x-pagination-page-count"?: string;
    "x-pagination-per-page"?: string;
    "x-pagination-total-count"?: string;
  };
  totalFilteredItems?: number;
  itemsPerPage?: number;
}

interface UsePaginationReturn {
  currentPage: number;
  pageCount: number;
  perPage: number;
  totalCount: number;
  nextPage: () => void;
  prevPage: () => void;
  setPage: (page: number) => void;
  canNextPage: boolean;
  canPrevPage: boolean;
  pages: number[];
}

export const usePagination = ({
  headers,
  totalFilteredItems,
  itemsPerPage = 20,
}: UsePaginationProps): UsePaginationReturn => {
  const [currentPage, setCurrentPage] = useState<number>(
    Number(headers?.["x-pagination-current-page"]) || 1
  );

  const perPage =
    itemsPerPage || Number(headers?.["x-pagination-per-page"]) || 20;
  const totalCount =
    totalFilteredItems || Number(headers?.["x-pagination-total-count"]) || 0;

  const pageCount = Math.ceil(totalCount / perPage);

  const nextPage = useCallback(() => {
    setCurrentPage((prev) => Math.min(prev + 1, pageCount));
  }, [pageCount]);

  const prevPage = useCallback(() => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  }, []);

  const setPage = useCallback(
    (page: number) => {
      const pageNumber = Math.max(1, Math.min(page, pageCount));
      setCurrentPage(pageNumber);
    },
    [pageCount]
  );

  useEffect(() => {
    if (currentPage > pageCount) {
      setCurrentPage(1);
    }
  }, [pageCount, currentPage]);

  const canNextPage = currentPage < pageCount;
  const canPrevPage = currentPage > 1;

  const pages = useMemo(() => {
    return Array.from({ length: pageCount }, (_, i) => i + 1);
  }, [pageCount]);

  return {
    currentPage,
    pageCount,
    perPage,
    totalCount,
    nextPage,
    prevPage,
    setPage,
    canNextPage,
    canPrevPage,
    pages,
  };
};
