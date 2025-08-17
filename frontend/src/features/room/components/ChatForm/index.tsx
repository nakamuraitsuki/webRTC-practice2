import { useForm } from "react-hook-form"
import { ChatFormData } from "../../pages"
import { Form } from "../../../ui/Form";

export type ChatFormProps = {
  register: ReturnType<typeof useForm<ChatFormData>>["register"];
  onSubmit: (e?: React.BaseSyntheticEvent) => void;
}

export const ChatForm  = ({ register, onSubmit }: ChatFormProps) => {
  return (
    <form onSubmit={onSubmit}>
      <Form.Field>
        <Form.Input
          {...register('content')}
          placeholder="メッセージを入力"
        />
        <Form.Button />
      </Form.Field>
    </form>
  )
}