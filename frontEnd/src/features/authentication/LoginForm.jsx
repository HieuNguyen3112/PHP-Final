import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../ui/Button";
import Form from "../../ui/Form";
import Input from "../../ui/Input";
import FormRowVertical from "../../ui/FormRowVertical";
import SpinnerMini from "../../ui/SpinnerMini";
import useLogin from "../../api/useLogin"; 

function LoginForm() {
  const { handleLogin, loading, error } = useLogin(); 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); 
  const [message, setMessage] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    if (!email || !password) {
        setMessage("Please enter both email and password.");
        return;
    }

    // Gọi API đăng nhập từ handleLogin
    const success = await handleLogin(email, password);

    if (success) {
        setMessage("Login successful!");
        setTimeout(() => {
            navigate("/dashboard");
        }, 1500);
    } else {
        setMessage(error || "Invalid email or password.");
    }
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
          disabled={loading}
        />
      </FormRowVertical>
      <FormRowVertical label="Password">
        <Input
          type="password"
          id="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
        />
      </FormRowVertical>
      <FormRowVertical>
        <Button size="large" disabled={loading}>
          {!loading ? "Log in" : <SpinnerMini />}
        </Button>
      </FormRowVertical>
      
      {/* Hiển thị thông báo */}
      {message && <p>{message}</p>}
    </Form>
  );
}

export default LoginForm;
