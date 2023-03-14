import React from "react";

const CautionModal = () => {
  return (
    <>
      {/* モーダル */}
      <input type="checkbox" id="caution-modal" className="modal-toggle" />
      <div className="modal modal-bottom sm:modal-middle">
        <div className="modal-box relative">
          <label
            htmlFor="caution-modal"
            className="btn btn-sm btn-circle absolute right-2 top-2"
          >
            ✕
          </label>
          <article class="prose prose-sm">
            <h3>ダメージ計算ツールについて</h3>
            <ol>
              <li>
                可能な限り正確なダメージ計算を行っておりますが、公式から仕様が公開されていないこともあり、完全に正しい結果を保証するものではございません。
              </li>
              <li>
                当アプリはベータ版のため、まだ各種とくせいやもちもの、わざの独自仕様（アクロバットが持ち物非所持時に威力2倍など）が計算結果に反映されません。
                <br />
                その代わり、倍率を任意に調整できるスライダーを用意しておりますので、ご利用ください。
              </li>
              <li>
                要望・不具合報告は、製作者
                <a
                  href="https://twitter.com/Arisato_Asumi"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Twitter
                </a>
                のダイレクトメッセージにて受け付けております。皆様からいただいたご意見は、今後の機能改善に役立ててまいります。
              </li>
              <li>
                開発者は、本ツールの利用によって生じたいかなる損害にも責任を負いかねます。
              </li>
            </ol>
          </article>
        </div>
      </div>
    </>
  );
};

export default CautionModal;
