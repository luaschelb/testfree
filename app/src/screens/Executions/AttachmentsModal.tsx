import { Delete, Download, RemoveRedEye } from "@mui/icons-material";
import { Box, Button, IconButton, Modal } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import TestCase from "../../models/TestCase";
import "../../shared_styles/StyledTable.css";

interface RunTestModalProps {
    open: boolean;
    handleClose: () => void;
    testCase?: TestCase;
  }


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

const AttachmentsModal: React.FC<RunTestModalProps> = ({ open, handleClose, testCase }) => {
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
            <div style={{display: "flex", flexDirection: "column", gap: "8px"}}>
                <b>Arquivos:</b>
                <table className="styledTable" >
                    <thead>
                        <tr>
                            <th>Nome</th>
                            <th>Data de Upload</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Screenshot10.png</td>
                            <td>26/10/2024 08:26</td>
                            <td>
                                <IconButton><RemoveRedEye color="primary"></RemoveRedEye></IconButton>
                                <IconButton><Download color="success"></Download></IconButton>
                                <IconButton><Delete color="error"></Delete></IconButton>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div>
                    <Button size="small" color="primary" variant="contained">Adicionar anexo</Button>
                </div>
            </div>
            </Box>
        </Modal>
    )
}

export default AttachmentsModal;