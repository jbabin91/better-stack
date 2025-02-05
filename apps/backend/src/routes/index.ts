import { indexRouter } from './index.route';
import { tasksRouter } from './tasks/tasks.index';

const routes = [indexRouter, tasksRouter] as const;

export { routes };
