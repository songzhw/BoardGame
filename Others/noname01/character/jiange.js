character.jiange = {
  character: {
    jg_pangtong: ["male", "shu", 3, ["qiwu", "tianyu"], ["fullskin"]],
    jg_huangyueying: ["female", "shu", 3, ["zhinang", "jingmiao"], ["fullskin"]],
    jg_zhugeliang: ["male", "shu", 3, ["biantian", "bazhen"], ["fullskin"]],
    jg_liubei: ["male", "shu", 4, ["jizhen", "lingfeng"], ["fullskin"]],
    jg_xiahouyuan: ["male", "wei", 4, ["shensu", "juechen"], ["fullskin"]],
    jg_caozhen: ["male", "wei", 4, ["chiying", "jingfan"], ["fullskin"]],
    jg_zhanghe: ["male", "wei", 4, ["huodi", "jueji"], ["fullskin"]],
    jg_simayi: ["male", "wei", 6, ["xuanlei", "sfanshi", "konghun"], ["fullskin"]]
  },
  skill: {
    sfanshi: {
      init: function(player) {
        player.maxHp = Math.floor(game.players.length / 2) + 2;
        player.hp = player.maxHp;
        player.update();
      },
      trigger: { global: "dieAfter" },
      forced: true,
      content: function() {
        player.maxHp = Math.floor(game.players.length / 2) + 2;
        player.hp = Math.min(player.hp, player.maxHp);
        player.update();
      },
      group: "sfanshi2",
      ai: {
        mingzhi: false
      }
    },
    sfanshi2: {
      trigger: { player: "phaseEnd" },
      forced: true,
      check: function() {
        return false;
      },
      content: function() {
        player.loseHp();
      }
    },
    konghun: {
      trigger: { player: "phaseUseBegin" },
      direct: true,
      filter: function(event, player) {
        return player.hp <= Math.floor(game.players.length / 3);
      },
      content: function() {
        "step 0";
        player.chooseTarget("是否发动【控魂】？", function(card, player, target) {
          return player != target;
        }, [1, Math.floor(game.players.length / 2)]).ai = function(target) {
          return ai.get.damageEffect(target, player, player, "thunder") + 1;
        };
        "step 1";
        if (result.bool) {
          event.targets = result.targets.slice(0);
          player.logSkill("konghun", event.targets, "thunder");
          event.targets.sort(lib.sort.seat);
          event.num = 0;
        } else {
          event.finish();
        }
        "step 2";
        if (event.num < event.targets.length) {
          event.targets[event.num].damage("thunder");
          event.num++;
          event.redo();
        }
        "step 3";
        player.recover(event.targets.length);
      }
    },
    xuanlei: {
      trigger: { player: "phaseBegin" },
      forced: true,
      filter: function(event, player) {
        for (var i = 0; i < game.players.length; i++) {
          if (game.players[i] != player && game.players[i].num("j")) return true;
        }
        return false;
      },
      content: function() {
        "step 0";
        event.targets = [];
        for (var i = 0; i < game.players.length; i++) {
          if (game.players[i] != player && game.players[i].num("j")) {
            event.targets.push(game.players[i]);
          }
        }
        event.targets.sort(lib.sort.seat);
        "step 1";
        if (event.targets.length) {
          event.targets.shift().damage("thunder");
        }
      }
    },
    jueji: {
      trigger: { global: "phaseDrawBegin" },
      direct: true,
      filter: function(event, player) {
        return event.num > 0 && event.player != player && event.player.hp < event.player.maxHp && player.num("he");
      },
      content: function() {
        "step 0";
        player.chooseToDiscard("he", "是否弃置一张牌令" + get.translation(trigger.player) + "的摸牌数-1？").ai = function(card) {
          if (ai.get.attitude(player, trigger.player) < 0) {
            return 6 - ai.get.value(card);
          }
          return 0;
        };
        "step 1";
        if (result.bool) {
          player.logSkill("jueji", trigger.player);
          trigger.num--;
        }
      },
      ai: {
        expose: 0.2,
        threaten: 1.8
      }
    },
    huodi: {
      trigger: { player: "phaseEnd" },
      direct: true,
      filter: function(event, player) {
        return !player.skills.contains("huodi3");
      },
      content: function() {
        "step 0";
        player.chooseTarget("是否发动【惑敌】？", function(card, player, target) {
          return target.num("he") && player != target;
        }).ai = function(target) {
          return -ai.get.attitude(player, target);
        };
        "step 1";
        if (result.bool) {
          player.logSkill("huodi", result.targets);
          player.discardPlayerCard(result.targets[0], true, "he");
        }
      },
      ai: {
        expose: 0.2,
        threaten: 1.2
      },
      group: "huodi2"
    },
    huodi2: {
      trigger: { player: "useCard" },
      filter: function(event, player) {
        return _status.currentPhase == player && event.targets && (event.targets.length > 1 || event.targets[0] != player);
      },
      silent: true,
      forced: true,
      popup: false,
      content: function() {
        player.addTempSkill("huodi3", "phaseAfter");
      }
    },
    huodi3: {},
    jingfan: {
      trigger: { player: "phaseUseEnd" },
      unique: true,
      direct: true,
      content: function() {
        "step 0";
        var num = get.cardCount(true, player) - player.num("h");
        event.num = num;
        if (num > 0) {
          player.draw(num);
        }
        "step 1";
        if (event.num > 0) {
          player.chooseTarget("选择至多" + get.cnNumber(event.num) + "名角色令其与其他角色的距离－1", [1, event.num], function(card, player, target) {
            return player != target;
          }).ai = function(target) {
            return ai.get.attitude(player, target);
          };
        } else {
          event.finish();
        }
        "step 2";
        if (result.bool && result.targets) {
          player.logSkill("jingfan", result.targets);
          for (var i = 0; i < result.targets.length; i++) {
            result.targets[i].addSkill("jingfan2");
            result.targets[i].popup("jingfan");
          }
        }
      },
      mod: {
        globalFrom: function(from, to, distance) {
          if (_status.currentPhase == from) {
            return distance - get.cardCount(true, from);
          }
        }
      },
      ai: {
        expose: 0.1
      }
    },
    jingfan2: {
      mod: {
        globalFrom: function(from, to, distance) {
          return distance - 1;
        }
      },
      trigger: { player: "phaseEnd" },
      forced: true,
      content: function() {
        player.removeSkill("jingfan2");
      }
    },
    chiying: {
      trigger: { global: "damageBegin" },
      check: function(event, player) {
        return ai.get.attitude(player, event.player) > 0;
      },
      filter: function(event, player) {
        if (event.num <= 1) return false;
        return true;
      },
      priority: -11,
      content: function() {
        trigger.num = 1;
        if (trigger.source) {
          trigger.source.addTempSkill("chiying2", "damageAfter");
        }
      }
    },
    chiying2: {
      trigger: { source: "damageEnd" },
      forced: true,
      popup: false,
      content: function() {
        player.draw();
      }
    },
    juechen: {
      trigger: { player: "useCard" },
      filter: function(event, player) {
        return event.card.name == "sha";
      },
      direct: true,
      content: function() {
        "step 0";
        game.delay(0.5);
        player.chooseTarget("是否发动【绝尘】？", function(card, player, target) {
          return player != target && !trigger.targets.contains(target) && target.num("he") > 0;
        }).ai = function(target) {
          return -ai.get.attitude(player, target);
        };
        "step 1";
        if (result.bool) {
          player.logSkill("juechen", result.targets);
          player.discardPlayerCard(true, result.targets[0], "he");
        }
      }
    },
    lingfeng: {
      trigger: { player: "phaseDrawBefore" },
      check: function(event, player) {
        for (i = 0; i < game.players.length; i++) {
          if (player != game.players[i]) {
            if (ai.get.attitude(player, game.players[i]) < 0) return true;
          }
        }
        return false;
      },
      content: function() {
        "step 0";
        trigger.untrigger();
        trigger.finish();
        event.cards = get.cards(2);
        player.showCards(event.cards);
        "step 1";
        if (get.color(event.cards[0]) != get.color(event.cards[1])) {
          player.chooseTarget("是否弃置一名角色一张牌？", function(card, player, target) {
            return player != target && target.num("he") > 0;
          }).ai = function(target) {
            return -ai.get.attitude(player, target);
          };
        }
        "step 2";
        if (result.bool && result.targets && result.targets.length) {
          player.discardPlayerCard(result.targets[0], "he", true);
        }
        "step 3";
        player.gain(event.cards);
        player.$draw(event.cards);
        game.delay();
      },
      ai: {
        threaten: 1.1
      }
    },
    biantian4: {
      trigger: { player: "dieBegin" },
      forced: true,
      popup: false,
      content: function() {
        for (var i = 0; i < game.players.length; i++) {
          if (game.players[i].skills.contains("biantian3")) {
            game.players[i].removeSkill("biantian3");
            game.players[i].popup("biantian3");
          }
        }
      }
    },
    biantian: {
      trigger: { player: "phaseBegin" },
      forced: true,
      unique: true,
      group: "biantian4",
      content: function() {
        "step 0";
        player.removeSkill("biantian2");
        for (var i = 0; i < game.players.length; i++) {
          if (game.players[i].skills.contains("biantian3")) {
            game.players[i].removeSkill("biantian3");
            game.players[i].popup("biantian3");
          }
        }
        player.judge(function(card) {
          if (get.color(card) == "red") return 1;
          if (get.suit(card) == "spade") return 3;
          return -1;
        });
        "step 1";
        if (result.color == "red") {
          player.chooseTarget("选择至多三名角色获得狂风标记", [1, 3], function(card, player, target) {
            return player != target;
          }).ai = function(target) {
            if (target.hasSkillTag("nofire")) return 0;
            return -ai.get.attitude(player, target);
          };
        } else {
          event.finish();
          if (result.suit == "spade") {
            player.addSkill("biantian2");
          }
        }
        "step 2";
        if (result.bool && result.targets) {
          for (var i = 0; i < result.targets.length; i++) {
            result.targets[i].addSkill("biantian3");
            result.targets[i].popup("kuangfeng");
          }
          player.logSkill("kuangfeng", result.targets, "fire");
        }
      }
    },
    biantian2: {
      trigger: { player: "damageBefore" },
      filter: function(event) {
        if (event.nature != "thunder") return true;
        return false;
      },
      forced: true,
      content: function() {
        trigger.untrigger();
        trigger.finish();
      },
      ai: {
        nofire: true,
        nodamage: true,
        effect: {
          target: function(card, player, target, current) {
            if (get.tag(card, "damage") && !get.tag(card, "thunderDamage")) return [0, 0];
          }
        }
      }
    },
    biantian3: {
      trigger: { player: "damageBegin" },
      filter: function(event) {
        if (event.nature == "fire") return true;
        return false;
      },
      forced: true,
      content: function() {
        trigger.num++;
      },
      ai: {
        effect: {
          target: function(card, player, target, current) {
            if (get.tag(card, "fireDamage")) return 1.5;
          }
        }
      }
    },
    jingmiao: {
      trigger: { global: "useCardAfter" },
      direct: true,
      filter: function(event, player) {
        return event.player != player && event.card.name == "wuxie" && event.player.num("he") > 0;
      },
      content: function() {
        "step 0";
        player.choosePlayerCard(trigger.player, "是否发动【精妙】弃置" +
          get.translation(trigger.player) + "一张牌？", "he");
        "step 1";
        if (result.bool) {
          player.logSkill("jingmiao", trigger.player);
          trigger.player.discard(result.links);
        }
      },
      ai: {
        expose: 0.2
      }
    },
    zhinang: {
      trigger: { player: "phaseBegin" },
      frequent: true,
      content: function() {
        "step 0";
        event.cards = get.cards(3);
        event.cards2 = [];
        for (var i = 0; i < event.cards.length; i++) {
          var type = get.type(event.cards[i]);
          if (type == "trick" || type == "equip") {
            event.cards2.push(event.cards[i]);
          }
        }
        if (event.cards2.length == 0) {
          player.showCards(event.cards);
          event.target = player;
        } else {
          var dialog = ui.create.dialog("将三张牌中的锦囊牌或装备牌交给一名角色");
          dialog.add(event.cards);
          for (var i = 0; i < dialog.buttons.length; i++) {
            if (event.cards2.contains(dialog.buttons[i].link)) {
              dialog.buttons[i].style.opacity = 1;
            } else {
              dialog.buttons[i].style.opacity = 0.5;
            }
          }
          var next = player.chooseTarget(true, dialog);
          next.ai = function(target) {
            if (player.num("j", "lebu")) {
              if (target == player) return 0;
            }
            var att = ai.get.attitude(player, target);
            if (player.num("h") > player.hp) {
              if (target == player) return Math.max(1, att - 2);
            }
            if (target == player) return att + 5;
            return att;
          };
          if (!event.isMine()) {
            dialog.style.display = "none";
          }
        }
        "step 1";
        if (result && result.targets && result.targets.length) {
          event.target = result.targets[0];
        }
        if (event.cards2.length) {
          event.target.gain(event.cards2, "gain");
        }
      },
      ai: {
        threaten: 1.3
      }
    },
    qiwu: {
      trigger: { player: "useCard" },
      forced: true,
      filter: function(event, player) {
        return get.suit(event.card) == "club" && player.hp < player.maxHp;
      },
      content: function() {
        player.recover();
      }
    },
    tianyu: {
      trigger: { player: "phaseEnd" },
      direct: true,
      filter: function(event, player) {
        for (var i = 0; i < game.players.length; i++) {
          if (!game.players[i].isLinked() && player != game.players[i]) {
            return true;
          }
        }
      },
      content: function() {
        "step 0";
        var num = 0;
        for (var i = 0; i < game.players.length; i++) {
          if (!game.players[i].isLinked() && player != game.players[i]) {
            num++;
          }
        }
        player.chooseTarget("是否发动【天狱】？", [1, num], function(card, player, target) {
          return !target.isLinked() && player != target;
        }).ai = function(target) {
          return -ai.get.attitude(player, target);
        };
        "step 1";
        if (result.bool) {
          player.logSkill("tianyu", result.targets);
          event.targets = result.targets;
          event.num = 0;
        } else {
          event.finish();
        }
        "step 2";
        if (event.num < event.targets.length) {
          event.targets[event.num].link();
          event.num++;
          event.redo();
        }
      },
      ai: {
        expose: 0.3
      }
    },
    jizhen: {
      trigger: { player: "phaseEnd" },
      direct: true,
      filter: function(event, player) {
        for (var i = 0; i < game.players.length; i++) {
          if (game.players[i].hp < game.players[i].maxHp && player != game.players[i]) {
            return true;
          }
        }
      },
      content: function() {
        "step 0";
        var num = 0;
        for (var i = 0; i < game.players.length; i++) {
          if (!game.players[i].isLinked() && player != game.players[i]) {
            num++;
          }
        }
        player.chooseTarget("是否发动【激阵】？", [1, 2], function(card, player, target) {
          return target.hp < target.maxHp && player != target;
        }).ai = function(target) {
          return ai.get.attitude(player, target);
        };
        "step 1";
        if (result.bool) {
          player.logSkill("jizhen", result.targets);
          game.asyncDraw(result.targets);
        }
      },
      ai: {
        expose: 0.3,
        threaten: 1.3
      }
    }
  },
  translate: {
    jg_pangtong: "浴火士元",
    jg_huangyueying: "工神月英",
    jg_zhugeliang: "天侯孔明",
    jg_liubei: "烈帝玄德",
    jg_xiahouyuan: "绝尘妙才",
    jg_caozhen: "佳人子丹",
    jg_zhanghe: "巧魁儁乂",
    jg_simayi: "断狱仲达",
    qiwu: "栖梧",
    tianyu: "天狱",
    zhinang: "智囊",
    jingmiao: "精妙",
    biantian: "变天",
    biantian2: "大雾",
    biantian3: "狂风",
    jizhen: "激阵",
    xuanlei: "玄雷",
    xuanlei_info: "锁定技，准备阶段，你令所有判定区内有牌的其他角色受到1点雷电伤害",
    sfanshi: "反噬",
    sfanshi2: "反噬",
    sfanshi_info: "锁定技，你的体力上限为场上存活角色数的一半+2（向下取整），结束阶段，你失去1点体力",
    konghun: "控魂",
    konghun_info: "出牌阶段开始时，若你的体力值不大于1（场上存活角色数不小于6时改为2），你可以对至多X名角色各造成1点雷电伤害，然后你恢复等量体力，X为场上存活角色数的一半（向下取整）",
    jizhen_info: "结束阶段，你可以令所至多两名已受伤角色摸一张牌",
    // biantian2_info:'已获得大雾标记',
    // biantian3_info:'已获得狂风标记',
    lingfeng: "灵锋",
    jueji: "绝汲",
    huodi: "惑敌",
    huodi_info: "回合结束阶段，若你本回合内没有使用过指定其他角色为目标的卡牌，你可以弃置一名其他角色的一张牌",
    jueji_info: "其他角色的摸牌阶段开始时，若其已受伤，你可以弃置一张牌令其摸牌数-1",
    lingfeng_info: "摸牌阶段，你可以弃置摸牌，改为亮出牌堆顶的两张牌并获得之，若两张牌颜色不同，你可以弃置一名角色的一张牌",
    biantian_info: "锁定技，准备阶段，你进行一次判定，若为红色，你可以选择至多三名角色进入“狂风”状态直到你的下一回合开始，若为黑桃，直到下个回合开始前，你处于“大雾”状态",
    jingmiao_info: "每当有一名其他角色使用无懈可击，你可以弃置其一张牌",
    zhinang_info: "准备阶段，你可以亮出牌堆顶的三张牌，你可以将其中锦囊或装备牌交给一名角色，然后将其余牌置入弃牌堆",
    qiwu_info: "锁定技。每当你使用一张梅花牌，你回复一点体力",
    tianyu_info: "回合结束阶段，你可以将任意名未横置的其他角色横置",
    juechen: "绝尘",
    juechen_info: "每当你使用一张杀，可以弃置一名其他角色的一张牌（不能是杀的目标）",
    chiying: "持盈",
    chiying_info: "每当一名角色受到多于1伤害时，你可以令其防止其余伤害，然后令伤害来源摸一张牌",
    jingfan: "惊帆",
    jingfan2: "惊帆",
    jingfan_info: "回合内，每当你使用一张卡牌，你与其他角色的距离－1；出牌阶段结束时，你可以将手牌数补至X，并指定至多X名角色令其与其他角色的距离－1直到其下一回合结束，X为你回合内使用的卡牌数"

  }
};
