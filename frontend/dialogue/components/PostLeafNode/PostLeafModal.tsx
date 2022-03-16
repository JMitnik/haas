import { useModal } from 'react-modal-hook';

import { Modal } from '../Modal/Modal';


export const usePostLeafModal = () => {
  const [showModal, closeModal] = useModal(() => (
    <Modal onClose={closeModal}>
      test
      {/* <UI.Card bg="white">
        test
      </UI.Card> */}
    </Modal>
  ));

  return [showModal, closeModal];
};
