"use client"

import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {Separator} from "@/components/ui/separator";
import {QueryClient, useMutation, useQueryClient, useSuspenseQueries} from "@tanstack/react-query";
import {Button} from "@/components/ui/button";
import {useRouter} from "next/navigation";
import {Textarea} from "@/components/ui/textarea";
import {AwaitedReactNode, JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal, useState} from "react";
import {Input} from "@/components/ui/input";
import {createComment, deleteBoard, getBoard, getCommentList} from "@/lib/api";
import {toast} from "@/components/ui/use-toast";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {Label} from "@/components/ui/label";

export default function Component({params}: { params: { id: number } }) {
    const boardId = params.id;
    const router = useRouter()


    const results = useSuspenseQueries({
        queries: [
            {
                queryKey: ['Board', boardId],
                queryFn: () => getBoard(boardId)
            },
            {
                queryKey: ['commentsList', boardId],
                queryFn: () => getCommentList(boardId)
            }
        ]
    });

    const [post, comments] = results.map((result: { data: any; }) => result.data);

    const handleEdit = () => router.push(`/modify/${boardId}`);
    const handleDelete = () => {

    };
    const handleBack = () => router.push("/");

    const [newContents, setNewContents] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [newNickName, setNewNickName] = useState("");
    const [deletePassword, setDeletePassword] = useState("");

    const queryClient = useQueryClient();

    // 실제로 구현해야 하는 파트
    // 실제 댓글 API 파트
    const {mutate: CommentAdd} = useMutation({
        mutationFn: (param: Object) => createComment(boardId, param),
        onSuccess: (data, variables, context) => {
            queryClient.invalidateQueries({
                queryKey: ['commentsList', boardId],
                type: "all"
            })
            setNewContents('')
            setNewNickName((prevState) => "")
            setNewPassword((prevState) => "")
        }
    })


    const {mutate: boardDelete} = useMutation({
        mutationFn: (param: string) => deleteBoard(boardId, {password: param}),
        onSuccess: (data, variables, context) => {
            queryClient.invalidateQueries({queryKey: ['board']});
            router.push(`/`);
        },
        onError: (error, variables, context) => {
            toast({
                title: "게시글 삭제가 불가능합니다.",
                description: "올바른 비밀번호를 입력하세요",
            })
        }
    })

    const handleCommentSubmit = () => {
        const newComment = {
            password: newPassword,
            nickname: newNickName,
            content: newContents
        }
        CommentAdd(newComment)
    }
    return (
        <div className="px-4 py-6 md:px-6 lg:py-16 md:py-12">
            <article className="prose prose-gray mx-auto dark:prose-invert">
                <div className="space-y-2 not-prose">
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl lg:leading-[3.5rem]">
                        {post.title}
                    </h1>
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <div className="flex items-center gap-2">
                            <Avatar>
                                <AvatarImage src="/placeholder-user.jpg"/>
                                <AvatarFallback>nickName</AvatarFallback>
                            </Avatar>
                            <div className="text-sm font-medium">{post.nickname}</div>
                        </div>
                        <Separator orientation="vertical"/>
                        <div className="text-sm">{new Date(post.createdAt).toLocaleDateString()}</div>
                    </div>
                </div>
                <div className="flex gap-2 float-end">
                    <Button onClick={handleEdit}>Edit</Button>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="outline">Delete</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>게시글 삭제</DialogTitle>
                                <DialogDescription>
                                    게시글을 삭제하시기 위해 비밀번호를 입력해주세요.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="name" className="text-right">
                                        비밀번호
                                    </Label>
                                    <Input
                                        id="name"
                                        type={"password"}
                                        defaultValue=""
                                        className="col-span-3"
                                        onChange={event => setDeletePassword(event.target.value)}
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button
                                    type="submit"
                                    onClick={event => boardDelete(deletePassword)}
                                >삭제하기</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                    <Button variant="outline" onClick={handleBack}>
                        Back to List
                    </Button>
                </div>
                <div className={"mt-12"}> {post.content}</div>
                <div className="mt-8 space-y-4">
                    <h2 className="text-2xl font-bold">Comments</h2>
                    <div className="space-y-4">
                        {comments.map((comment: {
                            id: Key | null | undefined;
                            nickname: string | null | undefined;
                            content: string | null | undefined;
                            createdAt: string | null | undefined;
                        }) => (
                            <div key={comment.id} className="flex items-start gap-4">
                                <Avatar>
                                    <AvatarImage src="/placeholder-user.jpg"/>
                                    <AvatarFallback>nickName</AvatarFallback>
                                </Avatar>
                                <div className="flex-1 space-y-2">
                                    <div className="flex items-center justify-between">
                                        <div className="font-medium">{comment.nickname}</div>
                                        <div
                                            className="text-xs text-muted-foreground">{comment.createdAt}</div>
                                    </div>
                                    <p>{comment.content}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className={"mt-6"}>
                    <div className="flex gap-2">
                        <div className="flex-2 space-y-3">
                            <Input value={newNickName} onChange={(e) => setNewNickName(e.target.value)}
                                   placeholder="Nickname"/>
                            <Input type="password" value={newPassword}
                                   onChange={(e) => setNewPassword(e.target.value)} placeholder="Password"/>
                        </div>
                        <Textarea
                            value={newContents}
                            onChange={(e) => setNewContents(e.target.value)}
                            placeholder="Write your comment..."
                            className="flex-1"
                        />
                        <Button onClick={handleCommentSubmit}>Submit</Button>
                    </div>
                </div>
            </article>
        </div>
    );
}