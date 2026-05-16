"use client";

import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { fetchNotes } from "@/lib/api/clientApi";
import Link from "next/link";
import SearchBox from "@/components/SearchBox/SearchBox";
import NoteList from "@/components/NoteList/NoteList";
import Pagination from "@/components/Pagination/Pagination";
import css from "./NotesPage.module.css";

interface NotesClientProps {
  initialTag?: string;
}

export default function NotesClient({ initialTag }: NotesClientProps) {
  const currentTag = initialTag || "all";
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const { data, isLoading, error } = useQuery({
    queryKey: ["notes", currentTag, debouncedSearch, currentPage],
    queryFn: async () => {
      const queryParams: {
        tag?: string;
        search?: string;
        page?: number;
        perPage?: number;
      } = {
        page: currentPage,
        perPage: 12,
      };

      if (currentTag && currentTag !== "all") {
        queryParams.tag = currentTag;
      }

      if (debouncedSearch) {
        queryParams.search = debouncedSearch;
      }

      return fetchNotes(queryParams);
    },
  });

  const notes = data?.notes || [];
  const totalPages = data?.totalPages || 1;

  const handleSearch = (value: string) => {
    setSearchQuery(value);
  };

  const handlePageChange = (selectedItem: { selected: number }) => {
    setCurrentPage(selectedItem.selected + 1);
  };

  if (error) {
    return <p>Error loading notes. Please try again.</p>;
  }

  return (
    <div className={css.app}>
      <div className={css.toolbar}>
        <h1 style={{ margin: 0 }}>
          {currentTag !== "all" ? `${currentTag} Notes` : "All Notes"}
        </h1>
        <Link href="/notes/action/create" className={css.button}>
          Create Note +
        </Link>
      </div>

      <SearchBox value={searchQuery} onSearch={handleSearch} />

      {isLoading ? (
        <p>Loading...</p>
      ) : notes.length === 0 ? (
        <p>No notes found.</p>
      ) : (
        <>
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              pageCount={totalPages}
              onPageChange={handlePageChange}
            />
          )}
          <NoteList notes={notes} />
        </>
      )}
    </div>
  );
}
