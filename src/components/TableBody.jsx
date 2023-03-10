import React from "react";

const TableBody = ({ post, setInformation }) => {
  const handleClick = () => {
    setInformation(post);
  };

  return (
    <tr className="bg-white border-b text-xs ">
      <th
        scope="row"
        className="pl-2 py-2 font-medium text-gray-900 whitespace-nowrap "
      >
        <label onClick={handleClick}>{post.pokemon}</label>
      </th>

      <td className="pl-2 whitespace-nowrap">
        <label onClick={handleClick}>
          {post.ev_hp}-{post.ev_attack}-{post.ev_defense}-
          {post.ev_special_attack}-{post.ev_special_defense}-{post.ev_speed}
        </label>
      </td>
      <td className="pl-2 whitespace-nowrap">
        <label onClick={handleClick}>{post.nature}</label>
      </td>
      <td className="pl-2 whitespace-nowrap">
        <label onClick={handleClick}>{post.title}</label>
      </td>
    </tr>
  );
};

export default TableBody;
