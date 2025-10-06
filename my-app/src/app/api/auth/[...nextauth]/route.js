import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { getConnection } from "@/lib/db";
import bcrypt from "bcryptjs";

const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const { email, password } = credentials || {};

        if (!email || !password) {
          throw new Error("Email and password are required");
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) throw new Error("Invalid email format");

        if (password.length < 6)
          throw new Error("Password must be at least 6 characters long");


        let user;
        try {
          const pool = await getConnection();
          const [rows] = await pool.query(
            "SELECT * FROM Users WHERE Email = ?",
            [email]
          );
          if (rows.length === 0) throw new Error("Email not registered");
          user = rows[0];
        } catch (err) {
          console.error("DB error:", err);
          throw new Error("Incorrect Email or Password");
        }

        if (user.Status && user.Status.toLowerCase() === "disabled") {
          throw new Error("Your account has been disabled. Contact support.");
        }

        const isValid = await bcrypt.compare(password, user.PasswordHash);
        if (!isValid) throw new Error("Incorrect password");

        // ✅ Success: return user object
        return {
          id: user.Id,
          name: user.Name,
          email: user.Email,
          role: user.Role,
          message: "Login successful", // Pass success message
        };
      },
    }),
  ],

  session: {
    strategy: "jwt",
    maxAge: 4 * 60 * 60,
  },

  jwt: {
    secret: process.env.JWT_SECRET,
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.message = user.message || null; // store message in token
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.message = token.message; // pass message to client session
      }
      return session;
    },
  },

  pages: {
    signIn: "/auth/login",
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
