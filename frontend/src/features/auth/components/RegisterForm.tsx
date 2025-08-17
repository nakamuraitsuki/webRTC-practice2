import React from "react";
import styles from "./RegisterForm.module.css";
import { useForm } from "react-hook-form";
import { Form } from "../../ui/Form";
import { User } from "../../../domains/user/models/User";
import { RegisterFormData } from "../pages";

export type RegisterFormProps = {
  user: User | null;
  register: ReturnType<typeof useForm<RegisterFormData>>["register"];
  onSubmit: (e?: React.BaseSyntheticEvent) => void;
}

export const RegisterForm = ({ user, register, onSubmit }: RegisterFormProps) => {
  return (
    <form className={styles.form} onSubmit={onSubmit}>
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