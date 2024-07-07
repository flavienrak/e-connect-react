import "boxicons/css/boxicons.min.css";
import "../../../styles/Login.css";

import toast from "react-hot-toast";

import { useContext, useEffect, useRef, useState } from "react";
import { emailRegex } from "../../lib/regex";
import { useDispatch } from "react-redux";
import { UidContext } from "../../context/UidContext";
import { updatePersistInfos } from "../../redux/slices/persistSlice";
import { HiEye, HiEyeOff } from "react-icons/hi";
import { BiSolidUser } from "react-icons/bi";

export default function Login() {
  const login = useRef(null);
  const register = useRef(null);
  const dispatch = useDispatch();
  const { toastStyle, apiUrl } = useContext(UidContext);

  const [signUpMode, setSignUpMode] = useState(false);
  const [nom, setNom] = useState({ value: "", valid: false });
  const [email, setEmail] = useState({ valid: false, value: "" });
  const [password, setPassword] = useState({ valid: false, value: "" });
  const [userNotFound, setUserNotFound] = useState(false);
  const [nameError, setNameError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [incorrectPassword, setIncorrectPassword] = useState(false);
  const [isModified, setIsModified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmit, setIsSubmit] = useState(false);

  useEffect(() => {
    if (isSubmit) {
      setIsSubmit(false);
    }

    if (signUpMode && register?.current) {
      register.current.reset();
    } else if (login?.current) {
      login.current.reset();
    }

    // nom
    if (nom.value?.trim()?.length > 2) {
      if (!nom.valid) {
        setNom((prev) => ({ ...prev, valid: true }));
      }
      if (isModified) {
        setIsModified(false);
      }
    } else {
      if (nom.valid) {
        setNom((prev) => ({ ...prev, valid: false }));
      }
      if (isModified) {
        setIsModified(false);
      }
    }

    // email
    if (emailRegex.test(email.value?.trim())) {
      if (!email.valid) {
        setEmail((prev) => ({ ...prev, valid: true }));
      }
      if (isModified) {
        setIsModified(false);
      }
      if (userNotFound) {
        setUserNotFound(false);
      }
    } else {
      if (email.valid) {
        setEmail((prev) => ({ ...prev, valid: false }));
      }
      if (isModified) {
        setIsModified(false);
      }
      if (userNotFound) {
        setUserNotFound(false);
      }
    }

    // password
    if (password.value?.length > 5) {
      if (!password.valid) {
        setPassword((prev) => ({ ...prev, valid: true }));
      }
      if (isModified) {
        setIsModified(false);
      }
      if (incorrectPassword) {
        setIncorrectPassword(false);
      }
    } else {
      if (password.valid) {
        setPassword((prev) => ({ ...prev, valid: false }));
      }
      if (isModified) {
        setIsModified(false);
      }
      if (incorrectPassword) {
        setIncorrectPassword(false);
      }
    }
  }, [nom.value, email.value, password.value]);

  useEffect(() => {
    if (isSubmit) {
      if (!nom.valid) {
        toast.error("Nom moins de 6 caracteres", toastStyle);
      } else if (!email.valid) {
        toast.error("Email invalide", toastStyle);
      } else if (!password.valid) {
        toast.error("Mot de passe moins de 6 caracteres", toastStyle);
      }
    }
  }, [isSubmit]);

  const handleSwitch = (value) => {
    setNom({ value: "", valid: false });
    setEmail({ value: "", valid: false });
    setPassword({ value: "", valid: false });
    setShowPassword(false);
    setNameError(false);
    setEmailError(false);
    setIsSubmit(false);
    setIsLoading(false);
    setIsModified(false);
    setIncorrectPassword(false);
    setSignUpMode(value);
  };

  useEffect(() => {
    handleSwitch(signUpMode);
  }, [signUpMode]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsSubmit(true);
    setIsModified(true);

    if (!email.valid) {
      toast.error("Email incorrect", toastStyle);
    } else if (email.valid && !password.valid) {
      toast.error("Mot de passe incorrect", toastStyle);
    } else if (email.valid && password.valid) {
      setIsLoading(true);
      const toastId = toast.loading("Connexion", toastStyle);
      const res = await fetch(`${apiUrl}/auth/sign-in`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.value, password: password.value }),
      }).then((res) => res.json());

      toast.dismiss(toastId);
      setIsLoading(false);

      if (res?.userNotFound) {
        setUserNotFound(true);
        toast.error("Utilisateur inconnu", toastStyle);
      } else if (res?.incorrectPassword) {
        setIncorrectPassword(true);
        toast.error("Mot de passe incorrect", toastStyle);
      } else if (res?.authToken) {
        dispatch(updatePersistInfos({ authToken: res.authToken }));
        window.location = "/home?path=accueil";
      }
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsSubmit(true);
    setIsModified(true);

    if (nom.value && email.valid && password.valid) {
      setIsLoading(true);
      const toastId = toast.loading("Connexion", toastStyle);
      const res = await fetch(`${apiUrl}/auth/sign-up`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: nom.value,
          email: email.value,
          password: password.value,
        }),
      }).then((res) => res.json());

      toast.dismiss(toastId);
      setIsLoading(false);

      if (res?.nameError) {
        setNameError(true);
        toast.error("Nom moins de 6 caracteres", toastStyle);
      } else if (res?.emailError) {
        setEmailError(true);
        toast.error("Email invalide", toastStyle);
      } else if (res?.passwordError) {
        setIncorrectPassword(true);
        toast.error("Mot de passe moins de 6 caracteres", toastStyle);
      } else if (res?.userAlreadyExist) {
        setEmailError(true);
        toast.error("L'utilisateur existe deja", toastStyle);
      } else if (res?.user) {
        toast.success("Votre compte a ete cree", toastStyle);
        setSignUpMode(false);
      }
    }
  };

  const handleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div
      className={`container bg-[var(--bg-primary)] ${
        signUpMode ? "sign-up-mode" : ""
      }`}
    >
      <div className="forms-container">
        <div className="signin-signup">
          <form ref={login} onSubmit={handleLogin} className="sign-in-form">
            <h2 className="title text-[var(--opposite)]">Se connecter</h2>
            <div
              className={`input-field ${
                isSubmit && (!email.valid || userNotFound) ? "error" : ""
              }`}
            >
              <i className="flex justify-center items-center">
                <BiSolidUser size={"1.15rem"} />
              </i>
              <input
                type="text"
                placeholder="Email"
                onChange={(e) =>
                  setEmail((prev) => ({ ...prev, value: e.target.value }))
                }
                value={email.value}
              />
            </div>
            <div
              className={`input-field relative flex items-center ${
                isSubmit && (!password.valid || incorrectPassword)
                  ? "error"
                  : ""
              }`}
            >
              {" "}
              <i className="bx bxs-lock-alt"></i>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Mot de passe"
                onChange={(e) =>
                  setPassword((prev) => ({ ...prev, value: e.target.value }))
                }
                value={password.value}
              />
              {showPassword ? (
                <i
                  onClick={handleShowPassword}
                  className="absolute right-4 cursor-pointer"
                >
                  <HiEye size={"1.25rem"} />{" "}
                </i>
              ) : (
                <i
                  onClick={handleShowPassword}
                  className="absolute right-4 cursor-pointer"
                >
                  <HiEyeOff size={"1.25rem"} />{" "}
                </i>
              )}
            </div>
            <input type="submit" value="Connexion" className="btn solid" />
          </form>

          <form
            ref={register}
            onSubmit={handleRegister}
            className="sign-up-form"
          >
            <h2 className="title text-[var(--opposite)]">Inscription</h2>
            <div
              className={`input-field ${
                (isSubmit && !nom.valid) || (isSubmit && nameError)
                  ? "error"
                  : ""
              }`}
            >
              {" "}
              <i className="bx bxs-user"></i>
              <input
                type="text"
                placeholder="Nom"
                onChange={(e) =>
                  setNom((prev) => ({ ...prev, value: e.target.value }))
                }
                value={nom.value}
              />
            </div>
            <div
              className={`input-field ${
                (isSubmit && !email.valid) || (isSubmit && emailError)
                  ? "error"
                  : ""
              }`}
            >
              {" "}
              <i className="bx bxs-envelope"></i>
              <input
                type="text"
                placeholder="Email"
                onChange={(e) =>
                  setEmail((prev) => ({ ...prev, value: e.target.value }))
                }
                value={email.value}
              />
            </div>
            <div
              className={`input-field relative flex items-center ${
                (isSubmit && !password.valid) || (isSubmit && incorrectPassword)
                  ? "error"
                  : ""
              }`}
            >
              {" "}
              <i className="bx bxs-lock-alt"></i>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Mot de passe"
                onChange={(e) =>
                  setPassword((prev) => ({ ...prev, value: e.target.value }))
                }
                value={password.value}
              />
              {showPassword ? (
                <i
                  onClick={handleShowPassword}
                  className="absolute right-4 cursor-pointer"
                >
                  <HiEye size={"1.25rem"} />{" "}
                </i>
              ) : (
                <i
                  onClick={handleShowPassword}
                  className="absolute right-4 cursor-pointer"
                >
                  <HiEyeOff size={"1.25rem"} />{" "}
                </i>
              )}
            </div>
            <input type="submit" value="S'inscrire" className="btn solid" />
          </form>
        </div>
      </div>
      <div className="panels-container">
        <div className="panel left-panel">
          <div className="content">
            <h3>Nous rejoindre ?</h3>
            <p>Si vous n'avez pas encore de compte</p>
            <button
              className="btn transparent"
              id="sign-up-btn"
              onClick={() => handleSwitch(true)}
            >
              Inscription
            </button>
          </div>
          <img src={"/image/logos.svg"} className="image" alt="logos" />
        </div>
        <div className="panel right-panel">
          <div className="content">
            <h3>A deja un compte ?</h3>
            <p>Si vous avez deja un compte.</p>
            <button
              className="btn transparent"
              id="sign-in-btn"
              onClick={() => handleSwitch(false)}
            >
              Connexion
            </button>
          </div>
          <img src={"/image/register.svg"} className="image" alt="register" />
        </div>
      </div>
    </div>
  );
}
