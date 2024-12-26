import { Modal, Button } from "react-bootstrap";
import React from "react";

interface ErrorModalProps {
  show: boolean;
  onHide: () => void;
  errorMessage: string;
}

export const ErrorModal: React.FC<ErrorModalProps> = ({
  show,
  onHide,
  errorMessage,
}) => {
  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
      className="fixed inset-0 z-50 flex items-center justify-center"
      contentClassName="relative w-full max-w-md mx-auto"
      backdropClassName="fixed inset-0 bg-black bg-opacity-50"
    >
      <div className="bg-white rounded-lg shadow-xl overflow-hidden">
        <Modal.Header closeButton className="bg-red-50 border-b border-red-100">
          <Modal.Title className="text-red-600 text-lg font-semibold">
            Error
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="py-4 px-6">
          <p className="text-gray-700">{errorMessage}</p>
        </Modal.Body>
        <Modal.Footer className="border-t border-gray-100 p-4">
          <Button
            variant="secondary"
            onClick={onHide}
            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
          >
            Close
          </Button>
        </Modal.Footer>
      </div>
    </Modal>
  );
};
