/* eslint-disable react-refresh/only-export-components */
/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { createContext, useState, useEffect, useContext } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

type UserRole = string;

type UserProfile = {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  created_at: string | null;
  updated_at: string | null;
  email_verified: boolean | null;
  roles: string[] | null;
  subscription_id: string | null;
  subscription_status: string | null;
  active: boolean | null;
  provider: string;
};

type AuthContextType = {
  session: Session | null;
  user: User | null;
  profile: UserProfile | null;
  userRole: UserRole | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string) => Promise<{ error: any }>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: any }>;
  updateProfile: (updates: any) => Promise<{ error: any }>;
  refetchProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener first
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, newSession) => {
      setSession(newSession);
      setUser(newSession?.user ?? null);

      if (newSession?.user) {
        // Use setTimeout to prevent deadlocks
        setTimeout(() => {
          fetchUserProfile(newSession, newSession.user.id);
        }, 0);
      } else {
        setProfile(null);
        setUserRole(null);
      }
    });

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session: newSession } }) => {
      setSession(newSession);
      setUser(newSession?.user ?? null);

      if (newSession?.user) {
        fetchUserProfile(newSession, newSession.user.id);
        localStorage.setItem("access_token", newSession.access_token);
      }

      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const refetchProfile = async () => {
    if (profile) {
      await fetchUserProfile(session!, profile.id);
    }
  };

  const fetchUserProfile = async (newSession: Session, userId: string) => {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("Error fetching user profile:", error);

        // Create new user record if profile doesn't exist
        const { error: createError } = await supabase.from("users").insert({
          id: userId,
          avatar_url: newSession.user?.user_metadata?.avatar_url,
          first_name:
            newSession.user?.user_metadata?.full_name?.split(" ")[0] || "",
          last_name:
            newSession.user?.user_metadata?.full_name?.split(" ")[1] || "",
          email: newSession?.user.email,
          provider: newSession.user?.app_metadata?.provider || "email",
          roles: ["user"],
          email_verified: newSession.user?.email_confirmed_at ? true : false,
          active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });

        if (createError) {
          console.error("Error creating user record:", createError);
        } else {
          // Fetch the newly created profile

          const { data: newData, error: newError } = await supabase
            .from("users")
            .select("*")
            .eq("id", userId)
            .single();

          if (newError) {
            console.error("Error fetching new user profile:", newError);
          } else if (newData) {
            setProfile(newData as unknown as UserProfile);
            if (newData.roles && newData.roles.length > 0) {
              setUserRole(newData.roles[0]);
            }
          }
        }
      } else if (data) {
        setProfile(data as unknown as UserProfile);
        if (data.roles && data.roles.length > 0) {
          setUserRole(data.roles[0]);
        }
      }
    } catch (error) {
      console.error("Error in fetchUserProfile:", error);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      return { error };
    } catch (error) {
      console.error("Error in signIn:", error);
      return { error };
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });
      return { error };
    } catch (error) {
      console.error("Error in signUp:", error);
      return { error };
    }
  };

  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin,
      },
    });
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    return { error };
  };

  const updateProfile = async (updates: any) => {
    try {
      if (!user) {
        return { error: new Error("User not authenticated") };
      }

      const { error } = await supabase
        .from("users")
        .update(updates)
        .eq("id", user.id);

      if (!error) {
        // Refresh profile data
        fetchUserProfile(session!, user.id);
      }

      return { error };
    } catch (error) {
      console.error("Error updating profile:", error);
      return { error };
    }
  };

  const value = {
    session,
    user,
    profile,
    userRole,
    isLoading,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
    resetPassword,
    updateProfile,
    refetchProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
