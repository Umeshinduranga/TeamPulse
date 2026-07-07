import User from '../models/User';

export const authRepository = {
  createUser: async (userData: any) => {
    return await User.create(userData);
  },
  findUserByEmail: async (email: string) => {
    return await User.findOne({ email }).select('+password');
  },
  findUserById: async (id: string) => {
    return await User.findById(id).select('-password');
  }
};