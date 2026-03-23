  const express = require('express');
  const bodyParser = require('body-parser');
  
  const app = express();
  app.use(bodyParser.json());
  app.use(express.json());

  const fs = require('fs').promises;

  async function readFile() {
    try {
      let data = await fs.readFile('todos.json', 'utf-8');
      return JSON.parse(data);
    } 
    catch(err) {
      console.error(err);
      return false;
    }
  }

  async function writeFile(data) {
    try {
      await fs.writeFile('todos.json', JSON.stringify(data, null, 2));
    } catch (err) {
      console.error(err);
    }
  }

  app.get('/todos', async (req, res) => {
    const data = await readFile();
    
    if (!data) {
      return res.status(500).json({ error: "Failed to read todos" });
    }
    res.status(200).json(data)
  })

  app.get('/todos/:id', async (req, res) => {
    const data = await readFile();
    const id = Number(req.params.id);

    let todo = data.find(todo => todo.id === id);
    
    if (todo !== undefined) {
      res.status(200).json(todo)
    } else {
      res.status(404).json({ error: "Not Found" });
    }
  })

  app.post('/todos', async (req, res) => {
    let fileData = await readFile();
    if (fileData) {
      let data = req.body;
      let idCounter = fileData.length > 0 ? Math.max(...fileData.map(t => t.id)): 0;
      let todo = {
        id: idCounter+1,
        title: data.title,
        description: data.description
      }
      fileData.push(todo);
      await writeFile(fileData);
      res.status(201).json({ id: todo.id });
    } else {
      res.status(404).json({ error: "Database error" })
    }
  })

  app.delete('/todos/:id', async (req, res) => {
    let fileData = await readFile();
    const id = Number(req.params.id);
    if (fileData) {
      if (fileData.find(t => t.id === id)) {
        fileData = fileData.filter(t => t.id !== id)
        await writeFile(fileData);
        res.status(200).json({ status: "DELETED" });
      } else {
        res.status(404).json({ error: "Not Found" });
      }
    } else {
      res.status(404).json({ error: "Database error" })
    }
  })

  app.put('/todos/:id', async (req, res) => {
    let fileData = await readFile();
    let id = Number(req.params.id);
    if (fileData) {
      let index = fileData.findIndex(t => t.id === id);
      if (index < 0) {
        res.status(404).json({ error: "Not Found" });
      } else {
        fileData[index].title = req.body.title;
        fileData[index].description = req.body.description;
        await writeFile(fileData);
        res.status(200).json({ status: "OK"})
      }
    } else {
      res.status(404).json({ error: "Database error" })
    }
  })
  
  app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000')
  })
