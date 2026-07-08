import { Router } from 'express';
import { createReport, getMyReports, updateReport, submitReport } from '../controllers/reportController';
import { protect, authorize } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { reportCreateSchema, reportUpdateSchema } from '../validators/reportValidators';

const router = Router();

// Only members manage personal reports (Managers will have a separate dashboard route)
router.use(protect, authorize('member')); 

router.post('/', validate(reportCreateSchema), createReport);
router.get('/me', getMyReports);
router.put('/:id', validate(reportUpdateSchema), updateReport);
router.patch('/:id/submit', submitReport); // PATCH is semantic for changing a single state (status)

export default router;