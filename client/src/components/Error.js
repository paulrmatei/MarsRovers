import Alert from 'react-bootstrap/Alert';

const Error = ({ error }) => {
  return <Alert variant="danger">{error}</Alert>;
};

export default Error;
