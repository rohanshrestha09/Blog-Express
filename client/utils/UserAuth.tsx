import { NextRouter, useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";
import { auth } from "../api/user";
import { AUTH } from "../constants/queryKeys";

import UserContext from "./userContext";

const UserAuth: React.FC<{ children: React.ReactNode }> = ({
  children,
}): JSX.Element => {
  const router: NextRouter = useRouter();

  const { data: userInfo, refetch } = useQuery({
    queryFn: () => auth(),
    queryKey: [AUTH],
  });

  const userLogout = (): void => {
    localStorage.removeItem("token");
    refetch();
    router.push("/signup");
  };

  return (
    <UserContext.Provider value={{ userInfo, userLogout }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserAuth;
