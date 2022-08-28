import React from 'react'

const Mymodal = () => {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
  return (
    <div>
         <Button onClick={handleOpen}>Open modal</Button>
      <Modal
        open={open}
        onClose={handleClose}
        
      >
        <Box >
          
          
        </Box>
      </Modal>
    </div>
  )
}

export default Mymodal