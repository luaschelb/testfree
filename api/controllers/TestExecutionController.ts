import express from 'express'
import prisma from '../db'
const router = express.Router()

// Get all executions
router.get('/', async (req, res) => {
    const result = await prisma.test_executions.findMany(); 
    res.json(result)
});

// Rota para listar execuções com o nome do plano de teste e versão da build
router.get('/list', async (req, res) => {
    const result = await prisma.test_executions.findMany({
        include: {
            test_plan : true,
            build: true
        }
    })

    res.status(200).json(result);
});


// Get all executions by project
router.get('/project/:project_id', async (req, res) => {
    const { project_id } = req.params;
    const result = await prisma.test_executions.findMany({
        where: {
            test_plan: {
                project_id: Number(project_id)
            }
        },
        include: {
            test_plan: true,
            build: true
        }
    })
    res.status(200).json(result);
});

/**
 * Rota para alimentar a tela de TestExecutionScreen
 * 
 * Rota que retorna a execução de teste com todos os casos de teste agrupados por cenário com os dados de sua última execução
 * Ela acaba sendo complexa porém retorna os dados perfeitamente exibidos para o front, diminuindo a complexidade no react.
 * Dividi o trabalho de ordenação entre o SQL e o servidor.
 */
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const execution = await prisma.test_executions.findUnique({
            where: { id: Number(id) },
            include: {
                build: true,
                test_plan: true
            }
        });

        if (!execution) {
            return res.status(404).json({ error: "Execução não encontrada." });
        }

        type RawRow = {
            scenario_id: number;
            scenario_name: string | null;
            scenario_description: string | null;
            test_case_id: number;
            test_case_name: string | null;
            test_case_description: string | null;
            tectc_id: number | null;
            passed: boolean | null;
            failed: boolean | null;
            skipped: boolean | null;
            comment: string | null;
            created_at: string | null;
        };

        const result = await prisma.$queryRawUnsafe<RawRow[]>(`
            SELECT 
                ts.id              AS scenario_id,
                ts.name            AS scenario_name,
                ts.description     AS scenario_description,
                tc.id              AS test_case_id,
                tc.name            AS test_case_name,
                tc.description     AS test_case_description,
                tectc.id           AS tectc_id,
                tectc.passed,
                tectc.failed,
                tectc.skipped,
                tectc.comment,
                tectc.created_at
            FROM test_executions te
            JOIN test_plans tp ON tp.id = te.test_plan_id
            JOIN testplans_testcases tt ON tt.test_plan_id = tp.id
            JOIN test_cases tc ON tt.test_case_id = tc.id
            JOIN test_scenarios ts ON ts.id = tc.test_scenario_id
            LEFT JOIN test_executions_test_cases tectc 
                ON tectc.id = (
                    SELECT id FROM test_executions_test_cases
                    WHERE test_case_id = tc.id AND test_execution_id = te.id
                    ORDER BY created_at DESC
                    LIMIT 1
                )
            WHERE te.id = ?
            ORDER BY ts.id, tc.id;
        `, id) as RawRow[]; 

        const groupedScenarios: any[] = [];
        const testExecutionsTestCases: any[] = [];

        for (const row of result) {
            let scenario = groupedScenarios.find(s => s.id === row.scenario_id);
            if (!scenario) {
                scenario = {
                    id: row.scenario_id,
                    name: row.scenario_name,
                    description: row.scenario_description,
                    testCases: []
                };
                groupedScenarios.push(scenario);
            }

            const testCase = {
                id: row.test_case_id,
                name: row.test_case_name,
                description: row.test_case_description,
                test_scenario_id: row.scenario_id
            };

            if (row.tectc_id) {
                testExecutionsTestCases.push({
                    id: row.tectc_id,
                    created_at: row.created_at,
                    comment: row.comment,
                    passed: row.passed,
                    failed: row.failed,
                    skipped: row.skipped,
                    test_execution_id: Number(id),
                    test_case_id: row.test_case_id,
                    test_case: testCase
                });
            }

            scenario.testCases.push(testCase);
        }

        const response = {
            ...execution,
            scenarios: groupedScenarios,
            test_executions_test_cases: testExecutionsTestCases
        };

        res.json(response);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erro ao buscar execução." });
    }
});

// Create a new execution
router.post('/', async (req, res) => {
    const { title, start_date, end_date, test_plan_id, build_id, status, comments } = req.body;

    const result = await prisma.test_executions.create({
        data: {
            title, start_date, end_date, test_plan_id, build_id, status: status ?? 1, comments: comments ?? null
        }
    })

    res.status(201).json(result);
});

// Update an execution by ID
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { title, start_date, end_date, test_plan_id, build_id, status, comments } = req.body;

    try {
        const result = await prisma.test_executions.update({
        where: { id: Number(id) },
        data: { title, start_date, end_date, test_plan_id, build_id, status: status ?? 1, comments: comments ?? null }
        })
        res.json(result)
    } catch (error) {
        return res.status(404).json({ error: 'Execução não encontrada' })
    }
});

// Delete an execution by ID
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const result = await prisma.test_cases.delete({
            where: { id: Number(id) }
        })
        res.json(result)
    } catch (error) {
        return res.status(404).json({ error: 'Execução não encontrada' })
    }
});

module.exports = router;