const express = require('express');
const cors = require('cors');
const TestCaseController = require("./controllers/TestCaseController")

const app = express();

app.use(cors());
app.use(express.json());

app.use('/testcases', TestCaseController);

const PORT = 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});