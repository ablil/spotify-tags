import { ExtendedSession } from "@/lib/nextauth/handler";
import { useSession } from "next-auth/react";
import React, { FC, PropsWithChildren, useEffect } from "react";

const AuthWrapper: FC<PropsWithChildren> = ({ children }) => {
  const { status, data } = useSession();

  useEffect(() => {
    if (status === "authenticated") {
      const token = (data as ExtendedSession).accessToken;
      if (token) {
        sessionStorage.setItem("token", token);
      } else {
        console.warn("missing access token from user session");
      }
    } else {
      sessionStorage.removeItem("token");
    }
  }, [data, status]);

  return <>{children}</>;
};

export default AuthWrapper;
