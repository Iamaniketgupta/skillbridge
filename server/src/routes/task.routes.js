import express from 'express';
import { verifyJwt } from '../middlewares/auth.middleware2.js';
import { assignTask, changeTaskStatus,getAllMenteeTasks, submitTask, editSubmittedTask , markTaskAsComplete , getTaskSubmissions , deleteTask  , getAllTasks} from '../controllers/task.controller.js';

const taskRouter = express.Router();

taskRouter.route('/assign-task').post(verifyJwt , assignTask);
taskRouter.route('/change-task-status').put(verifyJwt , changeTaskStatus);
taskRouter.route('/submit-task').post(verifyJwt, submitTask);
taskRouter.route('/editSubmittedTask').post(verifyJwt, editSubmittedTask);
taskRouter.route('/markTaskAsComplete').post(verifyJwt , markTaskAsComplete);
taskRouter.route('/getTaskSubmissions').post(verifyJwt , getTaskSubmissions);
taskRouter.route('/deleteTask').post(verifyJwt , deleteTask);
taskRouter.route('/getAllTasks').post(verifyJwt , getAllTasks);
taskRouter.route('/getAllMenteeTasks').post(verifyJwt, getAllMenteeTasks);

export default taskRouter;
