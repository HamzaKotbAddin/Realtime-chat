import axios from "axios";
import { NEXTJS_URL } from "@/utils/constants";


export const apiClient = axios.create({
  baseURL: NEXTJS_URL,
  withCredentials: true, 
});