import type { ChatHistory } from "../../models/Chat";
import { API } from "../api";

export const getChatHistory = (projectId: number): Promise<ChatHistory[]> => {
  return API.get(`/v1/chat/projects/${projectId}`);
};
