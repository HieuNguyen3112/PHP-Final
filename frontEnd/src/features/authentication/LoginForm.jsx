import { useState } from "react";
import Button from "../../ui/Button";
import Form from "../../ui/Form";
import Input from "../../ui/Input";
import FormRowVertical from "../../ui/FormRowVertical";
import SpinnerMini from "../../ui/SpinnerMini";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [message, setMessage] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (!email || !password) {
      setMessage("Please enter both email and password.");
      return;
    }

    // Dữ liệu tĩnh tạm thời cho kiểm tra đăng nhập
    const mockEmail = "admin@example.com";
    const mockPassword = "password123";

    setIsPending(true);

    setTimeout(() => {
      if (email === mockEmail && password === mockPassword) {
        setMessage("Login successful!");
      } else {
        setMessage("Invalid email or password.");
      }
      setIsPending(false);
    }, 1000);
  }

  return (
    <Form onSubmit={handleSubmit}>
      <FormRowVertical label="Email address">
        <Input
          type="email"
          id="email"
          autoComplete="username"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isPending}
        />
      </FormRowVertical>
      <FormRowVertical label="Password">
        <Input
          type="password"
          id="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isPending}
        />
      </FormRowVertical>
      <FormRowVertical>
        <Button size="large" disabled={isPending}>
          {!isPending ? "Log in" : <SpinnerMini />}
        </Button>
      </FormRowVertical>
      {message && <p>{message}</p>}
    </Form>
  );
}

export default LoginForm;
