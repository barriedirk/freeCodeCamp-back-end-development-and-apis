import express, {Router} from "express";
import weatherRouter from "./weather.js";
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
// const PORT = process.env.PORT || 3000;
const PORT = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = Router();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public")));

app.route("/api/data").get((req, res) => {
  res.status(200).json({ message: "GET /api/data", data: [] });
}).post((req,res) => {
  res.status(201).json({});
})

app.use("/", router);
app.use("/api/weather", weatherRouter);


app.get("/", (req, res) => {
  // res.status(200).send("Weather Service API");

  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/api/info", (req, res) => {
  res.json({
    name: "Weather Service API",
    version: "1.0.0",
    endpoints: ["/api/weather/:city", "/api/greet/:name", "/api/data"],
  });
});

app.get("/api/status", (req, res) => {
  res.status(200).json({status: 200});
});

app.get("/docs", (req, res) => {
  res.redirect("/api/info");
})

app.get("/api/greet/:name", (req, res) => {
  const {name} = req.params;

  res.status(200).json({name});
});

app.listen(PORT, () => {
  console.log("Server is running on port 3000");
})
