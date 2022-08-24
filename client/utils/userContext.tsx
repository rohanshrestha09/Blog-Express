import { createContext } from "react";

interface context {
  userInfo?: Response;
  userLogout: () => void;
}

const userContext = createContext<context | null>(null);

export default userContext;
