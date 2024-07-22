import Link from "next/link"
import { Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationLink, PaginationNext } from "@/components/ui/pagination"
import { Board } from "@/types/Board"

import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { ModeToggle } from "@/components/mode-toggle"

type Post = {
  postId: number;
  title: string;
  content: string;
  nickname: string;
};

const posts: Board[] = [
  {title: "1", content: 'qwer', nickname: '123', boardId:1},
  {title: "2", content: 'qwer', nickname: '123', boardId:2},
];


export default function Home() {
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
            {posts.map((post) => (
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
            <PaginationItem>
              <PaginationLink href="#">1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">2</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">3</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
      </section>
    {/*   <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center"> */}
    {/*     <Icons.logo className="h-16 w-16" /> */}
    {/*     <h1 className="text-4xl font-semibold sm:text-5xl md:text-6xl lg:text-7xl"> */}
    {/*       {siteConfig.name} */}
    {/*     </h1> */}
    {/*     <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8"> */}
    {/*       {siteConfig.description} */}
    {/*     </p> */}
    {/*     <div className="flex gap-2"> */}
    {/*       <Link */}
    {/*         href={siteConfig.links.github} */}
    {/*         target="_blank" */}
    {/*         className={cn(buttonVariants({ size: "default" }))} */}
    {/*       > */}
    {/*         Get Started */}
    {/*       </Link> */}
    {/*       <ModeToggle /> */}
    {/*     </div> */}
    {/*   </div> */}
     </main>
  )
}
