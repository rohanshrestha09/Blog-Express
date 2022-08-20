import UserContext from "./userContext";

const UserAuth: React.FC<{ children: React.ReactNode }> = ({
  children,
}): JSX.Element => {
  const storage = "Rohan";

  return (
    <UserContext.Provider value={{ storage }}>{children}</UserContext.Provider>
  );
};

export default UserAuth;
