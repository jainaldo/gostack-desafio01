const express = require('express');

const server = express();

server.use(express.json());

const projects = [];

/* Middleware global para contar as requisições na aplicação */
function logRequests(req, res, next) {
  console.count('Número de requisições');
  return next();
}

server.use(logRequests)

/* Middleware local para verificar se o projeto existe */
function checkProjectExists(req, res, next) {
  const { id } = req.params;

  const project = projects.find(project => project.id === id);

  if(!project){
    return res.status(400).json({ error: "Project does not exists"})
  }

  return next();
}

/* Lista todos os projetos */
server.get('/projects', (req, res) => {
  return res.json(projects);
})

/* Criar um novo projeto */
server.post('/projects', (req, res) => {
  const { id, title } = req.body;
  
  const project = {
    id,
    title,
    tasks: []
  }

  projects.push(project);

  res.json(project);
})

/* Atualiza o titulo de um projeto, conforme o params ID do projeto */
server.put('/projects/:id', checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(project => project.id === id);
  
  project.title = title;

  res.json(project);
})

/* Remove um projeto, conforme o params ID do projeto */
server.delete('/projects/:id', checkProjectExists, (req, res) => {
  const { id } = req.params;

  const projectIndex = projects.findIndex(project => project.id === id);

  projects.splice(projectIndex, 1);

  return res.send();
})

/* Cria uma nova tarefa para um projeto, conforme o ID do projeto */
server.post('/projects/:id/tasks', checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(project => project.id === id);

  project.tasks.push(title);

  return res.json(project);
})

server.listen(3000);