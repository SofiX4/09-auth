import ReactPaginate from "react-paginate";
import css from "./Pagination.module.css";

interface PaginationProps {
  pageCount: number;
  onPageChange: (selectedItem: { selected: number }) => void;
  currentPage: number;
}

export default function Pagination({
  pageCount,
  onPageChange,
  currentPage,
}: PaginationProps) {
  return (
    <ReactPaginate
      previousLabel={"←"}
      nextLabel={"→"}
      breakLabel={"..."}
      pageCount={pageCount}
      marginPagesDisplayed={2}
      pageRangeDisplayed={3}
      onPageChange={onPageChange}
      forcePage={Math.max(0, (currentPage || 1) - 1)}
      containerClassName={css.pagination}
      activeClassName={css.active}
      pageLinkClassName={css.pageLink}
      previousLinkClassName={css.pageLink}
      nextLinkClassName={css.pageLink}
      breakLinkClassName={css.pageLink}
    />
  );
}
