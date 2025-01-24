import SpotifyProvider from "next-auth/providers/spotify";
import CredentialsProvider from "next-auth/providers/credentials";

export const spotifyProvider = SpotifyProvider({
  clientId: process.env.SPOTIFY_CLIENT_ID!,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET!,
  authorization: {
    params: {
      scope: "user-read-email user-read-currently-playing playlist-modify-private",
    },
  },
});

export const credentialsProvider = CredentialsProvider({
  name: "Credentials",
  credentials: {
    password: { label: "password", type: "password" },
  },
  // eslint-disable-next-line
  async authorize(credentials, _): Promise<any> {
    if (credentials?.password === process.env.PASSWORD) {
      return {
        name: "admin",
        email: "admin@example.com",
      };
    }
    return null;
  },
});
