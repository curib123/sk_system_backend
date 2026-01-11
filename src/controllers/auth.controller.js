import {
  getMeService,
  loginUser,
  registerUser,
} from '../services/auth.service.js';

/* =========================
   REGISTER
========================= */
export const register = async (req, res) => {
  try {
    const user = await registerUser(req.body);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: user,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

/* =========================
   LOGIN
========================= */
export const login = async (req, res) => {
  try {
    const data = await loginUser(req.body);

    res.json({
      success: true,
      message: 'Login successful',
      data,
    });
  } catch (err) {
    res.status(401).json({
      success: false,
      message: err.message,
    });
  }
};

/* =========================
   GET CURRENT USER
========================= */
export const me = async (req, res) => {
  try {
    const user = await getMeService(req.user.userId);

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message,
    });
  }
};