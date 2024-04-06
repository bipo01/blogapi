import express from "express";
import cors from "cors";
import pg from "pg";
import env from "dotenv";

const app = express();
const port = 3000;
env.config();

const db = new pg.Client({
    connectionString: process.env.PG_URL,
});
db.connect();

app.use(cors());

app.get("/getuser", async (req, res) => {
    const result = await db.query(
        "SELECT * FROM accounts WHERE username = $1",
        [req.query.username]
    );
    const data = result.rows;

    console.log(data);
    res.json(data);
});

app.get("/", async (req, res) => {
    const result = await db.query("SELECT username FROM accounts");

    const data = result.rows;

    res.json(data);
});

app.get("/getposts", async (req, res) => {
    const result = await db.query(
        "SELECT * FROM posts WHERE username = $1 ORDER BY datapost",
        [req.query.username]
    );

    const data = result.rows;
    res.json(data);
});

app.get("/allposts", async (req, res) => {
    const result = await db.query("SELECT * FROM posts");
    const data = result.rows;
    console.log(data);
    res.json(data);
});

app.get("/delete", async (req, res) => {
    db.query("DELETE FROM posts WHERE id = $1", [req.query.id]);
    res.json(`${req.query.id} deletada`);
});

app.get("/add", (req, res) => {
    let dia = `${new Date().getDate()}`.padStart(2, 0);
    let mes = `${new Date().getMonth() + 1}`.padStart(2, 0);
    let ano = `${new Date().getFullYear()}`;

    const dataAtual = `${dia}/${mes}/${ano}`;

    db.query(
        "INSERT INTO posts(username, title, content, author, datapost) VALUES($1, $2, $3, $4, $5)",
        [
            req.query.username,
            req.query.title,
            req.query.content,
            req.query.author,
            dataAtual,
        ]
    );

    res.json("Adicionado");
});

app.get("/newuser", async (req, res) => {
    db.query("INSERT INTO accounts(username,password) VALUES ($1, $2)", [
        req.query.username,
        req.query.password,
    ]);

    const result = await db.query(
        "SELECT * FROM accounts WHERE username = $1",
        [req.query.username]
    );
    const data = result.rows;

    res.json(data);
});

app.get("/edit", (req, res) => {
    let dia = `${new Date().getDate()}`.padStart(2, 0);
    let mes = `${new Date().getMonth() + 1}`.padStart(2, 0);
    let ano = `${new Date().getFullYear()}`;

    const dataAtual = `${dia}/${mes}/${ano}`;

    db.query(
        "UPDATE posts SET title = $1, content = $2, author = $3, datapost = $4 WHERE id = $5",
        [
            req.query.title,
            req.query.content,
            req.query.author,
            dataAtual,
            req.query.id,
        ]
    );

    res.json("Editado");
});

app.listen(port, () => {
    console.log(`API running on port ${port}`);
});
