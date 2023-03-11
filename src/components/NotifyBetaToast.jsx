import React, { useEffect } from "react";
import { toast } from "react-toastify";

const NotifyBetaToast = () => {
  useEffect(() => {
    toast.warning(
      "当アプリはベータ版です。現段階では、特性と持ち物、技の独自仕様が計算結果に反映されません。順次対応予定です。"
    );
  }, []);
  return <></>;
};

export default NotifyBetaToast;
