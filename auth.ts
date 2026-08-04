import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

export function isGoogleAuthConfigured() {
  return Boolean(process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET);
}

function adminEmails() {
  return new Set(
    (process.env.ADMIN_EMAILS ?? "")
      .split(",")
      .map((email) => email.trim().toLowerCase())
      .filter(Boolean),
  );
}

export const { auth, handlers, signIn, signOut } = NextAuth({
  providers: isGoogleAuthConfigured() ? [Google] : [],
  callbacks: {
    signIn({ user }) {
      return typeof user.email === "string" && adminEmails().has(user.email.toLowerCase());
    },
    jwt({ token, profile }) {
      const email = profile?.email ?? token.email;
      token.isAdmin = typeof email === "string" && adminEmails().has(email.toLowerCase());
      return token;
    },
    session({ session, token }) {
      session.user.isAdmin = token.isAdmin === true;
      return session;
    },
  },
});
