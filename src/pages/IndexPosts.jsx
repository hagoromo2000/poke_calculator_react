import React from "react";
import { useState, useEffect } from "react";
import PostCard from "../components/PostCard";
import axios from "axios";
import ReactPaginate from "react-paginate";
import { InfinitySpin } from "react-loader-spinner";

const IndexPosts = () => {
  const [posts, setPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // react-paginateのための設定
  const [itemsOffset, setItemsOffset] = useState(0);
  const itemsPerPage = 12; // 1ページの表示数なので任意に変更してください
  const endOffset = itemsOffset + itemsPerPage;
  const currentPosts = filteredPosts.slice(itemsOffset, endOffset);
  const pageCount = Math.ceil(filteredPosts.length / itemsPerPage);
  const handlePageClick = (e) => {
    const newOffset = (e.selected * itemsPerPage) % filteredPosts.length;
    setItemsOffset(newOffset);
  };

  useEffect(() => {
    axios.get("/posts").then((res) => {
      setPosts(res.data.data);
      setFilteredPosts(res.data.data);

      setIsLoading(false);
      // データの取得が完了したらisLoadingをfalseに設定する
    });
  }, []);

  const handleSearch = () => {
    const keywords = searchTerm.split(/\s+/);

    const filteringPosts = posts.filter((post) => {
      return keywords.every((keyword) => {
        return (
          post.attributes.pokemon
            .toLowerCase()
            .includes(keyword.toLowerCase()) ||
          post.attributes.title.toLowerCase().includes(keyword.toLowerCase()) ||
          post.attributes.item.toLowerCase().includes(keyword.toLowerCase()) ||
          post.attributes.move1.toLowerCase().includes(keyword.toLowerCase()) ||
          post.attributes.move2.toLowerCase().includes(keyword.toLowerCase()) ||
          post.attributes.move3.toLowerCase().includes(keyword.toLowerCase()) ||
          post.attributes.move4.toLowerCase().includes(keyword.toLowerCase())
        );
      });
    });
    setFilteredPosts(filteringPosts);
  };

  return (
    <>
      <div className="flex justify-center mt-10 mb-10">
        <div className="flex items-center">
          <div className="flex border border-purple-200 rounded">
            <input
              type="text"
              className="block w-48 px-4 py-2 text-purple-700 bg-white border rounded-md focus:border-purple-400 focus:ring-purple-300 focus:outline-none focus:ring focus:ring-opacity-40"
              placeholder="ポケモンなどを入力"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              className="px-4 text-white bg-purple-600 border-l rounded"
              onClick={handleSearch}
            >
              Search
            </button>
          </div>
        </div>
      </div>

      {isLoading ? ( // isLoadingがtrueの間はスピナーを表示する
        <div className="flex justify-center">
          <div className="loader">
            <InfinitySpin width="200" color="#4fa94d" />
          </div>
        </div>
      ) : (
        <>
          <div className="md:flex flex-wrap justify-center">
            {filteredPosts.length > 0 &&
              currentPosts.map((post) => (
                <div key={post.id}>
                  <PostCard
                    post={post.attributes}
                    id={post.id}
                    delete={false}
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
      )}
    </>
  );
};

export default IndexPosts;
