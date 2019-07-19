const CardRankList = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];
type ICardRank = "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10" | "J" | "Q" | "K" | "A";

/** @return : first < second, 返回-1;  first > second, 返回1; 相等则返回0 */
export function compareCardRank(one: ICardRank, two: ICardRank) {
  const idx1 = CardRankList.findIndex(value => value === one);
  const idx2 = CardRankList.findIndex(value => value === two);
  return idx1 > idx2 ? 1 : (idx1 == idx2 ? 0 : -1);
}

//TODO expand
type ICardLabel = "杀" | "闪";


interface ICard {
  suit: "spade" | "heart" | "diamond" | "club";  //黑桃|红心|方块|梅花
  rank: ICardRank;
  label: ICardLabel;
}


export const CardDeck: Array<ICard> = [
  { suit: "spade", rank: "1", label: "杀" },
  { suit: "spade", rank: "2", label: "杀" },
  { suit: "spade", rank: "3", label: "杀" },
  { suit: "spade", rank: "4", label: "杀" },
  { suit: "spade", rank: "5", label: "杀" },
  { suit: "spade", rank: "6", label: "杀" },
  { suit: "spade", rank: "7", label: "杀" },
  { suit: "spade", rank: "8", label: "杀" },
  { suit: "spade", rank: "9", label: "杀" },
  { suit: "spade", rank: "A", label: "杀" },
  { suit: "heart", rank: "J", label: "杀" },
  { suit: "heart", rank: "1", label: "杀" },
  { suit: "heart", rank: "2", label: "杀" },
  { suit: "heart", rank: "3", label: "杀" },
  { suit: "heart", rank: "4", label: "杀" },
  { suit: "heart", rank: "5", label: "杀" },
  { suit: "heart", rank: "6", label: "杀" },
  { suit: "heart", rank: "7", label: "杀" },
  { suit: "heart", rank: "8", label: "杀" },
  { suit: "heart", rank: "9", label: "杀" },
  { suit: "heart", rank: "K", label: "杀" },
  { suit: "heart", rank: "J", label: "杀" },
  { suit: "diamond", rank: "4", label: "杀" },
  { suit: "diamond", rank: "5", label: "杀" },
  { suit: "diamond", rank: "6", label: "杀" },
  { suit: "diamond", rank: "7", label: "杀" },
  { suit: "diamond", rank: "8", label: "杀" },
  { suit: "diamond", rank: "9", label: "杀" },
  { suit: "diamond", rank: "K", label: "杀" },
  { suit: "diamond", rank: "3", label: "杀" },
  { suit: "diamond", rank: "2", label: "闪" },
  { suit: "diamond", rank: "5", label: "闪" },
  { suit: "diamond", rank: "6", label: "闪" },
  { suit: "diamond", rank: "7", label: "闪" },
  { suit: "diamond", rank: "2", label: "闪" },
  { suit: "diamond", rank: "Q", label: "闪" },
  { suit: "club", rank: "J", label: "闪" },
  { suit: "club", rank: "J", label: "闪" },
  { suit: "club", rank: "J", label: "闪" },
  { suit: "club", rank: "J", label: "闪" },
  { suit: "club", rank: "J", label: "闪" },
  { suit: "club", rank: "J", label: "闪" },
  { suit: "club", rank: "J", label: "闪" },
  { suit: "club", rank: "J", label: "闪" },
  { suit: "club", rank: "J", label: "闪" },
  { suit: "club", rank: "J", label: "闪" },
  { suit: "club", rank: "J", label: "闪" },
  { suit: "club", rank: "J", label: "闪" },
  { suit: "club", rank: "J", label: "闪" },
  { suit: "club", rank: "J", label: "闪" },
  { suit: "club", rank: "J", label: "闪" },
  { suit: "club", rank: "J", label: "闪" }
];
