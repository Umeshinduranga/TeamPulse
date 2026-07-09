import { Router } from 'express';
import { getAllProjects, createProject, updateProject, deleteProject } from '../controllers/projectController';
import { protect, authorize } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { projectCreateSchema, projectUpdateSchema } from '../validators/projectValidators';

const router = Router();

router.use(protect); // All routes require login

router.get('/', getAllProjects); // Any authenticated user can view projects

// ONLY Managers can modify projects
router.post('/', validate(projectCreateSchema), createProject);
router.put('/:id', authorize('manager'), validate(projectUpdateSchema), updateProject);
router.delete('/:id', authorize('manager'), deleteProject);

export default router;