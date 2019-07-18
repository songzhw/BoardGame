card.extra = {
  card: {
    jiu: {
      fullskin: true,
      type: "basic",
      enable: true,
      savable: function(card, player, dying) {
        return dying == player;
      },
      usable: 1,
      selectTarget: -1,
      filterTarget: function(card, player, target) {
        return target == player;
      },
      content: function() {
        if (target == _status.dying) target.recover();
        else {
          target.addTempSkill("jiu", "phaseAfter");
          if (card.clone && card.clone.parentNode == ui.arena) {
            card.clone.moveTo(player).delete();
          }
        }
      },
      ai: {
        basic: {
          useful: [5, 1],
          value: [5, 1]
        },
        order: function() {
          return lib.card.sha.ai.order + 0.2;
        },
        result: {
          target: function(player, target) {
            if (target && target == _status.dying) return 2;
            var shas = target.get("h", "sha");
            var ok = false;
            if (shas.length) {
              for (var i = 0; i < shas.length; i++) {
                if (lib.filter.filterCard(shas[i], target)) {
                  ok = true;
                  break;
                }
              }
            }
            if (ok) {
              var card = target.get("h", "sha", 0);
              for (var i = 0; i < game.players.length; i++) {
                if (ai.get.attitude(target, game.players[i]) < 0 &&
                  target.canUse(card, game.players[i], true, true)) {
                  if (ai.get.effect(game.players[i], card, target) > 0) return 1;
                }
              }
            }
            return 0;
          }
        },
        tag: {
          save: 1
        }
      }
    },
    huogong: {
      fullskin: true,
      type: "trick",
      enable: true,
      filterTarget: function(card, player, target) {
        if (player != game.me && player.num("h") < 3) return false;
        return target.num("h") > 0;
      },
      content: function() {
        "step 0";
        if (target.get("h").length == 0) {
          event.finish();
          return;
        }
        target.chooseCard(true);
        "step 1";
        event.dialog = ui.create.dialog(get.translation(target.name) + "展示的手牌", result.cards);
        event.card2 = result.cards[0];
        game.log(get.translation(target.name) + "展示了" + get.translation(event.card2));
        player.chooseToDiscard(function(card) {
          return get.suit(card) == get.suit(_status.event.parent.card2);
        }, function(card) {
          if (ai.get.damageEffect(target, player, player, "fire") > 0) {
            return 6 - ai.get.value(card, _status.event.player);
          }
          return -1;
        }).prompt = false;
        game.delay(2);
        "step 2";
        if (result.bool) {
          target.damage("fire");
        } else {
          target.addTempSkill("huogong2", "phaseBegin");
        }
        event.dialog.close();
      },
      ai: {
        basic: {
          order: 4,
          value: [3, 1],
          useful: 1
        },
        result: {
          player: function(player) {
            var nh = player.num("h");
            if (nh == 2 && player.hp == 1) return 0;
            if (nh <= player.hp &&
              _status.event.name == "chooseToUse" && _status.event.filterCard({ name: "huogong" })) return -10;
          },
          target: function(player, target) {
            if (target.skills.contains("huogong2")) return 0;
            return -1.5;
          }
        },
        tag: {
          damage: 1,
          fireDamage: 1,
          natureDamage: 1
        }
      }
    },
    tiesuo: {
      fullskin: true,
      type: "trick",
      enable: true,
      filterTarget: true,
      selectTarget: [1, 2],
      content: function() {
        target.link();
      },
      chongzhu: true,
      ai: {
        basic: {
          useful: 4,
          value: 4,
          order: 7
        },
        result: {
          target: function(player, target) {
            if (target.classList.contains("linked")) return 1;
            if (ai.get.attitude(player, target) >= 0) return -1;
            for (var i = 0; i < game.players.length; i++) {
              if (ai.get.attitude(player, game.players[i]) < 0 &&
                game.players[i] != target && !game.players[i].isLinked()) {
                return -1;
              }
            }
            return 0;
          }
        },
        tag: {
          multitarget: 1,
          multineg: 1
        }
      }
    },
    bingliang: {
      fullskin: true,
      type: "delay",
      range: { global: 1 },
      filterTarget: function(card, player, target) {
        return (lib.filter.judge(card, player, target) && player != target);
      },
      judge: function(card) {
        if (get.suit(card) == "club") return 0;
        return -3;
      },
      effect: function() {
        if (result.bool == false) {
          player.skip("phaseDraw");
        }
      },
      ai: {
        basic: {
          order: 1,
          useful: 1,
          value: 4
        },
        result: {
          target: function(player, target) {
            return -1 - target.get("h").length;
          }
        },
        tag: {
          skip: "phaseDraw"
        }
      }
    },
    hualiu: {
      fullskin: true,
      type: "equip",
      subtype: "equip3",
      distance: { globalTo: 1 }
    },
    zhuque: {
      fullskin: true,
      type: "equip",
      subtype: "equip1",
      distance: { attackFrom: -3 },
      ai: {
        basic: {
          equipValue: 2
        }
      },
      skills: ["zhuque_skill"]
    },
    guding: {
      fullskin: true,
      type: "equip",
      subtype: "equip1",
      distance: { attackFrom: -1 },
      ai: {
        basic: {
          equipValue: 2
        }
      },
      skills: ["guding_skill"]
    },
    tengjia: {
      fullskin: true,
      type: "equip",
      subtype: "equip2",
      ai: {
        basic: {
          equipValue: function(card, player) {
            var num = 3;
            for (var i = 0; i < game.players.length; i++) {
              if (ai.get.attitude(game.players[i], player) < 0) num--;
            }
            if (player.hp == 1) num += 4;
            if (player.hp == 2) num += 1;
            if (player.hp == 3) num--;
            if (player.hp > 3) num -= 4;
            return num;
          }
        }
      },
      skills: ["tengjia1", "tengjia2"]
    },
    baiyin: {
      fullskin: true,
      type: "equip",
      subtype: "equip2",
      onLose: function() {
        player.recover();
      },
      filterLose: function(card, player) {
        return player.hp < player.maxHp;
      },
      skills: ["baiyin_skill"],
      tag: {
        recover: 1
      },
      ai: {
        order: 9.5,
        basic: {
          equipValue: function(card, player) {
            if (player.hp == player.maxHp) return 5;
            if (player.num("h", "baiyin")) return 6;
            return 0;
          }
        }
      }
    }
  },
  skill: {
    huogong2: {},
    jiu: {
      trigger: { source: "damageBegin" },
      filter: function(event) {
        return (event.card && (event.card.name == "sha") && event.parent.name != "_lianhuan" && event.parent.name != "_lianhuan2");
      },
      forced: true,
      content: function() {
        trigger.num++;
      },
      group: "jiu2"
    },
    jiu2: {
      trigger: { player: "useCardAfter" },
      filter: function(event) {
        return (event.card && (event.card.name == "sha"));
      },
      forced: true,
      popup: false,
      content: function() {
        player.removeSkill("jiu");
      }
    },
    guding_skill: {
      trigger: { source: "damageBegin" },
      filter: function(event) {
        if (event.card && event.card.name == "sha") {
          if (event.player.get("h").length == 0) return true;
        }
        return false;
      },
      forced: true,
      content: function() {
        trigger.num++;
      },
      ai: {
        effect: {
          target: function(card, player, target, current) {
            if (card.name == "sha" && target.get("h").length == 0) return [1, -2];
          }
        }
      }
    },
    tengjia1: {
      trigger: { target: "useCardToBefore" },
      forced: true,
      priority: 6,
      filter: function(event, player) {
        if (event.player.num("s", "unequip")) return false;
        if (event.card.name == "nanman") return true;
        if (event.card.name == "wanjian") return true;
        if (event.card.name == "sha" && !event.card.nature) return true;
      },
      content: function() {
        trigger.untrigger();
        trigger.finish();
      },
      ai: {
        effect: {
          target: function(card, player, target, current) {
            if (player.num("s", "unequip")) return;
            if (card.name == "nanman" || card.name == "wanjian") return 0;
            if (card.name == "sha") {
              var equip1 = player.get("e", "1");
              if (equip1 && equip1.name == "zhuque") return 2;
              if (equip1 && equip1.name == "qinggang") return 1;
              if (!card.nature) return 0;
            }
          }
        }
      }
    },
    tengjia2: {
      trigger: { player: "damageBegin" },
      filter: function(event) {
        if (event.nature == "fire") return true;
      },
      forced: true,
      content: function() {
        trigger.num++;
      },
      ai: {
        effect: {
          target: function(card, player, target, current) {
            if (card.name == "sha") {
              if (card.nature == "fire" || player.skills.contains("zhuque_skill")) return 2;
            }
            if (get.tag(card, "fireDamage") && current < 0) return 2;
          }
        }
      }
    },
    baiyin_skill: {
      trigger: { player: "damageBegin" },
      forced: true,
      filter: function(event, player) {
        if (event.num <= 1) return false;
        if (event.parent.player.num("s", "unequip")) return false;
        return true;
      },
      priority: -10,
      content: function() {
        trigger.num = 1;
      }
    },
    zhuque_skill: {
      trigger: { player: "useCardToBefore" },
      priority: 7,
      filter: function(event, player) {
        if (event.card.name == "sha" && !event.card.nature) return true;
      },
      check: function(event, player) {
        var att = ai.get.attitude(player, event.target);
        if (event.target.hasSkillTag("nofire")) {
          return att > 0;
        }
        return att <= 0;
      },
      content: function() {
        trigger.card.nature = "fire";
        player.addSkill("zhuque_skill2");
        player.storage.zhuque_skill = trigger.card;
      }
    },
    zhuque_skill2: {
      trigger: { player: "useCardAfter" },
      forced: true,
      popup: false,
      content: function() {
        delete player.storage.zhuque_skill.nature;
      }
    },
    huogon2: {}
  },
  translate: {
    jiu: "酒",
    huogong: "火攻",
    tiesuo: "铁锁连环",
    huogong_bg: "攻",
    tiesuo_bg: "锁",
    _chongzhu: "重铸",
    _lianhuan: "连环",
    _lianhuan2: "连环",
    bingliang: "兵粮寸断",
    hualiu: "骅骝",
    zhuque: "朱雀羽扇",
    bingliang_bg: "粮",
    bingliang_info: "目标角色判定阶段进行判定：若判定结果不为梅花，则跳过该角色的摸牌阶段。",
    hualiu_bg: "+马",
    zhuque_bg: "扇",
    zhuque_skill: "朱雀羽扇",
    zhuque_info: "你可以将一张普通【杀】当具火焰伤害的【杀】使用。",
    guding: "古锭刀",
    guding_info: "锁定技，当你使用【杀】对目标角色造成伤害时，若其没有手牌，此伤害+1。",
    guding_skill: "古锭刀",
    tengjia: "藤甲",
    tengjia_info: "锁定技，【南蛮入侵】、【万箭齐发】和普通【杀】对你无效。你每次受到火焰伤害时，该伤害+1。",
    tengjia1: "藤甲",
    tengjia2: "藤甲",
    baiyin: "白银狮子",
    baiyin_info: "锁定技，你每次受到伤害时，最多承受1点伤害（防止多余的伤害）；当你失去装备区里的【白银狮子】时，你回复1点体力。",
    baiyin_skill: "白银狮子",
    _baiyin: "白银狮子"
  },
  list: [
    ["heart", 4, "sha", "fire"],
    ["heart", 7, "sha", "fire"],
    ["heart", 10, "sha", "fire"],
    ["diamond", 4, "sha", "fire"],
    ["diamond", 5, "sha", "fire"],
    ["spade", 4, "sha", "thunder"],
    ["spade", 5, "sha", "thunder"],
    ["spade", 6, "sha", "thunder"],
    ["spade", 7, "sha", "thunder"],
    ["spade", 8, "sha", "thunder"],
    ["club", 5, "sha", "thunder"],
    ["club", 6, "sha", "thunder"],
    ["club", 7, "sha", "thunder"],
    ["club", 8, "sha", "thunder"],
    ["heart", 8, "shan"],
    ["heart", 9, "shan"],
    ["heart", 11, "shan"],
    ["heart", 12, "shan"],
    ["diamond", 6, "shan"],
    ["diamond", 7, "shan"],
    ["diamond", 8, "shan"],
    ["diamond", 10, "shan"],
    ["diamond", 11, "shan"],
    ["heart", 5, "tao"],
    ["heart", 6, "tao"],
    ["diamond", 2, "tao"],
    ["diamond", 3, "tao"],
    ["diamond", 9, "jiu"],
    ["spade", 3, "jiu"],
    ["spade", 9, "jiu"],
    ["club", 3, "jiu"],
    ["club", 9, "jiu"],

    ["diamond", 13, "hualiu"],
    ["club", 1, "baiyin"],
    ["spade", 2, "tengjia", "fire"],
    ["club", 2, "tengjia", "fire"],
    ["spade", 2, "guding"],
    ["diamond", 2, "zhuque", "fire"],

    ["heart", 2, "huogong", "fire"],
    ["heart", 3, "huogong", "fire"],
    ["diamond", 12, "huogong", "fire"],
    ["spade", 11, "tiesuo"],
    ["spade", 12, "tiesuo"],
    ["club", 10, "tiesuo"],
    ["club", 11, "tiesuo"],
    ["club", 12, "tiesuo"],
    ["club", 13, "tiesuo"],
    ["heart", 13, "wuxie"],
    ["heart", 13, "wuxie"],
    ["spade", 13, "wuxie"],
    ["spade", 10, "bingliang"],
    ["club", 4, "bingliang"]
  ]
};
