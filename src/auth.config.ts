// src/auth.config.ts
import type { NextAuthConfig } from "next-auth";
import NextAuth from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
        token.sub = user.id?.toString();
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) (session.user as any).role = token.role;
      if (token.sub && session.user) session.user.id = token.sub;
      return session;
    },
  },
  providers: [],
} satisfies NextAuthConfig;

export const { auth } = NextAuth(authConfig);