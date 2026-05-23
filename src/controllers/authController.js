import createHttpError from 'http-errors';
import bcrypt from 'bcrypt';
import { User } from '../models/user.js';
import { createSession, setSessionCookies } from '../services/auth.js';
import { Session } from '../models/session.js';

//! Регістрація
export const registerUser = async (req, res) => {
  const { email, password } = req.body;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw createHttpError(400, 'Email in use');
  }

  // Хеш пароля bcrypt
  const hashedPassword = await bcrypt.hash(password, 10);

  // Створює нового користувача в базі
  const user = await User.create({
    email,
    password: hashedPassword,
  });

  // Створюємо сесію
  const newSession = await createSession(user._id);

  // Додавання кукі до відповіді
  setSessionCookies(res, newSession);

  // Відповідь
  res.status(201).json(user);
};

//! Логін
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    throw createHttpError(401, 'Invalid credentials');
  }

  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    throw createHttpError(401, 'Invalid credentials');
  }

  // Видаляє стару сесію та створює нову
  await Session.deleteOne({ userId: user._id });

  const session = await createSession(user._id);

  // кукі до відповіді
  setSessionCookies(res, session);

  // відповідь
  res.status(200).json(user);
};

//! ротація токена за допомогою refresh-ток
//! дозволить користувачу залишатися авторизованим навіть після завершення терміну дії короткоживучого access-токена
export const refreshUserSession = async (req, res) => {
  const { sessionId, refreshToken } = req.cookies;

  if (!sessionId || !refreshToken) {
    throw createHttpError(401, 'Missing session credentials');
  }

  // Знаходимо сесію за id сесії та реф-токеном
  const session = await Session.findOne({
    _id: sessionId,
    refreshToken,
  });

  // Якщо сесії нема, повертаємо - помилка
  if (!session) {
    throw createHttpError(401, 'Session not found');
  }

  // Якщо сесія існує, перевіряємо валідність рефреш токена
  const isSessionTokenExpired = session.refreshTokenValidUntil < new Date();

  // Якщо термін дії рефреш токена вийшов,
  // видаляємо сесію і повертаємо помилку
  if (isSessionTokenExpired) {
    await session.deleteOne();
    res.clearCookie('sessionId');
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    throw createHttpError(401, 'Session token expired');
  }

  // Якщо перевірки пройшли добре, видаляємо сесію
  await session.deleteOne();

  // Створюємо нову сесію
  const newSession = await createSession(session.userId);
  setSessionCookies(res, newSession);

  res.status(200).json({
    message: 'Session refreshed',
  });
};

//! Логаут користувача
export const logoutUser = async (req, res) => {
  const { sessionId } = req.cookies;

  if (sessionId) {
    await Session.deleteOne({ _id: sessionId });
  }

  res.clearCookie('sessionId');
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');

  res.status(204).send();
};
