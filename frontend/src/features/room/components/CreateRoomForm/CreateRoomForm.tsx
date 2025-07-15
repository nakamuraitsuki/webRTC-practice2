import { useForm } from "react-hook-form";
import { Form } from "../../../ui/Form";
import styles from "./CreateRoomForm.module.css";
import React from "react";
import { CreateRoomFormData } from "../../pages";

export type CreateRoomFormProps = {
  register: ReturnType<typeof useForm<CreateRoomFormData>>['register'];
  onSubmit: (e?: React.BaseSyntheticEvent) => void;
};

export const CreateRoomForm = ({ register, onSubmit }: CreateRoomFormProps) => {
  return (
    <form className={styles.form} onSubmit={onSubmit}>
      <Form.Field>
        <Form.Label label="Room Name" />
        <Form.Input
          type="text"
          id="roomName"
          required
          placeholder="Enter room name"
          {...register("name")}
        />
        <Form.Button type="submit">
          Create Room
        </Form.Button>
      </Form.Field>
    </form>
  );
}