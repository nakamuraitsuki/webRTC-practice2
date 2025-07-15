import { NavigateFunction, useNavigate } from "react-router-dom";
import { useRoom } from "../../../app/hooks/useRoom";
import { CreateRoomForm, CreateRoomFormProps } from "../components/CreateRoomForm/CreateRoomForm";
import { useForm } from "react-hook-form";
import styles from "./CreateRoomPage.module.css";
import { RoomUseCase } from "../../../domains/room/usecase/RoomUseCase";
import { CreateRoomInput } from "../../../domains/room/repositories/RoomRepository";

export type CreateRoomFormData = {
  name: string;
};

const CreateRoomHandler = async (
  data: CreateRoomFormData, 
  usecase: RoomUseCase, 
  navigate: NavigateFunction,
) => {
  const input: CreateRoomInput = {
    name: data.name,
  };
  await usecase.createRoom(input);
  navigate('/room'); // ルーム作成後はルーム一覧へリダイレクト
}

export const CreateRoomPage = () => {
  const { usecase } = useRoom();
  const { register, handleSubmit } = useForm<CreateRoomFormData>();
  const navigate = useNavigate();

  const onSubmit = handleSubmit((data) => {
    CreateRoomHandler(data, usecase, navigate);
  });

  const createRoomFormProps: CreateRoomFormProps = {
    register,
    onSubmit,
  };
  return (
    <div className={styles.container}>
      <h1>Create Room</h1>
      <CreateRoomForm {...createRoomFormProps} />
    </div>
  );
}