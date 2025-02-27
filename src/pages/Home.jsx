import { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import useAuth from "../hooks/useAuth";
import useAxiosPublic from "../hooks/useAxiosPublic";
import { Link } from "react-router-dom";
import { io } from "socket.io-client";
import { FaTrash } from "react-icons/fa";

//const socket = io("https://task-manager-server-c7xi.onrender.com/");
const socket = io("http://localhost:5000/");

const Home = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const axiosPublic = useAxiosPublic();
  
  useEffect(() => {
    if (user) {
      axiosPublic
        .get(`/tasks?email=${user.email}`)
        .then((res) => setTasks(res.data))
        .catch((err) => console.error(err));
    }

    socket.on("taskUpdated", ({ taskId, category, createdAt }) => {
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === taskId ? { ...task, category, createdAt } : task
        )
      );
    });

    return () => socket.off("taskUpdated");
  }, [user, ]);

  const handleDeleteTask = async (id) => {
    await axiosPublic.delete(`/tasks/${id}`);
    setTasks((prevTasks) => prevTasks.filter((task) => task._id !== id));
  };

  const handleDragEnd = async (result) => {
    if (!result.destination) return;
  
    setTasks((prevTasks) => {
      const updatedTasks = [...prevTasks];
      const [movedTask] = updatedTasks.splice(result.source.index, 1);
  
      if (!movedTask) return prevTasks; // Prevent undefined error
  
      movedTask.category = result.destination.droppableId;
      movedTask.createdAt = new Date().toISOString();
  
      updatedTasks.splice(result.destination.index, 0, movedTask);
  
      console.log("Task ID being moved:", movedTask._id); // Log the task ID
  
      socket.emit("taskMoved", {
        taskId: movedTask._id.toString(), // Ensure taskId is a string
        category: movedTask.category,
        createdAt: movedTask.createdAt,
      });
  
      return updatedTasks;
    });
  };
  

  return (
    <div className="min-h-screen p-6 bg-base-100">
      <h2 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
        Task Manager
      </h2>

      {user ? (
        <>
          <div className="mb-4 flex gap-2">
            <button className="bg-accent text-white px-4 py-2 rounded">
              <Link to="/addtask">Add Task</Link>
            </button>
          </div>

          <DragDropContext onDragEnd={handleDragEnd}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {["To-Do", "In Progress", "Done"].map((category) => (
                <Droppable key={category} droppableId={category}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className="p-4 bg-base-200 rounded shadow-md min-h-[200px]"
                    >
                      <h3 className="text-xl font-bold mb-2">{category}</h3>
                      {tasks
                        .filter((task) => task.category === category)
                        .map((task, index) => (
                          <Draggable
                            key={task._id.toString()} // Ensure _id is a string
                            draggableId={task._id.toString()} // Convert _id to a string
                            index={index}
                          >
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className="p-2 mb-2 bg-gray-200 rounded flex flex-col md:flex-row justify-between items-center"
                              >
                                <div className="flex flex-col">
                                  <h2 className="text-md flex justify-evenly">
                                    <span className="font-bold">Name:</span> {task.title}
                                  </h2>
                                  <div>
                                    <p className="text-sm font-thin">
                                      <span className="font-bold">Description:</span> {task.description}
                                    </p>
                                  </div>
                                  <p className="text-sm font-thin">
                                    <span className="font-bold">Status:</span> {task.category}
                                  </p>
                                  <p className="text-sm font-thin">
                                    <span className="font-bold">TimeStamp:</span> {new Date(task.createdAt).toLocaleString()}
                                  </p>
                                  <button
                                    onClick={() => handleDeleteTask(task._id)}
                                    className="text-red-500"
                                  >
                                    <FaTrash />
                                  </button>
                                </div>
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
        <p className="text-center text-xl text-red-500">
          Please log in to manage tasks.
        </p>
      )}
    </div>
  );
};

export default Home;
