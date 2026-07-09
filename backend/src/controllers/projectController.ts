import { Request, Response } from 'express';
import { asyncHandler } from '../middleware/asyncHandler';
import { projectService } from '../services/projectService';

export const getAllProjects = asyncHandler(async (req: Request, res: Response) => {
  const projects = await projectService.getAllProjects();
  res.status(200).json({ success: true, data: { projects } });
});

export const createProject = asyncHandler(async (req: Request, res: Response) => {
  // Inject the authenticated manager's ID into the project data
  const projectData = {
    ...req.body,
    createdBy: req.user!.id 
  };
  
  const project = await projectService.createProject(projectData);
  res.status(201).json({ success: true, data: { project } });
});

export const updateProject = asyncHandler(async (req: Request, res: Response) => {
  const project = await projectService.updateProject(req.params.id, req.body);
  res.status(200).json({ success: true, data: { project } });
});

export const deleteProject = asyncHandler(async (req: Request, res: Response) => {
  await projectService.deleteProject(req.params.id);
  res.status(200).json({ success: true, data: {} });
});