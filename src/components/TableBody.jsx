import React from "react";

const TableBody = (props) => {
  const handleClick = () => {
    props.setInformation(props.post);
  };

  return (
    <tr className="bg-white border-b dark:bg-gray-800  hover:bg-gray-50 text-xs ">
      <th
        scope="row"
        className="pl-2 py-2 font-medium text-gray-900 whitespace-nowrap "
      >
        <label onClick={handleClick}>{props.post.pokemon}</label>
      </th>
      <td className="pl-2 whitespace-nowrap">
        <label onClick={handleClick}>
          {props.post.ev_hp}-{props.post.ev_attack}-{props.post.ev_defense}-
          {props.post.ev_special_attack}-{props.post.ev_special_defense}-
          {props.post.ev_speed}
        </label>
      </td>
      <td className="pl-2 whitespace-nowrap">
        <label onClick={handleClick}>{props.post.nature}</label>
      </td>
      <td className="pl-2 whitespace-nowrap">
        <label onClick={handleClick}>{props.post.title}</label>
      </td>
    </tr>
  );
};

export default TableBody;
