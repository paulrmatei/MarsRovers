import Card from 'react-bootstrap/Card';

const Rover = ({ rover }) => {
  const { name, state } = rover;

  return (
    <div className="col-12 col-sm-4">
      <Card>
        <Card.Body>
          <Card.Title>{name}</Card.Title>
          <Card.Text>{state}</Card.Text>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Rover;
