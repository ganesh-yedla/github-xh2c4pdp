import { useEffect, useState } from 'react';
import { flushSync } from 'react-dom';
import { monitorForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { extractClosestEdge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge';
import { reorderWithEdge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/util/reorder-with-edge';
import { triggerPostMoveFlash } from '@atlaskit/pragmatic-drag-and-drop-flourish/trigger-post-move-flash';
import { Task } from './task';
import { getTaskData, isTaskData, type TTask, getTasks } from './task-data';

export function List() {
  const [tasks, setTasks] = useState<TTask[]>(() => getTasks());

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

        const element = document.querySelector(`[data-task-id="${sourceData.taskId}"]`);
        if (element instanceof HTMLElement) {
          triggerPostMoveFlash(element);
        }
      },
    });
  }, [tasks]);

  return (
    <div className="flex flex-col items-center pt-6 mx-auto w-[600px]">
      <div className="w-full flex justify-end mb-4">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
        // onClick={handleSave}
        >
          Save
        </button>
      </div>
      <table className="border-collapse border border-gray-300 w-[600px]">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-300 p-2">Rank</th>
            <th className="border border-gray-300 p-2">Property</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task.id} data-task-id={task.id}>
              <td className="border border-gray-300 p-2 text-center">#{task.rank + 1}</td>
              <td className="border border-gray-300 p-2">
                <Task task={task} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
