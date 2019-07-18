mode.identity = {
  game: {
    start: function() {
      var next = game.createEvent("game", false);
      next.content = function() {
        "step 0";
        game.prepareArena();
        game.delay();
        "step 1";
        if (lib.storage.test) {
          _status.auto = true;
          // ui.auto.innerHTML='手动';
          ui.auto.classList.add("glow");
        }
        game.chooseCharacter();
        "step 2";
        if (get.config("ai_identity") || game.players.length == 2) {
          game.showIdentity(true);
        } else {
          for (var i = 0; i < game.players.length; i++) {
            game.players[i].ai.shown = 0;
          }
        }
        game.zhu.ai.shown = 1;
        if (get.config("enhance_zhu") && get.population("fan") >= 3) {
          var skill;
          switch (game.zhu.name) {
            case "liubei":
              skill = "jizhen";
              break;
            case "dongzhuo":
              skill = "hengzheng";
              break;
            case "sunquan":
              skill = "batu";
              break;
            case "diy_zhangjiao":
              skill = "tiangong";
              break;
            case "liushan":
              skill = "shengxi";
              break;
            case "sunce":
              skill = "ciqiu";
              break;
            case "yuanshao":
              skill = "geju";
              break;
            case "re_caocao":
              skill = "dangping";
              break;
            case "caopi":
              skill = "junxing";
              break;
            case "liuxie":
              skill = "moukui";
              break;
            default:
              skill = "tianming";
              break;
          }
          game.zhu.addSkill(skill);
          game.zhu.storage.enhance_zhu = skill;
        }
        if (lib.storage.test) {
          var str = "";
          for (var i = 0; i < game.players.length; i++) {
            str += get.translation(game.players[i]);
            if (game.players[i] == game.zhu) str += "（主）";
            str += " ";
          }
          console.log(str);
          game.showIdentity();
        }
        lib.config.ai_guess = true;
        event.trigger("gameStart");
        game.gameDraw(game.zhu);
        game.phaseLoop(game.zhu);
      };
    },
    showIdentity: function() {
      var players = game.players.concat(game.dead);
      for (var i = 0; i < game.players.length; i++) {
        game.players[i].identityShown = true;
        game.players[i].ai.shown = 1;
        game.players[i].setIdentity(game.players[i].identity);
      }
    },
    checkResult: function() {
      if (get.population("zhong") == 0 || (get.population("fan") + get.population("nei") == 0)) {
        for (var i = 0; i < game.players.length; i++) {
          if (game.players[i].spy == "zhong") {
            game.players[i].identity = "zhong";
            game.players[i].setIdentity();
            game.players[i].draw(2);
            delete game.players[i].spy;
          }
        }
      }
      if (get.population("fan") == 0 || game.zhu.isDead()) {
        for (var i = 0; i < game.players.length; i++) {
          if (game.players[i].spy == "fan") {
            game.players[i].identity = "fan";
            game.players[i].setIdentity();
            game.players[i].draw(2);
            delete game.players[i].spy;
          }
        }
      }
      if (get.population("fan") + get.population("zhong") == 0 && game.zhu.isAlive()) {
        for (var i = 0; i < game.players.length; i++) {
          if (game.players[i].spy == "nei") {
            game.players[i].identity = "nei";
            game.players[i].setIdentity();
            game.players[i].draw(2);
            delete game.players[i].spy;
          }
        }
      }
      if (game.zhu.isAlive() && get.population("fan") + get.population("nei") > 0) return;
      if (lib.storage.test) {
        if (game.zhu.isAlive()) {
          console.log("主忠胜利");
        } else if (game.players[0].identity == "nei" && game.players.length == 1) {
          console.log("内奸胜利");
        } else {
          console.log("反贼胜利");
        }
      }
      for (var i = 0; i < game.players.length; i++) {
        game.players[i].setIdentity(game.players[i].identity);
      }
      if (game.me.identity == "zhu" || game.me.identity == "zhong") {
        if (game.zhu.classList.contains("dead")) {
          game.over(false);
        } else {
          game.over(true);
        }
      } else if (game.me.identity == "nei") {
        if (get.population("fan") + get.population("zhu") + get.population("zhong") == 0) {
          game.over(true);
        } else {
          game.over(false);
        }
      } else {
        if (get.population("fan") + get.population("zhong") > 0 && game.zhu.classList.contains("dead")) {
          game.over(true);
        } else {
          game.over(false);
        }
      }
    },
    chooseCharacter: function() {
      var next = game.createEvent("chooseCharacter", false);
      next.showConfig = true;
      next.addPlayer = function(player) {
        var list = lib.config.mode_config.identity.identity[game.players.length - 3].slice(0);
        var list2 = lib.config.mode_config.identity.identity[game.players.length - 2].slice(0);
        for (var i = 0; i < list.length; i++) list2.remove(list[i]);
        player.identity = list2[0];
        player.setIdentity("cai");
      };
      next.removePlayer = function() {
        return game.players.randomGet(game.me, game.zhu);
      };
      next.ai = function(player, list, list2) {
        switch (player.identity) {
          case "zhu":
            for (var i = 0; i < list2.length; i++)
              list2.sort(lib.sort.random);
            var choice, choice2;
            if (Math.random() - 0.8 < 0 && list2.length) {
              choice = list2[0];
              choice2 = list[0];
              if (choice2 == choice) {
                choice2 = list[1];
              }
            } else {
              choice = list[0];
              choice2 = list[1];
            }
            if (get.config("double_character")) {
              player.init(choice, choice2);
            } else {
              player.init(choice);
            }
            if (game.players.length > 4) {
              player.hp++;
              player.maxHp++;
              player.update();
            }
            break;

          case "zhong":
            var choice = 0;
            for (var i = 0; i < list.length; i++) {
              if (lib.character[list[i]][1] == game.zhu.group) {
                choice = i;
                break;
              }
            }
            if (get.config("double_character")) {
              player.init(list[choice], list[choice == 0 ? choice + 1 : choice - 1]);
            } else {
              player.init(list[choice]);
            }
            break;

          default:
            if (get.config("double_character")) {
              player.init(list[0], list[1]);
            } else {
              player.init(list[0]);
            }
        }
      };
      next.content = function() {
        "step 0";
        var i;
        var list;
        var list2 = [];
        var list3 = [];
        var identityList = lib.config.mode_config.identity.identity[game.players.length - 2].slice(0);
        var addSetting = function(dialog) {
          dialog.add("更换身份");
          var table = document.createElement("table");
          table.style.margin = "0 auto";
          var tr = document.createElement("tr");
          table.appendChild(tr);
          var list = ["random", "zhu", "zhong", "nei", "fan"];
          for (var i = 0; i < 5; i++) {
            var td = document.createElement("td");
            tr.appendChild(td);
            td.style.width = "40px";
            td.style.fontSize = "18px";
            td.link = list[i];
            td.innerHTML = get.translation(list[i] + "2");
            td.addEventListener(lib.config.touchscreen ? "touchend" : "click", function() {
              if (_status.dragged) return;
              if (game.zhu.name) {
                game.zhu.uninit();
                delete game.zhu.identityShown;
              }
              dialog.close();
              _status.event = _status.event.parent;
              _status.event.step = 0;
              if (this.link != "random") {
                _status.event.identity = this.link;
              } else {
                delete _status.event.identity;
              }
              game.resume();
            });
          }
          dialog.content.appendChild(table);
          dialog.add(ui.create.div(".placeholder"));
          dialog.add(ui.create.div(".placeholder"));
          dialog.add(ui.create.div(".placeholder"));
        };
        event.addSetting = addSetting;
        event.list = [];
        for (i = 0; i < identityList.length; i++) {
          identityList.sort(lib.sort.random);
        }
        if (event.identity) {
          identityList.remove(event.identity);
          identityList.unshift(event.identity);
          delete event.identity;
        }
        for (i = 0; i < game.players.length; i++) {
          game.players[i].identity = identityList[i];
          game.players[i].setIdentity("cai");
          if (identityList[i] == "zhu") {
            game.zhu = game.players[i];
          }
          game.players[i].identityShown = false;
        }
        game.zhu.setIdentity();
        game.zhu.identityShown = true;
        game.me.setIdentity();
        for (i in lib.character) {
          if (lib.config.forbidai.contains(i)) continue;
          if (lib.config.forbidall.contains(i)) continue;
          if (!get.config("double_character") && get.config("ban_weak") && lib.config.forbidsingle.contains(i)) continue;
          if (get.config("double_character") && lib.config.forbiddouble.contains(i)) continue;
          event.list.push(i);
          if (lib.character[i][4] && lib.character[i][4].contains("zhu")) {
            list2.push(i);
          } else {
            list3.push(i);
          }
        }
        event.list.sort(lib.sort.random);
        list3.sort(lib.sort.random);
        var num = get.config("choice")[game.me.identity];
        if (game.zhu != game.me) {
          event.ai(game.zhu, event.list, list2);
          event.list.remove(game.zhu.name);
          event.list.remove(game.zhu.name2);
          list = event.list.splice(0, num);
        } else {
          list = list3.slice(0, num).concat(list2);
        }
        var dialog = ui.create.dialog("选择角色", [list, "character"]);
        if (get.config("change_identity")) {
          addSetting(dialog);
        }
        game.me.chooseButton(dialog, true).selectButton = function() {
          return get.config("double_character") ? 2 : 1;
        };
        ui.create.cheat = function() {
          ui.cheat = ui.create.control("更换", function() {
            if (game.zhu != game.me) {
              event.list = event.list.concat(list);
              event.list.sort(lib.sort.random);
              list = event.list.splice(0, num);
            } else {
              list3.sort(lib.sort.random);
              list = list3.slice(0, num).concat(list2);
            }
            _status.event.dialog.close();
            _status.event.dialog = ui.create.dialog("选择角色", [list, "character"]);
            if (get.config("change_identity")) {
              addSetting(_status.event.dialog);
            }
            game.uncheck();
            game.check();
          });
        };
        (function() {
          var list = [];
          var dialog;
          var node = ui.create.div(".caption");
          var namecapt = [];
          var getCapt = function(str) {
            if (str.indexOf("_") == -1) {
              return str[0];
            }
            return str[str.indexOf("_") + 1];
          };
          for (i in lib.character) {
            if (get.config("ban_weak") && lib.config.forbidall.contains(i)) continue;
            list.push(i);
            if (namecapt.indexOf(getCapt(i)) == -1) {
              namecapt.push(getCapt(i));
            }
          }
          namecapt.sort(function(a, b) {
            return a > b ? 1 : -1;
          });
          var clickCapt = function() {
            if (_status.dragged) return;
            dialog.currentcapt = this.link;
            for (var i = 0; i < dialog.buttons.length; i++) {
              if (dialog.buttons[i].capt != dialog.currentcapt ||
                (dialog.currentgroup && dialog.buttons[i].group != dialog.currentgroup)) {
                dialog.buttons[i].style.display = "none";
              } else {
                dialog.buttons[i].style.display = "";
              }
            }
          };
          for (i = 0; i < namecapt.length; i++) {
            var span = document.createElement("span");
            span.innerHTML = " " + namecapt[i].toUpperCase() + " ";
            span.link = namecapt[i];
            span.addEventListener(lib.config.touchscreen ? "touchend" : "click", clickCapt);
            node.appendChild(span);
          }
          var groupSort = function(name) {
            if (lib.character[name][1] == "wei") return 0;
            if (lib.character[name][1] == "shu") return 1;
            if (lib.character[name][1] == "wu") return 2;
            if (lib.character[name][1] == "qun") return 3;
          };
          list.sort(function(a, b) {
            var del = groupSort(a) - groupSort(b);
            if (del != 0) return del;
            var aa = a, bb = b;
            if (a.indexOf("_") != -1) {
              a = a.slice(a.indexOf("_") + 1);
            }
            if (b.indexOf("_") != -1) {
              b = b.slice(b.indexOf("_") + 1);
            }
            if (a != b) {
              return a > b ? 1 : -1;
            }
            return aa > bb ? 1 : -1;
          });
          if (lib.storage.hide_alphabet) {
            node.style.display = "none";
          }
          dialog = ui.create.dialog("hidden", "自由选将", node, [list, "character"]);
          dialog.add(ui.create.div(".placeholder"));
          dialog.firstChild.firstChild.firstChild.addEventListener(lib.config.touchscreen ? "touchend" : "click", function() {
            if (_status.dragged) return;
            if (node.style.display == "none") {
              node.style.display = "";
              game.save("hide_alphabet", false);
            } else {
              node.style.display = "none";
              game.save("hide_alphabet", true);
            }
          });
          for (i = 0; i < dialog.buttons.length; i++) {
            dialog.buttons[i].group = lib.character[dialog.buttons[i].link][1];
            dialog.buttons[i].capt = getCapt(dialog.buttons[i].link);
          }
          _status.event.dialogxx = dialog;
        }());
        ui.create.cheat2 = function() {
          ui.cheat2 = ui.create.control("自由选将", function() {
            if (this.dialog == _status.event.dialog) {
              this.dialog.close();
              _status.event.dialog = this.backup;
              this.backup.open();
              delete this.backup;
              game.uncheck();
              game.check();
              if (ui.cheat2x) {
                ui.cheat2x.close();
                delete ui.cheat2x;
              }
            } else {
              ui.cheat2x = ui.create.control("全部", "wei", "shu", "wu", "qun", function(link) {
                if (link == "全部") {
                  ui.dialog.currentcapt = "";
                  ui.dialog.currentgroup = "";
                  for (var i = 0; i < ui.dialog.buttons.length; i++) {
                    ui.dialog.buttons[i].style.display = "";
                  }
                } else {
                  ui.dialog.currentgroup = link;
                  for (var i = 0; i < ui.dialog.buttons.length; i++) {
                    if (ui.dialog.buttons[i].group != link ||
                      (ui.dialog.currentcapt && ui.dialog.buttons[i].capt != ui.dialog.currentcapt)) {
                      ui.dialog.buttons[i].style.display = "none";
                    } else {
                      ui.dialog.buttons[i].style.display = "";
                    }
                  }
                }
              });
              this.backup = _status.event.dialog;
              _status.event.dialog.close();
              _status.event.dialog = _status.event.parent.dialogxx;
              this.dialog = _status.event.dialog;
              this.dialog.open();
              game.uncheck();
              game.check();
            }
          });
        };
        if (!ui.cheat && get.config("change_choice"))
          ui.create.cheat();
        if (!ui.cheat2 && get.config("free_choose"))
          ui.create.cheat2();
        "step 1";
        if (ui.cheat) {
          ui.cheat.close();
          delete ui.cheat;
        }
        if (ui.cheat2) {
          ui.cheat2.close();
          delete ui.cheat2;
        }
        if (ui.cheat2x) {
          ui.cheat2x.close();
          delete ui.cheat2x;
        }
        if (result.buttons.length == 2) {
          game.me.init(result.buttons[0].link, result.buttons[1].link);
        } else {
          game.me.init(result.buttons[0].link);
        }
        event.list.remove(game.me.name);
        event.list.remove(game.me.name2);
        if (game.me.identity == "zhu" && game.players.length > 4) {
          game.me.hp++;
          game.me.maxHp++;
          game.me.update();
        }
        for (var i = 0; i < game.players.length; i++) {
          if (game.players[i] != game.zhu && game.players[i] != game.me) {
            event.ai(game.players[i],
              event.list.splice(0, get.config("choice")[game.players[i].identity]));
          }
        }
      };
    }
  },
  translate: {
    identity_mode: "身份",
    zhu: "主",
    zhong: "忠",
    nei: "内",
    fan: "反",
    cai: "猜",
    zhu2: "主公",
    zhong2: "忠臣",
    nei2: "内奸",
    fan2: "反贼",
    random2: "随机",
    ai_strategy_1: "均衡",
    ai_strategy_2: "偏反",
    ai_strategy_3: "偏主",
    ai_strategy_4: "酱油",
    ai_strategy_5: "天使",
    ai_strategy_6: "仇主"
  },
  element: {
    player: {
      dieSpeak: function() {
        switch (this.identity) {
          case "zhu":
            this.popup("吾降矣", 2000);
            break;
          case "zhong":
            this.popup("呃啊", 2000);
            break;
          case "nei":
            this.popup("啊，被看穿了", 2000);
            break;
          case "fan":
            this.popup("饶命啊", 2000);
            break;
        }
      },
      dieAfter: function(source) {
        if (this.spy) {
          this.identity = this.spy;
          this.setIdentity();
          delete this.spy;
        }
        this.dieSpeak();
        if (get.config("show_identity") && !this.identityShown) {
          this.setIdentity(this.identity);
          this.identityShown = true;
        }
        game.checkResult();
        if (this.identity == "fan" && source) source.draw(3);
        else if (this.identity == "zhong" && source && source.identity == "zhu") {
          source.discard(source.get("he"));
        }
        if (game.zhu.storage.enhance_zhu && get.population("fan") < 3) {
          game.zhu.removeSkill(game.zhu.storage.enhance_zhu);
          delete game.zhu.storage.enhance_zhu;
        }
      },
      logAi: function(targets, card) {
        if (this.ai.shown == 1) return;
        if (typeof targets == "number") {
          this.ai.shown += targets;
        } else {
          var effect = 0, c, shown;
          var info = get.info(card);
          if (info.ai && info.ai.expose) {
            if (this.spy) this.ai.shown -= info.ai.expose;
            else this.ai.shown += info.ai.expose;
          }
          if (targets.length > 0) {
            for (var i = 0; i < targets.length; i++) {
              shown = Math.abs(targets[i].ai.shown);
              if (shown < 0.2 || targets[i].identity == "nei") c = 0;
              else if (shown < 0.4) c = 0.5;
              else if (shown < 0.6) c = 0.8;
              else c = 1;
              effect += ai.get.effect(targets[i], card, this) * c;
            }
          }
          if (effect > 0 && !this.spy) {
            if (effect < 1) c = 0.5;
            else c = 1;
            if (targets.length == 1 && targets[0] == this) ;
            else if (targets.length == 1) this.ai.shown += 0.2 * c;
            else this.ai.shown += 0.1 * c;
          } else if (effect < 0 && this == game.me && game.me.identity != "nei") {
            if (targets.length == 1 && targets[0] == this) ;
            else if (targets.length == 1) this.ai.shown -= 0.2;
            else this.ai.shown -= 0.1;
          } else if (this.spy) {
            if (this.ai.shown > 0.5) this.ai.shown = 0.5;
            if (targets.length == 1 && targets[0] != this) this.ai.shown -= 0.2;
            else this.ai.shown -= 0.1;
          }
        }
        if (this != game.me) this.ai.shown *= 2;
        if (this.ai.shown > 0.95) this.ai.shown = 0.95;
        if (this.ai.shown < -0.5) this.ai.shown = -0.5;
      }
    }
  },
  ai: {
    get: {
      attitude: function(from, to) {
        var x = 0, num = 0, temp, i;
        if (_status.ai.customAttitude) {
          for (i = 0; i < _status.ai.customAttitude.length; i++) {
            temp = _status.ai.customAttitude[i](from, to);
            if (temp != undefined) {
              x += temp;
              num++;
            }
          }
        }
        if (num) {
          return x / num;
        }
        var difficulty = 0;
        if (to == game.me) difficulty = 2 - get.difficulty();
        if (get.config("ai_identity") || from == to || !lib.config.ai_guess || (to.identityShown && !to.spy)) {
          return ai.get.realAttitude(from, to) + difficulty * 1.5;
        } else {
          return ai.get.realAttitude(from, to) * to.ai.shown + difficulty * 1.5;
        }
      },
      realAttitude: function(from, to) {
        if (_status.currentPhase == from && from.ai.tempIgnore && from.ai.tempIgnore.contains(to)) return 0;
        var situation = ai.get.situation();
        var identity = from.spy || from.identity;
        var identity2 = to.identity;
        if (from == to && from.spy) identity2 = from.spy;
        switch (identity) {
          case "zhu":
            switch (identity2) {
              case "zhu":
                return 10;
              case "zhong":
                return 6;
              case "nei":
                if (game.players.length == 2) return -10;
                if (ai.get.situation() > 1) return 0;
                return Math.min(3, get.population("fan"));
              case "fan":
                return -4;
            }
          case "zhong":
            switch (identity2) {
              case "zhu":
                return 10;
              case "zhong":
                return get.population("fan") > 0 ? 4 : -1;
              case "nei":
                if (get.population("fan") == 0) return -2;
                return Math.min(3, -ai.get.situation());
              case "fan":
                return -8;
            }
          case "nei":
            if (identity2 == "zhu" && game.players.length == 2) return -10;
            var strategy = get.aiStrategy();
            if (strategy == 4) {
              if (from == to) return 10;
              return 0;
            }
            var num;
            switch (identity2) {
              case "zhu":
                if (strategy == 6) return -1;
                if (strategy == 5) return 10;
                if (to.hp <= 0) return 10;
                if (ai.get.situation() > 1) num = 0;
                else num = get.population("fan") + Math.max(0, 3 - game.zhu.hp);
                if (strategy == 2) num--;
                if (strategy == 3) num++;
                return num;
              case "zhong":
                if (strategy == 5) return Math.min(0, -ai.get.situation());
                if (strategy == 6) return Math.max(-1, -ai.get.situation());
                if (get.population("fan") == 0) num = -5;
                else if (ai.get.situation() <= 0) num = 0;
                else if (game.zhu && game.zhu.hp < 2) num = 0;
                else if (game.zhu && game.zhu.hp == 2) num = -0.5;
                else num = -2;
                if (strategy == 2) num--;
                if (strategy == 3) num++;
                return num;
              case "nei":
                if (from == to) return 10;
                if (from.ai.friend.contains(to)) return 5;
                return -1;
              case "fan":
                if (strategy == 5) return Math.max(-1, ai.get.situation());
                if (strategy == 6) return Math.min(0, ai.get.situation());
                if ((game.zhu && game.zhu.hp <= 2 && ai.get.situation() <= 0) || ai.get.situation() < -1) num = -3;
                else if (ai.get.situation() < 0 || get.population("zhong") == 0) num = -2;
                else if ((game.zhu && game.zhu.hp > 4 && ai.get.situation() > 0) || ai.get.situation() > 1) num = 1;
                else num = 0;
                if (strategy == 2) num++;
                if (strategy == 3) num--;
                return num;
            }
          case "fan":
            switch (identity2) {
              case "zhu":
                if (ai.get.situation() == 1) return -6;
                if (ai.get.situation() > 1) return -5;
                return -10;
              case "zhong":
                return -7;
              case "nei":
                if (get.population("zhong") == 0) return -7;
                if (game.zhu && game.zhu.hp <= 2) return -1;
                return Math.min(3, ai.get.situation());
              case "fan":
                return 5;
            }
        }
      },
      situation: function(absolute) {
        var i, j, player;
        var zhuzhong = 0, total = 0, zhu, fan = 0;
        for (i = 0; i < game.players.length; i++) {
          player = game.players[i];
          j = player.get("h").length + player.get("e").length * 1.5 + player.hp * 2;
          if (player.skills.contains("benghuai")) {
            j -= player.hp / 1.5;
          }
          if (player.identity == "zhu") {
            zhuzhong += j * 1.2 + 5;
            total += j * 1.2 + 5;
            zhu = j;
          } else if (player.identity == "zhong") {
            zhuzhong += j * 0.8 + 3;
            total += j * 0.8 + 3;
          } else if (player.identity == "fan") {
            zhuzhong -= j + 4;
            total += j + 4;
            fan += j + 4;
          }
        }
        if (absolute) return zhuzhong;
        var result = parseInt(10 * Math.abs(zhuzhong / total));
        if (zhuzhong < 0) result = -result;
        if (zhu < 12 && fan > 30) result--;
        if (zhu < 6 && fan > 15) result--;
        if (zhu < 4) result--;
        return result;
      },
      population: function(identity) {
        return get.population(identity);
      }
    }
  },
  ui: {
    click: {
      identity: function() {
        if (_status.dragged) return;
        _status.clicked = true;
        if (this.parentNode.identityShown) return;
        if (this.parentNode == game.me) return;
        switch (this.firstChild.innerHTML) {
          case "猜":
            this.firstChild.innerHTML = "反";
            this.dataset.color = "fan";
            break;
          case "反":
            this.firstChild.innerHTML = "忠";
            this.dataset.color = "zhong";
            break;
          case "忠":
            this.firstChild.innerHTML = "内";
            this.dataset.color = "nei";
            break;
          case "内":
            this.firstChild.innerHTML = "猜";
            this.dataset.color = "cai";
            break;
        }
      }
    }
  },
  identity: [["zhu", "zhong", "nei", "fan", "cai"], ["fan", "zhong", "nei", "cai"]],
  config: {
    player_number: true,
    double_character: true,
    double_hp: true,
    ban_weak: true,
    enhance_zhu: true,
    free_choose: true,
    change_choice: true,
    change_card: true,
    change_identity: true,
    dierestart: true,
    swap: true,
    revive: true,
    auto_identity: true,
    ai_strategy: true,
    ai_identity: true,
    difficulty: true
  }
};
