import { createBrowserRouter, Outlet } from "react-router-dom";
import { HomePage } from "../features/home";
import { Layout } from "../features/layout";
import { LoginPage, RegisterPage } from "../features/auth";
import { CreateRoomPage, RoomListPage, RoomPage } from "../features/room";
import { ImageUploadPage } from "../features/icon/pages";
import { RoomProvider } from "./providers";

export const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "user",
        children: [
          {
            path: "register",
            element: <RegisterPage />,
          },
          {
            path: "login",
            element: <LoginPage />,
          },
          {
            path: "icon",
            element: <ImageUploadPage />
          }
        ]
      },
      {
        path: "room",
        element: (
          <RoomProvider>
            <Outlet />
          </RoomProvider>
        ),
        children: [
          {
            index: true,
            element: <RoomListPage />,
          },
          {
            path: "create",
            element: <CreateRoomPage />,
          },
          {
            path: ":roomId",
            element: (
              <RoomPage />
            ),
          }
        ]
      },
    ]
  }
]);
