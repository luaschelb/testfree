const express = require('express');
const cors = require('cors');
const TestCaseController = require("./controllers/TestCaseController")
const TestCenarioController = require("./controllers/TestCenarioController")
const TestProjectController = require("./controllers/TestProjectController")

const app = express();

app.use(cors());
app.use(express.json());

app.use('/projetos', TestProjectController);
app.use('/cenarios', TestCenarioController);
app.use('/testcases', TestCaseController);

const PORT = 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});