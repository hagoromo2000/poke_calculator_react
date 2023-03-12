import React, { useState, useEffect } from "react";
import { useToggle } from "react-use";
import Attacker from "../components/Attacker";
import "../css/Calculator.css";
import Defender from "../components/Defender";
import Environment from "../components/Environment";
import Footer from "../components/Footer";
import TypeCompatibility from "../calculator/TypeCompatibility";
import WeatherDamageModifier from "../calculator/WeatherDamageModifier";
import WeatherDefenseModifier from "../calculator/WeatherDefenseModifier";
import WeatherSpecialDefenseModifier from "../calculator/WeatherSpecialDefenseModifier";
import FieldDamageModifier from "../calculator/FieldDamageModifier";
import roundToHalf from "../calculator/RoundToHalf";
import BetaToast from "../components/BetaToast";

const Calculator = () => {
  const [attack, setAttack] = useState(100);
  const [specialAttack, setSpecialAttack] = useState(100);
  const [moveType, setMoveType] = useState("でんき");
  const [power, setPower] = useState(90);
  const [damageClass, setDamageClass] = useState("とくしゅ");
  const [attackerFirstType, setAttackerFirstType] = useState("でんき");
  const [attackerSecondType, setAttackerSecondType] = useState(null);
  const [attackerTerastal, setAttackerTerastal] = useToggle(false);
  const [burn, setBurn] = useToggle(false);
  const [boosterEnergy, setBoosterEnergy] = useToggle(false);
  const [attackerOtherMultiplier, setAttackerOtherMultiplier] = useState(1);
  const [attackerRank, setAttackerRank] = useState(0);

  const [hp, setHp] = useState(100);
  const [defense, setDefense] = useState(100);
  const [specialDefense, setSpecialDefense] = useState(100);
  const [defenseRank, setDefenseRank] = useState(0);
  const [teraType, setTeraType] = useState(null);
  const [defenseType1, setDefenseType1] = useState("ほのお");
  const [defenseType2, setDefenseType2] = useState("ひこう");
  const [wall, setWall] = useToggle(false);
  const [defenderOtherMultiplier, setDefenderOtherMultiplier] = useState(1);

  const [weather, setWeather] = useState(null);
  const [damageMultiplierByWeather, setDamageMultiplierByWeather] = useState(1);
  const [defenseMultiplierByWeather, setDefenseMultiplierByWeather] =
    useState(1);
  const [
    specialDefenseMultiplierByWeather,
    setSpecialDefenseMultiplierByWeather,
  ] = useState(1);

  const [field, setField] = useState(null);
  const [damageMultiplierByField, setDamageMultiplierByField] = useState(1);

  const [damage, setDamage] = useState(0);
  const [minDamage, setMinDamage] = useState(0);
  const [maxDamage, setMaxDamage] = useState(0);
  const [compatibility, setCompatibility] = useState(1);

  //環境、タイプ相性による倍率の設定
  useEffect(() => {
    //天候による倍率の設定
    setDamageMultiplierByWeather(WeatherDamageModifier(moveType, weather));
    setDefenseMultiplierByWeather(
      WeatherDefenseModifier(defenseType1, defenseType2, teraType, weather)
    );
    setSpecialDefenseMultiplierByWeather(
      WeatherSpecialDefenseModifier(
        defenseType1,
        defenseType2,
        teraType,
        weather
      )
    );

    //フィールドによる倍率の設定
    setDamageMultiplierByField(
      FieldDamageModifier(
        attackerFirstType,
        attackerSecondType,
        defenseType1,
        defenseType2,
        teraType,
        field,
        moveType
      )
    );

    //タイプ相性による倍率の設定
    setCompatibility(
      TypeCompatibility(moveType, teraType, defenseType1, defenseType2)
    );
  }, [
    weather,
    field,
    moveType,
    teraType,
    defenseType1,
    defenseType2,
    attackerFirstType,
    attackerSecondType,
  ]);

  //　各種値が変化すると、副作用で基礎ダメージが計算される。
  useEffect(() => {
    setDamage(() => {
      let baseDamage = 0;
      let attackRankMultiplier = 1;
      let defenseRankMultiplier = 1;
      let burnMultiplier = 1;
      let boosterEnergyMultiplier = 1;

      // 能力ランクによるステータス倍率の設定
      if (attackerRank >= 0) {
        attackRankMultiplier = (2 + attackerRank) / 2;
      } else {
        attackRankMultiplier = 2 / (2 - attackerRank);
      }

      if (defenseRank >= 0) {
        defenseRankMultiplier = (2 + defenseRank) / 2;
      } else {
        defenseRankMultiplier = 2 / (2 - defenseRank);
      }

      //　やけどによるステータス倍率の設定
      if (burn === true) {
        burnMultiplier = 1 / 2;
      }

      //　ブーストエナジーによるステータス倍率の設定
      if (boosterEnergy === true) {
        boosterEnergyMultiplier = 1.3;
      }

      // ダメージ=攻撃側のレベル×2÷5+2→切り捨て 今回はレベル50固定なので22で確定
      // ×物理技(特殊技)の威力×(攻撃側のこうげき(とくこう)*ランク補正)÷(防御側のぼうぎょ(とくぼう)*ランク補正)→切り捨て
      // ÷50+2→切り捨て
      // ×乱数(0.85, 0.86, …… ,0.99, 1.00 の何れか)→切り捨て
      if (damageClass === "ぶつり") {
        baseDamage = Math.floor(
          Math.floor(
            (22 *
              power *
              (attack *
                attackRankMultiplier *
                burnMultiplier *
                boosterEnergyMultiplier *
                attackerOtherMultiplier)) /
              (defense *
                defenseMultiplierByWeather *
                defenseRankMultiplier *
                defenderOtherMultiplier)
          ) /
            50 +
            2
        );
      } else {
        baseDamage = Math.floor(
          Math.floor(
            (22 *
              power *
              (specialAttack *
                attackRankMultiplier *
                boosterEnergyMultiplier *
                attackerOtherMultiplier)) /
              (specialDefense *
                specialDefenseMultiplierByWeather *
                defenseRankMultiplier *
                defenderOtherMultiplier)
          ) /
            50 +
            2
        );
      }

      // はれかあめの時のダメージ倍率、およびフィールドによるダメージ倍率をかける
      baseDamage =
        baseDamage * damageMultiplierByWeather * damageMultiplierByField;

      return baseDamage;
    });
  }, [
    attack,
    power,
    defense,
    specialAttack,
    specialDefense,
    hp,
    damageClass,
    compatibility,
    attackerRank,
    defenseRank,
    damageMultiplierByWeather,
    defenseMultiplierByWeather,
    specialDefenseMultiplierByWeather,
    damageMultiplierByField,
    burn,
    boosterEnergy,
    attackerOtherMultiplier,
    defenderOtherMultiplier,
  ]);

  // 基礎ダメージが計算されると、乱数幅を掛けた最大ダメージと最小ダメージが算出され、それに各種倍率を掛けて最終的なダメージが算出される。
  useEffect(() => {
    let stab = 1;

    //　タイプ一致の場合、タイプ一致補正でダメージが1.5倍になる（same_type_attack_bonus = stab)
    if (attackerFirstType === moveType || attackerSecondType === moveType) {
      stab = stab + 0.5;
    }

    // テラスタル中の場合、タイプ一致と同じ扱い。これはタイプ一致補正と重複する(2.25倍にはならず、2倍になる)
    if (attackerTerastal === true) {
      stab = stab + 0.5;
    }

    // リフレクター・光のかべ状態時、ダメージは半分
    if (wall === true) {
      stab = stab * 0.5;
    }

    // ダメージの乱数幅を制御
    let minBaseDamage = Math.floor(damage * 0.85);
    let maxBaseDamage = damage;

    // タイプ一致補正を乗算
    minBaseDamage = minBaseDamage * stab;
    maxBaseDamage = maxBaseDamage * stab;

    // 五捨五超入
    minBaseDamage = roundToHalf(minBaseDamage);
    maxBaseDamage = roundToHalf(maxBaseDamage);

    // タイプ相性をかける
    setMinDamage(Math.floor(minBaseDamage * compatibility));
    setMaxDamage(Math.floor(maxBaseDamage * compatibility));
  }, [damage, attackerTerastal, moveType, compatibility, wall]);

  return (
    <>
      <div className="flex justify-center mt-2">
        <BetaToast />
      </div>
      <div className="md:flex">
        <Attacker
          setAttack={setAttack}
          setSpecialAttack={setSpecialAttack}
          setMoveType={setMoveType}
          setPower={setPower}
          setDamageClass={setDamageClass}
          setAttackerFirstType={setAttackerFirstType}
          setAttackerSecondType={setAttackerSecondType}
          setAttackerTerastal={setAttackerTerastal}
          setBurn={setBurn}
          setBoosterEnergy={setBoosterEnergy}
          setAttackerRank={setAttackerRank}
          setOtherMultiplier={setAttackerOtherMultiplier}
          power={power}
          attack={attack}
          specialAttack={specialAttack}
          attackerRank={attackerRank}
          otherMultiplier={attackerOtherMultiplier}
        />
        <Defender
          setHp={setHp}
          setDefense={setDefense}
          setSpecialDefense={setSpecialDefense}
          setDefenseRank={setDefenseRank}
          setTeraType={setTeraType}
          setDefenseType1={setDefenseType1}
          setDefenseType2={setDefenseType2}
          setWall={setWall}
          setOtherMultiplier={setDefenderOtherMultiplier}
          hp={hp}
          defense={defense}
          specialDefense={specialDefense}
          defenseRank={defenseRank}
          teraType={teraType}
          otherMultiplier={defenderOtherMultiplier}
        />
      </div>
      <div className="h-64">
        <Environment setWeather={setWeather} setField={setField} />
      </div>
      <Footer
        damage={damage}
        minDamage={minDamage}
        maxDamage={maxDamage}
        hp={hp}
        compatibility={compatibility}
      />
    </>
  );
};

export default Calculator;
