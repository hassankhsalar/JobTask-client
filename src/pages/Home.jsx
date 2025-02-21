import React, { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import useAuth from "../hooks/useAuth";
import useAxiosPublic from "../hooks/useAxiosPublic";
import { Link } from "react-router-dom";

const Home = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const axiosPublic = useAxiosPublic();
  console.log(user);

  useEffect(() => {
    if (user) {
      axiosPublic
        .get(`/tasks?email=${user.email}`)
        .then(res => setTasks(res.data))
        .catch(err => console.error(err));
    }
  }, [user, axiosPublic]);

  const handleAddTask = async () => {
    if (!newTask.trim()) return;

    const taskData = {
      title: newTask,
      category: "To-Do",
      email: user.email,
    };

    const res = await axiosPublic.post("/tasks", taskData);
    setTasks([...tasks, res.data]);
    setNewTask("");
  };

  const handleDeleteTask = async (id) => {
    await axiosPublic.delete(`/tasks/${id}`);
    setTasks(tasks.filter(task => task._id !== id));
  };

  const handleDragEnd = async (result) => {
    if (!result.destination) return;
  
    const updatedTasks = [...tasks];
    const [movedTask] = updatedTasks.splice(result.source.index, 1);
    movedTask.category = result.destination.droppableId;
    updatedTasks.splice(result.destination.index, 0, movedTask);
    
    setTasks(updatedTasks);
    
    try {
      await axiosPublic.put(`/tasks/${movedTask._id}`, { category: movedTask.category });
    } catch (error) {
      console.error("Error updating task category:", error);
    }
  };
  

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <h2 className="text-3xl text-center mb-6">Task Manager</h2>

      {user ? (
        <>
          {/* Add Task Input */}
          <div className="mb-4 flex gap-2">
            
            <button className="bg-blue-500 text-white px-4 py-2 rounded">
              <Link to='/addtask'>
              Add Task</Link>
            </button>
          </div>

          {/* Drag & Drop Task Board */}
          <DragDropContext onDragEnd={handleDragEnd}>
            <div className="grid grid-cols-3 gap-4">
              {["To-Do", "In Progress", "Done"].map((category) => (
                <Droppable key={category} droppableId={category}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className="p-4 bg-white rounded shadow-md min-h-[200px]"
                    >
                      <h3 className="text-xl font-bold mb-2">{category}</h3>
                      {tasks
                        .filter((task) => task.category === category)
                        .map((task, index) => (
                          <Draggable key={task._id} draggableId={task._id} index={index}>
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className="p-2 mb-2 bg-gray-200 rounded flex justify-between"
                              >
                                <span>{task.title}</span>
                                <button
                                  onClick={() => handleDeleteTask(task._id)}
                                  className="text-red-500"
                                >
                                  ❌
                                </button>
                              </div>
                            )}
                          </Draggable>
                        ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              ))}
            </div>
          </DragDropContext>
        </>
      ) : (
        <p className="text-center text-xl text-red-500">Please log in to manage tasks.</p>
      )}
    </div>
  );
};

export default Home;
