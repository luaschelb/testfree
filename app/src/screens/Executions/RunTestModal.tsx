import * as React from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import CloseIcon from '@mui/icons-material/Close';
import TestCase from '../../models/TestCase';
import { Button } from '@mui/material';
import { useState } from 'react';
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
}

const RunTestModal: React.FC<RunTestModalProps> = ({ open, handleClose, testCase }) => {

  const [ comments, setComments ] = useState<string | undefined>(testCase?.comment);
  const [ status, setStatus ] = useState<number | undefined>(testCase?.status);

  let submit = () => {
    if(status !== 0)
    {
      // edita o test_execution_test_cases!!
    }
    else if(status !== undefined)
    {
      // cria test_executions_test_cases 
    }
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
        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          {testCase ? (
            <div style={{display: "flex", flexDirection:"column", gap: "4px", marginTop: "16px"}}>
              <b>Nome:</b> {testCase?.name}<br />
              <b>Descrição:</b> {testCase?.description}<br />
              <b>Estado:</b> {status ? TestCaseStatusEnum[status] : "Não executado"}<br />
              <b>Passos:</b>{testCase?.steps.split("\n").map((str) => <div>{str}</div> )}
              <b>Comentários: </b> 
              <textarea 
                rows={5} 
                value={comments}
                onChange={(event) => setComments(event.target.value)}
                >
              </textarea>
              <div style={{display: "flex", gap: "16px", marginTop: "16px"}}>
                <Button variant="contained" onClick={() => {setStatus(2)}} size="small" style={{backgroundColor: "#ccc", color: "#333", fontWeight: "bold"}}> Pulado </Button>
                <Button variant="contained" onClick={() => {setStatus(1)}} size="small" color="success">Sucesso</Button>
                <Button variant="contained" onClick={() => {setStatus(3)}} size="small" color="error">Falha</Button>
              </div>
              <div style={{marginTop: "16px"}}>
                <Button variant="contained" size="small" style={{float: "right"}} color="primary" onClick={submit}>Atualizar Caso</Button>
              </div>
            </div>
        ) : "Nenhum caso de teste selecionado."}
        </Typography>
      </Box>
    </Modal>
  );
}

export default RunTestModal;