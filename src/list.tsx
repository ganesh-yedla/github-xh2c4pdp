import { useEffect, useState } from 'react';
import { getTasks, type TTask } from './task-data';
import { Task } from './task';
import { monitorForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { isTaskData } from './task-data';
import { extractClosestEdge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge';
import { reorderWithEdge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/util/reorder-with-edge';
import { triggerPostMoveFlash } from '@atlaskit/pragmatic-drag-and-drop-flourish/trigger-post-move-flash';
import { flushSync } from 'react-dom';

export function List() {
  // Initialize tasks with ranks
  const [tasks, setTasks] = useState<TTask[]>(() =>
    getTasks().map((task, index) => ({ ...task, rank: index })),
  );

  useEffect(() => {
    return monitorForElements({
      canMonitor({ source }) {
        return isTaskData(source.data);
      },
      onDrop({ location, source }) {
        const target = location.current.dropTargets[0];
        if (!target) return;

        const sourceData = source.data;
        const targetData = target.data;

        if (!isTaskData(sourceData) || !isTaskData(targetData)) return;

        const indexOfSource = tasks.findIndex((task) => task.id === sourceData.taskId);
        const indexOfTarget = tasks.findIndex((task) => task.id === targetData.taskId);

        if (indexOfSource < 0 || indexOfTarget < 0) return;

        const closestEdgeOfTarget = extractClosestEdge(targetData);

        flushSync(() => {
          // Reorder tasks
          const reorderedTasks = reorderWithEdge({
            list: tasks,
            startIndex: indexOfSource,
            indexOfTarget,
            closestEdgeOfTarget,
            axis: 'vertical',
          });

          // Update ranks after reordering
          const updatedTasks = reorderedTasks.map((task, index) => ({
            ...task,
            rank: index,
          }));

          setTasks(updatedTasks);
        });

        // Flash effect for the dropped task
        const element = document.querySelector(`[data-task-id="${sourceData.taskId}"]`);
        if (element instanceof HTMLElement) {
          triggerPostMoveFlash(element);
        }
      },
    });
  }, [tasks]);

  return (
    <div className="pt-6 my-0 mx-auto w-[420px]">
      <div className="flex flex-col gap-2 border border-solid rounded p-2">
        {tasks.map((task) => (
          <Task key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
}
