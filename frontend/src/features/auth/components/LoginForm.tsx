import { useForm } from "react-hook-form";
import { LoginFormData } from "../types/LoginFormData";
import { useAuth } from "../hooks/useAuth";
import { Form } from "../../ui/Form";
import { useNavigate } from "react-router-dom";

import styles from "./LoginForm.module.css";
import { LoginParams } from "../repository/userRepository";
import { UserRepo } from "../repository/userRepositoryImpl";

export const LoginForm = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
  } = useForm<LoginFormData>()
  const { user, loading, refetch } = useAuth();
  if (loading) return <div>Loading...</div>;

  const handleLogin = async (data: LoginFormData) => {
    try {
      const input: LoginParams = { data, refetch };
      await UserRepo.login(input);

      navigate('/');
    } catch (error) {
      console.error("Login failed:", error);
    }
  };
  return (
    <form className={styles.form} onSubmit={handleSubmit(handleLogin)}>
      <Form.Field>
        <Form.Label label="Email" />
        <Form.Input
          type="email"
          id="email"
          required
          placeholder="Email"
          {...register("email")}
        />
        <Form.Label label="Password" />
        <Form.Input
          type="password"
          id="password"
          required
          placeholder="Password"
          {...register("password")}
        />
        {!user && (
          <Form.Button type="submit" >
            Login
          </Form.Button>
        )}
      </Form.Field>
    </form>
  )
}