import { PaginationMeta } from "../types";

export const extractPaginationFromHeaders = (
  headers: Record<string, string>
): PaginationMeta => {
  return {
    currentPage: parseInt(headers["x-pagination-current-page"] || "1"),
    pageCount: parseInt(headers['x-pagination-page-count'] || '1'),
    perPage: parseInt(headers['x-pagination-per-page'] || '20'),
    totalCount: parseInt(headers['x-pagination-total-count'] || '0')
  };
}; 