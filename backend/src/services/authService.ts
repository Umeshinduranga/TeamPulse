import { authRepository } from '../repositories/authRepository';
import { ApiError } from '../utils/ApiError';
import { generateToken } from '../utils/jwt';
import bcrypt from 'bcrypt';

export const authService = {
  register: async (data: any) => {
    const { fullName, email, password, role } = data;
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await authRepository.createUser({
      fullName,
      email,
      passwordHash: hashedPassword,
      role: role || 'member'
    });

    const token = generateToken(user._id.toString(), user.role);
    // Return sanitized user (no passwordHash) + token
    const userObj = { _id: user._id, fullName: user.fullName, email: user.email, role: user.role };
    return { user: userObj, token };
  },

  login: async (data: any) => {
    const { email, password } = data;
    const user = await authRepository.findUserByEmail(email);

    if (!user) throw new ApiError(401, 'Invalid credentials');

    const isMatch = await bcrypt.compare(password, user.passwordHash); 
    if (!isMatch) throw new ApiError(401, 'Invalid credentials');

    const token = generateToken(user._id.toString(), user.role);
    const userObj = { _id: user._id, fullName: user.fullName, email: user.email, role: user.role };
    return { user: userObj, token };
  }
};