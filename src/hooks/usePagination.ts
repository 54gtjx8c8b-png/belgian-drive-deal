import { useState, useMemo } from "react";

export const usePagination = <T>(items: T[], itemsPerPage: number = 12) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(items.length / itemsPerPage);

  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return items.slice(startIndex, endIndex);
  }, [items, currentPage, itemsPerPage]);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      // Scroll to top of results
      window.scrollTo({ top: 400, behavior: "smooth" });
    }
  };

  const nextPage = () => goToPage(currentPage + 1);
  const prevPage = () => goToPage(currentPage - 1);

  // Reset to page 1 when items change
  const resetPage = () => setCurrentPage(1);

  return {
    currentPage,
    totalPages,
    paginatedItems,
    goToPage,
    nextPage,
    prevPage,
    resetPage,
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1,
    totalItems: items.length,
    startItem: (currentPage - 1) * itemsPerPage + 1,
    endItem: Math.min(currentPage * itemsPerPage, items.length),
  };
};
