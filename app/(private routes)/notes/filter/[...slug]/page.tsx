import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import NotesClient from "./Notes.client";
import { fetchNotes } from "@/lib/api/serverApi";
import type { Metadata } from "next";

interface FilterPageProps {
  params: Promise<{
    slug: string[];
  }>;
}

export async function generateMetadata({
  params,
}: FilterPageProps): Promise<Metadata> {
  const { slug } = await params;
  const currentTag = slug[0] || "all";

  const tagName = currentTag !== "all" ? currentTag : "All Notes";

  return {
    title: `${tagName} - NoteHub`,
    description: `Browse ${tagName.toLowerCase()} in your personal note management app.`,
    openGraph: {
      title: `${tagName} - NoteHub`,
      description: `Browse ${tagName.toLowerCase()} in your personal note management app.`,
      url: `https://notehub.com/notes/filter/${currentTag}`,
      siteName: "NoteHub",
      images: [
        {
          url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
          width: 1200,
          height: 630,
          alt: `${tagName} - NoteHub`,
        },
      ],
      type: "website",
    },
  };
}

export default async function FilterPage({ params }: FilterPageProps) {
  const { slug } = await params;
  const currentTag = slug[0];

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["notes", currentTag || "all"],
    queryFn: async () => {
      const queryParams =
        currentTag && currentTag !== "all" ? { tag: currentTag } : {};
      return fetchNotes(queryParams);
    },
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient initialTag={currentTag} />
    </HydrationBoundary>
  );
}
