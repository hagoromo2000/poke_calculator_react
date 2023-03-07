import { Link } from "react-router-dom";
import React from "react";
import GoogleAuthButton from "./GoogleAuthButton";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const [user] = useAuthState(auth);

  return (
    <>
      <div className="navbar bg-primary sticky">
        <div className="flex-1">
          <div className="btn btn-ghost normal-case text-xl text-white">
            <Link to={`/`}>ダメージ計算</Link>
          </div>
        </div>
        <div className="flex-none">
          <ul className="menu menu-horizontal px-1 text-white ">
            <li tabIndex={0}>
              <a>
                育成論
                <svg
                  className="fill-current"
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                >
                  <path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z" />
                </svg>
              </a>
              <ul className="p-2 bg-primary shadow-xl bg-emerald-400">
                <li>
                  <Link to={`/posts`}>育成論一覧</Link>
                </li>
                <li>
                  {user ? (
                    <>
                      <Link to={`/posts/new/`}>育成論投稿</Link>
                    </>
                  ) : (
                    <label htmlFor="signup-modal">育成論投稿</label>
                  )}
                </li>
              </ul>
            </li>
            <li>
              {user ? (
                <>
                  <UserInfo />
                </>
              ) : (
                <label htmlFor="signup-modal">ログイン</label>
              )}
            </li>
          </ul>
        </div>
      </div>

      <input type="checkbox" id="signup-modal" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box relative">
          <label
            htmlFor="signup-modal"
            className="btn btn-sm btn-circle absolute right-2 top-2"
          >
            ✕
          </label>
          <p className="p-4 text-gray-400 flex justify-center">
            Googleログインすると育成論投稿機能を利用できます。
          </p>
          <GoogleAuthButton />
          <p className="text-gray-400 p-4">
            <Link
              to={`/terms/`}
              className="text-blue-400"
              onClick={() =>
                (document.getElementById("signup-modal").checked = false)
              }
            >
              利用規約
            </Link>
            、
            <Link
              to={`/privacy-policy`}
              className="text-blue-400"
              onClick={() =>
                (document.getElementById("signup-modal").checked = false)
              }
            >
              プライバシーポリシー
            </Link>
            に同意した上でログインしてください。
          </p>
        </div>
      </div>
    </>
  );
};

export default Header;

function UserInfo() {
  return (
    <>
      <a>
        <div className="avatar">
          <div className="w-10 rounded-full">
            <img src={auth.currentUser.photoURL} alt="" />
          </div>
        </div>
        <svg
          className="fill-current"
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
        >
          <path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z" />
        </svg>
      </a>
      <ul className="py-2 pr-2 bg-primary shadow-xl bg-emerald-400">
        <li>
          <Link to={"/mypage/"}>マイページ</Link>
        </li>
        <li>
          <SignOutButton />
        </li>
      </ul>
    </>
  );
}

function SignOutButton() {
  const navigate = useNavigate();

  const logoutHandler = async () => {
    // await logout();
    auth.signOut();
    navigate("/");
    toast.success("サインアウトしました！");
  };
  return <button onClick={logoutHandler}>サインアウト</button>;
}
