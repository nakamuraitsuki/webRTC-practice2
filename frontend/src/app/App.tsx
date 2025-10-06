// src/app/App.tsx
import { HashRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./providers/AuthProvider.tsx";
import { routes } from "./router.tsx";

const renderRoutes = (routes: any[]) => {
  return routes.map((route, i) => {
    const { children, ...rest } = route;
    return (
      <Route key={i} {...rest}>
        {children && renderRoutes(children)}
      </Route>
    );
  })
}

export default function App() {
  return (
    <AuthProvider>
        <HashRouter>
          <Routes>
            {renderRoutes(routes)}
          </Routes>
        </HashRouter>
    </AuthProvider>
  );
}
