// User モデルの定義
// NOTE: Auth系でのみ使うので、emailフィールドを含んでいるが、
//       それ以外のドメインではemailはセキュリティの観点で用いるべきでない
export type User = {
  id: string;
  name: string;
  email: string;
};