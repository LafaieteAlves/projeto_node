const express = require('express');
const app = express();
const User = require('./models/User');
const res = require('express/lib/response');


app.use(express.json());
app.use(express.urlencoded());
app.use('/assets', express.static('html/assets'));


app.get('/', function (req, res) {
  return res.sendFile('html/cadastro.html', { root: __dirname });
});

// Exclui o usuário
app.delete("/deletar/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({
        erro: true,
        mensagem: "Usuário não encontrado!"
      });
    }

    await user.destroy();

    return res.json({
      erro: false,
      mensagem: "Usuário excluído com sucesso!"
    });
  } catch (error) {
    return res.status(500).json({
      erro: true,
      mensagem: "Erro interno do servidor."
    });
  }
});

// Atualiza os dados do usuário
app.put("/atualizar/:id", async (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;

  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({
        erro: true,
        mensagem: "Usuário não encontrado!"
      });
    }

    user.name = name;
    user.email = email;
    await user.save();

    return res.json({
      erro: false,
      mensagem: "Usuário atualizado com sucesso!"
    });
  } catch (error) {
    return res.status(500).json({
      erro: true,
      mensagem: "Erro interno do servidor."
    });
  }
});

// Lista os usuários
app.get("/listar", async (req, res) => {
  try {
    const usuarios = await User.findAll();
    return res.json({
      erro: false,
      usuarios
    });
  } catch (error) {
    return res.status(500).json({
      erro: true,
      mensagem: "Erro interno do servidor."
    });
  }
});


// Cadastra os usuários
app.post("/cadastrar", async (req, res) => {
  pessoa = req.body;

  await User.create(pessoa)
    .then(() => {
      return res.sendFile('html/sucesso.html', { root: __dirname });


    }).catch(() => {
      return res.sendFile('html/erro.html', { root: __dirname });
    });
});


app.listen(8080, () => {
  console.log("Servidor iniciado na porta 8080: http://localhost:8080");
});