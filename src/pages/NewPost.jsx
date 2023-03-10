import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Select from "react-select";
import { toast } from "react-toastify";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";

import "../css/NewPost.css";
import Pokemons from "../json/all_pokemons.json";
import Moves from "../json/all_moves.json";
import Items from "../json/all_items.json";
import Abilities from "../json/all_abilities.json";
import Natures from "../json/all_natures.json";
import Types from "../json/all_types.json";

import { useAuthContext } from "../context/AuthContext.tsx";

const options = Moves.map((data) => {
  return { value: data.name, label: data.name };
});

const all_pokemons = Pokemons.map((data) => {
  return { value: data.name, label: data.name };
});

const all_items = Items.map((data) => {
  return { value: data.name, label: data.name };
});

const all_abilities = Abilities.map((data) => {
  return { value: data.name, label: data.name };
});

const all_natures = Natures.map((data) => {
  return { value: data.value, label: data.label };
});

const all_types = Types.map((data) => {
  return { value: data.value, label: data.label };
});

const NewPost = () => {
  const navigate = useNavigate();
  const [user] = useAuthState(auth);

  const [title, setTitle] = useState(null);
  const [body, setBody] = useState(null);
  const [pokemon, setPokemon] = useState(null);
  const [item, setItem] = useState(null);
  const [nature, setNature] = useState("すなお");
  const [teraType, setTeraType] = useState("ノーマル");
  const [ability, setAbility] = useState(null);
  const [move1, setMove1] = useState(null);
  const [move2, setMove2] = useState(null);
  const [move3, setMove3] = useState(null);
  const [move4, setMove4] = useState(null);
  const [evHp, setEvHp] = useState(0);
  const [evAttack, setEvAttack] = useState(0);
  const [evDefense, setEvDefense] = useState(0);
  const [evSpecialAttack, setEvSpecialAttack] = useState(0);
  const [evSpecialDefense, setEvSpecialDefense] = useState(0);
  const [evSpeed, setEvSpeed] = useState(0);

  const handleTitle = (event) => {
    setTitle(event.target.value);
  };

  const handleBody = (event) => {
    setBody(event.target.value);
  };

  const handlePokemon = (pokemon) => {
    setPokemon(pokemon);
  };

  const handleItem = (item) => {
    setItem(item);
  };

  const handleNature = (nature) => {
    setNature(nature);
  };

  const handleTeraType = (teraType) => {
    setTeraType(teraType);
  };

  const handleAbility = (ability) => {
    setAbility(ability);
  };

  const handleMove1 = (move1) => {
    setMove1(move1);
  };

  const handleMove2 = (move2) => {
    setMove2(move2);
  };

  const handleMove3 = (move3) => {
    setMove3(move3);
  };

  const handleMove4 = (move4) => {
    setMove4(move4);
  };

  const handleEvHp = (event) => {
    setEvHp(event.target.value);
  };
  const handleEvAttack = (event) => {
    setEvAttack(event.target.value);
  };
  const handleEvDefense = (event) => {
    setEvDefense(event.target.value);
  };
  const handleEvSpecialAttack = (event) => {
    setEvSpecialAttack(event.target.value);
  };
  const handleEvSpecialDefense = (event) => {
    setEvSpecialDefense(event.target.value);
  };
  const handleEvSpeed = (event) => {
    setEvSpeed(event.target.value);
  };

  // tokenを取得（クライアント側でtokenを保存する処理を行なっていないので、都度firebaseから取得する必要あり)
  const { currentUser } = useAuthContext();
  async function setConfig() {
    const token = await currentUser?.getIdToken();
    const config = {
      headers: { authorization: `Bearer ${token}` },
    };
    return config;
  }
  const handleSubmit = async () => {
    // ログイン状態を確認
    if (!user) {
      toast.error("ログインしてください。");
      return;
    }

    if (title.length > 16) {
      toast.error("タイトルは16文字以内で入力してください。");
      return;
    }

    if (!title || !pokemon || !ability || !nature || !move1 || !teraType) {
      // 必須項目に漏れがないかチェック
      toast.error("入力項目が不足しています。");
      return;
    }

    //　努力値が252を超えているステータスがないかチェック
    if (
      evHp > 252 ||
      evAttack > 252 ||
      evDefense > 252 ||
      evSpecialAttack > 252 ||
      evSpecialDefense > 252 ||
      evSpeed > 252
    ) {
      toast.error("努力値は252までの値で入力してください。");
      return;
    }

    if (
      // 努力値合計が510を超えてないかチェック（parseIntしないと文字列として連結される)
      parseInt(evHp) +
        parseInt(evAttack) +
        parseInt(evDefense) +
        parseInt(evSpecialAttack) +
        parseInt(evSpecialDefense) +
        parseInt(evSpeed) >
      510
    ) {
      toast.error("努力値の合計は510以下にしてください。");
      return;
    }

    // tokenをHTTPリクエストヘッダーにセット
    const config = await setConfig();

    // 投稿データをセット
    const data = {
      post: {
        title,
        body,
        pokemon: pokemon.value,
        ability: ability.value,
        item: item.value,
        nature: nature.value,
        tera_type: teraType.value,
        move1: move1.value,
        move2: move2.value,
        move3: move3.value,
        move4: move4.value,
        ev_hp: evHp,
        ev_attack: evAttack,
        ev_defense: evDefense,
        ev_special_attack: evSpecialAttack,
        ev_special_defense: evSpecialDefense,
        ev_speed: evSpeed,
      },
    };

    try {
      const response = await axios.post("/posts", data, config);
      if (response.status === 200) {
        toast.success("育成論が投稿されました!");
        navigate("/");
        return response.data;
      }
    } catch (err) {
      toast.error("投稿に失敗しました。時間をおいてもう一度お試しください。");
      let message;
      if (axios.isAxiosError(err) && err.response) {
        console.error(err.response.data.message);
      } else {
        message = String(err);
        console.error(message);
      }
    }
  };

  return (
    <>
      <div className="artboard phone-4 bg-white rounded-lg shadow-xl mx-auto mt-10">
        <div className="flex flex-row bg-gradient-to-r from-green-200 to-green-500">
          <p className="pt-5 pl-5 mb-5 font-bold text-gray-600 ">
            育成論新規作成
          </p>
        </div>

        <div className="form-control w-full max-w-xs ml-4">
          <label className="label">
            <span className="label-text text-gray-600">育成論のタイトル</span>
          </label>
          <input
            type="text"
            onChange={handleTitle}
            placeholder="最速CSサザンドラ"
            className="input input-bordered w-full max-w-xs text-gray-600"
          />
        </div>

        <div className="ml-10 mt-4">
          <div className="w-64">
            <Select
              value={pokemon}
              onChange={handlePokemon}
              options={all_pokemons}
              isSearchable={true}
              placeholder="ポケモンを選択"
            />
          </div>
        </div>

        <div className="ml-10 mt-4">
          <div className="w-64">
            <Select
              value={ability}
              onChange={handleAbility}
              options={all_abilities}
              isSearchable={true}
              placeholder="とくせいを選択"
            />
          </div>
        </div>

        <div className="ml-10 mt-4">
          <div className="w-64">
            <Select
              value={teraType}
              onChange={handleTeraType}
              options={all_types}
              isSearchable={true}
              placeholder="テラスタイプを選択"
            />
          </div>
        </div>

        <div className="ml-10 mt-4">
          <div className="w-64">
            <Select
              value={nature}
              onChange={handleNature}
              options={all_natures}
              isSearchable={true}
              placeholder="性格を選択"
            />
          </div>
        </div>

        <div className="ml-10 mt-4">
          <div className="w-64">
            <Select
              value={item}
              onChange={handleItem}
              options={all_items}
              isSearchable={true}
              placeholder="持ち物を選択"
            />
          </div>
        </div>

        <label className="label ml-4 mt-4">
          <span className="label-text text-gray-600">努力値</span>
        </label>

        <div className="flex justify-center">
          <div className="relative">
            <input
              type="number"
              min="0"
              max="252"
              step="4"
              onChange={handleEvHp}
              id="attack_ev_floating_filled"
              className="block rounded-t-lg px-1 pb-2.5 pt-5 w-20 text-sm text-gray-900 bg-gray-50  border-0 border-b-2 border-gray-300 appearance-none  focus:outline-none focus:ring-0 focus:border-blue-600 peer "
              defaultValue={0}
            />
            <label
              htmlFor="attack_ev_floating_filled"
              className="absolute text-sm text-gray-500  duration-300 transform -translate-y-4 scale-75 top-4  origin-[0] left-2.5 peer-focus:text-blue-600  peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4"
            >
              HP
            </label>
          </div>
          <div className="relative ml-4">
            <input
              type="number"
              min="0"
              max="252"
              step="4"
              onChange={handleEvAttack}
              id="attack_ev_floating_filled"
              className="block rounded-t-lg px-1 pb-2.5 pt-5 w-20 text-sm text-gray-900 bg-gray-50 border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer "
              defaultValue={0}
            />
            <label
              htmlFor="attack_ev_floating_filled"
              className="absolute text-sm text-gray-500  duration-300 transform -translate-y-4 scale-75 top-4  origin-[0] left-2.5 peer-focus:text-blue-600  peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4"
            >
              攻撃
            </label>
          </div>
          <div className="relative ml-4">
            <input
              type="number"
              min="0"
              max="252"
              step="4"
              onChange={handleEvDefense}
              id="attack_ev_floating_filled"
              className="block rounded-t-lg px-1 pb-2.5 pt-5 w-20 text-sm text-gray-900 bg-gray-50  border-0 border-b-2 border-gray-300 appearance-none  focus:outline-none focus:ring-0 focus:border-blue-600 peer "
              defaultValue={0}
            />
            <label
              htmlFor="attack_ev_floating_filled"
              className="absolute text-sm text-gray-500  duration-300 transform -translate-y-4 scale-75 top-4 origin-[0] left-2.5 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4"
            >
              防御
            </label>
          </div>
        </div>

        <div className="flex justify-center mt-4">
          <div className="relative">
            <input
              type="number"
              min="0"
              max="252"
              step="4"
              onChange={handleEvSpecialAttack}
              id="attack_ev_floating_filled"
              className="block rounded-t-lg px-1 pb-2.5 pt-5 w-20 text-sm text-gray-900 bg-gray-50  border-0 border-b-2 border-gray-300 appearance-none  focus:outline-none focus:ring-0 focus:border-blue-600 peer "
              defaultValue={0}
            />
            <label
              htmlFor="attack_ev_floating_filled"
              className="absolute text-sm text-gray-500  duration-300 transform -translate-y-4 scale-75 top-4  origin-[0] left-2.5 peer-focus:text-blue-600  peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4"
            >
              特攻
            </label>
          </div>
          <div className="relative ml-4">
            <input
              type="number"
              min="0"
              max="252"
              step="4"
              onChange={handleEvSpecialDefense}
              id="attack_ev_floating_filled"
              className="block rounded-t-lg px-1 pb-2.5 pt-5 w-20 text-sm text-gray-900 bg-gray-50  border-0 border-b-2 border-gray-300 appearance-none  focus:outline-none focus:ring-0 focus:border-blue-600 peer "
              defaultValue={0}
            />
            <label
              htmlFor="attack_ev_floating_filled"
              className="absolute text-sm text-gray-500  duration-300 transform -translate-y-4 scale-75 top-4  origin-[0] left-2.5 peer-focus:text-blue-600  peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4"
            >
              特防
            </label>
          </div>
          <div className="relative ml-4">
            <input
              type="number"
              min="0"
              max="252"
              step="4"
              onChange={handleEvSpeed}
              id="attack_ev_floating_filled"
              className="block rounded-t-lg px-1 pb-2.5 pt-5 w-20 text-sm text-gray-900 bg-gray-50 border-0 border-b-2 border-gray-300 appearance-none  focus:outline-none focus:ring-0 focus:border-blue-600 peer "
              defaultValue={0}
            />
            <label
              htmlFor="attack_ev_floating_filled"
              className="absolute text-sm text-gray-500  duration-300 transform -translate-y-4 scale-75 top-4  origin-[0] left-2.5 peer-focus:text-blue-600  peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4"
            >
              素早さ
            </label>
          </div>
        </div>

        <div className="mt-4 ml-10">
          <label className="label mt-4">
            <span className="label-text text-gray-600">わざ1</span>
          </label>
          <div className="w-64">
            <Select
              value={move1}
              onChange={handleMove1}
              options={options}
              isSearchable={true}
              placeholder="わざを選択"
            />
          </div>

          <label className="label">
            <span className="label-text text-gray-600">わざ2</span>
          </label>
          <div className="w-64">
            <Select
              value={move2}
              onChange={handleMove2}
              options={options}
              isSearchable={true}
              placeholder="わざを選択"
            />
          </div>

          <label className="label">
            <span className="label-text text-gray-600">わざ3</span>
          </label>
          <div className="w-64">
            <Select
              value={move3}
              onChange={handleMove3}
              options={options}
              isSearchable={true}
              placeholder="わざを選択"
            />
          </div>
          <label className="label">
            <span className="label-text text-gray-600">わざ4</span>
          </label>
          <div className="w-64">
            <Select
              value={move4}
              onChange={handleMove4}
              options={options}
              isSearchable={true}
              placeholder="わざを選択"
            />
          </div>
        </div>

        <div className="form-control ml-4 mr-4 mt-4">
          <label className="label">
            <span className="label-text text-gray-600">概要</span>
          </label>
          <textarea
            onChange={handleBody}
            className="textarea textarea-bordered h-60 text-gray-600"
            placeholder="おくびょう最速、とくこう252振りで、より多くの相手に上から負荷をかける運用をします。"
          ></textarea>
        </div>

        <div className="flex flex-row-reverse mt-4 mr-4">
          <button
            onClick={handleSubmit}
            className="btn btn-active btn-primary text-gray-200"
          >
            投稿
          </button>
        </div>
      </div>
    </>
  );
};

export default NewPost;
