"use client"

import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {Separator} from "@/components/ui/separator";
import {useMutation, useQueryClient, useSuspenseQueries} from "@tanstack/react-query";
import {Button} from "@/components/ui/button";
import {useRouter} from "next/navigation";
import {Textarea} from "@/components/ui/textarea";
import {useState} from "react";
import {Input} from "@/components/ui/input";

export default function Component({params}: { params: { id: number }}) {
    const boardId = params.id;
    const router = useRouter()

    // 실제 구현해야 하는 데이터 부분
    const getPostData = (boardId : number) => ({
        title: "hello",
        nickname: "허경영",
        createdAt: "2023-12-12",
        content: "conetns"
    });

    // 실제 구현해야 하는 데이터 부분
    const getCommentList = (boardId : number) => [
        {
            title: "hello",
            nickname: "허경영",
            createdAt: "2023-12-12",
            content: "content 1"
        },
        {
            title: "world",
            nickname: "홍길동",
            createdAt: "2024-01-15",
            content: "content 2"
        },
        {
            title: "example",
            nickname: "김철수",
            createdAt: "2024-02-20",
            content: "content 3"
        }
    ];

    // 실제 구현해야 하는 파트
    const deletePost = (param: number) => {
        return Promise.resolve(undefined);
    };



    const results = useSuspenseQueries({
        queries: [
            {
                queryKey: ['Board', boardId],
                queryFn: () => getPostData(boardId)
            },
            {
                queryKey: ['commentsList', boardId],
                queryFn: () => getCommentList(boardId)
            }
        ]
    });

    const [post, comments] = results.map((result: { data: any; }) => result.data);

    const handleEdit = () => router.push(`/modify/${boardId}`);
    const handleDelete =  () => null;
    const handleBack = () => router.push("/");

    const [newContents, setNewContents] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [newNickName, setNewNickName] = useState("");
    const queryClient = useQueryClient();

    // 실제로 구현해야 하는 파트
    // 실제 댓글 API 파트
    const writeComment =  (param:any) => (param);

    const {mutate:CommentAdd} = useMutation({
        mutationFn: (param:Object) => writeComment(param),
        onSuccess: (data, variables, context) => {
            queryClient.invalidateQueries({queryKey: ['commentList', boardId]})
            setNewContents('');
        },
    })


    const {mutate} = useMutation({
        mutationFn: (param: number) => deletePost(param),
        onSuccess: (data, variables, context) => {
            queryClient.invalidateQueries({queryKey: ['board']});
            router.push(`/`);
        },
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
                <div className="flex gap-2">
                    <Button onClick={handleEdit}>Edit</Button>
                    <Button variant="outline" onClick={handleDelete}>
                        Delete
                    </Button>
                    <Button variant="outline" onClick={handleBack}>
                        Back to List
                    </Button>
                </div>
                <p>{post.content}</p>
                <div className="mt-8 space-y-4">
                    <h2 className="text-2xl font-bold">Comments</h2>
                    <div className="space-y-4">
                        {comments.map(comment => (
                            <div key={comment.id} className="flex items-start gap-4">
                                <Avatar>
                                    <AvatarImage src="/placeholder-user.jpg"/>
                                    <AvatarFallback>nickName</AvatarFallback>
                                </Avatar>
                                <div className="flex-1 space-y-2">
                                    <div className="flex items-center justify-between">
                                        <div className="font-medium">{comment.nickname}</div>
                                        <div
                                            className="text-xs text-muted-foreground">{new Date(comment.createdAt).toLocaleDateString()}</div>
                                    </div>
                                    <p>{comment.content}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex gap-2">
                    <div className="flex-1 space-y-2">
                        <Input value={newNickName} onChange={(e) => setNewNickName(e.target.value)} placeholder="Nickname"/>
                        <Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Password"/>
                    </div>
                    <Textarea
                        value={newContents}
                        onChange={(e) => setNewContents(e.target.value)}
                        placeholder="Write your comment..."
                        className="flex-1"
                    />
                    <Button onClick={handleCommentSubmit}>Submit</Button>
                </div>
            </article>
        </div>
    );
}