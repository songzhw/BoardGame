character.refresh = {
  character: {
    re_caocao: ["male", "wei", 4, ["hujia", "rejianxiong"], ["zhu", "fullskin"]],
    re_simayi: ["male", "wei", 3, ["refankui", "reguicai"], ["fullskin"]],
    re_guojia: ["male", "wei", 3, ["tiandu", "reyiji"], ["fullskin"]],
    re_lidian: ["male", "wei", 3, ["xunxun", "wangxi"], ["fullskin"]],
    re_zhangliao: ["male", "wei", 4, ["retuxi"], ["fullskin"]],
    re_xuzhu: ["male", "wei", 4, ["reluoyi"], ["fullskin"]],
    re_xiahoudun: ["male", "wei", 4, ["reganglie", "qingjian"], ["fullskin"]],
    re_zhangfei: ["male", "shu", 4, ["paoxiao", "retishen"], ["fullskin"]],
    re_zhaoyun: ["male", "shu", 4, ["longdan", "reyajiao"], ["fullskin"], ["fullskin"]],
    re_guanyu: ["male", "shu", 4, ["wusheng", "yijue"], ["fullskin"]],
    re_machao: ["male", "shu", 4, ["mashu", "retieji"], ["fullskin"]],
    re_xushu: ["male", "shu", 4, ["zhuhai", "qianxin"], ["fullskin"]],
    re_zhouyu: ["male", "wu", 3, ["reyingzi", "refanjian"], ["fullskin"]],
    re_lvmeng: ["male", "wu", 4, ["keji", "qinxue"], ["fullskin"]],
    re_ganning: ["male", "wu", 4, ["qixi", "fenwei"], ["fullskin"]],
    re_luxun: ["male", "wu", 3, ["reqianxun", "relianying"], ["fullskin"]],
    re_daqiao: ["female", "wu", 3, ["reguose", "liuli"], ["fullskin"]],
    re_huanggai: ["male", "wu", 4, ["rekurou", "zhaxiang"], ["fullskin"]],
    re_lvbu: ["male", "qun", 5, ["wushuang"], ["fullskin"]],
    re_gongsunzan: ["male", "qun", 4, ["qiaomeng", "reyicong"], ["fullskin"]],
    re_huatuo: ["male", "qun", 3, ["chulao", "jijiu"], ["fullskin"]]
  },
  skill: {
    reqicai: {
      trigger: { player: "equipEnd" },
      frequent: true,
      content: function() {
        player.draw();
      },
      mod: {
        targetInRange: function(card, player, target, now) {
          var type = get.type(card);
          if (type == "trick" || type == "delay") return true;
        }
      }
    },
    rejizhi: {
      trigger: { player: "useCard" },
      frequent: true,
      filter: function(event) {
        var type = get.type(event.card, "trick");
        return (type == "trick" || type == "equip") && event.cards[0] && event.cards[0] == event.card;
      },
      content: function() {
        "step 0";
        var cards = get.cards();
        player.gain(cards, "gain2");
        game.log(get.translation(player) + "获得了" + get.translation(cards));
        if (get.type(cards[0]) != "basic") {
          event.finish();
        }
        "step 1";
        player.chooseToDiscard("h", true);
      },
      ai: {
        threaten: 1.4
      }
    },
    retuxi: {
      trigger: { player: "phaseDrawBefore" },
      direct: true,
      content: function() {
        "step 0";
        player.chooseTarget("是否发动突袭?", [1, 2], function(card, player, target) {
          return target.num("h") > 0 && player != target && target.num("h") >= player.num("h");
        }, function(target) {
          return (1 - ai.get.attitude(_status.event.player, target));
        });
        "step 1";
        if (result.bool) {
          player.logSkill("retuxi");
          for (var i = 0; i < result.targets.length; i++) {
            player.gain(result.targets[i].get("h").randomGet());
            result.targets[i].$give(1, player);
          }
          trigger.num -= result.targets.length;
        }
      },
      ai: {
        threaten: 1.6,
        expose: 0.2
      }
    },
    reguicai: {
      trigger: { global: "judge" },
      direct: true,
      filter: function(event, player) {
        return player.num("he") > 0;
      },
      content: function() {
        "step 0";
        player.chooseCard("鬼才：请选择代替判定的牌", "he").ai = function(card) {
          var trigger = _status.event.parent._trigger;
          var player = _status.event.player;
          var result = trigger.judge(card) - trigger.judge(trigger.player.judging);
          var attitude = ai.get.attitude(player, trigger.player);
          if (attitude == 0 || result == 0) return 0;
          if (attitude > 0) {
            return result - ai.get.value(card) / 2;
          } else {
            return -result - ai.get.value(card) / 2;
          }
        };
        "step 1";
        if (result.bool) {
          player.respond(result.cards);
        } else {
          event.finish();
        }
        "step 2";
        if (result.bool) {
          player.logSkill("reguicai");
          if (trigger.player.judging.clone) trigger.player.judging.clone.delete();
          ui.discardPile.appendChild(trigger.player.judging);
          trigger.player.judging = result.cards[0];
          game.delay(2);
        }
      },
      ai: {
        tag: {
          rejudge: 1
        }
      }
    },
    refankui: {
      trigger: { player: "damageEnd" },
      direct: true,
      filter: function(event, player) {
        return (event.source && event.source.num("he"));
      },
      content: function() {
        "step 0";
        event.num = trigger.num;
        "step 1";
        if (num == 0 || trigger.source.num("he") == 0) {
          event.finish();
          return;
        }
        event.num--;
        player.choosePlayerCard(trigger.source, ai.get.buttonValue, "he");
        "step 2";
        if (result.bool) {
          player.logSkill("refankui", trigger.source);
          player.gain(result.buttons[0].link);
          trigger.source.$give(1, player);
          event.goto(1);
        }
      },
      ai: {
        result: {
          target: function(card, player, target) {
            if (player.num("he") > 1 && get.tag(card, "damage")) {
              if (player.skills.contains("jueqing")) return [1, -1.5];
              if (ai.get.attitude(target, player) < 0) return [1, 1];
            }
          }
        }
      }
    },
    reluoyi: {
      trigger: { player: "phaseDrawBegin" },
      check: function(event, player) {
        if (player.num("h", "sha")) return true;
        return Math.random() < 0.5;
      },
      content: function() {
        "step 0";
        player.addTempSkill("luoyi2", { player: "phaseBefore" });
        trigger.untrigger();
        trigger.finish();
        "step 1";
        event.cards = get.cards(3);
        event.dialog = ui.create.dialog("裸衣", event.cards);
        game.delay(2);
        "step 2";
        event.dialog.close();
        for (var i = 0; i < cards.length; i++) {
          if (get.type(cards[i], "trick") == "trick" && cards[i].name != "juedou") {
            ui.discardPile.appendChild(cards[i]);
            cards.splice(i, 1);
            i--;
          } else if (get.type(cards[i]) == "equip" && get.subtype(cards[i]) != "equip1") {
            ui.discardPile.appendChild(cards[i]);
            cards.splice(i, 1);
            i--;
          }
        }
        player.gain(cards);
      }
    },
    reluoyi2: {
      trigger: { source: "damageBegin" },
      filter: function(event) {
        return (event.card && (event.card.name == "sha" || event.card.name == "juedou"));
      },
      forced: true,
      content: function() {
        trigger.num++;
      }
    },
    reganglie: {
      trigger: { player: "damageEnd" },
      filter: function(event, player) {
        return (event.source != undefined);
      },
      check: function(event, player) {
        return (ai.get.attitude(player, event.source) <= 0);
      },
      content: function() {
        "step 0";
        player.judge(function(card) {
          if (get.color(card) == "red") return 2;
          return 1;
        });
        "step 1";
        if (result.judge == 1 && trigger.source.num("he")) {
          player.discardPlayerCard(trigger.source, "he", true);
        } else {
          if (result.judge == 2) {
            trigger.source.damage();
          }
        }
      },
      ai: {
        expose: 0.4
      }
    },
    qinxue: {
      unique: true,
      trigger: { player: "phaseBegin" },
      forced: true,
      filter: function(event, player) {
        if (player.storage.qinxue) return false;
        if (player.num("h") >= player.hp + 3) return true;
        if (player.num("h") >= player.hp + 2 && game.players.length + game.dead.length >= 7) return true;
        return false;
      },
      content: function() {
        if (lib.config.mode != "guozhan" || player.maxHp >= 4) {
          player.loseMaxHp();
        }
        player.addSkill("gongxin");
      }
    },
    qingjian: {
      unique: true,
      trigger: { player: "gainAfter" },
      direct: true,
      filter: function(event) {
        if (event.parent.parent.name == "phaseDraw") return false;
        return event.cards && event.cards.length > 0;
      },
      content: function() {
        "step 0";
        event.cards = trigger.cards.slice(0);
        "step 1";
        player.chooseCardTarget({
          filterCard: function(card) {
            return _status.event.parent.cards.contains(card);
          },
          selectCard: [1, event.cards.length],
          filterTarget: function(card, player, target) {
            return player != target;
          },
          ai1: function(card) {
            if (ui.selected.cards.length > 0) return -1;
            return (_status.event.player.num("h") - _status.event.player.hp);
          },
          ai2: function(target) {
            if (target.num("h") > player.num("h")) return 0;
            return ai.get.attitude(_status.event.player, target) - 4;
          },
          prompt: "请选择要送人的卡牌"
        });
        "step 2";
        if (result.bool) {
          player.logSkill("qingjian", result.targets);
          result.targets[0].gain(result.cards);
          player.$give(result.cards.length, result.targets[0]);
          for (var i = 0; i < result.cards.length; i++) {
            event.cards.remove(result.cards[i]);
          }
          if (event.cards.length) event.goto(1);
        }
      },
      ai: {
        expose: 0.3
      }
    },
    reyingzi: {
      trigger: { player: "phaseDrawBegin" },
      forced: true,
      content: function() {
        trigger.num++;
      },
      ai: {
        threaten: 1.5
      },
      mod: {
        maxHandcard: function(player, num) {
          if (player.hp < player.maxHp) return num + player.maxHp - player.hp;
        }
      }
    },
    refanjian: {
      enable: "phaseUse",
      usable: 1,
      filter: function(event, player) {
        return player.num("h") > 0;
      },
      filterTarget: function(card, player, target) {
        return player != target;
      },
      filterCard: true,
      check: function(card) {
        return 8 - ai.get.value(card);
      },
      discard: false,
      prepare: function(cards, player, targets) {
        player.$give(1, targets[0]);
      },
      content: function() {
        "step 0";
        target.storage.refanjian = cards[0];
        target.gain(cards[0]);
        "step 1";
        target.chooseControl("refanjian_card", "refanjian_hp").ai = function(event, player) {
          var cards = target.get("he", { suit: get.suit(player.storage.refanjian) });
          if (cards.length == 1) return 0;
          if (cards.length == 2) {
            for (var i = 0; i < cards.length; i++) {
              if (get.tag(cards[i], "save")) return 1;
            }
          }
          if (player.hp == 1) return 0;
          for (var i = 0; i < cards.length; i++) {
            if (ai.get.value(cards[i]) >= 8) return 1;
          }
          if (cards.length > 2 && player.hp > 2) return 1;
          if (cards.length > 3) return 1;
          return 0;
        };
        "step 2";
        if (result.control == "refanjian_card") {
          target.showHandcards();
        } else {
          target.loseHp();
          event.finish();
        }
        "step 3";
        target.discard(target.get("he", { suit: get.suit(target.storage.refanjian) }));
      },
      ai: {
        order: 9,
        result: {
          target: function(player, target) {
            return -target.num("he");
          }
        },
        threaten: 2
      }
    },
    reqianxun: {
      init: function(player) {
        player.storage.reqianxun2 = [];
      },
      trigger: { target: "useCardToBegin", player: "judgeAfter" },
      filter: function(event, player) {
        if (player.num("h") == 0) return false;
        if (event.parent.name == "phaseJudge") {
          return event.result.judge != 0;
        }
        if (event.name == "judge") return false;
        if (event.targets && event.targets.length > 1) return false;
        if (event.card && get.type(event.card) == "trick" && event.player != player) return true;
      },
      content: function() {
        player.storage.reqianxun2 = player.storage.reqianxun2.concat(player.get("h"));
        player.lose(player.get("h"), ui.special);
        player.addSkill("reqianxun2");
      },
      ai: {
        effect: function(card, player, target) {
          if (get.type(card, "trick") == "trick" && ui.selected.targets.length == 0) return [1, 1];
        }
      }
    },
    reqianxun2: {
      trigger: { global: "phaseAfter" },
      forced: true,
      content: function() {
        player.gain(player.storage.reqianxun2);
        player.removeSkill("reqianxun2");
        player.storage.reqianxun2 = [];
      },
      mark: true,
      intro: {
        content: "cardCount"
      }
    },
    relianying: {
      trigger: { player: "loseEnd" },
      direct: true,
      filter: function(event, player) {
        if (player.num("h")) return false;
        for (var i = 0; i < event.cards.length; i++) {
          if (event.cards[i].original == "h") return true;
        }
        return false;
      },
      content: function() {
        "step 0";
        var num = 0;
        for (var i = 0; i < trigger.cards.length; i++) {
          if (trigger.cards[i].original == "h") num++;
        }
        player.chooseTarget("选择发动连营的目标", [1, num]).ai = function(target) {
          if (player == target) return ai.get.attitude(player, target) + 10;
          return ai.get.attitude(player, target);
        };
        "step 1";
        if (result.bool) {
          player.logSkill("relianying", result.targets);
          for (var i = 0; i < result.targets.length; i++) {
            if (result.targets[i] != player) result.targets[i].popup("relianying");
            result.targets[i].draw();
          }
        }
      },
      ai: {
        threaten: 0.8,
        effect: {
          target: function(card) {
            if (card.name == "guohe" || card.name == "liuxinghuoyu") return 0.5;
          }
        }
      }
    },
    retishen: {
      unique: true,
      mark: true,
      trigger: { player: "phaseBegin" },
      init: function(player) {
        player.storage.retishen = false;
      },
      filter: function(event, player) {
        if (player.storage.retishen) return false;
        if (typeof player.storage.retishen2 == "number") {
          return player.hp < player.storage.retishen2;
        }
        return false;
      },
      check: function(event, player) {
        if (player.hp <= 1) return true;
        return player.hp < player.storage.retishen2 - 1;
      },
      content: function() {
        player.unmarkSkill("retishen");
        player.recover(player.storage.retishen2 - player.hp);
        player.draw(player.storage.retishen2 - player.hp);
        player.storage.retishen = true;
      },
      intro: {
        mark: function(dialog, content, player) {
          if (player.storage.retishen) return;
          if (typeof player.storage.retishen2 != "number") {
            return "上回合体力：无";
          }
          return "上回合体力：" + player.storage.retishen2;
        },
        content: "limited"
      },
      group: ["retishen2"]
    },
    retishen2: {
      trigger: { player: "phaseEnd" },
      priority: -10,
      forced: true,
      popup: false,
      silent: true,
      content: function() {
        player.storage.retishen2 = player.hp;
      },
      intro: {
        content: function(storage, player) {
          if (player.storage.retishen) return;
          return "上回合体力：" + storage;
        }
      }
    },
    reyajiao: {
      trigger: { player: ["respond", "useCard"] },
      frequent: true,
      filter: function(event, player) {
        return player != _status.currentPhase && get.itemtype(event.cards) == "cards";
      },
      content: function() {
        "step 0";
        event.card = get.cards()[0];
        event.node = event.card.copy("thrown", "center", ui.arena).animate("start");
        if (get.type(event.card, "trick") == get.type(trigger.card, "trick")) {
          player.chooseTarget("选择获得此牌的角色").ai = function(target) {
            var att = ai.get.attitude(player, target);
            if (att > 0) {
              return att + Math.max(0, 5 - target.num("h"));
            }
            return att;
          };
        } else {
          player.chooseBool("是否弃置" + get.translation(event.card) + "？");
          event.disbool = true;
        }
        game.delay(2);
        "step 1";
        if (event.disbool) {
          if (!result.bool) {
            game.log(get.translation(player) + "展示了" + get.translation(event.card));
            ui.cardPile.insertBefore(event.card, ui.cardPile.firstChild);
          } else {
            game.log(get.translation(player) + "展示并弃掉了" + get.translation(event.card));
            ui.discardPile.appendChild(event.card);
          }
        } else if (result.targets) {
          result.targets[0].gain(event.card);
          event.node.moveTo(result.targets[0]);
          game.log(get.translation(result.targets[0]) + "获得了" + get.translation(event.card));
        } else {
          game.log(get.translation(player) + "展示并弃掉了" + get.translation(event.card));
          ui.discardPile.appendChild(event.card);
        }
        event.node.delete();
      },
      ai: {
        effect: {
          target: function(card, player) {
            if (get.tag(card, "respond") && player.num("h") > 1) return [1, 0.2];
          }
        }
      }
    },
    rejianxiong: {
      trigger: { player: "damageEnd" },
      direct: true,
      content: function() {
        "step 0";
        if (get.itemtype(trigger.cards) == "cards" && get.position(trigger.cards[0]) == "d") {
          player.chooseControl("rejianxiong_mopai", "rejianxiong_napai", "cancel").ai = function() {
            if (trigger.cards.length == 1 && trigger.cards[0].name == "sha") return 0;
            return 1;
          };
        } else {
          player.chooseControl("rejianxiong_mopai", "cancel");
        }
        "step 1";
        if (result.control == "rejianxiong_napai") {
          player.logSkill("rejianxiong");
          player.gain(trigger.cards);
          player.$gain2(trigger.cards);
        } else if (result.control == "rejianxiong_mopai") {
          player.logSkill("rejianxiong");
          player.draw();
        }
      },
      ai: {
        maixie: true,
        effect: {
          target: function(card, player, target) {
            if (player.skills.contains("jueqing")) return [1, -1];
            if (get.tag(card, "damage") && player != target) return [1, 1];
          }
        }
      }
    },
    reyiji: {
      trigger: { player: "damageEnd" },
      frequent: true,
      filter: function(event) {
        return (event.num > 0);
      },
      content: function() {
        "step 0";
        event.num = 1;
        event.count = 1;
        "step 1";
        player.gain(get.cards(2));
        player.$draw(2);
        "step 2";
        player.chooseCardTarget({
          filterCard: true,
          selectCard: [1, 2],
          filterTarget: function(card, player, target) {
            return player != target && target != event.temp;
          },
          ai1: function(card) {
            if (ui.selected.cards.length > 0) return -1;
            return (_status.event.player.num("h") - _status.event.player.hp);
          },
          ai2: function(target) {
            return ai.get.attitude(_status.event.player, target) - 4;
          },
          prompt: "请选择要送人的卡牌"
        });
        "step 3";
        if (result.bool) {
          player.lose(result.cards, ui.special);
          if (result.targets[0].skills.contains("reyiji2")) {
            result.targets[0].storage.reyiji2 = result.targets[0].storage.reyiji2.concat(result.cards);
          } else {
            result.targets[0].addSkill("reyiji2");
            result.targets[0].storage.reyiji2 = result.cards;
          }
          player.$give(result.cards.length, result.targets[0]);
          if (num == 1) {
            event.temp = result.targets[0];
            event.num++;
            event.goto(2);
          } else if (event.count < trigger.num) {
            delete event.temp;
            event.num = 1;
            event.count++;
            event.goto(1);
          }
        }
      },
      ai: {
        maixie: true,
        result: {
          effect: function(card, player, target) {
            if (get.tag(card, "damage")) {
              if (player.skills.contains("jueqing")) return [1, -2];
              if (player.hp >= 4) return [1, get.tag(card, damage) * 2];
              if (target.hp == 3) return [1, get.tag(card, damage) * 1.5];
              if (target.hp == 2) return [1, get.tag(card, damage) * 0.5];
            }
          }
        },
        threaten: 0.6
      }
    },
    reyiji2: {
      trigger: { player: "phaseDrawBegin" },
      forced: true,
      mark: true,
      popup: "遗计拿牌",
      content: function() {
        player.$draw(player.storage.reyiji2.length);
        player.gain(player.storage.reyiji2);
        delete player.storage.reyiji2;
        player.removeSkill("reyiji2");
        game.delay();
      },
      intro: {
        content: "cardCount"
      }
    },
    yijue: {
      enable: "phaseUse",
      usable: 1,
      filterTarget: function(card, player, target) {
        return player != target && target.num("h");
      },
      filter: function(event, player) {
        return player.num("h") > 0;
      },
      content: function() {
        "step 0";
        player.chooseToCompare(target).small = true;
        "step 1";
        if (result.bool) {
          if (target.skills.contains("yijue2") == false) {
            target.disabledSkills.yijue = [];
            for (var i = 0; i < target.skills.length; i++) {
              if (!get.skillLocked(target.skills[i])) {
                target.disabledSkills.yijue.push(target.skills[i]);
              }
            }
            target.addSkill("yijue2");
          }
          event.finish();
        } else if (target.hp < target.maxHp) {
          player.chooseBool("是否让目标回复一点体力？").ai = function(event, player) {
            return ai.get.recoverEffect(target, player, player) > 0;
          };
        } else {
          event.finish();
        }
        "step 2";
        if (result.bool) {
          target.recover();
        }
      },
      ai: {
        result: {
          target: function(player, target) {
            if (target.num("h") > target.hp + 1 && ai.get.recoverEffect(target) > 0) {
              return 1;
            }
            if (player.canUse("sha", target) && (player.num("h", "sha") || player.num("he", { color: "red" }))) {
              return -2;
            }
            return -0.5;
          }
        },
        order: 9
      }
    },
    yijue2: {
      trigger: { global: "phaseAfter" },
      forced: true,
      mark: true,
      content: function() {
        delete player.disabledSkills.yijue;
        player.removeSkill("yijue2");
      },
      mod: {
        cardEnabled: function() {
          return false;
        },
        cardUsable: function() {
          return false;
        },
        cardRespondable: function() {
          return false;
        },
        cardSavable: function() {
          return false;
        }
      },
      intro: {
        content: function(st, player) {
          var storage = player.disabledSkills.yijue;
          if (storage && storage.length) {
            var str = "失效技能：";
            for (var i = 0; i < storage.length; i++) {
              if (lib.translate[storage[i] + "_info"]) {
                str += get.translation(storage[i]) + "、";
              }
            }
            return str.slice(0, str.length - 1);
          }
        }
      }
    },
    retieji: {
      trigger: { player: "shaBegin" },
      check: function(event, player) {
        return ai.get.attitude(player, event.target) < 0;
      },
      content: function() {
        "step 0";
        player.judge(function() {
          return 0;
        });
        var target = trigger.target;
        if (target.skills.contains("retieji2") == false) {
          target.disabledSkills.retieji = [];
          for (var i = 0; i < target.skills.length; i++) {
            if (!get.skillLocked(target.skills[i])) {
              target.disabledSkills.retieji.push(target.skills[i]);
            }
          }
          target.addSkill("retieji2");
        }
        "step 1";
        var suit = get.suit(result.card);
        var target = trigger.target;
        var num = target.num("h", "shan");
        target.chooseToDiscard("请弃置一张" + get.translation(suit) + "牌，否则不能使用闪抵消此杀", "he", function(card) {
          return get.suit(card) == suit;
        }).ai = function(card) {
          if (num == 0) return 0;
          if (card.name == "shan") return num > 1;
          return 8 - ai.get.value(card);
        };
        "step 2";
        if (!result.bool) {
          trigger.directHit = true;
        }
      }
    },
    retieji2: {
      trigger: { global: "phaseAfter" },
      forced: true,
      content: function() {
        delete player.disabledSkills.retieji;
        player.removeSkill("retieji2");
      },
      mark: true,
      intro: {
        content: function(st, player) {
          var storage = player.disabledSkills.retieji;
          if (storage && storage.length) {
            var str = "失效技能：";
            for (var i = 0; i < storage.length; i++) {
              if (lib.translate[storage[i] + "_info"]) {
                str += get.translation(storage[i]) + "、";
              }
            }
            return str.slice(0, str.length - 1);
          }
        }
      }
    },
    reyicong: {
      mod: {
        globalFrom: function(from, to, current) {
          if (from.hp > 2) return current - 1;
        },
        globalTo: function(from, to, current) {
          if (to.hp <= 2) return current + 1;
        }
      },
      ai: {
        threaten: 0.8
      }
    },
    qiaomeng: {
      trigger: { source: "damageEnd" },
      direct: true,
      filter: function(event) {
        return event.card && event.card.name == "sha" && event.cards &&
          get.color(event.cards) == "black" && event.player.num("e");
      },
      content: function() {
        "step 0";
        player.choosePlayerCard("e", trigger.player);
        "step 1";
        if (result.bool) {
          player.logSkill("qiaomeng");
          trigger.player.discard(result.links[0]);
          event.card = result.links[0];
        } else {
          event.finish();
        }
        "step 2";
        if (get.position(card) == "d") {
          if (get.subtype(card) == "equip3" || get.subtype(card) == "equip4") {
            player.gain(card);
            player.$gain2(card);
          }
        }
      }
    },
    rekurou: {
      enable: "phaseUse",
      usable: 1,
      filterCard: true,
      check: function(card) {
        return 9 - ai.get.value(card);
      },
      position: "he",
      content: function() {
        player.loseHp();
      },
      ai: {
        order: 9,
        result: {
          player: function(player) {
            if (player.hp <= 2) return 0;
            if (player.num("h") + 1 < player.hp) return 1;
            return 0;
          }
        },
        effect: function(card, player) {
          if (get.tag(card, "damage")) {
            if (player.skills.contains("jueqing")) return [1, 1];
            return 1.2;
          }
        }
      }
    },
    zhaxiang: {
      trigger: { player: "loseHpEnd" },
      forced: true,
      content: function() {
        player.draw(3);
        if (_status.currentPhase == player) {
          player.addTempSkill("zhaxiang2", { player: "phaseAfter" });
        }
      }
    },
    zhaxiang2: {
      mod: {
        targetInRange: function(card, player, target, now) {
          if (card.name == "sha" && get.color(card) == "red") return true;
        },
        cardUsable: function(card, player, num) {
          if (card.name == "sha") return num + 1;
        }
      },
      trigger: { player: "shaBegin" },
      forced: true,
      filter: function(event, player) {
        return event.card && get.color(event.card) == "red";
      },
      content: function() {
        trigger.directHit = true;
      }
    },
    zhuhai: {
      trigger: { global: "phaseEnd" },
      direct: true,
      filter: function(event, player) {
        return event.player.getStat("damage") &&
          lib.filter.targetEnabled({ name: "sha" }, player, event.player) &&
          !lib.filter.autoRespondSha.call({ player: player });
      },
      content: function() {
        "step 0";
        player.chooseToUse({ name: "sha" }, "是否对" + get.translation(trigger.player) + "使用一张杀", trigger.player);
        "step 1";
        if (result.bool) {
          player.logSkill("zhuhai");
        }
      }
    },
    qianxin: {
      unique: true,
      trigger: { source: "damageAfter" },
      forced: true,
      filter: function(event, player) {
        return player.hp < player.maxHp;
      },
      content: function() {
        player.removeSkill("qianxin");
        player.addSkill("jianyan");
        if (lib.config.mode != "guozhan" || player.maxHp >= 4) {
          player.loseMaxHp();
        }
      }
    },
    jianyan: {
      enable: "phaseUse",
      usable: 1,
      content: function() {
        "step 0";
        player.chooseControl(["red", "black"].concat(get.types())).ai = function() {
          if (player.num("shan") == 0) return "basic";
          if (player.num("e") <= 1) return "equip";
          if (player.num("h") > 2) return "trick";
          return "red";
        };
        "step 1";
        var num = 20;
        var card;
        event.cards = [];
        while (num--) {
          card = get.cards(0);
          event.cards.push(card);
          if (get.color(card) == result.control) break;
          else if (get.type(card, "trick") == result.control) break;
        }
        event.card = card;
        player.showCards(event.cards);
        player.chooseTarget(true, "选择一名男性角色送出" + get.translation(event.card), function(card, player, target) {
          return target.sex == "male";
        });
        "step 2";
        result.targets[0].$gain(event.card);
        for (var i = 0; i < cards.length - 1; i++) {
          ui.discardPile.appendChild(cards[i]);
        }
        game.delay(0, 1000);
        "step 3";
        result.targets[0].gain(event.card);

      },
      ai: {
        order: 9,
        result: {
          player: 2
        },
        threaten: 1.2
      }
    },
    reguose: {
      enable: "phaseUse",
      usable: 1,
      discard: false,
      filter: function(event, player) {
        return player.num("he", { suit: "diamond" }) > 0;
      },
      prepare: function(cards, player, targets) {
        player.$throw(cards);
      },
      position: "he",
      filterCard: { suit: "diamond" },
      filterTarget: function(card, player, target) {
        if (player != target) return lib.filter.targetEnabled({ name: "lebu" }, player, target);
        return target.num("j", "lebu");
      },
      check: function(card) {
        return 7 - ai.get.value(card);
      },
      content: function() {
        if (target.num("j", "lebu")) {
          target.discard(target.get("j", "lebu", 0));
        } else {
          target.addJudge("lebu", cards);
        }
        player.draw();
      },
      ai: {
        result: {
          target: function(player, target) {
            if (target.num("j", "lebu")) return -ai.get.effect(target, { name: "lebu" }, player, target);
            return ai.get.effect(target, { name: "lebu" }, player, target);
          }
        },
        order: 9
      }
    },
    fenwei: {
      unique: true,
      mark: true,
      trigger: { global: "useCard" },
      priority: 5,
      filter: function(event, player) {
        if (get.info(event.card).multitarget) return false;
        if (event.targets.length < 2) return false;
        if (player.storage.fenwei) return false;
        return true;
      },
      init: function(player) {
        player.storage.fenwei = false;
      },
      direct: true,
      content: function() {
        "step 0";
        player.chooseTarget("选择令" + get.translation(trigger.card) + "无效的目标",
          [1, trigger.targets.length], function(card, player, target) {
            return trigger.targets.contains(target);
          }).ai = function(target) {
          if (game.phaseNumber > game.players.length * 2 && trigger.targets.length >= game.players.length - 1) {
            return -ai.get.effect(target, trigger.card, trigger.player, player);
          }
          return -1;
        };
        "step 1";
        if (result.bool) {
          player.unmarkSkill("fenwei");
          player.logSkill("fenwei", result.targets);
          player.storage.fenwei = true;
          for (var i = 0; i < result.targets.length; i++) {
            trigger.targets.remove(result.targets[i]);
          }
          game.delay();
        }
      },
      intro: {
        content: "limited"
      }
    },
    chulao: {
      enable: "phaseUse",
      usable: 1,
      filterTarget: function(card, player, target) {
        if (player == target) return false;
        if (target.group == "unknown") return false;
        for (var i = 0; i < ui.selected.targets.length; i++) {
          if (ui.selected.targets[i].group == target.group) return false;
        }
        return target.num("he") > 0;
      },
      filterCard: true,
      position: "he",
      selectTarget: [1, Infinity],
      check: function(card) {
        if (get.suit(card) == "spade") return 8 - ai.get.value(card);
        return 5 - ai.get.value(card);
      },
      content: function() {
        "step 0";
        if (num == 0 && get.suit(cards[0]) == "spade") player.draw();
        player.choosePlayerCard(targets[num], "he", true);
        "step 1";
        if (result.bool) {
          if (result.links.length) targets[num].discard(result.links[0]);
          if (get.suit(result.links[0]) == "spade") targets[num].draw();
        }
      },
      ai: {
        result: {
          target: -1
        },
        threaten: 1.2,
        order: 3
      }
    },
    xunxun: {
      trigger: { player: "phaseDrawBefore" },
      frequent: true,
      content: function() {
        "step 0";
        event.cards = get.cards(4);
        player.chooseCardButton(event.cards, 2, true, "选择获得两张牌").ai = ai.get.buttonValue;
        trigger.untrigger();
        trigger.finish();
        "step 1";
        var choice = [];
        for (var i = 0; i < result.links.length; i++) {
          choice.push(result.links[i]);
          cards.remove(result.links[i]);
        }
        for (var i = 0; i < cards.length; i++) {
          ui.cardPile.appendChild(cards[i]);
        }
        player.gain(choice);
        player.$gain(choice.length);
        game.delay();
      }
    },
    wangxi: {
      trigger: { player: "damageEnd", source: "damageEnd" },
      filter: function(event) {
        return event.num && event.source && event.player &&
          event.player.isAlive() && event.source.isAlive() && event.source != event.player;
      },
      check: function(event, player) {
        if (event.player == player) return ai.get.attitude(player, event.source) > -3;
        return ai.get.attitude(player, event.player) > -3;
      },
      content: function() {
        "step 0";
        game.asyncDraw([trigger.player, trigger.source], trigger.num);
        "step 1";
        game.delay();
      }
    }
  },
  translate: {
    re_zhangliao: "张辽",
    re_huangyueying: "黄月英",
    re_simayi: "司马懿",
    re_xuzhu: "许褚",
    re_xiahoudun: "夏侯惇",
    re_lvmeng: "吕蒙",
    re_zhouyu: "周瑜",
    re_luxun: "陆逊",
    re_zhaoyun: "赵云",
    re_guanyu: "关羽",
    re_zhangfei: "张飞",
    re_machao: "马超",
    re_caocao: "曹操",
    re_guojia: "郭嘉",
    re_lvbu: "吕布",
    re_xushu: "徐庶",
    re_huanggai: "黄盖",
    re_gongsunzan: "公孙瓒",
    re_daqiao: "大乔",
    re_ganning: "甘宁",
    re_huatuo: "华佗",
    re_lidian: "李典",
    qinxue: "勤学",
    retuxi: "突袭·新",
    reluoyi: "裸衣·新",
    reluoyi2: "裸衣·新",
    reganglie: "刚烈·新",
    qingjian: "清俭",
    reyingzi: "英姿·新",
    refanjian: "反间·新",
    refanjian_card: "弃牌",
    refanjian_hp: "流失体力",
    reqianxun: "谦逊·新",
    reqianxun2: "谦逊·新",
    relianying: "连营·新",
    retishen: "替身",
    retishen2: "替身",
    reyajiao: "涯角",
    rejianxiong: "奸雄·新",
    rejianxiong_mopai: "摸牌",
    rejianxiong_napai: "拿牌",
    reyiji: "遗计·新",
    reyiji2: "遗计·新",
    yijue: "义绝",
    yijue2: "义绝",
    retieji: "铁骑·新",
    retieji2: "铁骑·新",
    refankui: "反馈·新",
    reyicong: "义从",
    qiaomeng: "趫猛",
    rekurou: "苦肉·新",
    zhaxiang: "诈降",
    zhaxiang2: "诈降",
    zhuhai: "诛害",
    qianxin: "潜心",
    jianyan: "荐言",
    reguicai: "鬼才·新",
    xunxun: "恂恂",
    wangxi: "忘隙",
    reguose: "国色·新",
    fenwei: "奋威",
    chulao: "除痨",
    rejizhi: "集智",
//		rejizhi_info:'当你使用一张装备牌或锦囊牌时，你可以展示牌堆顶牌，若该牌为基本牌，将之置入弃牌堆或用一张手牌与之交换；若不为基本牌，则将之收入手牌。',
    rejizhi_info: "当你使用一张装备牌或锦囊牌时，你可以摸一张牌并展示之，若此牌是基本牌，你须弃置一张手牌",
    xunxun_info: "摸牌阶段，你可以放弃摸牌，改为观看牌堆顶的四张牌，然后获得其中的两张牌，将其余的牌以任意顺序置于牌堆底。",
    wangxi_info: "每当你对其他角色造成1点伤害后，或受到其他角色造成的1点伤害后，你可与该角色各摸一张牌。",
    reguose_info: "出牌阶段限一次，你可以选择一项：将一张方片花色牌当做【乐不思蜀】使用；或弃置一张方片花色牌并弃置场上的一张【乐不思蜀】。选择完成后，你摸一张牌。",
    fenwei_info: "当一名角色使用的锦囊牌指定了至少两名角色为目标时，你可以令此牌对其中任意名角色无效。",
    chulao_info: "出牌阶段限一次，若你有牌，你可以选择任意名势力各不相同的其他角色，你弃置你和这些角色的各一张牌。然后以此法弃置黑桃牌的角色各摸一张牌。",
    reguicai_info: "在任意角色的判定牌生效前，你可以打出一张牌代替之",
    zhuhai_info: "一名其他角色的结束阶段开始时，若该角色本回合造成过伤害，你可以对其使用一张【杀】。",
    qianxin_info: "觉醒技，当你造成一次伤害后，若你已受伤，你须减1点体力上限，并获得技能“荐言”。",
    jianyan_info: "出牌阶段限一次，你可以声明一种牌的类别或颜色，然后连续亮出牌堆顶的牌，直到亮出符合你声明的牌为止，选择一名男性角色，该角色获得此牌，再将其余以此法亮出的牌置入弃牌堆。",
    rekurou_info: "出牌阶段限一次，你可以弃置一张牌，然后失去1点体力。",
    zhaxiang_info: "锁定技 每当你失去1点体力后，你摸三张牌。然后若此时是你的出牌阶段，则直到回合结束，你使用红色【杀】无距离限制且不能被【闪】响应，你可以额外使用一张【杀】。",
    qiaomeng_info: "每当你使用黑色【杀】对一名角色造成伤害后，你可以弃置该角色装备区里的一张牌，若此牌是坐骑牌，你于此牌置入弃牌堆时获得之。",
    reyicong_info: "锁定技，只要你的体力值大于2点，你计算与其他角色的距离时，始终-1；只要你的体力值为2点或更低，其他角色计算与你的距离时，始终+1。",
    refankui_info: "每当你受到1点伤害后，你可以获得伤害来源的一张牌。",
    retieji_info: "当你使用【杀】指定一名角色为目标后，你可以进行一次判定并令该角色的非锁定技失效直到回合结束，除非该角色弃置一张与判定结果花色相同的牌，否则不能使用【闪】抵消此【杀】。",
    yijue_info: "出牌阶段限一次，你可以与一名其他角色拼点，若你赢，则直到回合结束，该角色不能使用或打出手牌且其非锁定技失效，若你没赢，你可令该角色回复一点体力。",
    reyiji_info: "每当你受到1点伤害后，你可以摸两张牌。然后你可以在至多两名角色的武将牌旁边分别扣置至多两张手牌，这些角色的下个摸牌阶段开始时，该角色获得其武将牌旁的这些牌。",
    rejianxiong_info: "每当你受到伤害后，你可以选择一项：摸一张牌，或获得对你造成伤害的牌。",
    reyajiao_info: "每当你于回合外使用或打出一张手牌时，你可以亮出牌堆顶的一张牌，若此牌与你此次使用或打出的牌类别相同，你可以将之交给任意一名角色；若不同则你可以将之置入弃牌堆。",
    retishen_info: "限定技，准备阶段开始时，你可以将体力回复至等同于你上回合结束时的体力值，然后你每以此法回复1点体力，便摸一张牌。",
    reqianxun_info: "每当一张延时类锦囊牌或其他角色使用的非延时类锦囊牌生效时，若你是此牌的唯一目标，你可以将所有手牌置于你的武将牌上，若如此做，此回合结束时，你获得你武将牌上的所有牌。",
    relianying_info: "当你失去最后的手牌时，你可以令至多X名角色各摸一张牌（X为你此次失去的手牌数）。",
    reyingzi_info: "锁定技，摸牌阶段摸牌时，你额外摸一张牌；你的手牌上限不会因体力值的减少而减少。",
    refanjian_info: "出牌阶段限一次，你可以展示一张手牌并将此牌交给一名其他角色。然后该角色选择一项：展示其手牌并弃置所有与此牌花色相同的牌，或是去一点体力。",
    qingjian_info: "每当你于摸牌阶段外获得牌时，你可以将其中任意牌以任意顺序交给其他角色",
    qinxue_info: "觉醒技，准备阶段开始时，若你的手牌数比体力值多3（人数不少于7时改为2）或更多，你须减一点体力上限并获得技能【攻心】",
    retuxi_info: "摸牌阶段摸牌时，你可以少摸任意张牌，然后选择等量的手牌数大于或等于你的其他角色，获得这些角色的各一张手牌。",
    reluoyi_info: "你可以跳过摸牌阶段，然后展示牌堆顶的三张牌，获得其中的基本牌、武器牌和【决斗】，若如此做，直到你的下回合开始，你为伤害来源的【杀】或【决斗】造成的伤害+1。",
    reganglie_info: "每当你受到1点伤害后，可进行一次判定，若结果为红色，你对伤害来源造成1点伤害，若结果为黑色，你弃置其一张牌。"
  }
};
