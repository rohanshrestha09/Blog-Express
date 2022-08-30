import { NextRouter, useRouter } from "next/router";
import {
  dehydrate,
  DehydratedState,
  QueryClient,
  useQuery,
} from "@tanstack/react-query";
import { auth } from "../api/user";
import { AUTH } from "../constants/queryKeys";

import UserContext from "./userContext";
import { GetServerSideProps } from "next";
import AppLayout from "../components/AppLayout";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const UserAuth: React.FC<{
  children: React.ReactNode;
}> = ({ children }): JSX.Element => {
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
      <AppLayout>
        {children} <ReactQueryDevtools />
      </AppLayout>
    </UserContext.Provider>
  );
};

export default UserAuth;

export const getServerSideProps: GetServerSideProps = async (): Promise<{
  props: { dehydratedState: DehydratedState };
}> => {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({ queryFn: () => auth(), queryKey: [AUTH] });

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};
