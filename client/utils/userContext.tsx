import { createContext } from "react";

interface context {
  storage: any;
}

const userContext = createContext<context | null>(null);

export default userContext;
