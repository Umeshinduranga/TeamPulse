import { Router } from 'express';
import { register, login, logout, getMe } from '../controllers/authController';
import { protect, authorize } from '../middleware/auth';
// import { validate } from '../middleware/validate';
// import { registerSchema, loginSchema } from '../validators/authValidators';

const router = Router();

// router.post('/register', validate(registerSchema), register);
router.post('/register', register); 
router.post('/login', login);
router.get('/logout', logout);
router.get('/me', protect, getMe);

// Dummy route to test RBAC manager guard
router.get('/admin-only', protect, authorize('Manager'), (req, res) => {
  res.status(200).json({ success: true, message: 'Welcome to the manager zone' });
});

export default router;