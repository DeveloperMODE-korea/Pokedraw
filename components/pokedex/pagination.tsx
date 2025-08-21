'use client';

import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div className="flex items-center justify-center gap-4 mt-8">
      <Button onClick={handlePrevious} disabled={currentPage === 1} variant="outline">
        <ChevronLeft className="h-4 w-4 mr-2" />
        이전
      </Button>
      <span className="text-lg font-medium">
        {currentPage} / {totalPages}
      </span>
      <Button onClick={handleNext} disabled={currentPage === totalPages} variant="outline">
        다음
        <ChevronRight className="h-4 w-4 ml-2" />
      </Button>
    </div>
  );
}
