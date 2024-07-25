"use client"
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "@/components/ui/card"
import {Label} from "@/components/ui/label"
import {Input} from "@/components/ui/input"
import {Textarea} from "@/components/ui/textarea"
import {Button} from "@/components/ui/button"
import {useRouter} from "next/navigation";
import {getBoard, updateBoard} from "@/lib/api"
import {useState} from "react"
import {useMutation, useQueryClient, useSuspenseQuery} from '@tanstack/react-query';
import {toast} from "@/components/ui/use-toast";


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
            toast({
                title: "게시글 등록에 실패하였습니다..",
            })
        },
    });

    const [title, setTitle] = useState<string>(data.title);
    const [content, setContent] = useState<string>(data.content);
    const [nickname, setNickname] = useState<string>(data.nickname);
    const [password, setPassword] = useState<string>(data.password);

    // 폼 제출 핸들러
    const handleSubmit = (event: any) => {
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
        <div className="flex h-screen items-center justify-center">
            <Card className="w-full max-w-2xl">
                <CardHeader>
                    <CardTitle>{"게시물 수정"}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="title">제목 *</Label>
                        <Input id="title" type="text" placeholder="제목을 입력하세요" defaultValue={title} required
                               onChange={event => setTitle(event.target.value)}/>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="author">작성자명</Label>
                        <Input id="author" type="text" placeholder="작성자명을 입력하세요" defaultValue={nickname}
                               onChange={event => setNickname(event.target.value)}/>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password">비밀번호</Label>
                        <Input id="password" type="password" placeholder="비밀번호를 입력하세요"
                               onChange={event => setPassword(event.target.value)}/>
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
