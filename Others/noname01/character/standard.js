character.standard = {
  character: {
    caocao: ["male", "wei", 4, ["hujia", "jianxiong"], ["zhu", "fullskin"]],
    simayi: ["male", "wei", 3, ["fankui", "guicai"], ["fullskin"]],
    xiahoudun: ["male", "wei", 4, ["ganglie"], ["fullskin"]],
    zhangliao: ["male", "wei", 4, ["tuxi"], ["fullskin"]],
    xuzhu: ["male", "wei", 4, ["luoyi"], ["fullskin"]],
    guojia: ["male", "wei", 3, ["tiandu", "yiji"], ["fullskin"]],
    zhenji: ["female", "wei", 3, ["luoshen", "qingguo"], ["fullskin"]],
    liubei: ["male", "shu", 4, ["rende", "jijiang"], ["zhu", "fullskin"]],
    guanyu: ["male", "shu", 4, ["wusheng"], ["fullskin"]],
    zhangfei: ["male", "shu", 4, ["paoxiao"], ["fullskin"]],
    zhugeliang: ["male", "shu", 3, ["guanxing", "kongcheng"], ["fullskin"]],
    zhaoyun: ["male", "shu", 4, ["longdan"], ["fullskin"]],
    machao: ["male", "shu", 4, ["mashu", "tieji"], ["fullskin"]],
    huangyueying: ["female", "shu", 3, ["jizhi", "qicai"], ["fullskin"]],
    sunquan: ["male", "wu", 4, ["zhiheng", "jiuyuan"], ["zhu", "fullskin"]],
    ganning: ["male", "wu", 4, ["qixi"], ["fullskin"]],
    lvmeng: ["male", "wu", 4, ["keji"], ["fullskin"]],
    huanggai: ["male", "wu", 4, ["kurou"], ["fullskin"]],
    zhouyu: ["male", "wu", 3, ["yingzi", "fanjian"], ["fullskin"]],
    daqiao: ["female", "wu", 3, ["guose", "liuli"], ["fullskin"]],
    luxun: ["male", "wu", 3, ["qianxun", "lianying"], ["fullskin"]],
    sunshangxiang: ["female", "wu", 3, ["xiaoji", "jieyin"], ["fullskin"]],
    huatuo: ["male", "qun", 3, ["qingnang", "jijiu"], ["fullskin"]],
    lvbu: ["male", "qun", 4, ["wushuang"], ["fullskin"]],
    diaochan: ["female", "qun", 3, ["lijian", "biyue"], ["fullskin"]]
  },
  skill: {
    hujia: {
      unique: true,
      trigger: { player: "chooseToRespondBegin" },
      filter: function(event, player) {
        if (player.identity != "zhu") return false;
        if (event.filterCard({ name: "shan" }) == false) return false;
        for (var i = 0; i < game.players.length; i++) {
          if (game.players[i] != player && game.players[i].group == "wei") return true;
        }
        return false;
      },
      content: function() {
        "step 0";
        if (event.current == undefined) event.current = player.next;
        if (event.current == player) {
          event.finish();
        } else if (event.current.group == "wei") {
          if ((event.current == game.me && !_status.auto) || (
            ai.get.attitude(event.current, player) > 2)) {
            var next = event.current.chooseToRespond("是否替" + get.translation(player) + "打出一张闪？", { name: "shan" });
            next.ai = function() {
              var event = _status.event;
              return (ai.get.attitude(event.player, event.source) - 2);
            };
            next.autochoose = lib.filter.autoRespondShan;
            next.source = player;
          }
        }
        "step 1";
        if (result.bool) {
          event.finish();
          trigger.result = result;
          trigger.responded = true;
          trigger.animate = false;
          if (typeof event.current.ai.shown == "number" && event.current.ai.shown < 0.95) {
            event.current.ai.shown += 0.3;
            if (event.current.ai.shown > 0.95) event.current.ai.shown = 0.95;
          }
        } else {
          event.current = event.current.next;
          event.goto(0);
        }
      }
    },
    jianxiong: {
      trigger: { player: "damageEnd" },
      filter: function(event, player) {
        return get.itemtype(event.cards) == "cards" && get.position(event.cards[0]) == "d";
      },
      content: function() {
        player.gain(trigger.cards);
        player.$gain2(trigger.cards);
      },
      ai: {
        maixie: true,
        effect: {
          target: function(card, player) {
            if (player.skills.contains("jueqing")) return [1, -1];
            if (get.tag(card, "damage")) return [1, 0.5];
          }
        }
      }
    },
    fankui: {
      trigger: { player: "damageEnd" },
      direct: true,
      filter: function(event, player) {
        return (event.source && event.source.num("he"));
      },
      content: function() {
        "step 0";
        player.choosePlayerCard(trigger.source, ai.get.buttonValue, "he");
        "step 1";
        if (result.bool) {
          player.logSkill("fankui", trigger.source);
          player.gain(result.buttons[0].link);
          trigger.source.$give(1, player);
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
    guicai: {
      trigger: { global: "judge" },
      direct: true,
      filter: function(event, player) {
        return player.num("h") > 0;
      },
      content: function() {
        "step 0";
        player.chooseCard("鬼才：请选择代替判定的牌").ai = function(card) {
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
          player.logSkill("guicai");
          if (trigger.player.judging.clone) trigger.player.judging.clone.delete();
          ui.discardPile.appendChild(trigger.player.judging);
          trigger.player.judging = result.cards[0];
          trigger.position.appendChild(result.cards[0]);
          game.log(get.translation(trigger.player) + "的判定牌改为" + get.translation(result.cards[0]));
          game.delay(2);
        }
      },
      ai: {
        tag: {
          rejudge: 1
        }
      }
    },
    ganglie: {
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
          if (get.suit(card) == "heart") return -2;
          return 2;
        });
        "step 1";
        if (result.judge < 2) {
          event.finish();
          return;
        }
        trigger.source.chooseToDiscard(2).ai = function(card) {
          return ai.get.unuseful(card) + 2.5 * (5 - get.owner(card).hp);
        };
        "step 2";
        if (result.bool == false) {
          trigger.source.damage();
        }
      },
      ai: {
        result: {
          target: function(card, player, target) {
            if (player.skills.contains("jueqing")) return [1, -1];
            if (get.tag(card, "damage") && ai.get.damageEffect(target, player, player) > 0) return [1, 0, 0, -1.5];
          }
        }
      }
    },
    tuxi: {
      trigger: { player: "phaseDrawBefore" },
      direct: true,
      content: function() {
        "step 0";
        var check;
        var i, num = 0;
        for (i = 0; i < game.players.length; i++) {
          if (player != game.players[i]) {
            if (ai.get.attitude(player, game.players[i]) <= 0 &&
              game.players[i].num("h")) num++;
          }
        }
        check = (num >= 2);
        player.chooseTarget("是否发动突袭？", [1, 2], function(card, player, target) {
            return target.num("h") > 0 && player != target;
          },
          function(target) {
            if (!check) return 0;
            return (1 - ai.get.attitude(_status.event.player, target));
          });
        "step 1";
        if (result.bool) {
          player.logSkill("tuxi", result.targets);
          for (var i = 0; i < result.targets.length; i++) {
            player.gain(result.targets[i].get("h").randomGet());
            result.targets[i].$give(1, player);
          }
          trigger.finish();
          trigger.untrigger();
        }
        "step 2";
        if (result.bool) game.delay();
      },
      ai: {
        threaten: 2,
        expose: 0.3
      }
    },
    luoyi: {
      trigger: { player: "phaseDrawBegin" },
      check: function(event, player) {
        var i, cancel = true;
        if (player.num("h") < 3) return false;
        if (player.get("h", "sha").length == 0) return false;
        cancel = true;
        for (i = 0; i < game.players.length; i++) {
          if (ai.get.attitude(player, game.players[i]) < 0 &&
            player.canUse("sha", game.players[i])) {
            return true;
          }
        }
        return false;
      },
      content: function() {
        player.addTempSkill("luoyi2", "phaseEnd");
        trigger.num--;
      }
    },
    luoyi2: {
      trigger: { source: "damageBegin" },
      filter: function(event) {
        return (event.card && (event.card.name == "sha" || event.card.name == "juedou"));
      },
      forced: true,
      content: function() {
        trigger.num++;
      }
    },
    tiandu: {
      trigger: { player: "judgeEnd" },
      frequent: true,
      content: function() {
        player.gain(trigger.result.card);
        player.$gain2(trigger.result.card);
      }
    },
    yiji: {
      trigger: { player: "damageEnd" },
      frequent: true,
      filter: function(event) {
        return (event.num > 0);
      },
      content: function() {
        "step 0";
        event.cards = get.cards(2 * trigger.num);
        player.gain(event.cards);
        player.$draw(event.cards.length);
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
            return ai.get.attitude(_status.event.player, target) - 4;
          },
          prompt: "请选择要送人的卡牌"
        });
        "step 2";
        if (result.bool) {
          result.targets[0].gain(result.cards);
          player.$give(result.cards.length, result.targets[0]);
          for (var i = 0; i < result.cards.length; i++) {
            event.cards.remove(result.cards[i]);
          }
          if (event.cards.length) event.goto(1);
        }
      },
      ai: {
        maixie: true,
        effect: {
          target: function(card, player, target) {
            if (get.tag(card, "damage")) {
              if (player.skills.contains("jueqing")) return [1, -2];
              if (target.hp >= 4) return [1, get.tag(card, "damage") * 2];
              if (target.hp == 3) return [1, get.tag(card, "damage") * 1.5];
              if (target.hp == 2) return [1, get.tag(card, "damage") * 0.5];
            }
          }
        }
      }
    },
    luoshen: {
      trigger: { player: "phaseBegin" },
      frequent: true,
      content: function() {
        "step 0";
        if (event.cards == undefined) event.cards = [];
        player.judge(function(card) {
          if (get.color(card) == "black") return 1.5;
          return -1.5;
        }, ui.special);
        "step 1";
        if (result.judge > 0) {
          event.cards.push(result.card);
          if (lib.config.auto_skill == false) {
            player.chooseBool("是否再次发动？");
          } else {
            event._result = { bool: true };
          }
        } else {
          for (var i = 0; i < event.cards.length; i++) {
            if (get.position(event.cards[i]) != "s") {
              event.cards.splice(i, 1);
              i--;
            }
          }
          player.gain(event.cards);
          event.finish();
        }
        "step 2";
        if (result.bool) {
          event.goto(0);
        } else {
          player.gain(event.cards);
        }
      }
    },
    qingguo: {
      enable: ["chooseToRespond"],
      filterCard: function(card) {
        return get.color(card) == "black";
      },
      viewAs: { name: "shan" },
      prompt: "将一张黑色牌当闪打出",
      check: function() {
        return 1;
      },
      ai: {
        respondShan: true,
        result: {
          target: function(card, player, target, current) {
            if (get.tag(card, "respondShan") && current < 0) return 0.6;
          }
        }
      }
    },
    rende: {
      group: ["rende1"],
      enable: "phaseUse",
      filterCard: true,
      selectCard: [1, Infinity],
      discard: false,
      prepare: function(cards, player, targets) {
        player.$give(cards.length, targets[0]);
      },
      filterTarget: function(card, player, target) {
        return player != target;
      },
      check: function(card) {
        if (ui.selected.cards.length > 1) return 0;
        var player = get.owner(card);
        if (player.hp == player.maxHp || player.storage.rende < 0 || player.num("h") <= 1) {
          if (ui.selected.cards.length) {
            return -1;
          }
          if (player.num("h") > player.hp) return 10 - ai.get.value(card);
          if (player.num("h") > 2) return 6 - ai.get.value(card);
          return -1;
        }
        return 10 - ai.get.value(card);
      },
      content: function() {
        target.gain(cards);
        game.delay();
        if (typeof player.storage.rende != "number") {
          player.storage.rende = 0;
        }
        if (player.storage.rende >= 0) {
          player.storage.rende += cards.length;
          if (player.storage.rende >= 2) {
            player.recover();
            player.storage.rende = -1;
          }
        }
      },
      ai: {
        order: 10,
        result: {
          target: function(player, target) {
            var nh = target.num("h");
            var np = player.num("h");
            if (player.hp == player.maxHp || player.storage.rende < 0 || player.num("h") <= 1) {
              if (nh >= np - 1 && np <= player.hp) return 0;
            }
            return Math.max(1, 5 - nh);
          }
        },
        effect: {
          target: function(card, player, target) {
            if (player == target && get.type(card) == "equip") {
              if (player.num("e", { subtype: get.subtype(card) })) {
                for (var i = 0; i < game.players.length; i++) {
                  if (game.players[i] != player && ai.get.attitude(player, game.players[i]) > 0) {
                    return 0;
                  }
                }
              }
            }
          }
        },
        threaten: 0.8
      }
    },
    rende1: {
      trigger: { player: "phaseUseBegin" },
      forced: true,
      popup: false,
      silent: true,
      content: function() {
        player.storage.rende = 0;
      }
    },
    jijiang: {
      unique: true,
      group: ["jijiang1", "jijiang2"]
    },
    jijiang1: {
      trigger: { player: "chooseToRespondBegin" },
      filter: function(event, player) {
        if (player.identity != "zhu") return false;
        if (event.filterCard({ name: "sha" }) == false) return false;
        for (var i = 0; i < game.players.length; i++) {
          if (game.players[i] != player && game.players[i].group == "shu") return true;
        }
        return false;
      },
      content: function() {
        "step 0";
        if (event.current == undefined) event.current = player.next;
        if (event.current == player) {
          event.finish();
        } else if (event.current.group == "shu") {
          var next = event.current.chooseToRespond("是否替" + get.translation(player) + "打出一张杀？", { name: "sha" });
          next.ai = function() {
            var event = _status.event;
            return (ai.get.attitude(event.player, event.source) - 2);
          };
          next.autochoose = lib.filter.autoRespondSha;
          next.source = player;
        }
        "step 1";
        if (result.bool) {
          event.finish();
          trigger.result = result;
          trigger.responded = true;
          trigger.animate = false;
          if (typeof event.current.ai.shown == "number" && event.current.ai.shown < 0.95) {
            event.current.ai.shown += 0.3;
            if (event.current.ai.shown > 0.95) event.current.ai.shown = 0.95;
          }
        } else {
          event.current = event.current.next;
          event.goto(0);
        }
      }
    },
    jijiang2: {
      enable: "phaseUse",
      filter: function(event, player) {
        if (player != game.zhu) return false;
        if (player != game.me && player.skills.contains("jijiang3")) return false;
        for (var i = 0; i < game.players.length; i++) {
          if (game.players[i].group == "shu" && game.players[i] != player) {
            return lib.filter.cardUsable({ name: "sha" }, player);
          }
        }
        return false;
      },
      filterTarget: function(card, player, target) {
        return player.canUse({ name: "sha" }, target);
      },
      content: function() {
        "step 0";
        if (event.current == undefined) event.current = player.next;
        if (event.current == player) {
          player.addTempSkill("jijiang3", "phaseAfter");
          event.finish();
        } else if (event.current.group == "shu") {
          var next = event.current.chooseToRespond("是否替" + get.translation(player) + "对" + get.translation(target) + "使用一张杀",
            function(card) {
              return player.canUse(card, target) && card.name == "sha";
            });
          next.ai = function() {
            var event = _status.event;
            return (ai.get.attitude(event.player, event.target) < 0);
          };
          next.autochoose = lib.filter.autoRespondSha;
          next.source = player;
          next.target = target;
        }
        "step 1";
        if (result.bool) {
          event.finish();
          if (result.cards && result.cards.length == 1 && result.cards[0].name == "sha") {
            player.useCard(result.cards[0], target).animate = false;
          } else {
            player.useCard({ name: "sha" }, target).animate = false;
          }
          if (typeof event.current.ai.shown == "number" && event.current.ai.shown < 0.95) {
            event.current.ai.shown += 0.3;
            if (event.current.ai.shown > 0.95) event.current.ai.shown = 0.95;
          }
        } else {
          event.current = event.current.next;
          event.goto(0);
        }
      },
      ai: {
        result: {
          target: function(player, target) {
            if (player.skills.contains("jijiang3")) return 0;
            return ai.get.effect(target, { name: "sha" }, player, target);
          }
        },
        order: function() {
          return lib.card.sha.ai.order - 0.1;
        }
      }
    },
    jijiang3: {},
    wusheng: {
      enable: ["chooseToRespond", "chooseToUse"],
      filterCard: function(card) {
        return get.color(card) == "red";
      },
      position: "he",
      viewAs: { name: "sha" },
      prompt: "将一张红色牌当杀使用或打出",
      check: function(card) {
        return 4 - ai.get.value(card);
      },
      ai: {
        respondSha: true
      }
    },
    paoxiao: {
      mod: {
        cardUsable: function(card, player, num) {
          if (card.name == "sha") return Infinity;
        }
      }
    },
    guanxing: {
      trigger: { player: "phaseBegin" },
      frequent: true,
      content: function() {
        "step 0";
        if (player.underControl()) {
          game.swapPlayer(player);
        }
        if (event.isMine()) {
          ui.auto.hide();
          event.top = [];
          event.bottom = [];
          event.status = true;
          event.dialog = ui.create.dialog("按顺序选择置于牌堆顶的牌（先选择的在上）", get.cards(Math.min(5, game.players.length)));
          event.control = ui.create.control("ok", "pileTop", "pileBottom", function(link) {
            var event = _status.event;
            if (link == "ok") {
              var i;
              for (i = 0; i < event.top.length; i++) {
                ui.cardPile.insertBefore(event.top[i].link, ui.cardPile.firstChild);
              }
              for (i = 0; i < event.bottom.length; i++) {
                ui.cardPile.appendChild(event.bottom[i].link);
              }
              for (i = 0; i < event.dialog.buttons.length; i++) {
                if (event.dialog.buttons[i].classList.contains("glow") == false &&
                  event.dialog.buttons[i].classList.contains("target") == false)
                  ui.cardPile.appendChild(event.dialog.buttons[i].link);
              }
              event.dialog.close();
              event.control.close();
              game.log(get.translation(player) + "将" + get.cnNumber(event.top.length) + "张牌置于牌堆顶");
              ui.auto.show();
              game.resume();
            } else if (link == "pileTop") {
              event.status = true;
              event.dialog.content.childNodes[0].innerHTML = "按顺序选择置于牌堆顶的牌";
            } else {
              event.status = false;
              event.dialog.content.childNodes[0].innerHTML = "按顺序选择置于牌堆底的牌";
            }
          });
          for (var i = 0; i < event.dialog.buttons.length; i++) {
            event.dialog.buttons[i].classList.add("selectable");
          }
          event.custom.replace.button = function(link) {
            var event = _status.event;
            if (link.classList.contains("target")) {
              link.classList.remove("target");
              event.top.remove(link);
            } else if (link.classList.contains("glow")) {
              link.classList.remove("glow");
              event.bottom.remove(link);
            } else if (event.status) {
              link.classList.add("target");
              event.top.unshift(link);
            } else {
              link.classList.add("glow");
              event.bottom.push(link);
            }
          };
          event.custom.replace.window = function() {
            for (var i = 0; i < _status.event.dialog.buttons.length; i++) {
              _status.event.dialog.buttons[i].classList.remove("target");
              _status.event.dialog.buttons[i].classList.remove("glow");
              _status.event.top.length = 0;
              _status.event.bottom.length = 0;
            }
          };
          game.pause();
        } else {
          var cards = get.cards(Math.min(5, game.players.length));
          var top = [];
          var judges = player.node.judges.childNodes;
          var stopped = false;
          if (!player.num("h", "wuxie")) {
            for (var i = 0; i < judges.length; i++) {
              var judge = get.judge(judges[i]);
              cards.sort(function(a, b) {
                return judge(b) - judge(a);
              });
              if (judge(cards[0]) < 0) {
                stopped = true;
                break;
              } else {
                top.unshift(cards.shift());
              }
            }
            ;
          }
          var bottom;
          if (!stopped) {
            cards.sort(function(a, b) {
              return ai.get.value(b, player) - ai.get.value(a, player);
            });
            while (cards.length) {
              if (ai.get.value(cards[0], player) <= 5) break;
              top.unshift(cards.shift());
            }
          }
          bottom = cards;
          for (i = 0; i < top.length; i++) {
            ui.cardPile.insertBefore(top[i], ui.cardPile.firstChild);
          }
          for (i = 0; i < bottom.length; i++) {
            ui.cardPile.appendChild(bottom[i]);
          }
          player.popup(get.cnNumber(top.length) + "上" + get.cnNumber(bottom.length) + "下");
          game.log(get.translation(player) + "将" + get.cnNumber(top.length) + "张牌置于牌堆顶");
          game.delay(2);
        }
      },
      ai: {
        tag: {
//					rejudge:0.3
        },
        threaten: 1.2
      }
    },
    kongcheng: {
      mod: {
        targetEnabled: function(card, player, target, now) {
          if (target.num("h") == 0) {
            if (card.name == "sha" || card.name == "juedou") return false;
          }
        }
      }
    },
    longdan: {
      group: ["longdan1", "longdan2"]
    },
    longdan1: {
      enable: ["chooseToUse", "chooseToRespond"],
      filterCard: { name: "shan" },
      viewAs: { name: "sha" },
      prompt: "将一张闪当杀使用或打出",
      check: function() {
        return 1;
      },
      ai: {
        effect: {
          target: function(card, player, target, current) {
            if (get.tag(card, "respondSha") && current < 0) return 0.6;
          }
        },
        respondSha: true,
        order: 4,
        useful: -1,
        value: -1
      }
    },
    longdan2: {
      enable: ["chooseToRespond"],
      filterCard: { name: "sha" },
      viewAs: { name: "shan" },
      prompt: "将一张杀当闪打出",
      check: function() {
        return 1;
      },
      ai: {
        respondShan: true,
        effect: {
          target: function(card, player, target, current) {
            if (get.tag(card, "respondShan") && current < 0) return 0.6;
          }
        },
        order: 4,
        useful: -1,
        value: -1
      }
    },
    mashu: {
      mod: {
        globalFrom: function(from, to, distance) {
          return distance - 1;
        }
      }
    },
    feiying: {
      mod: {
        globalTo: function(from, to, distance) {
          return distance + 1;
        }
      }
    },
    tieji: {
      trigger: { player: "shaBegin" },
      content: function() {
        "step 0";
        player.judge(function(card) {
          if (get.color(card) == "red") return 2;
          return -0.5;
        });
        "step 1";
        if (result.bool) {
          trigger.directHit = true;
        }
      }
    },
    jizhi: {
      trigger: { player: "useCard" },
      frequent: true,
      filter: function(event) {
        return (get.type(event.card) == "trick" && event.cards[0] && event.cards[0] == event.card);
      },
      content: function() {
        player.draw();
      },
      ai: {
        threaten: 1.4
      }
    },
    qicai: {
      mod: {
        targetInRange: function(card, player, target, now) {
          var type = get.type(card);
          if (type == "trick" || type == "delay") return true;
        }
      }
    },
    zhiheng: {
      enable: "phaseUse",
      usable: 1,
      position: "he",
      filterCard: true,
      selectCard: [1, Infinity],
      prompt: "弃置任意张牌并摸等量的牌",
      check: function(card) {
        return 6 - ai.get.value(card);
      },
      content: function() {
        player.draw(cards.length);
      },
      ai: {
        order: 1,
        result: {
          player: 1
        },
        threaten: 1.5
      }
    },
    jiuyuan: {
      unique: true,
      trigger: { target: "taoBegin" },
      forced: true,
      filter: function(event, player) {
        if (event.player == player) return false;
        if (player.identity != "zhu") return false;
        if (player.hp > 0) return false;
        if (event.player.group != "wu") return false;
        return true;
      },
      content: function() {
        player.recover();
      }
    },
    qixi: {
      enable: "chooseToUse",
      filterCard: function(card) {
        return get.color(card) == "black";
      },
      position: "he",
      viewAs: { name: "guohe" },
      prompt: "将一张黑色牌当过河拆桥使用",
      check: function(card) {
        return 4 - ai.get.value(card);
      }
    },
    keji: {
      trigger: { player: "phaseDiscardBefore" },
      filter: function(event, player) {
        return (get.cardCount({ name: "sha" }, player) == 0);
      },
      content: function() {
        trigger.untrigger();
        trigger.finish();
      }
    },
    kurou: {
      enable: "phaseUse",
      prompt: "流失1点体力并摸两张牌",
      content: function() {
        "step 0";
        player.loseHp(1);
        "step 1";
        player.draw(2);
      },
      ai: {
        basic: {
          order: 1
        },
        result: {
          player: function(player) {
            if (player.num("h") >= player.hp - 1) return -1;
            if (player.hp < 3) return -1;
            return 1;
          }
        }
      }
    },
    yingzi: {
      trigger: { player: "phaseDrawBegin" },
      frequent: true,
      content: function() {
        trigger.num++;
      },
      ai: {
        threaten: 1.3
      }
    },
    fanjian: {
      enable: "phaseUse",
      usable: 1,
      filter: function(event, player) {
        return player.num("h") > 0;
      },
      filterTarget: function(card, player, target) {
        return player != target;
      },
      content: function() {
        "step 0";
        target.chooseControl("heart2", "diamond2", "club2", "spade2").ai = function(event) {
          //var player=event.parent.player;
          //var list=[player.get('h',{suit:'heart'}),
          //player.get('h',{suit:'diamond'}),
          //player.get('h',{suit:'club'}),
          //player.get('h',{suit:'spade'})];
          //for(var i=0;i<list.length;i++){
          //	list[i]+=Math.random()*player.num('h')*2;
          //}
          //var max=list[0],result=0;
          //for(var i=1;i<4;i++){
          //	if(list[i]>max){
          //		result=i;
          //		max=list[i];
          //	}
          //}
          switch (Math.floor(Math.random() * 6)) {
            case 0:
              return "heart2";
            case 1:
            case 4:
            case 5:
              return "diamond2";
            case 2:
              return "club2";
            case 3:
              return "spade2";
          }
        };
        "step 1";
        event.choice = result.control;
        target.popup(event.choice);
        event.card = player.get("h").randomGet();
        target.gain(event.card);
        player.$give(event.card, target);
        game.delay();
        "step 2";
        if (get.suit(event.card) + "2" != event.choice) target.damage();
      },
      ai: {
        order: 1,
        result: {
          target: function(player, target) {
            var eff = ai.get.damageEffect(target, player);
            if (eff >= 0) return 1 + eff;
            var value = 0, i;
            var cards = player.get("h");
            for (i = 0; i < cards.length; i++) {
              value += ai.get.value(cards[i]);
            }
            value /= player.num("h");
            if (target.hp == 1) return Math.min(0, value - 7);
            return Math.min(0, value - 5);
          }
        }
      }
    },
    guose: {
      enable: "chooseToUse",
      filterCard: function(card) {
        return get.suit(card) == "diamond";
      },
      position: "he",
      viewAs: { name: "lebu" },
      prompt: "将一张方片牌当乐不思蜀使用",
      check: function(card) {
        return 6 - ai.get.value(card);
      },
      ai: {
        threaten: 1.5
      }
    },
    liuli: {
      trigger: { target: "shaBefore" },
      direct: true,
      priority: 5,
      filter: function(event, player) {
        for (var i = 0; i < game.players.length; i++) {
          if (get.distance(player, game.players[i], "attack") <= 1 &&
            game.players[i] != event.player && game.players[i] != player) {
            if (player.canUse(event.card, game.players[i])) return true;
          }
        }
        return false;
      },
      content: function() {
        "step 0";
        var next = player.chooseCardTarget({
          position: "he",
          filterTarget: function(card, player, target) {
            if (get.distance(player, target, "attack") <= 1 &&
              target != trigger.player && target != player) {
              if (player.canUse(trigger.card, target)) return true;
            }
            return false;
          },
          ai1: function(card) {
            return ai.get.unuseful(card) + 9;
          },
          ai2: function(target) {
            if (_status.event.player.num("h", "shan")) {
              return -ai.get.attitude(_status.event.player, target);
            }
            if (ai.get.attitude(_status.event.player, target) < 5) {
              return 6 - ai.get.attitude(_status.event.player, target);
            }
            if (_status.event.player.hp == 1 && player.num("h", "shan") == 0) {
              return 10 - ai.get.attitude(_status.event.player, target);
            }
            if (_status.event.player.hp == 2 && player.num("h", "shan") == 0) {
              return 8 - ai.get.attitude(_status.event.player, target);
            }
            return -1;
          },
          prompt: "是否发动[流离]？"
        });
        "step 1";
        if (result.bool) {
          player.discard(result.cards);
          player.logSkill("liuli", result.targets);
        }
        "step 2";
        if (result.bool) {
          trigger.target = result.targets[0];
          trigger.untrigger();
          trigger.trigger("useCardToBefore");
          trigger.trigger("shaBefore");
          game.delay();
        }
      },
      ai: {
        effect: {
          target: function(card, player, target) {
            if (target.num("he") == 0) return;
            if (card.name != "sha") return;
            var min = 1;
            for (var i = 0; i < game.players.length; i++) {
              if (player != game.players[i] &&
                ai.get.attitude(target, game.players[i]) < 0 &&
                target.canUse(card, game.players[i])) {
                if (min && player.canUse(card, game.players[i])) {
                  min = 0;
                }
                if (ai.get.effect(game.players[i], {
                  name: "shacopy",
                  nature: card.nature,
                  suit: card.suit
                }, player, player) > 0) {
                  return [0, 0.1];
                }
              }
            }
            return min;
          }
        }
      }
    },
    qianxun: {
      mod: {
        targetEnabled: function(card, player, target, now) {
          if (card.name == "shunshou" || card.name == "lebu") return false;
        }
      }
    },
    lianying: {
      trigger: { player: "loseEnd" },
      frequent: true,
      filter: function(event, player) {
        if (player.num("h")) return false;
        for (var i = 0; i < event.cards.length; i++) {
          if (event.cards[i].original == "h") return true;
        }
        return false;
      },
      content: function() {
        player.draw();
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
    xiaoji: {
      trigger: { player: "loseEnd" },
      frequent: true,
      filter: function(event, player) {
        for (var i = 0; i < event.cards.length; i++) {
          if (event.cards[i].original == "e") return true;
        }
        return false;
      },
      content: function() {
        var num = 0;
        for (var i = 0; i < trigger.cards.length; i++) {
          if (trigger.cards[i].original == "e") num += 2;
        }
        player.draw(num);
      },
      ai: {
        effect: {
          target: function(card, player, target, current) {
            if (get.type(card) == "equip") return [1, 3];
          }
        }
      }
    },
    jieyin: {
      enable: "phaseUse",
      filterCard: true,
      usable: 1,
      selectCard: 2,
      check: function(card) {
        var player = get.owner(card);
        if (player.num("h") > player.hp)
          return 8 - ai.get.value(card);
        if (player.hp < player.maxHp)
          return 6 - ai.get.value(card);
        return 4 - ai.get.value(card);

      },
      filterTarget: function(card, player, target) {
        if (target.sex != "male") return false;
        if (target.hp >= target.maxHp) return false;
        if (target == player) return false;
        return true;
      },
      content: function() {
        player.recover();
        target.recover();
      },
      ai: {
        order: 7.5,
        result: {
          player: function(player) {
            if (player.hp < player.maxHp) return 4;
            if (player.num("h") > player.hp) return 0;
            return -1;
          },
          target: 4
        },
        threaten: 2
      }
    },
    qingnang: {
      enable: "phaseUse",
      filterCard: true,
      usable: 1,
      check: function(card) {
        return 9 - ai.get.value(card);
      },
      filterTarget: function(card, player, target) {
        if (target.hp >= target.maxHp) return false;
        return true;
      },
      content: function() {
        target.recover();
      },
      ai: {
        order: 9,
        result: {
          target: function(player, target) {
            if (target.hp == 5) return 5;
            if (player == target && player.num("h") > player.hp) return 5;
            return 2;
          }
        },
        threaten: 2
      }
    },
    jijiu: {
      enable: "chooseToUse",
      filter: function(event, player) {
        return _status.currentPhase != player;
      },
      filterCard: function(card) {
        return get.color(card) == "red";
      },
      position: "he",
      viewAs: { name: "tao" },
      prompt: "将一张红色牌当桃使用",
      check: function(card) {
        return 15 - ai.get.value(card);
      },
      ai: {
        threaten: 1.5,
        save: true
      }
    },
    wushuang: {
      forced: true,
      group: ["wushuang1", "wushuang2"]
    },
    wushuang1: {
      trigger: { player: "shaBegin" },
      forced: true,
      content: function() {
        "step 0";
        var next = trigger.target.chooseToRespond({ name: "shan" });
        next.autochoose = lib.filter.autoRespondShan;
        next.ai = function(card) {
          if (trigger.target.num("h", "shan") > 1) {
            return ai.get.unuseful2(card);
          }
          return -1;
        };
        "step 1";
        if (result.bool == false) {
          trigger.untrigger();
          trigger.directHit = true;
        }
      }
    },
    wushuang2: {
      trigger: { player: "juedou", target: "juedou" },
      forced: true,
      filter: function(event, player) {
        return event.turn != player;
      },
      content: function() {
        "step 0";
        var next = trigger.turn.chooseToRespond({ name: "sha" });
        next.autochoose = lib.filter.autoRespondSha;
        next.ai = function(card) {
          if (ai.get.attitude(trigger.turn, player) < 0 && trigger.turn.num("h", "sha") > 1) {
            return ai.get.unuseful2(card);
          }
          return -1;
        };
        "step 1";
        if (result.bool == false) {
          trigger.directHit = true;
        }
      },
      ai: {
        result: {
          target: function(card, player, target) {
            if (card.name == "juedou" && target.num("h") > 0) return [1, 0, 0, -1];
          }
        }
      }
    },
    lijian: {
      enable: "phaseUse",
      usable: 1,
      filter: function(event, player) {
        var num = 0;
        for (var i = 0; i < game.players.length; i++) {
          if (game.players[i].sex == "male" && game.players[i] != player) num++;
        }
        return (num > 1);
      },
      check: function(card) {
        return 10 - ai.get.value(card);
      },
      filterCard: true,
      position: "he",
      filterTarget: function(card, player, target) {
        if (player == target) return false;
        if (target.sex != "male") return false;
        if (ui.selected.targets.length == 1) {
          return target.canUse({ name: "juedou" }, ui.selected.targets[0]);
        }
        return true;
      },
      targetprompt: ["先出杀", "后出杀"],
      selectTarget: 2,
      multitarget: true,
      content: function() {
        targets[1].useCard({ name: "juedou" }, targets[0]).animate = false;
        game.delay(0.5);
      },
      ai: {
        order: 8,
        result: {
          target: function(player, target) {
            if (ui.selected.targets.length == 0) {
              return -3;
            } else {
              var num = ui.selected.targets[0].num("h");
              if (num == 0) return 0;
              if (num == 1) return -0.1;
              return -2;
            }
          }
        },
        expose: 0.4,
        threaten: 3
      }
    },
    biyue: {
      trigger: { player: "phaseEnd" },
      frequent: true,
      content: function() {
        player.draw();
      }
    },
    invincible: {
      trigger: { player: ["damageBefore", "loseHpBefore", "loseMaxHpBefore"] },
      forced: true,
      popup: false,
      content: function() {
        trigger.untrigger();
        trigger.finish();
      }
    }
  },
  translate: {
    caocao: "曹操",
    simayi: "司马懿",
    xiahoudun: "夏侯惇",
    zhangliao: "张辽",
    xuzhu: "许褚",
    guojia: "郭嘉",
    zhenji: "甄姬",
    liubei: "刘备",
    guanyu: "关羽",
    zhangfei: "张飞",
    zhugeliang: "诸葛亮",
    zhaoyun: "赵云",
    machao: "马超",
    huangyueying: "黄月英",
    sunquan: "孙权",
    ganning: "甘宁",
    lvmeng: "吕蒙",
    huanggai: "黄盖",
    zhouyu: "周瑜",
    daqiao: "大乔",
    luxun: "陆逊",
    sunshangxiang: "孙尚香",
    huatuo: "华佗",
    lvbu: "吕布",
    diaochan: "貂蝉",

    hujia: "护驾",
    jianxiong: "奸雄",
    fankui: "反馈",
    guicai: "鬼才",
    ganglie: "刚烈",
    tuxi: "突袭",
    luoyi: "裸衣",
    luoyi2: "裸衣",
    tiandu: "天妒",
    yiji: "遗计",
    luoshen: "洛神",
    qingguo: "倾国",
    rende: "仁德",
    jijiang: "激将",
    jijiang1: "激将",
    jijiang2: "激将",
    wusheng: "武圣",
    paoxiao: "咆哮",
    guanxing: "观星",
    kongcheng: "空城",
    longdan: "龙胆",
    longdan1: "龙胆",
    longdan2: "龙胆",
    mashu: "马术",
    feiying: "飞影",
    tieji: "铁骑",
    jizhi: "集智",
    qicai: "奇才",
    zhiheng: "制衡",
    jiuyuan: "救援",
    qixi: "奇袭",
    keji: "克己",
    kurou: "苦肉",
    yingzi: "英姿",
    fanjian: "反间",
    guose: "国色",
    liuli: "流离",
    qianxun: "谦逊",
    lianying: "连营",
    xiaoji: "枭姬",
    jieyin: "结姻",
    qingnang: "青囊",
    jijiu: "急救",
    wushuang: "无双",
    wushuang1: "无双",
    wushuang2: "无双",
    lijian: "离间",
    biyue: "闭月",
    pileTop: "牌堆顶",
    pileBottom: "牌堆底",
    hujia_info: "主公技，魏势力角色可以替你打出[闪]",
    jianxiong_info: "你可以立即获得对你造成伤害的牌",
    fankui_info: "当你受到伤害时，可以获得伤害来源的一张牌",
    guicai_info: "在任意角色的判定牌生效前，你可以打出一张手牌代替之",
    ganglie_info: "每当你受到一次伤害，可进行一次判定，若结果不为红桃，则伤害来源须弃置两张手牌若受到来自你的一点伤害",
    tuxi_info: "摸牌阶段，你可以放弃摸牌，并从1~2名其他角色各抽取一张手牌",
    luoyi_info: "摸牌阶段，你可以少摸一张牌，若如此做，你本回合内[杀]或[决斗]造成的伤害+1",
    tiandu_info: "你可以立即获得你的判定牌",
    yiji_info: "每当你受到一点伤害，可以观看牌堆顶的两张牌，并将其交给任意1~名角色",
    luoshen_info: "回合开始阶段，你可以进行一定判定，若为黑色则可以继续判定，直到出现红色。然后你获得所有黑色的判定牌",
    qingguo_info: "你可以将一张黑色手牌当[闪]使用或打出",
    rende_info: "出牌阶段，你可以将任意手牌送给其他角色，若送出的手牌不少于两张，你回复一点体力",
    jijiang_info: "蜀势力角色可以帮你使用或打出[杀]",
    wusheng_info: "你可以将一张红色牌当[杀]使用",
    paoxiao_info: "出牌阶段，你使用[杀]无数量限制",
    guanxing_info: "回合开始阶段，你可以观看牌堆顶的x张牌，并将其以任意顺序置于牌堆项或牌堆底，x为存活角色个数且不超过5",
    kongcheng_info: "锁定技，当你没有手牌时，不能成为[杀]或[决斗]的目标",
    longdan_info: "你可以将[杀]当[闪]，或[闪]当[杀]使用或打出",
    mashu_info: "当计算你与其它角色的距离时，始终-1",
    feiying_info: "当计算其它角色与你的距离时，始终+1",
    tieji_info: "当你使用一张[杀]时，可进行一次判定，若为红色则此[杀]不可闪避",
    jizhi_info: "每当你使用或打出一张非延时锦囊，可以摸一张牌",
    qicai_info: "锁定技，你使用的锦囊牌无距离限制",
    zhiheng_info: "出牌阶段，你可以弃置任意张牌并摸等量的牌，每阶段限1次",
    jiuyuan_info: "锁定技，濒死阶段，吴势力角色对你使用的[桃]额外回复一点体力",
    qixi_info: "你可以将一张黑色手牌当[过河拆桥]使用",
    keji_info: "若你在出牌阶段没有使用[杀]，则可跳过弃牌阶段",
    kurou_info: "出牌阶段，你可以流失一点体力并摸两张牌",
    yingzi_info: "摸牌阶段，你可以额外摸一张牌",
    fanjian_info: "出牌阶段，你可以令一名角色选择一种花色并展示你的一张手牌，若选择的花色与展示的不同，该角色受到来自你的一点伤害。结算结束后该角色获得展示的牌。每阶段限1次",
    guose_info: "你可以将一张方片花色的手牌当[乐不思蜀]使用",
    liuli_info: "当你成为[杀]的目标时，可以弃置一张牌将其转移给攻击范围内的一名其他角色，此角色不能是[杀]的使用者",
    qianxun_info: "锁定技，你不能成为[顺手牵羊]和[乐不思蜀]的目标",
    lianying_info: "每当你失去最后一张手牌，可摸一张牌",
    xiaoji_info: "每当你失去一张装备牌，可以摸两张牌",
    jieyin_info: "出牌阶段，你可以弃置两张牌并选择1名已经受伤的男性角色，你与其各回复一点体力，每阶段限一次",
    qingnang_info: "出牌阶段，你可以弃置一张手牌令一名角色回复一点体力，每阶段限一次",
    jijiu_info: "回合外，你可以将一张红色牌当[桃]使用",
    wushuang_info: "锁定技，你使用的[杀]或[决斗]需要两张[闪]或[杀]响应",
    lijian_info: "出牌阶段，你可以弃一张牌，视为一名男性角色对另一名男性角色使用一张[决斗]，每阶段限一次",
    biyue_info: "回合结束阶段，你可以摸一张牌"
  }
};
