"use client"
import {Card, CardHeader, CardTitle, CardContent, CardFooter} from "@/components/ui/card"
import {Label} from "@/components/ui/label"
import {Input} from "@/components/ui/input"
import {Textarea} from "@/components/ui/textarea"
import {Button} from "@/components/ui/button"
import {useRouter} from "next/navigation";
import {getBoard, updateBoard} from "@/lib/api"
import {useEffect, useState} from "react"
import {useMutation, useQuery, useQueryClient, useSuspenseQuery} from '@tanstack/react-query';


// export default function Component()
export default function InputForm({
                                      params,
                                  }: {
    params: { id: number };
}) {
    const router = useRouter();
    const queryClient = useQueryClient();

    const {data, isSuccess} = useSuspenseQuery({
        queryKey: [params.id],
        queryFn: context => getBoard(params.id),
    })

    const {mutate} = useMutation({
        mutationFn: (param: any) => updateBoard(params.id, param),
        onSuccess: (data, variables, context) => {
            queryClient.invalidateQueries({queryKey: [params.id]});
            router.push(`/detail/${params.id}`);
        },
        onError: (data, variables, context) => {
            console.log(data);

        },
    });

    const [title, setTitle] = useState<string>(data.title);
    const [content, setContent] = useState<string>(data.content);
    const [nickname, setNickname] = useState<string>(data.nickname);
    const [password, setPassword] = useState<string>(data.password);

    // 폼 제출 핸들러
    const handleSubmit = (event: any) => {
        event.preventDefault();
        const updatedPost = {
            id: params.id,
            nickname: nickname,
            password: password,
            title: title,
            content: content
        };
        mutate(updatedPost);
    };

    const handleCancel = () => {
        router.back();
    }

    return (
        <div className="flex justify-center">
            <Card className="w-full max-w-2xl">
                <CardHeader>
                    <CardTitle>{"게시물 수정"}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="title">제목 *</Label>
                        <Input id="title" type="text" placeholder="제목을 입력하세요" defaultValue={title} required/>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="author">작성자명</Label>
                        <Input id="author" type="text" placeholder="작성자명을 입력하세요" defaultValue={nickname}/>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password">비밀번호</Label>
                        <Input id="password" type="password" placeholder="비밀번호를 입력하세요" defaultValue={password}/>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="content">내용</Label>
                        <Textarea
                            id="content"
                            placeholder="내용을 입력하세요"
                            className="min-h-[200px]"
                            defaultValue={content}
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
