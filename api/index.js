const express = require('express');
const cors = require('cors');
const TestCaseController = require("./controllers/TestCaseController")
const TestScenarioController = require("./controllers/TestScenarioController")
const TestProjectController = require("./controllers/TestProjectController")

const app = express();

app.use(cors());
app.use(express.json());

app.use('/projetos', TestProjectController);
app.use('/scenarios', TestScenarioController);
app.use('/testcases', TestCaseController);

const PORT = 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});