import { useState, useRef } from 'react';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

const AddRoverModal = ({ open, toggleModal }) => {
  const [loading, setLoading] = useState(false);
  const [inputError, setInputError] = useState(false);

  const roverNameInput = useRef();

  const launchRover = async () => {
    let name = roverNameInput.current.value;

    if (!name) {
      setInputError(true);
      return;
    }

    setLoading(true);

    await fetch(`/add-rover/${name}`, { method: 'POST' })
      .then((res) => {
        if (res.status === 201) {
          setLoading(false);
          toggleModal();
        } else {
          throw new Error(res.statusText);
        }
      })
      .catch((err) => {
        console.error(err);
      });

    roverNameInput.current.value = '';
  };

  return (
    <Modal show={open} onHide={toggleModal}>
      <Modal.Header>
        <Modal.Title>New Rover</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group>
          <Form.Label>Launch new rover to Mars</Form.Label>
          <Form.Control
            type="text"
            required
            placeholder="Rover Name"
            ref={roverNameInput}
            isInvalid={inputError}
            onChange={() =>
              roverNameInput.current.value && setInputError(false)
            }
          />
        </Form.Group>
      </Modal.Body>
      <Modal.Footer className="d-flex justify-content-between">
        <Button variant="secondary" onClick={toggleModal}>
          Cancel
        </Button>
        <Button variant="primary" onClick={launchRover} disabled={loading}>
          {loading ? 'Loading...' : 'Launch'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddRoverModal;
