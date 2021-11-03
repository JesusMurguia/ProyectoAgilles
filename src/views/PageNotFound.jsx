import React from "react";
import { Container, Row, Col } from "react-bootstrap";

const PageNotFound = () => (
  <Container>
    <Row>
      <Col className="text-center m-5">
        <h1>404</h1>
        <p>Page not found.</p>
      </Col>
    </Row>
  </Container>
);

export default PageNotFound;
