import { createContext } from "react";
import context from "../interface/context";

const userContext = createContext<context | null>(null);

export default userContext;
