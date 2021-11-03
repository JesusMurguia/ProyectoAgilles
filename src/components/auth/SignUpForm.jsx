import React from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import "./auth.css";
import { useAuth } from "../../hooks/useAuth";
import { useForm } from "react-hook-form";

const SignUpForm = () => {
  const { handleSubmit, register, setError, formState } = useForm();

  const { createUserWithEmailAndPassword } = useAuth();

  const onSubmit = async (data) => {
    try {
      await createUserWithEmailAndPassword(
        data.email,
        data.password,
        data.username
      );
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
          <h1>Sign Up</h1>
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
                required={true}
                type="email"
                placeholder="Enter email"
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="username">
              <Form.Label>Username</Form.Label>
              <Form.Control
                {...register("username", {
                  required: true,
                  pattern: {
                    value: /^[a-zA-Z0-9]+$/,
                    message:
                      "Your username should only include letters and numbers",
                  },
                })}
                required={true}
                name="username"
                type="username"
                maxLength="20"
                placeholder="Enter username"
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                {...register("password")}
                name="password"
                maxLength="100"
                required={true}
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
                Sign up
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

export default SignUpForm;
