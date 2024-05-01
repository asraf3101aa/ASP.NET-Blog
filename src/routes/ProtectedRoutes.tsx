import { RoutePath } from "@/@enums/router.enum";
import { Navigate, Outlet } from "react-router-dom";
import { useStorage } from "@/contexts/StorageContext";

const ProtectedRoutes = () => {
  const localStorageClient = useStorage()!;
  const accessToken = localStorageClient.getAccessToken();
  return (
    <>{accessToken ? <Outlet /> : <Navigate to={RoutePath.LOGIN} replace />}</>
  );
};

export default ProtectedRoutes;
