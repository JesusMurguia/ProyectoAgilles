import React from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import "./auth.css";
import { useAuth } from "../../hooks/useAuth";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";

const LoginForm = () => {
  const { handleSubmit, register, setError, formState } = useForm();

  const { signInWithEmailAndPassword } = useAuth();

  const history = useHistory();

  const onSubmit = async (data) => {
    try {
      await signInWithEmailAndPassword(data.email, data.password);
      history.push("/");
    } catch (error) {
      setError("email", {
        type: "manual",
        message: error.message,
      });
    }
  };
  return (
    <Container>
      <Row>
        <Col className="text-center m-5">
          <h1>Log In</h1>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="4">
          {formState.errors.email && (
            <div className="alert alert-danger">
              {formState.errors.email.message}
            </div>
          )}
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Form.Group className="mb-3" controlId="email">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                {...register("email")}
                name="email"
                type="email"
                placeholder="Enter email"
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                {...register("password")}
                name="password"
                type="password"
                placeholder="Password"
              />
            </Form.Group>
            {/* <Form.Group className="mb-3" controlId="formBasicCheckbox">
              <Form.Check type="checkbox" label="Keep me signed in" />
            </Form.Group> */}
            {!formState.isSubmitting && (
              <Button
                className="float-left"
                variant="outline-light"
                type="submit"
              >
                Login
              </Button>
            )}
            {formState.isSubmitting && (
              <Button
                className="float-left"
                variant="outline-light"
                type="button"
                disabled
              >
                <span
                  className="spinner-border spinner-border-sm"
                  role="status"
                  aria-hidden="true"
                ></span>
              </Button>
            )}
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginForm;
