import React from "react";

const PostCard = (props) => {
  const handleDelete = (id) => {
    // 確認用のアラートを表示する
    if (window.confirm("本当に削除しますか？")) {
      // 削除処理を実行する
      props.handleDelete(id);
    }
  };

  return (
    <div className="card w-96 bg-base-100 shadow-xl md:m-4 mb-4 text-gray-600">
      <div className="card-body">
        <h2 className="card-title">{props.post.title}</h2>
        <div className="md:flex">
          <p>
            {props.post.pokemon} <br />
            {props.post.ev_hp}-{props.post.ev_attack}-{props.post.ev_defense}-
            {props.post.ev_special_attack}-{props.post.ev_special_defense}-
            {props.post.ev_speed}
          </p>

          {props.delete && (
            <div className="card-actions justify-end mr-1">
              <button
                className="btn btn-outline btn-error"
                onClick={() => handleDelete(props.id)}
              >
                削除
              </button>
            </div>
          )}

          <div className="card-actions justify-end ">
            <PostShowModal post={props.post} id={props.id} />
          </div>
        </div>
      </div>
    </div>
  );
};

const PostShowModal = (props) => {
  return (
    <>
      <label
        htmlFor={`post-modal-${props.id}`}
        className="btn btn-outline border-indigo-400 btn-info"
      >
        詳細
      </label>

      {/* Put this part before </body> tag */}
      <input
        type="checkbox"
        id={`post-modal-${props.id}`}
        className="modal-toggle"
      />

      <div className="modal modal-bottom sm:modal-middle overflow-auto">
        <div className="modal-box">
          <label
            htmlFor={`post-modal-${props.id}`}
            className="btn btn-sm btn-circle absolute right-2 top-2"
          >
            ✕
          </label>
          <h3 className="font-bold text-lg col-span-2 flex justify-center mb-4">
            {props.post.title}
          </h3>
          <div className="grid grid-cols-4 gap-1">
            <p className="col-span-2">
              <span className="font-bold">ポケモン:</span> {props.post.pokemon}
            </p>
            <p className="col-span-2">
              <span className="font-bold">性格:</span> {props.post.nature}
            </p>
            <div className=" col-span-2">
              {" "}
              <span className="font-bold">努力値: </span>
              {props.post.ev_hp}-{props.post.ev_attack}-{props.post.ev_defense}-
              {props.post.ev_special_attack}-{props.post.ev_special_defense}-
              {props.post.ev_speed}
            </div>
            <div className=" col-span-2">
              <span className="font-bold">テラスタイプ: </span>
              {props.post.tera_type}
            </div>
            <p className="col-span-2">
              <span className="font-bold">もちもの: </span>
              {props.post.item}
            </p>
            <p className="col-span-2">
              <span className="font-bold">とくせい: </span>
              {props.post.ability}
            </p>
            <p className="col-span-4 pt-4 font-bold">わざ:</p>
            <p className="col-span-2 "> {props.post.move1}</p>
            <p className="col-span-2"> {props.post.move2}</p>
            <p className="col-span-2 "> {props.post.move3}</p>
            <p className="col-span-2 "> {props.post.move4}</p>
          </div>
          <h4 className="pt-4">概要</h4>
          <p>{props.post.body}</p>
        </div>
      </div>
    </>
  );
};

export default PostCard;
