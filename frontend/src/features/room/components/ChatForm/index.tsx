import { useForm } from "react-hook-form"
import { ChatFormData } from "../../pages"
import { Form } from "../../../ui/Form";

export type ChatFormProps = {
  register: ReturnType<typeof useForm<ChatFormData>>["register"];
  onSubmit: (e?: React.BaseSyntheticEvent) => void;
  reset: () => void; // フォームクリア
}

export const ChatForm  = ({ register, onSubmit, reset }: ChatFormProps) => {
  // onSubmitにフォームクリア処理を追加
  const handleSubmit = (e: React.BaseSyntheticEvent) => {
    onSubmit(e);
    reset();
  };

  return (
    <form onSubmit={handleSubmit}>
      <Form.Field>
        <Form.Input
          {...register('content')}
          placeholder="メッセージを入力"
          required
        />
        <Form.Button type="submit">
          送信
        </Form.Button>
      </Form.Field>
    </form>
  )
}