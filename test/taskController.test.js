const taskController = require('../src/controllers/taskController');

// Mock do objeto de requisição e resposta
const mockRequest = (params = {}, body = {}) => ({
    params,
    body
});

const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

describe('Task Controller Tests', () => {
    beforeEach(() => {
        // Resetar o "banco de dados" antes de cada teste
        taskController.resetTasks();
    });

    describe('createTask', () => {
        test('deve criar uma nova tarefa com sucesso', () => {
            const req = mockRequest({}, { title: 'Nova Tarefa', description: 'Descrição da tarefa' });
            const res = mockResponse();

            taskController.createTask(req, res);

            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    title: 'Nova Tarefa',
                    description: 'Descrição da tarefa',
                    completed: false
                })
            );
        });

        test('deve retornar erro quando o título não é fornecido', () => {
            const req = mockRequest({}, { description: 'Descrição sem título' });
            const res = mockResponse();

            taskController.createTask(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    message: 'O título da tarefa é obrigatório'
                })
            );
        });
    });

    describe('getAllTasks', () => {
        test('deve retornar uma lista vazia inicialmente', () => {
            const req = mockRequest();
            const res = mockResponse();

            taskController.getAllTasks(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith([]);
        });

        test('deve retornar todas as tarefas após adicioná-las', () => {
            // Adicionar tarefas
            const req1 = mockRequest({}, { title: 'Tarefa 1' });
            const res1 = mockResponse();
            taskController.createTask(req1, res1);

            const req2 = mockRequest({}, { title: 'Tarefa 2' });
            const res2 = mockResponse();
            taskController.createTask(req2, res2);

            // Buscar todas as tarefas
            const reqGet = mockRequest();
            const resGet = mockResponse();
            taskController.getAllTasks(reqGet, resGet);

            expect(resGet.status).toHaveBeenCalledWith(200);
            expect(resGet.json).toHaveBeenCalledWith(
                expect.arrayContaining([
                    expect.objectContaining({ title: 'Tarefa 1' }),
                    expect.objectContaining({ title: 'Tarefa 2' })
                ])
            );
        });
    });

    describe('getTaskById', () => {
        test('deve retornar uma tarefa específica por ID', () => {
            // Criar uma tarefa
            const reqCreate = mockRequest({}, { title: 'Tarefa Teste' });
            const resCreate = mockResponse();
            taskController.createTask(reqCreate, resCreate);

            // Capturar o ID da tarefa criada
            const taskId = resCreate.json.mock.calls[0][0].id;

            // Buscar a tarefa por ID
            const reqGet = mockRequest({ id: taskId });
            const resGet = mockResponse();
            taskController.getTaskById(reqGet, resGet);

            expect(resGet.status).toHaveBeenCalledWith(200);
            expect(resGet.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    id: taskId,
                    title: 'Tarefa Teste'
                })
            );
        });

        test('deve retornar 404 para ID inexistente', () => {
            const req = mockRequest({ id: 'id-inexistente' });
            const res = mockResponse();

            taskController.getTaskById(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    message: 'Tarefa não encontrada'
                })
            );
        });
    });
});