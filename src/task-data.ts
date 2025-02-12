export type TStatus = 'todo' | 'in-progress' | 'done';
export type TTask = { id: string; content: string;  rank: number };

const taskDataKey = Symbol('task');

export type TTaskData = { [taskDataKey]: true; taskId: TTask['id'] };

export function getTaskData(task: TTask): TTaskData {
  return { [taskDataKey]: true, taskId: task.id };
}

export function isTaskData(data: Record<string | symbol, unknown>): data is TTaskData {
  return data[taskDataKey] === true;
}

const tasks: TTask[] = [
  { id: 'task-0', content: 'Brickline-retail',  rank: 0 },
  { id: 'task-1', content: 'Brickline-office',rank: 1 },
  { id: 'task-2', content: 'Trestle',  rank: 2 },
  { id: 'task-3', content: 'The Merkle Building',  rank: 3 },
  { id: 'task-4', content: 'The Dean',  rank: 4 },
  { id: 'task-5', content: 'The Biltmore',  rank: 5 },
  { id: 'task-6', content: 'Montebello',  rank: 6 },
  { id: 'task-7', content: 'The Benton', rank: 7 },
];

export function getTasks() {
  return tasks;
}
