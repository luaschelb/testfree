import React, { useEffect, useState } from "react";
import { Delete, Download, RemoveRedEye } from "@mui/icons-material";
import { Box, Button, IconButton, Modal, Input } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import TestCase from "../../models/TestCase";
import "../../shared_styles/StyledTable.css";
import TestFileService from "../../services/TestFileService";

interface RunTestModalProps {
    open: boolean;
    handleClose: () => void;
    testCase?: TestCase;
}

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    border: '1px solid #222',
    boxShadow: 24,
    p: 4,
    width: "600px",
};

interface FileData {
    id: number;
    name: string;
    url: string;
    path: string;
    test_executions_test_cases_id: number;
}

const AttachmentsModal: React.FC<RunTestModalProps> = ({ open, handleClose, testCase }) => {
    const [files, setFiles] = useState<FileData[]>([]);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    useEffect(() => {
        if (testCase?.test_execution_test_case_id) {
            TestFileService.getFilesByTestExecutionTestCaseId(testCase.test_execution_test_case_id)
                .then((data) => setFiles(data))
                .catch((error) => console.error("Erro ao carregar os arquivos:", error));
        }
    }, [testCase]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setSelectedFile(event.target.files[0]);
        }
    };

    const handleUpload = () => {
        if (testCase?.test_execution_test_case_id && selectedFile) {
            TestFileService.uploadFile(testCase.test_execution_test_case_id, selectedFile)
                .then(() => {
                    // Atualiza a lista de arquivos após o upload
                    return TestFileService.getFilesByTestExecutionTestCaseId(testCase?.test_execution_test_case_id as number);
                })
                .then((updatedFiles) => {
                    alert("Arquivo enviado com sucesso")
                    setFiles(updatedFiles);
                    setSelectedFile(null);
                })
                .catch((error) => {
                    alert("Erro ao enviar o arquivo")
                    console.error("Erro ao enviar o arquivo:", error)
                });
        }
    };

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <IconButton
                    aria-label="close"
                    onClick={handleClose}
                    sx={{ position: 'absolute', top: 8, right: 8 }}
                >
                    <CloseIcon />
                </IconButton>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <b>Arquivos:</b>
                    <table className="styledTable">
                        <thead>
                            <tr>
                                <th>Nome</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {files.map((file) => (
                                <tr key={file.id}>
                                    <td>{file.name}</td>
                                    <td>
                                        <IconButton onClick={() => window.open(file.url, '_blank')}>
                                            <RemoveRedEye color="primary" />
                                        </IconButton>
                                        <IconButton onClick={async () => {
                                            const response = await fetch(file.url);
                                            const blob = await response.blob();
                                            const link = document.createElement('a');
                                            link.href = URL.createObjectURL(blob);
                                            link.download = file.name || 'download'; // Defina o nome do arquivo
                                            link.click();
                                        }}>
                                            <Download color="success" />
                                        </IconButton>
                                        <IconButton onClick={() => {
                                            TestFileService.deleteFile(file.id)
                                                .then(() => {
                                                    alert("Arquivo deletado com sucesso")
                                                    setFiles((prevFiles) => prevFiles.filter(f => f.id !== file.id));
                                                })
                                                .catch((error) => {
                                                    alert("Erro ao deletar arquivo")
                                                    console.error("Erro ao deletar arquivo:", error)
                                                });
                                        }}>
                                            <Delete color="error" />
                                        </IconButton>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div>
                        <Input type="file" onChange={handleFileChange} />
                        <div>
                            <br />
                            <Button
                                size="small"
                                color="primary"
                                variant="contained"
                                onClick={handleUpload}
                                disabled={!selectedFile}
                            >
                                Adicionar anexo
                            </Button>
                        </div>
                    </div>
                </div>
            </Box>
        </Modal>
    );
};

export default AttachmentsModal;