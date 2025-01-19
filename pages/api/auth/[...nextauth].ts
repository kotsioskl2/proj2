import NextAuth, { DefaultSession, DefaultUser } from 'next-auth';
import { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { createClient } from '@supabase/supabase-js';
import { JWT } from 'next-auth/jwt';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY!;
console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Key:', supabaseKey);

const supabase = createClient(supabaseUrl, supabaseKey);

// Define custom types
interface CustomUser extends DefaultUser {
  role?: string;
  username?: string;
}

interface CustomSession extends DefaultSession {
  user: CustomUser;
}

type CustomToken = {
  role?: string;
} & JWT;

// Extend the built-in types
declare module 'next-auth' {
  interface Session extends CustomSession {}
  interface User extends CustomUser {}
}

declare module 'next-auth/jwt' {
  interface JWT {
    role?: string;
  }
}

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials): Promise<CustomUser | null> {
        if (!credentials) {
          console.error('Missing credentials');
          throw new Error('Missing credentials');
        }
        const { email, password } = credentials;

        console.log('Attempting to sign in with email:', email);

        // Check if the provided credentials match any user in the database
        const { data: signInData, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error || !signInData.user) {
          console.error('Supabase auth error:', error);
          throw new Error('Invalid email or password');
        }

        const user = signInData.user;

        console.log('User signed in:', user);

        // Get user role from users table
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('role, username')
          .eq('id', user.id)
          .single();

        if (userError) {
          console.error('User data error:', userError);
          throw new Error('Error fetching user data');
        }

        if (!userData) {
          throw new Error('No user data found');
        }

        console.log('User data fetched:', userData);

        return {
          id: user.id,
          email: user.email!,
          name: user.email!,
          username: userData?.username,
          role: userData?.role || 'user'
        };
      }
    })
  ],
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.role = (user as CustomUser).role;
        token.id = (user as CustomUser).id;
        token.email = (user as CustomUser).email;
      }
      return token;
    },
    session: async ({ session, token }) => {
      if (session?.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        (session.user as CustomUser).role = token.role;
      }
      return session;
    },
    async signIn({ user }) {
      if (user.role === 'admin') {
        return true; // Let NextAuth handle the redirect
      }
      return true;
    }
  },
  pages: {
    signIn: '/login',
    error: '/auth/error', // Simplified error path
  },
  session: {
    strategy: 'jwt',
  }
};

export default NextAuth(authOptions);
