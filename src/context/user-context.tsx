import {
  createContext,
  useContext,
  useEffect,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import axios from "axios";
import type { IUserData } from "@/types";

type UserContextType = {
  user: IUserData | null;
  handleGetUser: () => void;
  setUser: Dispatch<SetStateAction<IUserData | null>>;
};

export const UserContext = createContext<UserContextType>({
  user: null,
  handleGetUser: () => {},
  setUser: () => {},
});

export const UserContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const [user, setUser] = useState<IUserData | null>(null);

  const handleGetUser = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get(`${BASE_URL}me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 200) {
        setUser(res.data.data.user);
      }
    } catch (error) {
      console.error("Get user error:", error);
    }
  };

  useEffect(() => {
    handleGetUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, handleGetUser, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserContext must be used within a UserContextProvider");
  }
  return context;
};
