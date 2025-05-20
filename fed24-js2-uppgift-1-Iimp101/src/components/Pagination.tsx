import React from 'react';
import "../CSS/Pagination.css";

interface PaginationProps {
    hasNextPage: boolean;
	hasPreviousPage: boolean;
	onNextPage: () => void;
	onPreviousPage: () => void;
	page: number;
	totalPages?: number;
}

const Pagination: React.FC<PaginationProps> = ({
    hasPreviousPage,
	hasNextPage,
	onNextPage,
	onPreviousPage,
	page,
	totalPages,    
}) => {
    return (
        <div className="pagination-container">
            <button
                className="pagination-button"
                onClick={onPreviousPage}
                disabled={!hasPreviousPage}
            >
                ← Previous
            </button>

            <span className="pagination-info">
                Page {page} {totalPages && `/ ${totalPages}`}
            </span>

            <button 
                className="pagination-button"
                onClick={onNextPage}
                disabled={!hasNextPage}
            >
                Next →                
            </button>
        </div>
    )
}
export default Pagination;
