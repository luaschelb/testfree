import * as React from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import CloseIcon from '@mui/icons-material/Close';
import TestCase from '../../models/TestCase';
import { Button } from '@mui/material';
import { useState } from 'react';
import AttachmentsModal from './AttachmentsModal';
import TestExecutionTestCase from '../../models/TestExecutionTestCase';
import Execution from '../../models/Execution';
import TestExecutionTestCaseService from '../../services/TestExecutionTestCaseService';
import TestCaseStatusEnum from '../../enums/TestCaseStatusEnum';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '1px solid #222',
  boxShadow: 24,
  p: 4,
};

interface RunTestModalProps {
  open: boolean;
  handleClose: () => void;
  testCase?: TestCase;
  execution?: Execution;
  setShouldUpdateScreen: (arg: boolean) => void;
}


const RunTestModal: React.FC<RunTestModalProps> = ({ open, handleClose, testCase, execution, setShouldUpdateScreen}) => {

  const [ comments, setComments ] = useState<string | undefined>(testCase?.comment);
  const [ status, setStatus ] = useState<number | undefined>(testCase?.status ? testCase.status : 1);

  const [openModal, setOpenModal] = useState<{
      open: boolean,
      testCase?: TestCase
  }>({open: false, testCase: undefined});

  const handleCloseModal = () => {
    setOpenModal({ open: false, testCase: undefined });
  };

  async function submit() {
    let execution_2 = execution as Execution
    let testCase_2 = testCase as TestCase
    const data = new Date();
    const created_at = data.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false // Use false para formato 24 horas
    }).replace(',', ''); // Remove a vírgula
    let passed = 1
    let skipped = 1
    let failed = 1
    if(status === 1 || status === 0)
    {
      passed = 1
      skipped = 0
      failed = 0
    }
    if(status === 2)
    {
      passed = 0
      skipped = 1
      failed = 0
    }
    if(status === 3)
    {
      passed = 0
      skipped = 0
      failed = 1
    }
    try {
        if(testCase_2.test_execution_test_case_id === undefined)
        {
          await TestExecutionTestCaseService.createTestExecutionTestCase(new TestExecutionTestCase(created_at, comments ? comments : "", passed, skipped, failed, execution_2.id, testCase_2.id))
        }
        else
        {
          let aux = new TestExecutionTestCase(created_at, comments ? comments : "", passed, skipped, failed, execution_2.id, testCase_2.id);
          aux.id = testCase_2.test_execution_test_case_id
          await TestExecutionTestCaseService.updateTestExecutionTestCase(aux)
        }
        alert("Sucesso")
        setShouldUpdateScreen(true)
    } catch (error) {
        alert('Erro ao atualizar caso de teste: ' + (error as Error).message);
    }
    handleClose()
  }

  React.useEffect(() => {
    setComments(testCase?.comment)
    setStatus(testCase?.status)
  }, [testCase])

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
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
          }}
        >
          <CloseIcon />
        </IconButton>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Caso de Teste: TC-{testCase?.id}
        </Typography>
          <AttachmentsModal 
              open={openModal?.open} 
              handleClose={handleCloseModal}
              testCase={openModal?.testCase} 
          />
          {testCase ? (
            <div style={{display: "flex", flexDirection:"column", gap: "4px", marginTop: "16px"}}>
              <b>Nome:</b> {testCase?.name}<br />
              <b>Descrição:</b> {testCase?.description}<br />
              <b>Estado:</b> 
              <select 
                style={{height: "1.8rem"}}
                value={status ? status : 1}
                onChange={(event) => {
                    setStatus(parseInt(event.target.value))
                }}>
                {/* <option key={0} value={0}>Não executado</option> */}
                <option key={1} value={1}>Sucesso</option>
                <option key={2} value={2}>Pulado</option>
                <option key={3} value={3}>Com erros</option>
              </select>
              <b>Passos:</b>{testCase?.steps.split("\n").map((str, i) => <div key={i}>{str}</div> )}
              <b>Comentários: </b> 
              <textarea 
                rows={5}
                cols={10}
                value={comments}
                onChange={(event) => setComments(event.target.value)}
                >
              </textarea>
              <div style={{display: "flex", flexDirection: "column", gap: "2px", marginTop: "8px"}}>
                <Button variant="contained" size="small" 
                  onClick={() => { setOpenModal({
                    open: true, 
                    testCase: testCase
                    }) 
                }}
                  style={{width: "fit-content" }}
                  disabled={testCase?.status === TestCaseStatusEnum['Não executado'] }
                >Gerenciar Anexos</Button>
                {
                  testCase?.status === TestCaseStatusEnum['Não executado'] ? (
                    <span style={{fontSize: "12px", color: "red"}}>Salve a execução para gerenciar anexos</span>
                  ) : null
                }
              </div>
              <div style={{marginTop: "16px"}}>
                <Button variant="contained" size="small" color="success" onClick={submit}>
                  {
                    testCase?.status === TestCaseStatusEnum['Não executado'] ? "Salvar" : "Atualizar"
                  }
                </Button>
              </div>
            </div>
        ) :
        ( 
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            "Nenhum caso de teste selecionado."
          </Typography>
        )
        }
      </Box>
    </Modal>
  );
}

export default RunTestModal;