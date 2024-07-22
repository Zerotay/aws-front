"use client"
import Link from "next/link"
import { Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationLink, PaginationNext } from "@/components/ui/pagination"
import { Board } from "@/types/Board"
import { useRouter } from "next/router"
import { useQueryClient, useSuspenseQuery, useMutation } from "@tanstack/react-query"
import { useEffect,useState } from "react"

import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { ModeToggle } from "@/components/mode-toggle"
import { SORTBY, searchBoard , SearchBoardParams} from "@/lib/api"


const posts: Board[] = [
  {title: "1", content: 'qwer', nickname: '123', boardId:1, password:'234'},
  {title: "2", content: 'qwer', nickname: '123', boardId:2, password:'234'},
];


const API_URL = process.env.BACKEND_URL;


export default function Home() {
  // const router = useRouter();
  const queryClient = useQueryClient();

  const [page, setPage] = useState('1');
  const [size, setSize] = useState(10);
  const [sortby, setSortby] = useState<SORTBY>('LATEST');
  const [boardList, setBoardList] = useState<Board[]>([]);
  const [searchBoardParams, setSearchBoardParams] = useState<SearchBoardParams>({
    sortBy: "LATEST",
    page: 1,
    size: 10,
  });

    useEffect(() => {
    if (page) {
      searchBoardParams.page = parseInt(page) - 1;
      setSearchBoardParams(searchBoardParams);
    }
    window.scrollTo(0, 0); // 페이지 이동 시 스크롤 위치 맨 위로 초기화
  }, [page]);

  


  const {data, isSuccess} = useSuspenseQuery({
      queryKey: [searchBoardParams],
      queryFn: context => {
      return searchBoard(searchBoardParams);
    }
    ,
  })
  const pageclick =  () => {
    // setPage()

  }
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
        </div>
        <div className="grid grid-cols-1 gap-6 py-12 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 lg:gap-8">
            <div className="grid grid-cols-1 gap-6 py-12 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 lg:gap-8">
            {data.content && data.content.map((post) => (
              <div key={post.boardId} className="group relative rounded-lg shadow-md">
                <Link href="#" className="absolute inset-0 z-10" prefetch={false}>
                  <span className="sr-only">View Post</span>
                </Link>
                <div className="space-y-2 p-4">
                  <h3 className="text-lg font-semibold">{post.title}</h3>
                  <p className="text-muted-foreground">{post.nickname}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
            {data.totalPages && Array.from({length:data.totalPages}, (_,i)=>i+1).map((i) => (
                  <PaginationItem>
                    <PaginationLink href="#" onClick={pageclick}>{i}</PaginationLink>
                  </PaginationItem>
              ))}
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
      </section>
     </main>
  )
}
