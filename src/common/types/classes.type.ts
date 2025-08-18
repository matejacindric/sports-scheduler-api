export type Class = {
  id: string;
  sportId: string;
  description: string;
  startTime: string;
  classDays: string[];
  createdAt: Date;
};

export type ClassApplication = {
  id: string;
  classId: string;
  userId: string;
  appliedAt: Date;
};
