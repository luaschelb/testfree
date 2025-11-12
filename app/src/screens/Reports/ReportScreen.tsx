import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useGlobalSelectedProject } from "../../context/GlobalSelectedProjectContext";
import Execution from "../../models/Execution";
import TestScenario from "../../models/TestScenario";
import ExecutionService from "../../services/ExecutionService";
import TestExecutionStatusEnum from "../../enums/TestExecutionStatusEnum";
import TestExecutionTestCaseStatusEnum from "../../enums/TestExecutionTestCaseStatusEnum";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { Button, IconButton } from "@mui/material";
import generatePDF, { Margin, Options } from 'react-to-pdf';
import { Download } from "@mui/icons-material";
import File from "../../models/File";
import './ReportScreen.css';

const ReportScreen = () => {
    const navigate = useNavigate();
    const { selectedProject } = useGlobalSelectedProject();
    const { id } = useParams<{ id: string }>();
    const [testScenarios, setTestScenarios] = useState<TestScenario[]>([]);
    const [execution, setExecution] = useState<Execution>();
    const [expandedScenarios, setExpandedScenarios] = useState<number[]>([]);
    const [expandedTestCases, setExpandedTestCases] = useState<{ [key: number]: number[] }>({});

    const options: Options = {
        method: "save",
        filename: `relatorio-${execution?.test_plan?.name || 'teste'}.pdf`,
        page: { margin: Margin.MEDIUM },
    };

    const toggleScenario = (scenarioId: number) => {
        setExpandedScenarios((prev) =>
            prev.includes(scenarioId) ? prev.filter(id => id !== scenarioId) : [...prev, scenarioId]
        );
    };

    const toggleTestCase = (scenarioId: number, testCaseId: number) => {
        setExpandedTestCases((prev) => ({
            ...prev,
            [scenarioId]: prev[scenarioId]?.includes(testCaseId)
                ? prev[scenarioId].filter(id => id !== testCaseId)
                : [...(prev[scenarioId] || []), testCaseId]
        }));
    };

    const handlePDFGeneration = () => {
        const prevExpandedScenarios = [...expandedScenarios];
        const prevExpandedTestCases = JSON.parse(JSON.stringify(expandedTestCases));

        const allScenarioIds = testScenarios.map(s => s.id);
        const allExpandedTestCases: { [key: number]: number[] } = {};
        testScenarios.forEach(s => {
            allExpandedTestCases[s.id] = s.testCases.map((tc: any) => tc.id);
        });

        setExpandedScenarios(allScenarioIds);
        setExpandedTestCases(allExpandedTestCases);

        setTimeout(() => {
            const getTargetElement = () => {
                const content = document.getElementById('content-id') as HTMLElement;
                const expandIcons = content.getElementsByClassName('expandIcon');
                for (let i = 0; i < expandIcons.length; i++) {
                    expandIcons[i].setAttribute('hidden', 'true');
                }
                return content;
            };

            generatePDF(getTargetElement, options).then(() => {
                const content = document.getElementById('content-id') as HTMLElement;
                const expandIcons = content.getElementsByClassName('expandIcon');
                for (let i = 0; i < expandIcons.length; i++) {
                    expandIcons[i].removeAttribute('hidden');
                }
                setExpandedScenarios(prevExpandedScenarios);
                setExpandedTestCases(prevExpandedTestCases);
            });
        }, 300);
    };

    useEffect(() => {
        ExecutionService.getExecutionById(Number(id)).then((res) => {
            setExecution(res);
            setTestScenarios(res.scenarios);
        });
    }, [selectedProject, id]);

    const getTestCaseStatus = (testCaseId: number): number => {
        const exec = execution?.test_executions_test_cases?.find(e => e.test_case_id === testCaseId);
        return exec?.status || 0;
    };

    const getTestCaseFiles = (testCaseId: number): File[] => {
        const exec = execution?.test_executions_test_cases?.find(e => e.test_case_id === testCaseId);
        return exec?.files || [];
    };

    const getStatusColor = (status: number) => {
        const colors = { 0: '#868e96', 1: '#51cf66', 2: '#ffd43b', 3: '#ff6b6b' };
        return colors[status as keyof typeof colors] || '#868e96';
    };

    const getStatusBadge = (status: number) => (
        <span 
            className="status-badge"
            style={{
                backgroundColor: getStatusColor(status) + '20',
                color: getStatusColor(status),
                border: `1px solid ${getStatusColor(status)}`
            }}
        >
            {TestExecutionTestCaseStatusEnum[status]}
        </span>
    );

    const getScenarioStats = (scenario: any) => ({
        notExecuted: scenario.testCases.filter((tc: any) => getTestCaseStatus(tc.id) === 0).length,
        success: scenario.testCases.filter((tc: any) => getTestCaseStatus(tc.id) === 1).length,
        skipped: scenario.testCases.filter((tc: any) => getTestCaseStatus(tc.id) === 2).length,
        failed: scenario.testCases.filter((tc: any) => getTestCaseStatus(tc.id) === 3).length,
    });

    return (
        <div className="report-container">
            <div className="report-actions">
                <Button variant="contained" color="primary" onClick={() => navigate(`/executar_execucao/${execution?.id}`)}>
                    Ver Execução
                </Button>
                <Button color="success" variant="contained" endIcon={<Download />} onClick={handlePDFGeneration}>
                    Download PDF
                </Button>
            </div>

            <div className="report-document" id="content-id">
                {/* TopBar */}
                <div className="report-topbar">
                    <div className="report-topbar-left">
                        <div className="report-logo">L</div>
                        <h1 className="report-title">Relatório de Testes</h1>
                    </div>
                    <div className="report-execution-id">Execução ID: {execution?.id}</div>
                </div>

                {/* Informações Principais */}
                <div className="report-info-section">
                    <div className="report-info-grid">
                        <div>
                            <div className="report-info-item-label">Plano de Teste</div>
                            <div className="report-info-item-value">{execution?.test_plan?.name}</div>
                        </div>
                        <div>
                            <div className="report-info-item-label">Build</div>
                            <div className="report-info-item-value">{execution?.build?.title}</div>
                        </div>
                        <div>
                            <div className="report-info-item-label">Finalizada em</div>
                            <div className="report-info-item-value">{execution?.end_date?.toLocaleString()}</div>
                        </div>
                        <div>
                            <div className="report-info-item-label">Status</div>
                            <div className="report-info-item-value">
                                {execution?.status ? TestExecutionStatusEnum[execution.status] : ""}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Cenários de Teste */}
                <div className="report-scenarios-section">
                    <h2 className="report-section-title">Cenários de Teste</h2>

                    {testScenarios.map((scenario: any, tsIndex: number) => {
                        const stats = getScenarioStats(scenario);
                        const isExpanded = expandedScenarios.includes(scenario.id);

                        return (
                            <div key={scenario.id} className="report-scenario">
                                <div className={`report-scenario-header ${isExpanded ? 'expanded' : ''}`}>
                                    <IconButton onClick={() => toggleScenario(scenario.id)} className="expand-icon-btn" size="small">
                                        <div className="expandIcon">
                                            {isExpanded ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
                                        </div>
                                    </IconButton>

                                    <div className="report-scenario-content">
                                        <div className="report-scenario-name">
                                            {tsIndex + 1}. {scenario.name}
                                        </div>
                                        <div className="report-scenario-stats">
                                            <span style={{ color: '#868e96' }}>Não executados: <strong>{stats.notExecuted}</strong></span>
                                            <span style={{ color: '#51cf66' }}>Sucesso: <strong>{stats.success}</strong></span>
                                            <span style={{ color: '#ffd43b' }}>Pulados: <strong>{stats.skipped}</strong></span>
                                            <span style={{ color: '#ff6b6b' }}>Com erros: <strong>{stats.failed}</strong></span>
                                        </div>
                                    </div>
                                </div>

                                {isExpanded && (
                                    <div className="report-scenario-body">
                                        {scenario.testCases.map((testCase: any, tcIndex: number) => {
                                            const isTcExpanded = expandedTestCases[scenario.id]?.includes(testCase.id);

                                            return (
                                                <div key={testCase.id} className="report-testcase">
                                                    <div className="report-testcase-header">
                                                        <IconButton 
                                                            onClick={() => toggleTestCase(scenario.id, testCase.id)}
                                                            className="expand-icon-btn-small"
                                                            size="small"
                                                        >
                                                            <div className="expandIcon">
                                                                {isTcExpanded ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
                                                            </div>
                                                        </IconButton>
                                                        <div className="report-testcase-name">
                                                            {tcIndex + 1}. {testCase.name}
                                                        </div>
                                                        {getStatusBadge(getTestCaseStatus(testCase.id))}
                                                    </div>

                                                    {isTcExpanded && (
                                                        <div className="report-testcase-body">
                                                            <div className="report-testcase-field">
                                                                <div className="report-testcase-field-label">Descrição do teste</div>
                                                                <div className="report-testcase-field-value">{testCase.description}</div>
                                                            </div>

                                                            <div className="report-testcase-field">
                                                                <div className="report-testcase-field-label">Execução realizada em</div>
                                                                <div className="report-testcase-field-value">{testCase?.created_at}</div>
                                                            </div>

                                                            {testCase.comment && (
                                                                <div className="report-testcase-comment">
                                                                    <div className="report-testcase-field-label">Comentários da execução</div>
                                                                    <div className="report-testcase-field-value">{testCase.comment}</div>
                                                                </div>
                                                            )}

                                                            {getTestCaseFiles(testCase.id).length > 0 && (
                                                                <div>
                                                                    <div className="report-testcase-field-label">Evidências</div>
                                                                    <div className="report-evidence-grid">
                                                                        {getTestCaseFiles(testCase.id).map((file: File) => (
                                                                            <div key={file.id} className="report-evidence-item">
                                                                                <img 
                                                                                    src={`http://localhost:8080/testfiles${file.path}`}
                                                                                    alt={`Evidência do Caso ${testCase.id}`}
                                                                                />
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Footer */}
                <div className="report-footer">
                    Relatório gerado em {new Date().toLocaleString('pt-BR')}
                </div>
            </div>
        </div>
    );
};

export default ReportScreen;