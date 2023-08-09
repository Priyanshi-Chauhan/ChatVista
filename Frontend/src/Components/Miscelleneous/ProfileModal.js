import { ViewIcon } from '@chakra-ui/icons';
import { Button, IconButton, Image, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, useDisclosure } from '@chakra-ui/react';
import React from 'react'

const ProfileModal = ({user, children}) => {
      const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      {children ? (<span onClick={onOpen}>{children}</span>)
       :  // base is the viewport size
      (<IconButton display = {{base : "flex"}} icon ={<ViewIcon/>} onClick ={onOpen}></IconButton>)}
    
      <Modal size ="lg" isOpen = {isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{user.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody
           display = "flex"
           flexDir ="column"   // so that it is aligned in top-to-bottom
           alignItems ="center"
           justifyContent = "space-between">
            <Image 
            borderRadius = "full"
            boxSize = "150px"
            src ={user.pic}
            alt = {user.name}/>
            <Text>Email : {user.email}</Text>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr = {3} onClick={onClose}>
              Close
            </Button>
            
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default ProfileModal
