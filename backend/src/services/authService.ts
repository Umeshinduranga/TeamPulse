import { authRepository } from '../repositories/authRepository';
import { ApiError } from '../utils/ApiError';
import { generateToken } from '../utils/jwt';
import bcrypt from 'bcrypt';

export const authService = {
  register: async (data: any) => {
    const { fullName, email, password, role } = data; // Note: using fullName to match your schema
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await authRepository.createUser({
      fullName,
      email,
      passwordHash: hashedPassword, // Changed from password to passwordHash
      role: role || 'member'        // Changed from 'Team Member' to 'member'
    });

    return generateToken(user._id.toString(), user.role);
  },

  login: async (data: any) => {
    const { email, password } = data;
    const user = await authRepository.findUserByEmail(email);

    if (!user) throw new ApiError(401, 'Invalid credentials');

    // Compare the raw password with user.passwordHash
    const isMatch = await bcrypt.compare(password, user.passwordHash); 
    if (!isMatch) throw new ApiError(401, 'Invalid credentials');

    return generateToken(user._id.toString(), user.role);
  }
};