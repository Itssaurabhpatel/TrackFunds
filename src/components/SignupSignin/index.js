import React, { useState } from "react";
import "./styles.css";
import Input from "../Input";
import Button from "../Button";
import { toast } from "react-toastify";
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider
} from "firebase/auth";
import { auth, db } from "../../firebase";
import { useNavigate } from "react-router-dom";
import { doc, setDoc, getDoc } from "firebase/firestore";

function SignupSigninComponent() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loginForm, setLoginForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function signupWithEmail() {
    setLoading(true);
    if (fullName === "" || email === "" || password === "" || confirmPassword === "") {
      toast.error("All fields are mandatory!");
      setLoading(false);
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Password and Confirm Password don't match!");
      setLoading(false);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      toast.success("User Created!");
      createDoc(user);
      navigate("/dashboard");
      resetForm(); // Reset form after successful signup
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function loginUsingEmail() {
    setLoading(true);
    if (email === "" || password === "") {
      toast.error("All fields are mandatory!");
      setLoading(false);
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      toast.success("User Logged In!");
      navigate("/dashboard");
      resetForm(); // Reset form after successful login
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function createDoc(user) {
    if (!user) return;

    const userRef = doc(db, "users", user.uid);
    const userData = await getDoc(userRef);

    if (!userData.exists()) {
      try {
        await setDoc(userRef, { 
          name: user.displayName || "Anonymous", 
          email: user.email,
          photoURL: user.photoURL || "",
          createdAt: new Date()
        });
        toast.success("Document created!");
      } catch (e) {
        toast.error(e.message);
      }
    } else {
      toast.error("Document already exists");
    }
  }

  function googleAuth() {
    const provider = new GoogleAuthProvider();
    setLoading(true);
    signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user;
        createDoc(user);
        navigate("/dashboard");
        toast.success("User Authenticated!");
        resetForm(); // Reset form after successful Google authentication
      })
      .catch((error) => {
        toast.error(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  function resetForm() {
    setFullName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  }

  return (
    <>
      {loginForm ? (
        <div className="signup-wrapper">
          <h2 className="title">
            Log in <span style={{ color: "#28a750" }}>TrackFunds</span>
          </h2>
          <form>
            <Input
              type="email"
              label={"Email"}
              state={email}
              setState={setEmail}
              placeholder={"example@gmail.com"}
            />
            <Input
              type="password"
              label={"Password"}
              state={password}
              setState={setPassword}
              placeholder={"Example@123"}
            />
            <Button
              disabled={loading}
              text={loading ? "Loading..." : "Login using Email and Password"}
              onClick={loginUsingEmail}
              type="button"
            />
            <p className="p-login">or</p>
            <Button
              onClick={googleAuth}
              text={loading ? "Loading..." : "Login Using Google"}
              blue={true}
              type="button"
            />
            <p
              className="p-login"
              style={{ cursor: "pointer" }}
              onClick={() => setLoginForm(!loginForm)}
            >
              Or Don't Have an Account Already? Click Here
            </p>
          </form>
        </div>
      ) : (
        <div className="signup-wrapper">
          <h2 className="title">
            Sign Up on <span style={{ color: "mediumseagreen" }}>App Name</span>
          </h2>
          <form>
            <Input
              label={"Full Name"}
              state={fullName}
              setState={setFullName}
              placeholder={"Enter Your Name"}
            />
            <Input
              type="email"
              label={"Email"}
              state={email}
              setState={setEmail}
              placeholder={"example@gmail.com"}
            />
            <Input
              type="password"
              label={"Password"}
              state={password}
              setState={setPassword}
              placeholder={"Example@123"}
            />
            <Input
              type="password"
              label={"Confirm Password"}
              state={confirmPassword}
              setState={setConfirmPassword}
              placeholder={"Example@123"}
            />
            <Button
              disabled={loading}
              text={loading ? "Loading..." : "Signup using Email and Password"}
              onClick={signupWithEmail}
              type="button"
            />
            <Button 
              onClick={googleAuth}
              text={"Signup Using Google"} 
              blue={true} 
              type="button" 
            />
            <p 
              className="p-login" 
              style={{ cursor: "pointer" }} 
              onClick={() => setLoginForm(!loginForm)}
            >
              Or Already Have an Account? Click Here
            </p>
          </form>
        </div>
      )}
    </>
  );
}

export default SignupSigninComponent;
