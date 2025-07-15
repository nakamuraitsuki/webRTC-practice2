import { useForm } from "react-hook-form";
import { User } from "../../../domains/user/models/User";
import { Form } from "../../ui/Form";
import styles from "./LoginForm.module.css";
import { LoginFormData } from "../pages";

export type LoginFormProps = {
  user: User | null;
  register: ReturnType<typeof useForm<LoginFormData>>["register"];
  onSubmit: (e?: React.BaseSyntheticEvent) => void;
}

export const LoginForm = ({ user, register, onSubmit }: LoginFormProps) => {
  return (
    <form className={styles.form} onSubmit={onSubmit}>
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