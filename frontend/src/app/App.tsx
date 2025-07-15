// src/app/App.tsx
import { RouterProvider } from "react-router-dom";
import { appRouter } from "./router.tsx";
import { AuthProvider } from "./providers/AuthProvider.tsx";

export default function App() {
  return (
    <AuthProvider>
      <RouterProvider router={appRouter} />
    </AuthProvider>
  );
}
