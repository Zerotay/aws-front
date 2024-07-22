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

const API_URL = process.env.BACKEND_URL;

export const searchBoard = async (
  params: SearchBoardParams
): Promise<Board[]> => {
  const url = `board${makeQuerystring(params)}`;
  const response = await axios.get(`${API_URL}/${url}`);
  return response.data;
};

export const getBoard = async (id: number): Promise<Board> => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

export const updateBoard = async (id: number, post: Board): Promise<Board> => {
  const response = await axios.put(`${API_URL}/${id}`, post);
  return response.data;
};

export const deleteBoard = async (id: number, password: string): Promise<Board> => {
  const response = await axios.post(`${API_URL}/${id}`, password);
  return response.data;
};
