import { celebrate } from 'celebrate';
import { Router } from 'express';
import {
  registerUserSchema,
  loginUserSchema,
} from '../validations/authValidation.js';
import {
  registerUser,
  loginUser,
  logoutUser,
  refreshUserSession,
} from '../controllers/authController.js';

const router = Router();

// Регістрація
router.post('/auth/register', celebrate(registerUserSchema), registerUser);

// Логін
router.post('/auth/login', celebrate(loginUserSchema), loginUser);

// Оновлення сесії
router.post('/auth/refresh', refreshUserSession);

// Логаут користувача
router.post('/auth/logout', logoutUser);

export default router;
