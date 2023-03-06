import React from "react";

const CallPostModal = () => {
  return (
    <>
      <label
        htmlFor={`call-post-modal`}
        className="btn btn-primary ml-32 mt-2 mb-2"
      >
        育成論から呼び出す
      </label>

      {/* Put this part before </body> tag */}
      <input type="checkbox" id={`call-post-modal`} className="modal-toggle" />

      <div className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <label
            htmlFor={`call-post-modal`}
            className="btn btn-sm btn-circle absolute right-2 top-2"
          >
            ✕
          </label>
          <p>この機能は作成中です！</p>
        </div>
      </div>
    </>
  );
};

export default CallPostModal;
