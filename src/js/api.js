import { API_BASE } from './state.js';

async function getAllData() {
  const [tasksRes, commentsRes] = await Promise.all([
    axios.get(`${API_BASE}/tasks`),
    axios.get(`${API_BASE}/comments`)
  ]);
  return { tasks: tasksRes.data, comments: commentsRes.data };
}

function createTask(data) {
  return axios.post(`${API_BASE}/tasks`, data);
}

function updateTask(id, data) {
  return axios.patch(`${API_BASE}/tasks/${id}`, data);
}

function deleteTask(id) {
  return axios.delete(`${API_BASE}/tasks/${id}`);
}

function createComment(data) {
  return axios.post(`${API_BASE}/comments`, data);
}

function deleteComment(id) {
  return axios.delete(`${API_BASE}/comments/${id}`);
}

export { getAllData, createTask, updateTask, deleteTask, createComment, deleteComment };