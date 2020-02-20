// Configurando o servidor
const express = require('express')
const server = express()

//Configurar apresentação de arquivos extras
server.use(express.static("public"))

// Habilitar Body do Form
server.use(express.urlencoded({ extended: true }))


// Configura a Conexaõa o Postgree
const Pool = require('pg').Pool
const db = new Pool({
    user: 'postgres',
    password: 'r0dr1gu3sz',
    host: '127.0.0.1',
    database: 'doe'
})

//configura a Template Engine
const nunjucks = require('nunjucks')
nunjucks.configure("./", {
    express: server,
    noCache: true
})

// Configura a apresentação da página
server.get("/", function(req, res) {
    db.query("SELECT * FROM donors", function(err, result){
        if(err) return res.send(err)

        const donors = result.rows;

        return res.render("index.html", { donors })
    })
    
})

// Captura os Dados do Formulário
server.post("/", function(req, res) {
    const name = req.body.name
    const email = req.body.email
    const blood = req.body.blood
    
    if(name == "" || email == "" || blood == ""){
        return res.send("Todos os campos são Obrigatórios")
    }

    // Adiciona os valores no DB
    const query = 
        `INSERT INTO donors ("name", "email", "blood") VALUES ($1, $2, $3)`
    const values = [name, email, blood]

    db.query(query, values, function(err){
        console.log(err)
        if(err) return res.send(err)
        return res.redirect("/")
    })
})

// Inicia o servidor
server.listen(5500)