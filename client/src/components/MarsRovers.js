import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';

import Rover from './Rover';
import AddRoverModal from './AddRoverModal';
import Loading from './Loading';
import Error from './Error';

const MarsRovers = () => {
  const [rovers, setRovers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [modal, setModal] = useState(false);

  useEffect(() => {
    const socket = io('', { path: '/ws' });
    socket.on('/rovers', (data) => {
      setRovers(data);
      setLoading(false);
    });

    socket.on('connect_error', () => {
      setLoading(false);
      setError('Oops, satellite may be looking for Pluto...');
    });
  }, []);

  const displayRovers = () => {
    return rovers.map((rover, index) => <Rover key={index} rover={rover} />);
  };

  const toggleModal = () => {
    setModal(!modal);
  };

  if (loading) return <Loading />;
  if (error) return <Error error={error} />;

  return (
    <Container className="py-5">
      <h1 className="text-center">Mars Rovers</h1>
      <div className="row g-3">{displayRovers()}</div>
      <div className="d-flex justify-content-end  mt-2">
        <Button variant="primary" onClick={toggleModal}>
          New Rover
        </Button>
      </div>
      <AddRoverModal open={modal} toggleModal={toggleModal} />
    </Container>
  );
};

export default MarsRovers;
