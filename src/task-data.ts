export type TStatus = 'todo' | 'in-progress' | 'done';
export type TTask = { id: string; content: string; status: TStatus; rank: number };

const taskDataKey = Symbol('task');

export type TTaskData = { [taskDataKey]: true; taskId: TTask['id'] };

export function getTaskData(task: TTask): TTaskData {
  return { [taskDataKey]: true, taskId: task.id };
}

export function isTaskData(data: Record<string | symbol, unknown>): data is TTaskData {
  return data[taskDataKey] === true;
}

const tasks: TTask[] = [
  { id: 'task-0', content: 'Organize a team-building event', status: 'todo', rank: 0 },
  { id: 'task-1', content: 'Create and maintain office inventory', status: 'in-progress', rank: 1 },
  { id: 'task-2', content: 'Update company website content', status: 'done', rank: 2 },
  { id: 'task-3', content: 'Plan and execute marketing campaigns', status: 'todo', rank: 3 },
  { id: 'task-4', content: 'Coordinate employee training sessions', status: 'done', rank: 4 },
  { id: 'task-5', content: 'Manage facility maintenance', status: 'done', rank: 5 },
  { id: 'task-6', content: 'Organize customer feedback surveys', status: 'todo', rank: 6 },
  { id: 'task-7', content: 'Coordinate travel arrangements', status: 'in-progress', rank: 7 },
];

export function getTasks() {
  return tasks;
}
