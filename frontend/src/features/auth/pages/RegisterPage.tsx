import { NavigateFunction, useNavigate } from "react-router-dom";
import { useAuth } from "../../../app/hooks/useAuth";
import { RegisterForm, RegisterFormProps } from "../components/RegisterForm";
import { RegisterInput } from "../../../domains/user/repositories/UserRepository";

import styles from "./RegisterPage.module.css";
import { useForm } from "react-hook-form";
import { UserUseCase } from "../../../domains/user/usecases/UserUseCase";
import { useEffect } from "react";

// DTO
export type RegisterFormData = {
  name: string;
  email: string;
  password: string;
};

const RegisterHandler = async (data: RegisterFormData, usecase: UserUseCase, navigate: NavigateFunction) => {
  const input: RegisterInput = {
    name: data.name,
    email: data.email,
    password: data.password,
  }
  await usecase.register(input)
  navigate('/'); // 登録後はホームへリダイレクト
};

export const RegisterPage = () => {
  const { user, usecase } = useAuth();
  const { register, handleSubmit } = useForm<RegisterFormData>();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  if (user) return null;

  const onSubmit = handleSubmit((data) => {
    RegisterHandler(data, usecase, navigate);
  });

  const registerProps: RegisterFormProps = {
    user,
    register,
    onSubmit,
  };

  return (
    <div className={styles.container}>
      <h1>Register</h1>
      <RegisterForm {...registerProps} />
    </div>
  );
}