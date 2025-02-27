import { useState } from "react";
import useAxiosPublic from "../hooks/useAxiosPublic";
import useAuth from "../hooks/useAuth";
import { FaArrowLeft } from "react-icons/fa";
import { Link } from "react-router-dom";

const AddNewTask = () => {
  const { user } = useAuth();
  const axiosPublic = useAxiosPublic();

  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    category: "To-Do",
  });

  const handleChange = (e) => {
    setTaskData({ ...taskData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Add `email` and `createdAt` dynamically on each submit
    const newTask = {
      ...taskData,
      email: user.email,
      createdAt: new Date().toISOString(),
    };

    try {
      const response = await axiosPublic.post("/tasks", newTask);
      console.log("Task added successfully:", response.data);

      // Reset form fields, keeping default category
      setTaskData({ title: "", description: "", category: "To-Do" });
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl text-accent font-semibold mb-4">Add New Task</h2>
      <form onSubmit={handleSubmit}>
        {/* Title */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Title</label>
          <input
            type="text"
            name="title"
            value={taskData.title}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Description */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">
            Description
          </label>
          <textarea
            name="description"
            value={taskData.description}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Category */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">
            Category
          </label>
          <select
            name="category"
            value={taskData.category}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="To-Do">To-Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Done">Done</option>
          </select>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-accent text-white p-2 rounded-lg hover:scale-105 transition duration-300"
        >
          Add Task
        </button>
      </form>
      <Link to='/'>
        <button className="btn bg-secondary text-white  mt-2">
          <FaArrowLeft></FaArrowLeft> Go back{" "}
        </button>
      </Link>
    </div>
  );
};

export default AddNewTask;
