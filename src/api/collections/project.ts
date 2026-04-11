import type {
  Project,
  ProjectFileContent,
  ProjectFiles,
} from "../../models/Project";
import { API } from "../api";

export const getAllProjects = (): Promise<Project[]> => {
  return API.get("/v1/projects");
};

export const updateProject = (payload: {
  projectId: number;
  body: { name: string };
}): Promise<Project> => {
  return API.patch(`/v1/projects/${payload.projectId}`, payload.body);
};

export const deleteProject = (projectId: number): Promise<void> => {
  return API.delete(`/v1/projects/${projectId}`);
};

export const getProjectFiles = (projectId: number): Promise<ProjectFiles> => {
  return API.get(`/v1/projects/${projectId}/files`);
};

export const getProjectFileContent = (
  projectId: number,
  path: string,
): Promise<ProjectFileContent> => {
  return API.get(`/v1/projects/${projectId}/files/content?path=${path}`);
};
