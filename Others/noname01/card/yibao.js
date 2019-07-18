card.yibao = {
  card: {
    hufu: {
      fullskin: true,
      type: "basic",
      ai: {
        value: [7.5, 5, 2],
        useful: [7.5, 5, 2]
      }
    },
    huoshan: {
      fullskin: true,
      type: "delay",
      enable: function(card, player) {
        return (lib.filter.judge(card, player, player));
      },
      filterTarget: function(card, player, target) {
        return (lib.filter.judge(card, player, target) && player == target);
      },
      selectTarget: [-1, -1],
      judge: function(card) {
        if (get.suit(card) == "heart" && get.number(card) > 1 && get.number(card) < 10) return -6;
        return 0;
      },
      effect: function() {
        if (result.judge) {
          player.damage(2, "fire", "nosource");
          var players = get.players();
          for (var i = 0; i < game.players.length; i++) {
            if (get.distance(player, game.players[i]) <= 1 && player != game.players[i]) {
              game.players[i].damage(1, "fire", "nosource");
            }
          }
        } else {
          if (!card.expired) {
            if (card.name != "huoshan") {
              player.next.addJudge("huoshan", card);
            } else {
              player.next.addJudge(card);
            }
          } else {
            card.expired = false;
          }
        }
      },
      cancel: function() {
        player.next.addJudge(card);
      },
      ai: {
        basic: {
          useful: 0,
          value: 0
        },
        order: 1,
        result: {
          target: function(player, target) {
            var rejudge, num = 0;
            for (var i = 0; i < game.players.length; i++) {
              for (var j = 0; j < game.players[i].skills.length; j++) {
                rejudge = get.tag(game.players[i].skills[j], "rejudge", game.players[i]);
                if (rejudge != undefined) {
                  if (ai.get.attitude(target, game.players[i]) > 0 &&
                    ai.get.attitude(game.players[i], target) > 0) num += rejudge;
                  else num -= rejudge;
                }
              }
            }
            if (num > 0) return num;
            if (num == 0) {
              if (lib.config.mode == "identity") {
                if (target.identity == "nei") return 1;
                var situ = ai.get.situation();
                if (target.identity == "fan") {
                  if (situ > 1) return 1;
                } else {
                  if (situ < -1) return 1;
                }
              } else if (lib.config.mode == "guozhan") {
                if (target.identity == "ye") return 1;
                for (var i = 0; i < game.players.length; i++) {
                  if (game.players[i].identity == "unknown") return -1;
                }
                if (get.population(target.identity) == 1) {
                  if (target.maxHp > 2 && target.hp < 2) return 1;
                  if (game.players.length < 3) return -1;
                  if (target.hp <= 2 && target.num("he") <= 3) return 1;
                }
              }
            }
            return -1;
          }
        },
        tag: {
          // damage:1,
          // natureDamage:1,
          // fireDamage:1,
        }
      }
    },
    hongshui: {
      type: "delay",
      enable: function(card, player) {
        return (lib.filter.judge(card, player, player));
      },
      filterTarget: function(card, player, target) {
        return (lib.filter.judge(card, player, target) && player == target);
      },
      selectTarget: [-1, -1],
      judge: function(card) {
        if (get.suit(card) == "club" && get.number(card) > 1 && get.number(card) < 10) return -3;
        return 0;
      },
      fullskin: true,
      effect: function() {
        if (result.judge) {
          if (player.num("he") == 0) player.loseHp();
          else player.chooseToDiscard("he", true, 3);
          var players = get.players();
          for (var i = 0; i < game.players.length; i++) {
            var dist = get.distance(player, game.players[i]);
            if (dist <= 2 && player != game.players[i]) {
              if (game.players[i].num("he") == 0) game.players[i].loseHp();
              else game.players[i].chooseToDiscard("he", true, 3 - Math.max(1, dist));
            }
          }
        } else {
          if (!card.expired) {
            if (card.name != "hongshui") {
              player.next.addJudge("hongshui", card);
            } else {
              player.next.addJudge(card);
            }
          } else {
            card.expired = false;
          }
        }
      },
      cancel: function() {
        player.next.addJudge(card);
      },
      ai: {
        basic: {
          useful: 0,
          value: 0
        },
        order: 1,
        result: {
          target: function(player, target) {
            var rejudge, num = 0;
            for (var i = 0; i < game.players.length; i++) {
              for (var j = 0; j < game.players[i].skills.length; j++) {
                rejudge = get.tag(game.players[i].skills[j], "rejudge", game.players[i]);
                if (rejudge != undefined) {
                  if (ai.get.attitude(target, game.players[i]) > 0 &&
                    ai.get.attitude(game.players[i], target) > 0) num += rejudge;
                  else num -= rejudge;
                }
              }
            }
            if (num > 0) return num;
            if (num == 0) {
              if (lib.config.mode == "identity") {
                if (target.identity == "nei") return 1;
                var situ = ai.get.situation();
                if (target.identity == "fan") {
                  if (situ > 0) return 1;
                } else {
                  if (situ < 0) return 1;
                }
              } else if (lib.config.mode == "guozhan") {
                if (game.players.length <= 2) return -1;
                if (target.identity == "ye") return 1;
                for (var i = 0; i < game.players.length; i++) {
                  if (game.players[i].identity == "unknown") return -1;
                }
                if (get.population(target.identity) == 1) {
                  return 1;
                }
              }
            }
            return -1;
          }
        }
      }
    },
    liuxinghuoyu: {
      fullskin: true,
      type: "trick",
      enable: true,
      filterTarget: function(card, player, target) {
        return target.num("he") > 0;
      },
      content: function() {
        "step 0";
        target.chooseToDiscard("he", [1, 2]).ai = function(card) {
          if (target.hasSkillTag("nofire")) return 0;
          if (target.hasSkillTag("maixie") && target.hp > 1 && ui.selected.cards.length) {
            return 0;
          }
          if (get.type(card) != "basic") {
            return 10 - ai.get.value(card);
          }
          return 8 - ai.get.value(card);
        };
        "step 1";
        if (!result.bool || result.cards.length < 2) {
          if (result.bool) target.damage(2 - result.cards.length, "fire");
          else target.damage(2, "fire");
        }
      },
      ai: {
        basic: {
          order: 4,
          value: 7,
          useful: 2
        },
        result: {
          target: function(player, target) {
            if (target.hasSkillTag("nofire")) return 0;
            return -2;
          }
        },
        tag: {
          damage: 2,
          fireDamage: 2,
          natureDamage: 2,
          discard: 2,
          loseCard: 2,
          position: "he"
        }
      }
    },
    dujian: {
      fullskin: true,
      type: "basic",
      enable: true,
      filterTarget: function(card, player, target) {
        return target.num("h") > 0;
      },
      content: function() {
        "step 0";
        if (target.num("h") == 0 || player.num("h") == 0) {
          event.finish();
          return;
        }
        player.chooseCard(true);
        "step 1";
        event.card1 = result.cards[0];
        target.chooseCard(true);
        "step 2";
        event.card2 = result.cards[0];
        player.$compare(event.card1, target, event.card2);
        game.delay(4);
        "step 3";
        if (get.color(event.card2) == get.color(event.card1)) {
          player.discard(event.card1).animate = false;
          target.$gain2(event.card2);
          var clone = event.card1.clone;
          if (clone) {
            clone.style.transition = "all 0.5s";
            clone.style.webkitTransform = "scale(1.2)";
            clone.delete();
          }
          target.loseHp();
        } else {
          player.$gain2(event.card1);
          target.$gain2(event.card2);
          target.addTempSkill("dujian2", "phaseBegin");
        }
      },
      ai: {
        basic: {
          order: 2,
          value: 3,
          useful: 1
        },
        result: {
          player: function(player, target) {
            if (player.num("h") <= Math.max(2, player.hp) &&
              _status.event.name == "chooseToUse" && _status.event.filterCard({ name: "dujian" })) return -10;
          },
          target: -1.5
        },
        tag: {
          loseHp: 1
        }
      }
    },
    qiankundai: {
      fullskin: true,
      type: "equip",
      subtype: "equip5",
      onLose: function() {
        player.draw();
      },
      skills: ["qiankundai"],
      ai: {
        order: 9.5,
        basic: {
          equipValue: function(card, player) {
            if (player.num("h", "qiankundai")) return 6;
            return 1;
          }
        }
      }
    }
  },
  skill: {
    dujian2: {},
    qiankundai: {
      mod: {
        maxHandcard: function(player, num) {
          return num + 1;
        }
      }
    },
    _hufu_sha: {
      enable: ["chooseToRespond", "chooseToUse"],
      filter: function(event, player) {
        return player.num("h", "hufu") > 0;
      },
      filterCard: { name: "hufu" },
      viewAs: { name: "sha" },
      prompt: "将一张虎符当杀使用或打出",
      check: function(card) {
        return 1;
      },
      ai: {
        order: 1,
        useful: 7.5,
        value: 7.5
      }
    },
    _hufu_shan: {
      enable: ["chooseToRespond", "chooseToUse"],
      filter: function(event, player) {
        return player.num("h", "hufu") > 0;
      },
      filterCard: { name: "hufu" },
      viewAs: { name: "shan" },
      prompt: "将一张虎符当闪使用或打出",
      check: function() {
        return 1;
      },
      ai: {
        order: 1,
        useful: 7.5,
        value: 7.5
      }
    },
    _hufu_jiu: {
      enable: ["chooseToRespond", "chooseToUse"],
      filter: function(event, player) {
        return player.num("h", "hufu") > 0;
      },
      filterCard: { name: "hufu" },
      viewAs: { name: "jiu" },
      prompt: "将一张虎符当酒使用",
      check: function() {
        return 1;
      }
    }
  },
  translate: {
    huoshan: "火山",
    huoshan_info: "出牌阶段，对自己使用。若判定结果为红桃2~9，则目标角色受到2点火焰伤害，距离目标1以内的其他角色受到1点火焰伤害。若判定不为红桃2~9，将之移动到下家的判定区里。",
    hongshui: "洪水",
    hongshui_info: "出牌阶段，对自己使用。若判定结果为梅花2~9，该角色须弃置3张牌，距离该角色为X的角色须弃置3-X张牌，若没有牌则失去一点体力，X至少为1",
    liuxinghuoyu: "流星火羽",
    liuxinghuoyu_info: "出牌阶段，对一名有手牌或装备牌的角色使用，令其弃置0~2张牌，并受到2-X点火焰伤害，X为弃置的卡牌数",
    dujian: "毒箭",
    dujian_info: "出牌阶段，对一名有手牌或装备牌的角色使用，令其展示一张手牌，若与你选择的手牌颜色相同，你对其造成一点毒属性伤害",
    qiankundai: "乾坤袋",
    qiankundai_info: "你的手牌上限+1。当你失去该装备时，你摸取一张牌。",
    hufu: "虎符",
    hufu_bg: "符",
    _hufu_sha: "符杀",
    _hufu_shan: "符闪",
    _hufu_jiu: "符酒",
    hufu_info: "你可以将一张虎符当作杀、闪或酒使用或打出"
  },
  list: [
    ["heart", 1, "hufu"],
    ["spade", 1, "hufu"],
    ["club", 1, "qiankundai"],
    ["heart", 6, "huoshan", "fire"],
    ["club", 7, "hongshui"],
    ["diamond", 3, "liuxinghuoyu", "fire"],
    ["heart", 6, "liuxinghuoyu", "fire"],
    ["heart", 9, "liuxinghuoyu", "fire"],
    //['heart',11,'liuxinghuoyu','fire'],
    //['heart',12,'liuxinghuoyu','fire'],
    ["spade", 3, "dujian"],
    //['club',6,'dujian','poison'],
    //['club',9,'dujian','poison'],
    ["club", 11, "dujian"],
    ["club", 12, "dujian"]
    //['club',3,'sha','poison'],
    //['club',4,'sha','poison'],
    //['club',5,'sha','poison'],
    //['spade',6,'sha','poison'],
    //['spade',7,'sha','poison'],
    //['club',3,'sha','poison'],
    //['club',4,'sha','poison'],
    //['club',5,'sha','poison'],
    //['spade',6,'sha','poison'],
    //['spade',7,'sha','poison'],
  ]
};
