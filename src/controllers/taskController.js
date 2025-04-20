const { v4: uuidv4 } = require('uuid');

// Simulando um banco de dados com um array
let tasks = [];

// Obter todas as tarefas
const getAllTasks = (req, res) => {
    res.status(200).json(tasks);
};

// Obter uma tarefa específica
const getTaskById = (req, res) => {
    const task = tasks.find(t => t.id === req.params.id);

    if (!task) {
        return res.status(404).json({ message: 'Tarefa não encontrada' });
    }

    res.status(200).json(task);
};

// Criar uma nova tarefa
const createTask = (req, res) => {
    const { title, description } = req.body;

    if (!title) {
        return res.status(400).json({ message: 'O título da tarefa é obrigatório' });
    }

    const newTask = {
        id: uuidv4(),
        title,
        description: description || '',
        completed: false,
        createdAt: new Date().toISOString()
    };

    tasks.push(newTask);
    res.status(201).json(newTask);
};

// Atualizar uma tarefa
const updateTask = (req, res) => {
    const { title, description, completed } = req.body;
    const taskIndex = tasks.findIndex(t => t.id === req.params.id);

    if (taskIndex === -1) {
        return res.status(404).json({ message: 'Tarefa não encontrada' });
    }

    tasks[taskIndex] = {
        ...tasks[taskIndex],
        title: title || tasks[taskIndex].title,
        description: description !== undefined ? description : tasks[taskIndex].description,
        completed: completed !== undefined ? completed : tasks[taskIndex].completed,
        updatedAt: new Date().toISOString()
    };

    res.status(200).json(tasks[taskIndex]);
};

// Deletar uma tarefa
const deleteTask = (req, res) => {
    const taskIndex = tasks.findIndex(t => t.id === req.params.id);

    if (taskIndex === -1) {
        return res.status(404).json({ message: 'Tarefa não encontrada' });
    }

    const deletedTask = tasks.splice(taskIndex, 1)[0];
    res.status(200).json({ message: 'Tarefa removida com sucesso', task: deletedTask });
};

// Função para resetar as tarefas (útil para testes)
const resetTasks = () => {
    tasks = [];
};

module.exports = {
    getAllTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask,
    resetTasks
};