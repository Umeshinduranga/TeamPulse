import { Router } from 'express';
import { dashboardController } from '../controllers/dashboardController';
import { protect, authorize } from '../middleware/auth';
import { asyncHandler } from '../middleware/asyncHandler';

const router = Router();

router.use(protect, authorize('manager'));

router.get('/reports', asyncHandler(dashboardController.getReports));
router.get('/summary', asyncHandler(dashboardController.getSummary));
router.get('/submission-status', asyncHandler(dashboardController.getSubmissionStatus));
router.get('/workload', asyncHandler(dashboardController.getWorkloadByProject));
router.get('/tasks-trend', asyncHandler(dashboardController.getTasksTrend));

export default router;
