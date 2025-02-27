import axios from "axios";

const axiosPublic = axios.create({
    //baseURL: 'https://task-manager-server-c7xi.onrender.com/'
    baseURL: 'http://localhost:5000/'
})

const useAxiosPublic = () => {
    return axiosPublic;
};

export default useAxiosPublic;