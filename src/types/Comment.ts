// LocalDateTime 타입 정의 (ISO 8601 형식의 문자열)
export type LocalDateTime = string;

// Comment 객체의 타입 정의
export type Comment = {
    id: number;
    nickname: string;
    title: string;
    content: string;
    createdAt: LocalDateTime; // ISO 8601 형식의 날짜 문자열
};

// 예시 데이터 배열 타입 정의
export type CommentArray = Comment[];