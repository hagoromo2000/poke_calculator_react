import React from "react";
import { auth } from "../firebase";

const MypageHeader = () => {
  return (
    <>
      <div className="text-4xl text-gray-600 flex justify-center mt-10">
        <div className="avatar">
          <div className="w-10 rounded-full mr-8">
            {/* ページがリロードされた場合、componentDidMount()メソッドは再度呼び出されないため、auth.currentuserが一時的にnullになるので、以下のような分岐が必要 */}
            {auth.currentUser && (
              <img
                src={auth.currentUser.photoURL}
                referrerPolicy="no-referrer"
              />
            )}
          </div>
        </div>
        {auth.currentUser && <p>{auth.currentUser.displayName}のマイページ</p>}
      </div>
    </>
  );
};

export default MypageHeader;
