"use client"
import Link from "next/link";
import { Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationLink, PaginationNext } from "@/components/ui/pagination";
import { Board } from "@/types/Board";
import { useQueryClient, useSuspenseQuery, useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import {Button, buttonVariants} from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { ModeToggle } from "@/components/mode-toggle";
import { SORTBY, searchBoard, SearchBoardParams } from "@/lib/api";
import {
  Dialog,
  DialogContent,
  DialogDescription, DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {useRouter} from "next/navigation";

export default function Home() {
  const queryClient = useQueryClient();

  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [sortby, setSortby] = useState<SORTBY>('LATEST');
  const [searchBoardParams, setSearchBoardParams] = useState<SearchBoardParams>({
    sortBy: "LATEST",
    page: 0,
    size: 5,
  });

  const route = useRouter()

  const { data, isSuccess, refetch } = useSuspenseQuery({
    queryKey: [searchBoardParams],
    queryFn: () => searchBoard(searchBoardParams)
  });

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    setSearchBoardParams({ ...searchBoardParams, page: newPage });
  };

  const getPageRange = (currentPage: number, totalPages: number) => {
    const rangeSize = 10;
    const start = Math.floor(currentPage / rangeSize) * rangeSize;
    const end = Math.min(start + rangeSize, totalPages);
    return { start, end };
  };

  return (
      <main className="flex h-screen items-center justify-center">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Our Latest Posts</h2>
                <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Explore our collection of beautifully designed posts.
                </p>
              </div>
              <Button onClick={event => {route.push("/write")}}> 작성하기 </Button>
            </div>
            <div className="grid grid-cols-1 gap-6 py-12 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 lg:gap-8">
              {data.content.map((post) => (
                  <div key={post.id} className="group relative rounded-lg shadow-md">
                    <Link href={`/detail/${post.id}`} className="absolute inset-0 z-10" prefetch={false}>
                      <span className="sr-only">View Post</span>
                    </Link>
                    <div className="space-y-2 p-4">
                      <h3 className="text-lg font-semibold">{post.title}</h3>
                      <p className="text-muted-foreground">{post.nickname}</p>
                    </div>
                  </div>
              ))}
            </div>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  {page > 0 && <PaginationPrevious onClick={() => handlePageChange(page - 1)}/>}
                </PaginationItem>
                {(() => {
                  const {start, end} = getPageRange(page, data.totalPages);
                  return Array.from({length: end - start}).map((_, index) => {
                    const pageIndex = start + index;
                    return (
                        <PaginationItem key={pageIndex}>
                          <PaginationLink href="#" onClick={() => handlePageChange(pageIndex)}
                                          isActive={pageIndex === page} aria-disabled={pageIndex === page}>
                            {pageIndex + 1}
                          </PaginationLink>
                        </PaginationItem>
                    );
                  });
                })()}
                <PaginationItem>
                  {!data.last && <PaginationNext onClick={() => handlePageChange(page + 1)}/>}
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </section>
      </main>
  );
}
