import { useEffect, useState } from "react";
import TestCase from "../models/TestCase";
import TestCaseService from "../services/TestCaseService";

function TestCaseTable() {
    const [testCases, setTestCases] = useState<TestCase[]>([])

    useEffect(() => {
        TestCaseService.getTestCases().then((res) => {
            setTestCases(res);
        })
    }, [])

    return (
      <div>
        <h1>Tabela de Casos de Teste</h1>
        <table>
            <thead>
                <tr>
                    <th>Id</th>
                    <th>Descrição</th>
                    <th>Passos</th>
                </tr>
            </thead>
            <tbody>
            {
                testCases.map((tc : TestCase) => {
                    return (
                        <tr key={tc.id}>
                            <td>{tc.id}</td>
                            <td>{tc.description}</td>
                            <td>{tc.steps}</td>
                        </tr>
                    )
                })
            }
            </tbody>
        </table>
      </div>
    );
  }
  
  export default TestCaseTable;
  