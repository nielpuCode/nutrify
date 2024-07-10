// src/app/lib/auth.ts
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import User from "../../../models/User";
import connect from "../../../utils/db";

export const authOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await connect();
        try {
          const user = await User.findOne({ email: credentials.email });
          if (!user) {
            throw new Error("Email not found");
          }

          console.log("Hashed password from DB:", user.password); // Log the hash from the database
          console.log("Input password from user:", credentials.password); // Log the input password

          // Check the password
          const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password);
          console.log("Password match:", isPasswordCorrect); // Log the result of the comparison

          if (!isPasswordCorrect) {
            throw new Error("Incorrect password");
          }

          // Return user data with all fields
          return { 
            id: user._id, 
            nickname: user.nickname, 
            email: user.email, 
            name: user.fullname, 
            birthDate: user.birthDate,
            allergy: user.allergy, 
            gender: user.gender, 
            password: user.password 
          };
        } catch (err) {
          console.error(err);
          throw new Error(err.message);
        }
      },
    }),
  ],
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        console.log("JWT callback - user:", user);
        console.log("JWT callback - token:", token);
        token.id = user.id;
        token.nickname = user.nickname;
        token.email = user.email;
        token.name = user.name;
        token.birthDate = user.birthDate;
        token.allergy = user.allergy;
        token.gender = user.gender;
        // Note: Storing passwords in the token is not recommended for security reasons
        // token.password = user.password;
      }
      return token;
    },
    async session({ session, token }) {
      console.log("Session callback - token:", token);
      console.log("Session callback - session:", session);
      session.id = token.id;
      session.nickname = token.nickname;
      session.email = token.email;
      session.name = token.name;
      session.birthDate = token.birthDate;
      session.allergy = token.allergy;
      session.gender = token.gender;
      // Note: Exclude password for security reasons
      // session.password = token.password;
      return session;
    }
  },
};
