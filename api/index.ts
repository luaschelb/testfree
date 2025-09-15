import express from 'express'
import cors from 'cors'

const TestCaseController = require("./controllers/TestCaseController")
const TestScenarioController = require("./controllers/TestScenarioController")
const TestProjectController = require("./controllers/TestProjectController")
const TestBuildController = require("./controllers/TestBuildController")
const TestPlanController = require("./controllers/TestPlanController")
const TestExecutionController = require("./controllers/TestExecutionController")
const TestExecutionTestCaseController = require("./controllers/TestExecutionTestCaseController")
const TestFileController = require("./controllers/TestFileController")

const app = express();

app.use(cors());
app.use(express.json());

app.use('/projetos', TestProjectController);
app.use('/scenarios', TestScenarioController);
app.use('/testcases', TestCaseController);
app.use('/builds', TestBuildController);
app.use('/test-plans', TestPlanController);
app.use('/executions', TestExecutionController);
app.use('/testexecutions_testcases', TestExecutionTestCaseController);
app.use('/testfiles', TestFileController);

app.get('/health-check', (req, res) => {
    res.status(200).json({ status: 'ok', uptime: process.uptime() })
})

const PORT = 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});