import {
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signInWithPopup,
    signOut,
    updateProfile,
  } from "firebase/auth";
  import { GithubAuthProvider, GoogleAuthProvider } from "firebase/auth";
  import { createContext, useEffect, useState } from "react";
  import axios from "axios";
  import { auth } from "../Firebase/firebase.config";
  
  export const AuthContext = createContext(null);
  const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [update, setUpdate] = useState(false);
  
    const createUser = (email, password) => {
      setLoading(true);
      return createUserWithEmailAndPassword(auth, email, password);
    };
    const signIn = (email, password) => {
      setLoading(true);
      return signInWithEmailAndPassword(auth, email, password);
    };
  
    const updateUserProfile = (name, photo) => {
      return updateProfile(auth.currentUser, {
        displayName: name,
        photoURL: photo,
      });
    };
  
    const saveUser = async (user) => {
      const userInf = {
        userName: user?.displayName,
        userImage: user?.photoURL,
        userEmail: user?.email,
        role: "User",
        status: "Verified",
      };
      const { data } = await axios.put(
        `${import.meta.env.VITE_API_URL}/users`,
        userInf
      );
      return data;
    };
    useEffect(() => {
      const unSubscribe = onAuthStateChanged(auth, (currentUser) => {
        const userEmail = currentUser?.email || user?.email;
        const loggedUser = { email: userEmail };
        setUser(currentUser);
        if (currentUser) {
          saveUser(currentUser);
          axios
            .post(`${import.meta.env.VITE_API_URL}/jwt`, loggedUser, {
              withCredentials: true,
            })
            .then((res) => {
              console.log(res.data);
            });
        } else {
          axios
            .post(`${import.meta.env.VITE_API_URL}/logout`, loggedUser, {
              withCredentials: true,
            })
            .then((res) => {
              console.log(res.data);
            });
        }
        setLoading(false);
      });
      return () => {
        unSubscribe();
      };
    }, [update]);
    const logOut = () => {
      return signOut(auth);
    };
    const googleProvider = new GoogleAuthProvider();
    const githubProvider = new GithubAuthProvider();
    const googleLogin = () => {
      return signInWithPopup(auth, googleProvider);
    };
    const githubLogin = () => {
      return signInWithPopup(auth, githubProvider);
    };
    const userInfo = {
      setLoading,
      setUpdate,
      update,
      updateUserProfile,
      user,
      createUser,
      signIn,
      logOut,
      loading,
      googleLogin,
      githubLogin,
    };
    return (
      <AuthContext.Provider value={userInfo}>{children}</AuthContext.Provider>
    );
  };
  
  export default AuthProvider;