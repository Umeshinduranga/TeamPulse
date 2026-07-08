import {Report} from '../models/Report';

export const reportRepository = {
  create: async (data: any) => await Report.create(data),
  findByUserId: async (userId: string) => await Report.find({ userId }).sort({ weekStart: -1 }).populate('projectId', 'name'),
  findById: async (id: string) => await Report.findById(id),
  update: async (id: string, data: any) => await Report.findByIdAndUpdate(id, data, { new: true, runValidators: true }),
};