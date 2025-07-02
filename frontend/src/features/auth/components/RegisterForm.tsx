import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { RegisterFormData } from "../types/RegisterFormData";
import { useAuth } from "../hooks/useAuth";
import { UserRepo } from "../repository/userRepositoryImpl";
import { Form } from "../../ui/Form";
import { RegisterParams } from "../repository/userRepository";

import styles from "./RegisterForm.module.css";

export const RegisterForm = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
  } = useForm<RegisterFormData>()
  const { user, loading, refetch } = useAuth();
  if (loading) return <div>Loading...</div>;

  const registerHandler = async (data: RegisterFormData) => {
    try {

      const input: RegisterParams = { data, refetch };
      await UserRepo.register(input);

      navigate('/');
    } catch (error) {
      console.error("Register failed:", error);
    }
  };
  return (
    <form className={styles.form} onSubmit={handleSubmit(registerHandler)}>
      <Form.Field>
        <Form.Label label="Name" />
        <Form.Input
          type="text"
          id="name"
          required
          placeholder="Name"
          {...register("name")}
        />
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
            Register
          </Form.Button>
        )}
      </Form.Field>
    </form>
  )
}