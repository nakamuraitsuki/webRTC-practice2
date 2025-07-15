import { NavigateFunction, useNavigate } from "react-router-dom";
import { useAuth } from "../../../app/hooks/useAuth";
import { LoginForm } from "../components/LoginForm";
import styles from "./LoginPage.module.css";
import { useForm } from "react-hook-form";
import { UserUseCase } from "../../../domains/user/usecases/UserUseCase";
import { useEffect } from "react";

export type LoginFormData = {
  email: string;
  password: string;
};

const LoginHandler = async (data: LoginFormData, usecase: UserUseCase, navigate: NavigateFunction) => {
  const input = {
    email: data.email,
    password: data.password,
  };
  await usecase.login(input);
  navigate('/'); // ログイン後はホームへリダイレクト
}

export const LoginPage = () => {
  const {user, usecase} = useAuth();
  const { register, handleSubmit } = useForm<LoginFormData>();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  if (user) return null;

  const onSubmit = handleSubmit((data) => {
    LoginHandler(data, usecase, navigate);
  });

  const loginFormProps = {
    user,
    register,
    onSubmit,
  };

  return (
    <div className={styles.container}>
      <h1>Login</h1>
      <LoginForm {...loginFormProps} />
    </div>
  );
}