mode.changjing = {
  game: {
    start: function() {
      var next = game.createEvent("game", false);
      next.content = function() {
        "step 0";
        game.import("scene");
        "step 1";
        game.load();
      };
    }
  },
  character: {
    zuiqiangshenhua: ["male", "qun", 8, ["wushuang", "mashu", "tuxi", "ganglie", "lieren", "shenwei"], "boss"],
    baonuzhanshen: ["male", "qun", 4, ["wushuang", "mashu", "lieren", "shenwei"], "boss"]
  },
  skill: {
    shenwei: {
      trigger: { player: "phaseEnd" },
      frequent: true,
      content: function() {
        player.draw(3);
      }
    },
    taoyuan_draw: {
      inherit: "biyue"
    }
  },
  translate: {
    zuiqiangshenhua: "吕布",
    baonuzhanshen: "吕布",
    shenwei: "神威",
    taoyuan_draw: "桃园",
    shenwei_info: "你可以在回合结束阶段摸三张牌"
  },
  scene: [
    {
      title: "桃园结义",
      control: ["liubei", "guanyu", "zhangfei"],
      enemy: ["zhangjiao", "yuanshao", "dongzhuo"],
      global: ["taoyuan_draw"]
    },
    {
      title: "董卓进京",
      enemy: ["lvbu"],
      control: ["dongzhuo"],
      global: ["biyue"]
    },
    {
      title: "捉放曹·一",
      control: ["caocao"],
      enemy: ["dongzhuo"]
    },
    {
      title: "捉放曹·二",
      control: ["caocao"],
      enemy: ["lvbu"]
    },
    {
      title: "虎牢关·一",
      enemy: ["zuiqiangshenhua"],
      control: ["liubei", "guanyu", "zhangfei"]
    },
    {
      title: "虎牢关·二",
      enemy: ["liubei", "guanyu", "zhangfei"],
      control: ["baonuzhanshen"]
    },
    {
      title: "跨江击刘表",
      enemy: ["yuanshao"],
      control: ["zhaoyun"],
      neutral: ["sunjian"]
    },
    {
      title: "凤仪亭",
      enemy: ["dongzhuo", "caiwenji"],
      control: ["diaochan"],
      friend: ["lvbu"]
    },
    {
      title: "犯长安",
      enemy: ["lvbu"],
      control: ["machao"]
    },
    {
      title: "三让徐州",
      enemy: ["caocao", "xunyu"],
      friend: ["lvbu"],
      neutral: ["zhangjiao"],
      control: ["liubei"]
    },
    {
      title: "李郭交兵",
      enemy: ["zhangjiao"],
      control: ["caocao"]
    },
    {
      title: "小霸王孙策",
      enemy: ["sunce"],
      control: ["yuji"]
    },
    {
      title: "辕门射戟",
      enemy: ["yuanshao", "caocao"],
      neutral: ["liubei"],
      control: ["lvbu"]
    },
    {
      title: "战宛城",
      enemy: ["dianwei"],
      control: ["jiaxu"]
    },
    {
      title: "白门楼",
      enemy: ["lvbu", "diaochan"],
      friend: ["liubei"],
      control: ["caocao"]
    },
    {
      title: "煮酒论英雄",
      enemy: ["dongzhuo", "sunjian", "sunce", "zhangjiao"],
      friend: ["yuanshao"],
      neutral: ["caocao", "jiaxu"],
      control: ["liubei"]
    }
  ]
};