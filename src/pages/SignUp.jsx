import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const SignUp = () => {
  const navigator = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigator("/todo");
    }
  });
  //Login 버튼 비활성화 여부 Check 변수
  const [isValidEmail, setIsValidEmail] = useState(false);
  const [isValidPW, setIsValidPW] = useState(false);

  //User Data
  const [email, setEmail] = useState("");
  const [pw, setPW] = useState("");

  const onChangeCheckEmail = (e) => {
    const email = e.target.value;
    setEmail(email);
    const isValidEmail = email.includes("@");
    if (isValidEmail) {
      setIsValidEmail(true);
    } else {
      setIsValidEmail(false);
    }
  };
  const onChangeCheckPW = (e) => {
    const pw = e.target.value;
    setPW(pw);
    if (pw.length > 7) {
      setIsValidPW(true);
    } else {
      setIsValidPW(false);
    }
  };
  const onClickRegister = () => {
    //url: https://pre-onboarding-selection-task.shop/auth/signup
    const data = {
      email: email,
      password: pw,
    };
    const url = "https://pre-onboarding-selection-task.shop/auth/signup";
    const config = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    };
    fetch(url, config)
      .then((res) => {
        if (res.status === 201 && res.statusText === "Created") {
          return res.json();
        }
      })
      .then((data) => {
        navigator("/signin");
      });
  };
  return (
    <div>
      <input
        type="email"
        onChange={onChangeCheckEmail}
        data-testid="email-input"
        onKeyDown={(e) => {
          if (e.code === "Enter") {
            onClickRegister();
          }
        }}
      />
      <input
        type="password"
        onChange={onChangeCheckPW}
        data-testid="password-input"
        onKeyDown={(e) => {
          if (e.code === "Enter") {
            onClickRegister();
          }
        }}
      />
      <button
        onClick={onClickRegister}
        disabled={!isValidEmail || !isValidPW}
        data-testid="signin-button"
      >
        회원가입
      </button>
      <br />

      <Link to={"/signin"}>
        <button data-testid="signin-button">홈 화면</button>
      </Link>
    </div>
  );
};
export default SignUp;
