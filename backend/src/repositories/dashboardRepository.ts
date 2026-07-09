import { Report } from '../models/Report';
import User from '../models/User';
import { Project } from '../models/Project';
import { FilterQuery } from 'mongoose';
import { IReport } from '../models/Report';

export const dashboardRepository = {
  async findFilteredReports(filter: FilterQuery<IReport>) {
    return Report.find(filter)
      .populate('userId', 'fullName email')
      .populate('projectId', 'name')
      .sort({ weekStart: -1 });
  },

  async countAllMembers() {
    return User.countDocuments({ role: 'member' });
  },

  async findAllMembers() {
    return User.find({ role: 'member' }).select('fullName email');
  },

  async findAllProjects() {
    return Project.find({ isActive: true }).select('name');
  },
};
