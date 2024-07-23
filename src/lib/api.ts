import axios from 'axios';
import { Board } from '@/types/Board';

function makeQuerystring(obj: any): string {
  const querystring: string[] = [];
  for (const key in obj) {
    const value = obj[key as keyof any];
    querystring.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`);
  }
  return `?${querystring.join("&")}`;
}

export type SORTBY = "LATEST" | "OLDEST";

export interface SearchBoardParams {
  searchKeyword?: string; //선택
  nickname?: string; //선택
  sortBy: SORTBY; //필수.
  page: number;
  size: number;
}
export interface SearchBoardResponse {
  content: Board[];
  totalPages: number;
  totalElements: number;
  last: boolean;
}

const API_URL = process.env.NEXT_PUBLIC_BACKED_URL;

export const searchBoard = async (
  params: SearchBoardParams
): Promise<SearchBoardResponse> => {
  const url = `board${makeQuerystring(params)}`;
  console.log(API_URL)
  const response = await axios.get(`${API_URL}/${url}`);
  console.log(response.data.content)
  console.log(response.data)
  return response.data;
};

export const getBoard = async (id: number): Promise<Board> => {
  const response = await axios.get(`${API_URL}/board/${id}`);
  return response.data;
};

export const createPost = async (post: any): Promise<Board> => {
  const response = await axios.post(`${API_URL}/board`, post);
  return response.data;
};

export const updateBoard = async (id: number, post: any): Promise<any> => {
  const response = await axios.patch(`${API_URL}/board/${id}`, post);
  return response.data;
};

export const deleteBoard = async (id: number, password: any): Promise<any> => {
  const response = await axios.post(`${API_URL}/board/${id}`, password);
  return response.data;
};

export const getCommentList = async (id: number): Promise<Board> => {
  const response = await axios.get(`${API_URL}/board/${id}/comment`);
  return response.data;
};

export const createComment = async (id: number, comment: any): Promise<Board> => {
  const response = await axios.post(`${API_URL}/board/${id}/comment`, comment);
  return response.data;
};




