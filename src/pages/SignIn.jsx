import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const SignIn = () => {
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

  const onClickLogin = () => {
    const data = {
      email: email,
      password: pw,
    };
    const url = "https://pre-onboarding-selection-task.shop/auth/signin";
    const config = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    };
    fetch(url, config)
      .then((res) => {
        console.log(res);
        return res.json();
      })
      .then((data) => {
        console.log(data);
        const accessToken = data.access_token;
        localStorage.setItem("token", accessToken);
        navigator("/");
      });
  };
  return (
    <div>
      <input
        type="email"
        onChange={onChangeCheckEmail}
        data-testid="email-input"
        onKeyDown={(e) => {
          console.log(e.code);
          if (e.code === "Enter") {
            onClickLogin();
          }
        }}
      />
      <input
        type="password"
        onChange={onChangeCheckPW}
        data-testid="password-input"
        onKeyDown={(e) => {
          console.log(e.code);
          if (e.code === "Enter") {
            onClickLogin();
          }
        }}
      />
      <button
        onClick={onClickLogin}
        disabled={!isValidEmail || !isValidPW}
        data-testid="signin-button"
      >
        로그인
      </button>
      <br />
      <Link to={"/signup"}>
        <button data-testid="signup-button">회원가입 하기</button>
      </Link>
    </div>
  );
};

export default SignIn;
