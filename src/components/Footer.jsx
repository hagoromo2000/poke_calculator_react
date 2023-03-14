import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <>
      <footer className="p-4 bg-green-100 rounded-lg shadow md:px-6 md:py-8 ">
        <div className="sm:flex sm:items-center sm:justify-between">
          <div className="flex items-center mb-4 sm:mb-0">
            <img src="logo.png" className="h-12 mr-3" alt="Logo" />
            <Link to={`/`}>
              <span className="self-center text-2xl font-semibold whitespace-nowrap ">
                PokeCalculator
              </span>
            </Link>
          </div>
          <ul className="flex flex-wrap items-center mb-6 text-sm text-gray-500 sm:mb-0 ">
            <li>
              <Link to={`/terms/`} className="mr-4 hover:underline md:mr-6 ">
                利用規約
              </Link>
            </li>
            <li>
              <Link
                to={`/privacy-policy/`}
                className="mr-4 hover:underline md:mr-6"
              >
                プライバシーポリシー
              </Link>
            </li>
            <li>
              <label htmlFor="caution-modal" className="hover:underline  ">
                注意事項
              </label>
            </li>
          </ul>
        </div>
        <hr className="my-6 border-gray-200 sm:mx-auto lg:my-8" />
        <span className="block text-sm text-gray-500 sm:text-center ">
          © 2023 All Rights Reserved.
        </span>
      </footer>
    </>
  );
};

export default Footer;
