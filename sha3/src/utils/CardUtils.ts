/** @return : first < second, 返回-1;  first > second, 返回1; 相等则返回0 */
import { CardDeck, CardRankList, ICard, ICardRank } from "../data/CardDeck";
import { shuffle } from "./ArrayUtils";

export function compareCardRank(one: ICardRank, two: ICardRank) {
  const idx1 = CardRankList.findIndex(value => value === one);
  const idx2 = CardRankList.findIndex(value => value === two);
  return idx1 > idx2 ? 1 : (idx1 == idx2 ? 0 : -1);
}

export function shuffleCards() {
  return shuffle<ICard>(CardDeck);
}