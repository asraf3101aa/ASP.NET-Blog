import { RoutePath } from "@/@enums/router.enum";
import { ILocalStorage } from "@/storage/ILocalStorage";

export const handleLogout = (
  localStorageClient: ILocalStorage,
  handleRedirect: (path: string) => void
) => {
  localStorageClient.clearLocalStorage();
  handleRedirect(RoutePath.LOGIN);
};
