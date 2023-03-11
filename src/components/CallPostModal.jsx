import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import TableBody from "./TableBody";

const CallPostModal = (props) => {
  const [posts, setPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredPosts, setFilteredPosts] = useState([]);

  useEffect(() => {
    axios.get("/posts").then((res) => {
      setPosts(res.data.data);
      setFilteredPosts(res.data.data);
    });
  }, []);

  useEffect(() => {
    const keywords = searchTerm.split(/\s+/);

    const filteringPosts = posts.filter((post) => {
      return keywords.every((keyword) => {
        return (
          post.attributes.pokemon
            .toLowerCase()
            .includes(keyword.toLowerCase()) ||
          post.attributes.title.toLowerCase().includes(keyword.toLowerCase())
        );
      });
    });
    setFilteredPosts(filteringPosts);
  }, [searchTerm]);

  return (
    <>
      <label
        htmlFor={`${props.callPostModalId}`}
        className={`btn bg-white ${props.textColor} hover:bg-yellow-100 ml-32 mt-2 mb-2`}
      >
        育成論から呼び出す
      </label>

      {/* モーダル　*/}
      <input
        type="checkbox"
        id={`${props.callPostModalId}`}
        className="modal-toggle"
      />

      <div className="modal sm:modal-middle ">
        <div className="modal-box">
          <div className="min-h-screen">
            <label
              htmlFor={`${props.callPostModalId}`}
              className="btn btn-sm btn-circle absolute right-2 top-2"
            >
              ✕
            </label>

            <div className="pt-2 text-sm text-gray-600 ">
              ポケモンを選択すると、努力値と性格補正が自動入力されます。
            </div>

            <div className="mt-2 relative shadow-md rounded-lg sm:rounded-lg">
              <div className="bg-white dark:bg-gray-900">
                <label htmlFor="table-search" className="sr-only">
                  Search
                </label>
                <div className="relative mt-1">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <svg
                      className="w-5 h-5 text-gray-500 "
                      aria-hidden="true"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                  </div>
                  <input
                    type="text"
                    id="table-search"
                    className="block p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 "
                    placeholder="ポケモン名を入力"
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div
                className="flex overflow-auto"
                id="call-post-modal-scroll-handle"
              >
                <table className="w-full text-sm text-left text-gray-500 z-30">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50 ">
                    <tr>
                      <th scope="col" className="pl-3 py-2">
                        ポケモン
                      </th>
                      <th scope="col" className="pl-2 ">
                        努力値
                      </th>
                      <th scope="col" className="pl-2 ">
                        性格
                      </th>
                      <th scope="col" className="pl-2">
                        タイトル
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPosts.length > 0 &&
                      filteredPosts.map((post) => (
                        <TableBody
                          post={post.attributes}
                          setInformation={props.setInformation}
                          key={post.id}
                          callPostModalId={props.callPostModalId}
                        />
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CallPostModal;
