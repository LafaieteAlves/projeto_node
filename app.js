const express = require('express');
const app = express();
const User = require('./models/User');
const res = require('express/lib/response');


app.use(express.json());
app.set('view engine', 'ejs'); // Configura o motor de visualização EJS
app.use(express.urlencoded());
app.use('/assets', express.static('html/assets'));
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css')); // redirect CSS bootstrap


app.get('/', function (req, res) {
  return res.sendFile('html/cadastro.html', { root: __dirname });
});
// Cadastrar ADM
app.post("/adm", async (req, res) => {
  try {
    const pessoa = req.body;
    await User.create(pessoa);
    res.status(200).send('Cadastrado com sucesso!'); // Envia mensagem de sucesso
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro ao cadastrar. Tente novamente.'); // Envia mensagem de erro
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

// Listar os usuários
app.get("/listar", async (req, res) => {
  try {
    const usuarios = await User.findAll();
    return res.render('listar', { usuarios }); // Renderiza o arquivo EJS 'listar.ejs'
  } catch (error) {
    return res.status(500).json({
      erro: true,
      mensagem: "Erro interno do servidor."
    });
  }
});


// Editar os dados do usuário (página de formulário)
app.get("/editar/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({
        erro: true,
        mensagem: "Usuário não encontrado!"
      });
    }

    return res.render('editar', { usuario: user });
  } catch (error) {
    return res.status(500).json({
      erro: true,
      mensagem: "Erro interno do servidor."
    });
  }
});

// Editar os dados do usuário (ação de formulário)
app.post("/editar/:id", async (req, res) => {
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

    // Redirecionar para a página de listar após a edição
    return res.redirect('/listar'); // ou a rota específica que você usa para listar usuários

  } catch (error) {
    return res.status(500).json({
      erro: true,
      mensagem: "Erro interno do servidor."
    });
  }
});
// Deletar o usuário
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

app.listen(8080, () => {
  console.log("Servidor iniciado na porta 8080: http://localhost:8080");
});