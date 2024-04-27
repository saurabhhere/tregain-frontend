import React from 'react';
import { Modal, Box, Button } from '@mui/material';

const GeneralModal = ({ open, onClose, onSubmit, children }) => {
  const handleSubmit = () => {
    onSubmit();
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '80%',
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
        }}
      >
        {children}
        <Button variant="contained" onClick={handleSubmit}>Submit</Button>
      </Box>
    </Modal>
  );
};

export default GeneralModal;
