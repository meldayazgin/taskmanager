import React, { useEffect, useState } from 'react';
import { rtdb, auth } from '../firebase-config'; 
import { ref, onValue, set, remove, update } from 'firebase/database'; 
import './Tasks.css';
import { Link } from 'react-router-dom';

const Tasks = () => {
    const [tasks, setTasks] = useState([]);
    const [taskName, setTaskName] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [status, setStatus] = useState('Not Started'); 
    const [currentTaskId, setCurrentTaskId] = useState(null);

    useEffect(() => {
        if (!auth.currentUser) return;

        const tasksRef = ref(rtdb, 'tasks'); 
        const unsubscribe = onValue(tasksRef, (snapshot) => {
            const tasksData = [];
            snapshot.forEach((childSnapshot) => {
                const childData = childSnapshot.val();
                if (childData.userId === auth.currentUser.uid) {
                    tasksData.push({ id: childSnapshot.key, ...childData });
                }
            });
            setTasks(tasksData);
        });

        return () => unsubscribe();
    }, []);

    const addTask = async () => {
        if (taskName.trim() === '' || !auth.currentUser) return;
        
        const newTaskRef = ref(rtdb, `tasks/${Date.now()}`); 
        await set(newTaskRef, {
            name: taskName,
            dueDate: dueDate,
            status: status,
            userId: auth.currentUser.uid
        });

        setTaskName('');
        setDueDate('');
        setStatus('Not Started');
    };

    const deleteTask = async (id) => {
        const taskRef = ref(rtdb, `tasks/${id}`);
        await remove(taskRef);
    };

    const prepareUpdateTask = (id, name, dueDate, status) => {
        setCurrentTaskId(id);
        setTaskName(name);
        setDueDate(dueDate);
        setStatus(status);
    };

    const updateTask = async () => {
        if (currentTaskId === null || taskName.trim() === '') return;

        const taskRef = ref(rtdb, `tasks/${currentTaskId}`);
        await update(taskRef, {
            name: taskName,
            dueDate: dueDate,
            status: status,
        });

        setTaskName('');
        setDueDate('');
        setStatus('Not Started');
        setCurrentTaskId(null);
    };

    return (
        <div className="tasks-container">
            {auth.currentUser ? (
                <>
                    <div className="task-input">
                        <input
                            type="text"
                            placeholder="Enter task name..."
                            value={taskName}
                            onChange={(e) => setTaskName(e.target.value)}
                        />
                        <input
                            type="date"
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                        />
                        <select value={status} onChange={(e) => setStatus(e.target.value)}>
                            <option value="Not Started">Not Started</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Finished">Finished</option>
                        </select>
                        {currentTaskId ? (
                            <button onClick={updateTask}>Update Task</button>
                        ) : (
                            <button onClick={addTask}>Add Task</button>
                        )}
                    </div>
                    <ul className="task-list">
                        {tasks.map((task) => (
                            <li key={task.id} className="task-item">
                                <span>{task.name} - Due: {task.dueDate} - Status: {task.status}</span>
                                <div className="button-group">
                                    <button className="edit-button" onClick={() => prepareUpdateTask(task.id, task.name, task.dueDate, task.status)}>Edit</button>
                                    <button className="delete-button" onClick={() => deleteTask(task.id)}>Delete</button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </>
            ) : (
                <p>You have not logged in. <Link to="/login" className="login-link">Login</Link></p>
            )}
        </div>
    );
};

export default Tasks;
