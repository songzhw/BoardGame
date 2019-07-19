const CardRankList = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];
type ICardRank = "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "10" | "J" | "Q" | "K" | "A";

/** @return : first < second, 返回-1;  first > second, 返回1; 相等则返回0 */
export function compareCardRank(one: ICardRank, two: ICardRank) {
  const idx1 = CardRankList.findIndex(value => value === one);
  const idx2 = CardRankList.findIndex(value => value === two);
  return idx1 > idx2 ? 1 : (idx1 == idx2 ? 0 : -1);
}


interface ICard {
  suit: "spade" | "heart" | "diamond" | "club";  //黑桃|红心|方块|梅花
}


export const CardDeck = [];
