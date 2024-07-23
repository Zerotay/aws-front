"use client"
import {Card, CardHeader, CardTitle, CardContent, CardFooter} from "@/components/ui/card"
import {Label} from "@/components/ui/label"
import {Input} from "@/components/ui/input"
import {Textarea} from "@/components/ui/textarea"
import {Button} from "@/components/ui/button"
import {useRouter} from "next/navigation";
import {Board} from "@/types/Board"
import {useState} from "react"
import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query';
import axios from "axios";
import {createPost} from "@/lib/api";
import {toast} from "@/components/ui/use-toast";

const API_URL = process.env.NEXT_PUBLIC_APP_URL;

// export default function Component() 
export default function InputForm() {
    const [title, setTitle] = useState<string>();
    const [content, setContent] = useState<string>();
    const [nickname, setNickname] = useState<string>();
    const [password, setPassword] = useState<string>();


    const router = useRouter();
    const handleCancel = () => {
        router.back();
    }

    const {mutate} = useMutation({
        mutationFn: (param: any) => createPost(param),
        onSuccess: (data, variables, context) => {
            router.push(`/detail/${data}`);
        },
        onError: (data, variables, context) => {
            toast({
                title: "게시글 등록에 실패하였습니다..",
            })

        },
    });

    // 폼 제출 핸들러
    const handleSubmit = (event: any) => {
        event.preventDefault();
        const createdPost = {
            nickname: nickname,
            password: password,
            title: title,
            content: content
        };
        mutate(createdPost);
    };
    return (
        <div className="flex h-screen items-center justify-center">
            <Card className="w-full max-w-2xl">
                <CardHeader>
                    <CardTitle>{"\uC0C8 \uAC8C\uC2DC\uBB3C \uC791\uC131"}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="title">제목</Label>
                        <Input id="title" type="text" placeholder="제목을 입력하세요" defaultValue={title} onChange={event => setTitle(event.target.value)} required/>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="author">작성자명</Label>
                        <Input id="author" type="text" placeholder="작성자명을 입력하세요" defaultValue={nickname} onChange={event => setNickname(event.target.value)}/>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password">비밀번호</Label>
                        <Input id="password" type="password" placeholder="비밀번호를 입력하세요" defaultValue={password} onChange={event => setPassword(event.target.value)}/>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="content">내용</Label>
                        <Textarea
                            id="content"
                            placeholder="내용을 입력하세요"
                            className="min-h-[200px]"
                            defaultValue={content}
                            onChange={event => setContent(event.target.value)}
                        />
                    </div>
                </CardContent>
                <CardFooter className="flex justify-end gap-2">
                    <Button variant="outline" onClick={handleCancel}>
                        취소
                    </Button>
                    <Button type="submit" onClick={handleSubmit}>
                        {"\uC791\uC131"}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}
