const express = require('express');
const server = express();
var count = 0;
const projects = [];

server.listen(3000);
server.use(express.json());

server.use((req, res, next) => {
  console.log(`Contador de requisições: ${++count}`);

  return next();
});

function existProject(req, res, next) {
  const {id} = req.params;
  let project = null;

  if(req.params.id && projects) {
    project = projects.find(project => project.id === id);
  }
  
  if(project) {
    req.project = project;
    return next();
  }

  return res.status(400).json({error: "ID não existe!"});
}

//Cria um novo Projeto
server.post("/projects", (req, res) => {
  const {id, title} = req.body;
    
  projects.push({id, title, tasks: []});

  return res.send();
});

//Cria uma nova tarefa, no projeto informado (id)
server.post("/projects/:id/tasks", existProject, (req, res) => {
  req.project.tasks.push(req.body.title);

  return res.send();
});

//Altera o title do projeto (id)
server.put("/projects/:id", existProject, (req, res) => {
  req.project.title = req.body.title;

  return res.send();
});

//Remove o projeto
server.delete("/projects/:id", existProject, (req, res) => {
  let index = projects.findIndex(project => project.id === req.project.id);

  projects.splice(index, 1);

  return res.send();
});

//Lista todos os projetos
server.get("/projects", (req, res) => {
  res.json(projects);
});

