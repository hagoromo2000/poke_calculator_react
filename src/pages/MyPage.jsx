import React from "react";
import { useState, useEffect } from "react";
import PostCard from "../components/PostCard";
import axios from "axios";
import ReactPaginate from "react-paginate";
import { useAuthContext } from "../context/AuthContext.tsx";
import { auth } from "../firebase";
import { toast } from "react-toastify";
import "react-tabs/style/react-tabs.css";

const MyPage = () => {
  const [posts, setPosts] = useState([]);

  // react-paginateのための設定
  const [itemsOffset, setItemsOffset] = useState(0);
  const itemsPerPage = 6; // 1ページの表示数なので任意に変更してください
  const endOffset = itemsOffset + itemsPerPage;
  const currentPosts = posts.slice(itemsOffset, endOffset);
  const pageCount = Math.ceil(posts.length / itemsPerPage);
  const handlePageClick = (e) => {
    const newOffset = (e.selected * itemsPerPage) % posts.length;
    setItemsOffset(newOffset);
  };

  // tokenを取得（クライアント側でtokenを保存する処理を行っていないので、都度firebaseから取得する必要あり)
  const { currentUser } = useAuthContext();
  async function setConfig() {
    const token = await currentUser?.getIdToken();
    const config = {
      headers: { authorization: `Bearer ${token}` },
    };
    return config;
  }

  useEffect(() => {
    async function fetchData() {
      const config = await setConfig();
      axios.get("/mypage", config).then((res) => {
        setPosts(res.data.data);
      });
    }
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    const config = await setConfig();
    axios.delete(`/posts/${id}`, config);

    // 削除された投稿を排除した新しい`posts`の状態を設定する
    const updatedPosts = posts.filter((post) => post.id !== id);
    setPosts(updatedPosts);

    toast.success("育成論が削除されました!");
  };

  return (
    <>
      <div className="text-4xl text-gray-600 flex justify-center mt-10">
        <div className="avatar">
          <div className="w-10 rounded-full mr-8">
            <img src={auth.currentUser.photoURL} referrerPolicy="no-referrer" />
          </div>
        </div>
        <p>{auth.currentUser.displayName}のマイページ</p>
      </div>
      <hr className="h-px my-8 bg-gray-200 border-0 "></hr>

      <div className="text-2xl text-gray-600 flex justify-center mb-4">
        自分の投稿一覧
      </div>
      <div className="md:flex flex-wrap justify-center">
        {posts.length > 0 &&
          currentPosts.map((post) => (
            <div key={post.id}>
              <PostCard
                post={post.attributes}
                id={post.id}
                delete={true}
                handleDelete={handleDelete}
              />
            </div>
          ))}
      </div>
      <div className="pb-8">
        <ReactPaginate
          pageCount={pageCount}
          layout="pagination"
          onPageChange={handlePageClick}
          previousLabel={"Previous"}
          nextLabel={"Next"}
          breakLabel={"..."}
          marginPagesDisplayed={3}
          pageRangeDisplayed={3}
          containerClassName={
            "text-gray-600 justify-center items-center flex gap-x-5 gap-y-1.5"
          }
          pageClassName={
            "inline-flex justify-center items-center h-10 w-10 text-base font-bold rounded-full hover:border-black hover:font-bold "
          }
          pageLinkClassName={
            "inline-flex justify-center rounded-full align-middle text-black"
          }
          breakClassName={
            "inline-flex justify-center items-center h-10 w-10 text-base font-bold bg-white rounded-full"
          }
          breakLinkClassName={
            "inline-flex justify-center rounded-full align-middle text-black"
          }
          activeClassName={"bg-green-300"}
        />
      </div>
    </>
  );
};

export default MyPage;
