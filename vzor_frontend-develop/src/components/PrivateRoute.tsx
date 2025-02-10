import { Navigate, useLocation } from "react-router-dom";

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const location = useLocation();

  // Здесь должна быть ваша логика проверки аутентификации
  // Например, проверка токена в localStorage
  const isAuthenticated = localStorage.getItem("token") !== null;


  if (!isAuthenticated) {
    // Перенаправляем на страницу логина, сохраняя текущий путь
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default PrivateRoute;
