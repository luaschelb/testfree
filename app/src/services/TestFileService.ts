interface FileData {
    id: number; // Identificador único do arquivo
    name: string; // Nome do arquivo
    url: string; // URL completa para acessar o arquivo
    path: string; // Caminho do arquivo no servidor
    test_executions_test_cases_id: number; // ID associado ao test_execution_test_case
}

class TestFileService {
    // Método para buscar arquivos por test_execution_test_case_id
    static async getFilesByTestExecutionTestCaseId(testExecutionTestCaseId: number): Promise<FileData[]> {
        const response = await fetch(`http://localhost:8080/testfiles/${testExecutionTestCaseId}/files`);
        if (!response.ok) {
            throw new Error('Erro ao buscar arquivos.');
        }
        return await response.json();
    }

    // Método para enviar arquivo
    static async uploadFile(testExecutionTestCaseId: number, file: File): Promise<Response> {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch(`http://localhost:8080/testfiles/${testExecutionTestCaseId}/files`, {
            method: 'POST',
            body: formData,
        });
        if (!response.ok) {
            throw new Error('Erro ao enviar arquivo.');
        }
        return response;
    }

    // Método para deletar arquivo
    static async deleteFile(fileId: number): Promise<void> {
        const response = await fetch(`http://localhost:8080/testfiles/files/${fileId}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error('Erro ao deletar arquivo.');
        }
    }
}

export default TestFileService;
