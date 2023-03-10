import React, { useState, useEffect } from "react";
import Select from "react-select";
import "../css/Calculator.css";
import Pokemons from "../json/all_pokemons.json";
import Items from "../json/all_items.json";
import Types from "../json/all_teraTypes.json";
import Abilities from "../json/all_abilities.json";
import CallPostModal from "./CallPostModal";

const all_pokemons = Pokemons.map((data) => {
  return { value: data, label: data.name };
});

const all_items = Items.map((data) => {
  return { value: data.name, label: data.name };
});

const all_abilities = Abilities.map((data) => {
  return { value: data.name, label: data.name };
});

const all_types = Types.map((data) => {
  return { value: data.value, label: data.label };
});

//　コンポーネント
const Defender = (props) => {
  const [pokemon, setPokemon] = useState({
    value: Pokemons[5],
    label: Pokemons[5].name,
  });
  const handlePokemon = (pokemon) => {
    setPokemon(pokemon);

    // タイプのセット
    props.setDefenseType1(pokemon.value.type1);
    props.setDefenseType2(pokemon.value.type2);
  };

  const [item, setItem] = useState(null);
  const handleItem = (item) => {
    setItem(item);
  };

  function handleTeraType(selectedOption) {
    const value = selectedOption ? selectedOption.value : null;
    props.setTeraType(value);
  }

  const [ability, setAbility] = useState(null);
  const handleAbility = (ability) => {
    setAbility(ability);
  };

  // 性格補正の制御
  // 攻撃の性格補正の制御
  const [defenseNature, setDefenseNature] = useState(1);
  const handleDefenseNature = (event) => {
    setDefenseNature(event);
  };

  // 特攻の性格補正の制御
  const [specialDefenseNature, setSpecialDefenseNature] = useState(1);
  const handleSpecialDefenseNature = (event) => {
    setSpecialDefenseNature(event);
  };

  // Rank補正の制御
  const handleRankIncrease = () => {
    if (props.defenseRank <= 5) {
      props.setDefenseRank(props.defenseRank + 1);
    }
  };
  const handleRankDecrease = () => {
    if (props.defenseRank >= -5) {
      props.setDefenseRank(props.defenseRank - 1);
    }
  };

  // HP努力値と実数値を連動させる処理
  const [hp_ev, setHp_ev] = useState(0);
  const handleHp = (event) => {
    setHp_ev(event.target.value);
  };
  // ポケモン、努力値が変化した時、副作用で実数値が計算される
  useEffect(() => {
    const hp_value = Math.floor(
      (pokemon.value.hp * 2 + 31 + hp_ev / 4) / 2 + 60
    );
    props.setHp(hp_value);
  }, [hp_ev, pokemon]);

  // 防御努力値と実数値を連動させる処理
  const [defense_ev, setDefense_ev] = useState(0);
  const handleDefense = (event) => {
    setDefense_ev(event.target.value);
  };

  // ポケモン、防御努力値、性格補正が変化した際、副作用で実数値を再計算
  useEffect(() => {
    const defense_value = Math.floor(
      ((pokemon.value.defense * 2 + 31 + defense_ev / 4) / 2 + 5) *
        defenseNature
    );
    props.setDefense(defense_value);
  }, [defense_ev, defenseNature, pokemon]);

  // 特防努力値と実数値を連動させる処理
  const [specialDefense_ev, setSpecialDefense_ev] = useState(0);
  const handleSpecialDefense = (event) => {
    setSpecialDefense_ev(event.target.value);
  };

  // ポケモン、特防努力値、性格補正が変化した際、副作用で実数値を再計算
  useEffect(() => {
    const special_defense_value = Math.floor(
      ((pokemon.value.special_defense * 2 + 31 + specialDefense_ev / 4) / 2 +
        5) *
        specialDefenseNature
    );
    props.setSpecialDefense(special_defense_value);
  }, [specialDefense_ev, specialDefenseNature, pokemon]);

  //　CallPostModalに受け渡すための関数
  const getDefenderInformation = (post) => {
    // これはDefender
    const pokemonName = post.pokemon;

    //現段階では名前しか情報を持っていないので、JSONデータを名前で検索しオブジェクトを取得。
    const result = Pokemons.filter((obj) => obj.name === pokemonName);

    //　形を{value: {各種データ}}にする
    const formattedResult = { value: result[0], label: pokemonName };

    // 取得したオブジェクトからポケモンをセット
    setPokemon(formattedResult);

    // タイプのセット
    props.setDefenseType1(formattedResult.value.type1);
    props.setDefenseType2(formattedResult.value.type2);

    // 努力値のセット
    setHp_ev(post.ev_hp);
    setDefense_ev(post.ev_defense);
    setSpecialDefense_ev(post.ev_special_defense);

    //　性格補正のセット
    const defenseNatureValues = {
      ずぶとい: 1.1,
      のうてんき: 1.1,
      わんぱく: 1.1,
      のんき: 1.1,
      さみしがり: 0.9,
      おっとり: 0.9,
      おとなしい: 0.9,
      せっかち: 0.9,
    };
    setDefenseNature(defenseNatureValues[post.nature] || 1);
    const specialDefenseNatureValues = {
      おだやか: 1.1,
      おとなしい: 1.1,
      しんちょう: 1.1,
      なまいき: 1.1,
      やんちゃ: 0.9,
      のうてんき: 0.9,
      うっかりや: 0.9,
      むじゃき: 0.9,
    };
    setSpecialDefenseNature(specialDefenseNatureValues[post.nature] || 1);
  };

  const handleOtherMultiplier = (e) => {
    props.setOtherMultiplier(e.target.value);
  };

  return (
    <>
      <div className="artboard phone-5 bg-white rounded-lg shadow-xl mx-auto mt-8 ">
        <div className="flex flex-row bg-gradient-to-r rounded-t-lg from-blue-200 to-blue-200">
          <p className="pt-5 pl-5 font-bold ">防御側</p>
          <CallPostModal
            textColor={`text-indigo-500`}
            setInformation={getDefenderInformation}
            callPostModalId={`defender-call-post-modal`}
          />
        </div>

        <div className="w-64 mt-5 ml-4 z-20">
          <Select
            value={pokemon}
            onChange={handlePokemon}
            options={all_pokemons}
            isSearchable={true}
            placeholder="ポケモンを選択"
            menuPortalTarget={document.body}
            styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
          />
        </div>

        <div className="flex mt-5">
          {/* HP実数値 */}
          <div className="pl-5 text-gray-600">
            <label className="text-xs">H実数値</label>
            <p>{props.hp}</p>
          </div>

          {/* HP努力値 */}
          <div className="relative ml-4">
            <input
              value={hp_ev}
              type="number"
              onChange={handleHp}
              min="0"
              max="252"
              step="4"
              id="hp_ev_floating_filled"
              className="block rounded-t-lg px-1 pb-2.5 pt-5 w-20 text-sm text-gray-900 bg-gray-50 border-0 border-b-2 border-gray-300 appearance-none  focus:outline-none focus:ring-0 focus:border-blue-600 peer "
              placeholder=" "
            />
            <label
              htmlFor="hp_ev_floating_filled"
              className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-4 origin-[0] left-2.5 peer-focus:text-blue-600  peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4"
            >
              H努力値
            </label>
          </div>

          {/* テラスタイプ */}
          <div className="ml-4 mt-2">
            <div className="w-32">
              <Select
                value={all_types.find(
                  (option) => option.value === props.teraType
                )}
                onChange={handleTeraType}
                options={all_types}
                isSearchable={true}
                placeholder="テラス"
                menuPortalTarget={document.body}
                styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
              />
            </div>
          </div>
        </div>

        <div className="flex mt-5">
          {/* 防御実数値 */}
          <div className="pl-5 text-gray-600">
            <label className="text-xs">B実数値</label>
            <p>{props.defense}</p>
          </div>

          {/* 防御努力値 */}
          <div className="relative ml-4">
            <input
              value={defense_ev}
              type="number"
              id="defense_ev_floating_filled"
              onChange={handleDefense}
              min="0"
              max="252"
              step="4"
              className="block rounded-t-lg px-1 pb-2.5 pt-5 w-20 text-sm text-gray-900 bg-gray-50  border-0 border-b-2 border-gray-300 appearance-none  focus:outline-none focus:ring-0 focus:border-blue-600 peer "
              placeholder=" "
            />
            <label
              htmlFor="defense_ev_floating_filled"
              className="absolute text-sm text-gray-500  duration-300 transform -translate-y-4 scale-75 top-4 origin-[0] left-2.5 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4"
            >
              B努力値
            </label>
          </div>

          {/* 防御性格補正 */}
          <label className="mt-auto mx-auto mb-auto text-gray-500 "></label>
          <div
            className="inline-flex rounded-md shadow-sm ml-4 mr-4 "
            role="group"
          >
            <button
              type="button"
              onClick={() => {
                handleDefenseNature(1.1);
              }}
              className={`px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-l-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 ${
                defenseNature === 1.1
                  ? "ring-2 ring-blue-700 text-blue-700 z-10"
                  : ""
              }`}
            >
              1.1
            </button>
            <button
              type="button"
              onClick={() => {
                handleDefenseNature(1);
              }}
              className="px-4 py-2 text-sm font-medium text-gray-900 bg-white border-t border-b border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700"
            >
              性格
            </button>
            <button
              type="button"
              onClick={() => {
                handleDefenseNature(0.9);
              }}
              className={`px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-r-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 ${
                defenseNature === 0.9
                  ? "ring-2 ring-blue-700 text-blue-700 z-10"
                  : ""
              }`}
            >
              0.9
            </button>
          </div>
        </div>

        <div className="flex mt-5">
          {/* 特防実数値 */}
          <div className="pl-5 text-gray-600">
            <label className="text-xs">D実数値</label>
            <p>{props.specialDefense}</p>
          </div>

          {/* 特防努力値 */}
          <div className="relative ml-4">
            <input
              value={specialDefense_ev}
              type="number"
              onChange={handleSpecialDefense}
              min="0"
              max="252"
              step="4"
              id="defense_ev_floating_filled"
              className="block rounded-t-lg px-1 pb-2.5 pt-5 w-20 text-sm text-gray-900 bg-gray-50 border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer "
              placeholder=" "
            />
            <label
              htmlFor="defense_ev_floating_filled"
              className="absolute text-sm text-gray-500  duration-300 transform -translate-y-4 scale-75 top-4 origin-[0] left-2.5 peer-focus:text-blue-600  peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4"
            >
              D努力値
            </label>
          </div>

          {/* 特防性格補正 */}
          <label className="mt-auto mx-auto mb-auto text-gray-500 "></label>
          <div
            className="inline-flex rounded-md shadow-sm ml-4 mr-4 "
            role="group"
          >
            <button
              type="button"
              onClick={() => {
                handleSpecialDefenseNature(1.1);
              }}
              className={`px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-l-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 ${
                specialDefenseNature === 1.1
                  ? "ring-2 ring-blue-700 text-blue-700 z-10"
                  : ""
              }`}
            >
              1.1
            </button>
            <button
              type="button"
              onClick={() => {
                handleSpecialDefenseNature(1);
              }}
              className="px-4 py-2 text-sm font-medium text-gray-900 bg-white border-t border-b border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700"
            >
              性格
            </button>
            <button
              type="button"
              onClick={() => {
                handleSpecialDefenseNature(0.9);
              }}
              className={`px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-r-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 ${
                specialDefenseNature === 0.9
                  ? "ring-2 ring-blue-700 text-blue-700 z-10"
                  : ""
              }`}
            >
              0.9
            </button>
          </div>
        </div>

        {/* とくせい */}
        <div className="flex mt-5 ml-4">
          <div className="w-32">
            <Select
              value={ability}
              onChange={handleAbility}
              options={all_abilities}
              isSearchable={true}
              placeholder="とくせい"
              menuPortalTarget={document.body}
              styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
            />
          </div>

          {/* 能力ランク */}
          <p className="mt-auto mb-auto ml-5 text-gray-500 ">
            ランク {(props.defenseRank < 0 ? "" : "+") + props.defenseRank}
          </p>

          <div className="inline-flex rounded-md shadow-smm ml-5" role="group">
            <button
              type="button"
              onClick={handleRankIncrease}
              className="px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-l-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700"
            >
              +
            </button>
            <button
              type="button"
              onClick={handleRankDecrease}
              className="px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-r-md hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700"
            >
              -
            </button>
          </div>
        </div>

        {/* 持ち物 */}
        <div className="flex mt-5 ml-4">
          <div className="w-64">
            <Select
              value={item}
              onChange={handleItem}
              options={all_items}
              isSearchable={true}
              placeholder="持ち物"
              menuPortalTarget={document.body}
              styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
            />
          </div>
        </div>

        <div className="flex mt-5 ml-4">
          {/* やけど */}
          <div className="form-control">
            <label className="label cursor-pointer">
              <span className="label-text text-gray-500">
                リフレクター・ひかりのかべ
              </span>
              <input
                type="checkbox"
                className="toggle toggle-info"
                onClick={props.setWall}
              />
            </label>
          </div>
        </div>
        <div className="w-11/12 mt-2 mx-auto">
          <div className="text-xs text-gray-600">その他倍率</div>
          <input
            type="range"
            min="0.5"
            max="2"
            value={props.otherMultiplier}
            onChange={handleOtherMultiplier}
            step="0.1"
            className="range range-xs range-info"
            id="attackerOtherMunipulater"
          />
          <div className="w-full flex justify-between text-xs px-2 text-gray-400">
            <span>|</span>
            <span>|</span>
            <span>|</span>
            <span>|</span>
            <span>|</span>
            <span>|</span>
            <span>|</span>
            <span>|</span>
            <span>|</span>
            <span>|</span>
            <span>|</span>
            <span>|</span>
            <span>|</span>
            <span>|</span>
            <span>|</span>
            <span>| </span>
          </div>
          <div className="w-full flex justify-between text-xs px-2 text-gray-600">
            <span>0.5</span>
            <span>1.0</span>
            <span>1.5</span>
            <span>2.0</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default Defender;
