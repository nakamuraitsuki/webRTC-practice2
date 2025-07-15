// src/app/App.tsx
import { RouterProvider } from "react-router-dom";
import { appRouter } from "./router.tsx";
import { AuthProvider } from "./providers/AuthProvider.tsx";
import { RoomProvider } from "./providers/RoomProvider.tsx";

export default function App() {
  return (
    <AuthProvider>
      <RoomProvider>
        <RouterProvider router={appRouter} />
      </RoomProvider>
    </AuthProvider>
  );
}
