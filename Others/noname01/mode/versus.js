mode.versus = {
  game: {
    start: function() {
      var next = game.createEvent("game", false);
      next.content = function() {
        "step 0";
        if (lib.storage.choice == undefined) game.save("choice", 20);
        if (lib.storage.zhu == undefined) game.save("zhu", true);
        if (lib.storage.noreplace_end == undefined) game.save("noreplace_end", true);
        if (lib.storage.autoreplaceinnerhtml == undefined) game.save("autoreplaceinnerhtml", true);
        if (lib.storage.only_zhu == undefined) game.save("only_zhu", true);
        if (lib.storage.single_control == undefined) game.save("single_control", true);
        if (lib.storage.control_all == undefined) game.save("control_all", true);
        if (lib.storage.number == undefined) game.save("number", 3);
        if (lib.storage.replace_number == undefined) game.save("replace_number", 3);
        ui.create.arena();
        ui.auto.hide();
        ui.wuxie.hide();
        game.delay();
        "step 1";
        game.chooseCharacter();
        "step 2";
        event.trigger("gameStart");
        game.gameDraw(game.players[0]);
        _status.round = 0;
        if (lib.storage.single_control) {
          lib.skill.global.push("versus_swap");
          // ui.autoreplace=ui.create.system(lib.storage.autoreplaceinnerhtml||'自动切换',game.switchAutoreplace,true);
          ui.autoreplace = ui.create.div(".caption.normal");
          ui.autoreplace.innerHTML = "<div class=\"underline\">自动换人</div>";
          ui.autoreplace.style.textAlign = "center";
          if (lib.storage.autoreplaceinnerhtml) {
            ui.autoreplace.classList.add("on");
          }
          ui.autoreplace.listen(game.switchAutoreplace);

          ui.versusreplace = ui.create.system("换人", null, true);
          ui.versushs = ui.create.system("手牌", null, true);
          ui.versusreplace.addEventListener(lib.config.touchscreen ? "touchstart" : "mouseenter", game.versusHoverReplace);
          ui.versushs.addEventListener(lib.config.touchscreen ? "touchstart" : "mouseenter", game.versusHoverHandcards);
        }
        _status.friendCount = ui.create.system("我方阵亡：" + get.cnNumber(0), null, true);
        _status.enemyCount = ui.create.system("敌方阵亡：" + get.cnNumber(0), null, true);
        _status.friendCount.addEventListener(lib.config.touchscreen ? "touchstart" : "mouseenter", game.versusHoverFriend);
        _status.enemyCount.addEventListener(lib.config.touchscreen ? "touchstart" : "mouseenter", game.versusHoverEnemy);

        if (lib.storage.zhu) {
          _status.currentSide = true;
          game.versusPhaseLoop((_status.currentSide == game.me.side) ? game.friendZhu : game.enemyZhu);
        } else {
          game.versusPhaseLoop(game.players[Math.floor(Math.random() * game.players.length)]);
        }
      };
    },
    chooseCharacter: function() {
      var next = game.createEvent("chooseCharacter", false);
      next.showConfig = true;
      next.content = function() {
        "step 0";
        event.check = function() {
          this.dialog.style.top = "40px";
          this.dialog.style.left = "calc(5% + 60px)";
          this.dialog.style.width = "calc(90% - 120px)";
          this.dialog.style.height = "calc(100% - 80px)";
          this.dialog.classList.add("noslide");
          for (var i = 0; i < this.dialog.buttons.length; i++) this.dialog.buttons[i].style.opacity = 1;
          this.dialog.add("选项");
          // this.dialog.add(ui.create.div('.placeholder'));
          this.dialog.versus_zhu = this.dialog.add(ui.create.switcher("versus_zhu", lib.storage.zhu)).querySelector(".toggle");
          this.dialog.versus_only_zhu = this.dialog.add(ui.create.switcher("versus_only_zhu", lib.storage.only_zhu)).querySelector(".toggle");
          this.dialog.versus_main_zhu = this.dialog.add(ui.create.switcher("versus_main_zhu", lib.storage.main_zhu)).querySelector(".toggle");
          if (lib.storage.zhu) {
            this.dialog.versus_only_zhu.parentNode.classList.remove("disabled");
            this.dialog.versus_main_zhu.parentNode.classList.remove("disabled");
          } else {
            this.dialog.versus_only_zhu.parentNode.classList.add("disabled");
            this.dialog.versus_main_zhu.parentNode.classList.add("disabled");
          }
          // this.dialog.versus_replace=this.dialog.add(ui.create.switcher('versus_replace',lib.storage.replace)).querySelector('.toggle');
          this.dialog.versus_assign_enemy = this.dialog.add(ui.create.switcher("versus_assign_enemy", lib.storage.assign_enemy)).querySelector(".toggle");
          this.dialog.versus_random_seat = this.dialog.add(ui.create.switcher("versus_random_seat", lib.storage.random_seat)).querySelector(".toggle");
          this.dialog.versus_noreplace_end = this.dialog.add(ui.create.switcher("versus_noreplace_end", lib.storage.noreplace_end)).querySelector(".toggle");
          this.dialog.versus_single_control = this.dialog.add(ui.create.switcher("versus_single_control", lib.storage.single_control)).querySelector(".toggle");
          this.dialog.versus_control_all = this.dialog.add(ui.create.switcher("versus_control_all", lib.storage.control_all)).querySelector(".toggle");
          this.dialog.versus_die_stop = this.dialog.add(ui.create.switcher("versus_die_stop", lib.storage.die_stop)).querySelector(".toggle");
          this.dialog.versus_number = this.dialog.add(ui.create.switcher("versus_number", [1, 2, 3], lib.storage.number)).querySelector(".toggle");
          this.dialog.replace_number = this.dialog.add(ui.create.switcher("replace_number", [0, 1, 2, 3, 4, 5, 7, 9, 17], lib.storage.replace_number)).querySelector(".toggle");
          this.dialog.choice = this.dialog.add(ui.create.switcher("choice", [12, 16, 20, 24, 40, "∞"], lib.storage.choice)).querySelector(".toggle");

          // this.dialog.add(ui.create.div('.placeholder'));
          // this.dialog.add(ui.create.div('.placeholder'));
        };
        event.confirm = function() {
          var dialog = event.dialog;
          var num = lib.storage.number + lib.storage.replace_number;
          _status.friend.splice(num);
          _status.enemy.splice(num);
          dialog.close();
          if (ui.confirm) ui.confirm.close();
          game.resume();
        };
        ui.control.style.transition = "all 0s";
        ui.control.style.top = "calc(100% - 30px)";
        _status.friend = [];
        _status.enemy = [];
        _status.color = Math.random() < 0.5;
        var i, list = [];
        for (i in lib.character) {
          if (lib.config.forbidai.contains(i)) continue;
          if (lib.config.forbidversus.contains(i)) continue;
          if (get.config("ban_weak") && lib.config.forbidsingle.contains(i)) continue;
          if (get.config("ban_weak") && lib.config.forbidall.contains(i)) continue;
          list.push(i);
        }
        var groupSort = function(name) {
          if (lib.character[name][1] == "wei") return 0;
          if (lib.character[name][1] == "shu") return 1;
          if (lib.character[name][1] == "wu") return 2;
          if (lib.character[name][1] == "qun") return 3;
        };
        var sortByGroup = function(a, b) {
          var del = groupSort(a) - groupSort(b);
          if (del != 0) return del;
          if (a.indexOf("_") != -1) {
            a = a.slice(a.indexOf("_") + 1);
          }
          if (b.indexOf("_") != -1) {
            b = b.slice(b.indexOf("_") + 1);
          }
          return a > b ? 1 : -1;
        };
        if (lib.storage.choice == "∞") {
          list.sort(sortByGroup);
        } else {
          list.sort(lib.sort.random);
        }
        _status.list = list;
        var choice = (lib.storage.choice == "∞") ? list.length : lib.storage.choice;
        event.dialog = ui.create.dialog("选择角色", [list.slice(0, choice), "character"]);
        // for(var i=0;i<event.dialog.buttons.length;i++){
        // 	event.dialog.buttons[i].style.transform='scale(0.95)';
        // }
        event.check();
        ui.create.cheat = function() {
          ui.cheat = ui.create.control("更换", function() {
            if (lib.storage.choice == "∞") {
              list.sort(sortByGroup);
            } else {
              list.sort(lib.sort.random);
            }
            event.dialog.close();
            _status.friend.length = 0;
            _status.enemy.length = 0;
            var choice = (lib.storage.choice == "∞") ? list.length : lib.storage.choice;
            event.dialog = ui.create.dialog("选择角色", [list.slice(0, choice), "character"]);
            event.check();
          });
        };
        if (!ui.cheat && get.config("change_choice"))
          ui.create.cheat();
        event.fill = ui.create.control("补全", function() {
          delete _status.choosefinished;
          arguments[1].parentNode.close();
          var buttons = _status.event.dialog.buttons.slice(0);
          buttons.sort(lib.sort.random);
          for (var i = 0; i < buttons.length; i++) {
            if (buttons[i].classList.contains("glow") || buttons[i].classList.contains("selected")) {
              buttons.splice(i, 1);
              i--;
            }
          }
          var dialog = _status.event.dialog;
          var max = dialog.versus_number.link + dialog.replace_number.link;
          for (var i = 0; i < buttons.length; i++) {
            if (_status.friend.length < max) {
              _status.friend.push(buttons[i].link);
            } else if (_status.enemy.length < max) {
              _status.enemy.push(buttons[i].link);
            } else {
              break;
            }
          }
          _status.friend.splice(max);
          _status.enemy.splice(max);
          dialog.close();
          if (ui.confirm) ui.confirm.close();
          game.resume();
        });
        event.custom.replace.button = function(button) {
          if (_status.choose_enemy) {
            if (button.classList.contains("glow") || button.classList.contains("selected") || _status.choosefinished) return;
            _status.choose_enemy = false;
            if (!_status.color) {
              button.classList.add("selected");
              // button.style.transform='rotate(-3deg)';
            } else {
              button.classList.add("glow");
              // button.style.transform='rotate(-3deg)';
            }
            _status.enemy.push(button.link);
            var buttons = _status.event.dialog.buttons.slice(0);
            for (var i = 0; i < buttons.length; i++) {
              if (buttons[i].classList.contains("glow") || buttons[i].classList.contains("selected")) {
                buttons.splice(i, 1);
                i--;
              }
            }
          } else {
            if (button.classList.contains("glow") || button.classList.contains("selected") || _status.choosefinished) return;
            if (_status.color) {
              button.classList.add("selected");
              // button.style.transform='rotate(-3deg)';
            } else {
              button.classList.add("glow");
              // button.style.transform='rotate(-3deg)';
            }
            _status.friend.push(button.link);
            var buttons = _status.event.dialog.buttons.slice(0);
            for (var i = 0; i < buttons.length; i++) {
              if (buttons[i].classList.contains("glow") || buttons[i].classList.contains("selected")) {
                buttons.splice(i, 1);
                i--;
              }
            }
            if (lib.storage.assign_enemy) {
              _status.choose_enemy = true;
            } else {
              var button2 = buttons[Math.floor(Math.random() * buttons.length)];
              if (_status.color) {
                button2.classList.add("glow");
                // button2.style.transform='rotate(-3deg)';
              } else {
                button2.classList.add("selected");
                // button2.style.transform='rotate(-3deg)';
              }
              _status.enemy.push(button2.link);
              _status.event.dialog.content.firstChild.innerHTML = "对方选择了" + get.translation(button2.link);
            }
          }
        };
        event.custom.add.window = function() {
          var dialog = _status.event.dialog;
          if (_status.friend.length == _status.enemy.length && _status.friend.length >= dialog.versus_number.link + dialog.replace_number.link) {
            // if(!ui.confirm) ui.confirm=ui.create.control('start',_status.event.confirm);
            event.fill.firstChild.innerHTML = "开始";
            _status.choosefinished = true;
          }
          game.save("zhu", dialog.versus_zhu.link);
          if (lib.storage.zhu) {
            dialog.versus_only_zhu.parentNode.classList.remove("disabled");
            dialog.versus_main_zhu.parentNode.classList.remove("disabled");
          } else {
            dialog.versus_only_zhu.parentNode.classList.add("disabled");
            dialog.versus_main_zhu.parentNode.classList.add("disabled");
          }
          game.save("only_zhu", dialog.versus_only_zhu.link);
          game.save("main_zhu", dialog.versus_main_zhu.link);
          // game.save('replace',dialog.versus_replace.link);
          game.save("assign_enemy", dialog.versus_assign_enemy.link);
          game.save("random_seat", dialog.versus_random_seat.link);
          game.save("noreplace_end", dialog.versus_noreplace_end.link);
          game.save("single_control", dialog.versus_single_control.link);
          if (lib.storage.single_control) {
            dialog.versus_control_all.parentNode.classList.remove("disabled");
          } else {
            dialog.versus_control_all.parentNode.classList.add("disabled");
          }
          game.save("control_all", dialog.versus_control_all.link);
          game.save("die_stop", dialog.versus_die_stop.link);
          game.save("number", dialog.versus_number.link);
          game.save("replace_number", dialog.replace_number.link);
          game.save("choice", dialog.choice.link);
          var count, i;
          if (dialog.buttons.length > lib.storage.choice) {
            count = dialog.buttons.length - lib.storage.choice;
            var removed = [];
            for (i = dialog.buttons.length - 1; i >= 0 && count > 0; i--) {
              if (dialog.buttons[i].classList.contains("target") == false &&
                dialog.buttons[i].classList.contains("glow") == false) {
                dialog.buttons[i].remove();
                _status.list.remove(dialog.buttons[i].link);
                removed.push(dialog.buttons[i].link);
                dialog.buttons.splice(i, 1);
                count--;
              }
            }
            for (i = 0; i < removed.length; i++) _status.list.splice(lib.storage.choice, 0, removed[i]);
          } else if (dialog.buttons.length < lib.storage.choice || lib.storage.choice == "∞") {
            var list = _status.list;
            var choice = (lib.storage.choice == "∞") ? list.length : lib.storage.choice;
            var buttons = dialog.querySelector(".buttons");
            var button;
            for (i = dialog.buttons.length; i < choice; i++) {
              button = ui.create.button(list[i], "character", buttons).animate("zoom");
              dialog.buttons.push(button);
              button.style.opacity = 1;
            }
          }
        };
        game.pause();
        "step 1";
        _status.friendDied = [];
        _status.enemyDied = [];

        ui.auto.show();
        ui.wuxie.show();
        if (ui.cheat) {
          ui.cheat.close();
          delete ui.cheat;
        }
        ui.control.style.top = "";
        ui.control.style.transition = "";
        delete _status.list;
        var num = lib.storage.number;
        ui.create.players(num * 2);
        if (lib.storage.single_control && lib.storage.control_all && game.players.length >= 4) {
          ui.arena.dataset.number = parseInt(ui.arena.dataset.number) + 1;
          for (var i = 0; i < game.players.length; i++) {
            game.players[i].dataset.position = parseInt(game.players[i].dataset.position) + 1;
          }
          ui.fakeme = ui.create.div(".player", ui.arena);
          ui.fakeme.dataset.position = 0;
          ui.fakeme.line = lib.element.player.line;
          ui.fakemebg = ui.create.div(".avatar", ui.fakeme).hide();
        }
        ui.create.me();
        ui.create.cards();
        game.finishCards();
        var position, i;
        if (lib.storage.zhu && lib.storage.only_zhu) position = Math.ceil(num / 2) - 1;
        else position = Math.floor(Math.random() * num);
        game.friend = [];
        game.enemy = [];
        if (lib.storage.random_seat) {
          var players = game.players.slice(0);
          game.friend.push(game.me);
          players.remove(game.me);
          for (i = 0; i < num - 1; i++) {
            game.friend.push(players.randomRemove());
          }
          for (i = 0; i < num; i++) {
            game.enemy.push(players.randomRemove());
          }
        } else {
          for (i = 0; i < position; i++) {
            game.friend.push(game.players[i - position + num * 2]);
          }
          for (i = position; i < num; i++) {
            game.friend.push(game.players[i - position]);
          }
          for (i = 0; i < num; i++) {
            game.enemy.push(game.players[num - position + i]);
          }
        }
        if (((position == Math.ceil(num / 2) - 1 && lib.storage.zhu) || (lib.storage.zhu && lib.storage.single_control))) {
          var dialog = ui.create.dialog("按顺序选择出场角色", [_status.friend, "character"]);
          game.me.chooseButton(dialog, num, true);
        }
        if (lib.storage.random_seat && lib.storage.zhu) {
          if (lib.storage.only_zhu) {
            game.friendZhu = game.me;
          } else {
            game.friendZhu = game.friend.randomGet();
          }
          game.enemyZhu = game.enemy.randomGet();
        }
        for (i = 0; i < num; i++) {
          game.friend[i].side = _status.color;
          game.enemy[i].side = !_status.color;
          if (lib.storage.random_seat && lib.storage.zhu) {
            // console.log(i,game.friend[i].dataset.position,game.enemy[i].dataset.position);
            if (game.friendZhu == game.friend[i]) {
              game.friend[i].identity = "zhu";
              game.friend[i].setIdentity(_status.color + "Zhu");
            } else {
              game.friend[i].identity = "zhong";
              game.friend[i].setIdentity(_status.color + "Zhong");
            }
            if (game.enemyZhu == game.enemy[i]) {
              game.enemy[i].identity = "zhu";
              game.enemy[i].setIdentity(!_status.color + "Zhu");
            } else {
              game.enemy[i].identity = "zhong";
              game.enemy[i].setIdentity(!_status.color + "Zhong");
            }
          } else {
            if (i == Math.ceil(num / 2) - 1 && lib.storage.zhu) {
              game.friend[i].identity = "zhu";
              game.friend[i].setIdentity(_status.color + "Zhu");
              game.friendZhu = game.friend[i];
              game.enemy[i].identity = "zhu";
              game.enemy[i].setIdentity(!_status.color + "Zhu");
              game.enemyZhu = game.enemy[i];
            } else {
              game.friend[i].identity = "zhong";
              game.friend[i].setIdentity(_status.color + "Zhong");
              game.enemy[i].identity = "zhong";
              game.enemy[i].setIdentity(!_status.color + "Zhong");
            }
          }
          game.friend[i].node.identity.dataset.color = get.translation(_status.color + "Color");
          game.enemy[i].node.identity.dataset.color = get.translation(!_status.color + "Color");
          // game.friend[i].node.identity.style.backgroundColor=get.translation(_status.color+'Color');
          // game.enemy[i].node.identity.style.backgroundColor=get.translation(!_status.color+'Color');
        }
        "step 2";
        var num = lib.storage.number;
        if (result && result.buttons) {
          var list = [];
          for (i = 0; i < result.buttons.length; i++) {
            list.push(result.buttons[i].link);
            _status.friend.remove(result.buttons[i].link);
          }
          _status.friend = list.concat(_status.friend);
        }
        for (i = 0; i < num; i++) {
          game.friend[i].init(_status.friend[i]);
          game.enemy[i].init(_status.enemy[i]);

          game.friend[i].node.identity.dataset.color = get.translation(_status.color + "Color");
          game.enemy[i].node.identity.dataset.color = get.translation(!_status.color + "Color");
        }
        if (lib.storage.zhu && lib.storage.main_zhu) {
          game.friendZhu.maxHp++;
          game.friendZhu.hp++;
          game.friendZhu.update();

          game.enemyZhu.maxHp++;
          game.enemyZhu.hp++;
          game.enemyZhu.update();
        }
        _status.friend.splice(0, num);
        _status.enemy.splice(0, num);
        if (lib.storage.single_control && lib.storage.control_all) {
          ui.fakemebg.show();
          game.onSwapControl();
        }
      };
    },
    versusPhaseLoop: function(player) {
      var next = game.createEvent("phaseLoop");
      next.player = player;
      next.content = function() {
        "step 0";
        if (lib.storage.zhu) {
          player.classList.add("acted");
        }
        player.phase();
        "step 1";
        if (lib.storage.zhu) {
          _status.currentSide = !_status.currentSide;
          _status.round++;
          if (_status.round >= 2 * Math.max(game.friend.length, game.enemy.length)) {
            _status.round = 0;
            for (var i = 0; i < game.players.length; i++) {
              game.players[i].classList.remove("acted");
            }
          }
          var list = (_status.currentSide == game.me.side) ? game.friend.slice(0) : game.enemy.slice(0);
          for (var i = 0; i < list.length; i++) {
            if (list[i].classList.contains("acted")) {
              list.splice(i, 1);
              i--;
            }
          }
          if (list.length == 0) event.redo();
          else if (list.length == 1 || (game.me != game.friendZhu && !lib.storage.single_control) || _status.currentSide != game.me.side) {
            list.sort(function(a, b) {
              if (a.num("j") > b.num("j")) return 1;
              return a.hp - b.hp;
            });
            event.player = list[0];
            event.goto(0);
          } else {
            game.me.chooseTarget("选择要行动的角色", true, function(card, player, target) {
              return (target.classList.contains("acted") == false && target.side == game.me.side);
            });
          }
        } else {
          event.player = event.player.next;
          event.goto(0);
        }
        "step 2";
        event.player = result.targets[0];
        event.goto(0);
      };
    },
    replacePlayer: function(player) {
      var next = game.createEvent("replacePlayer");
      next.source = player;
      next.content = function() {
        "step 0";
        var list = (source.side == game.me.side) ? _status.friend : _status.enemy;
        if (list.length == 0) {
          // if(game.friend.contains(source)){
          // 	game.over(false);
          // }
          // else{
          // 	game.over(true);
          // }
          game.friend.remove(source);
          game.enemy.remove(source);
          if (game.friend.length == 0) game.over(false);
          else if (game.enemy.length == 0) game.over(true);
          if (game.friendZhu && game.friendZhu.classList.contains("dead") && game.friend.length) {
            game.friendZhu = game.friend[0];
            game.friendZhu.setIdentity(_status.color + "Zhu");
          }
          if (game.enemyZhu && game.enemyZhu.classList.contains("dead") && game.enemy.length) {
            game.enemyZhu = game.enemy[0];
            game.enemyZhu.setIdentity(!_status.color + "Zhu");
          }
          event.finish();
          return;
        }
        if (source.side == game.me.side && list.length > 1 && (game.me == game.friendZhu || (lib.storage.zhu && lib.storage.single_control)) &&
          !_status.auto) {
          event.dialog = ui.create.dialog("选择替补角色", [list, "character"]);
          event.filterButton = function() {
            return true;
          };
          event.player = game.me;
          event.forced = true;
          event.custom.replace.confirm = function() {
            event.character = ui.selected.buttons[0].link;
            event.dialog.close();
            if (ui.confirm) ui.confirm.close();
            delete event.player;
            game.resume();
          };
          game.check();
          game.pause();
        } else {
          event.character = list[Math.floor(Math.random() * list.length)];
        }
        "step 1";
        _status.friend.remove(event.character);
        _status.enemy.remove(event.character);
        source.revive();
        source.uninit();
        source.init(event.character);
        source.node.identity.dataset.color = get.translation(source.side + "Color");
        source.draw(4);
        if (lib.storage.die_stop) {
          _status.event.parent.parent.parent.untrigger(true);
        }
        if (lib.storage.single_control && lib.storage.control_all) {
          game.onSwapControl();
        }
      };
    },
    swapSeat: function() {
      ;
    },
    versusClickToSwap: function(e) {
      if (_status.dragged) return;
      if (this.link == game.me) {
        if (!this.classList.contains("buttonclick")) {
          this.animate("buttonclick");
        }
      } else if (_status.event.player == game.me && !_status.auto) {
        game.me.popup("请稍后再换人");
        e.stopPropagation();
      } else {
        game.versusSwapControl(this.link);
      }
    },
    versusCheckHandcards: function() {
      _status.clicked = true;
      var i, translation, intro, str;
      if (ui.intro) {
        ui.intro.close();
        if (ui.intro.source == "versusCheckHandcards") {
          delete ui.intro;
          ui.control.show();
          game.resume2();
          return;
        }
      }
      game.pause2();
      ui.control.hide();
      ui.intro = ui.create.dialog();
      ui.intro.source = "versusCheckHandcards";

      ui.intro.add(ui.autoreplace);
      var players = [];
      for (var i = 0; i < game.players.length; i++) {
        if (game.players[i].side == game.me.side) {
          players.push(game.players[i]);
        }
      }
      ui.intro.add(players, true);
      var buttons = ui.intro.querySelectorAll(".button");
      for (var i = 0; i < buttons.length; i++) {
        buttons[i].addEventListener(lib.config.touchscreen ? "touchend" : "click", game.versusClickToSwap);
      }

      for (var i = 0; i < game.players.length; i++) {
        if (game.players[i].side == game.me.side && game.players[i] != game.me) {
          ui.intro.add(get.translation(game.players[i]));
          var cards = game.players[i].get("h");
          if (cards.length) {
            ui.intro.add(cards, true);
          } else {
            ui.intro.add("（无）");
          }
        }
      }
    },
    versusHoverEnemy: function(e) {
      if (this._uiintro) {
        return;
      }
      if (ui.versushover && ui.versushover._uiintro) {
        ui.versushover._uiintro.delete();
        delete ui.versushover._uiintro;
      }
      ui.versushover = this;
      var uiintro = ui.create.dialog("hidden");
      uiintro.classList.add("popped");
      uiintro.classList.add("static");
      this._uiintro = uiintro;

      if (_status.enemyDied.length) {
        uiintro.add("已阵亡");
        uiintro.add([_status.enemyDied, "character"]);
      }

      uiintro.add("未上场");
      if (_status.enemy.length) {
        uiintro.add([_status.enemy, "character"]);
      } else {
        uiintro.add("（无）");
      }

      ui.window.appendChild(uiintro);
      uiintro.style.width = "330px";
      uiintro.style.height = Math.min(ui.window.offsetHeight - 260, uiintro.content.scrollHeight) + "px";
      uiintro.style.top = "50px";
      uiintro.style.left = (_status.enemyCount.parentNode.offsetLeft + _status.enemyCount.offsetLeft +
        _status.enemyCount.offsetWidth - 330) + "px";
      uiintro.addEventListener(lib.config.touchscreen ? "touchend" : "mouseleave", function() {
        if (_status.dragged) return;
        this.delete();
        setTimeout(function() {
          delete _status.enemyCount._uiintro;
        }, 500);
      });
    },
    versusHoverFriend: function(e) {
      if (this._uiintro) {
        return;
      }
      if (ui.versushover && ui.versushover._uiintro) {
        ui.versushover._uiintro.delete();
        delete ui.versushover._uiintro;
      }
      ui.versushover = this;
      var uiintro = ui.create.dialog("hidden");
      uiintro.classList.add("popped");
      uiintro.classList.add("static");
      this._uiintro = uiintro;

      if (_status.friendDied.length) {
        uiintro.add("已阵亡");
        uiintro.add([_status.friendDied, "character"]);
      }

      uiintro.add("未上场");
      if (_status.friend.length) {
        uiintro.add([_status.friend, "character"]);
      } else {
        uiintro.add("（无）");
      }

      ui.window.appendChild(uiintro);
      uiintro.style.width = "330px";
      uiintro.style.height = Math.min(ui.window.offsetHeight - 260, uiintro.content.scrollHeight) + "px";
      uiintro.style.top = "50px";
      uiintro.style.left = (_status.friendCount.parentNode.offsetLeft + _status.friendCount.offsetLeft + _status.friendCount.offsetWidth / 2 - 165) + "px";
      uiintro.addEventListener(lib.config.touchscreen ? "touchend" : "mouseleave", function() {
        if (_status.dragged) return;
        this.delete();
        setTimeout(function() {
          delete _status.friendCount._uiintro;
        }, 500);
      });
    },
    versusHoverReplace: function(e) {
      if (this._uiintro) {
        return;
      }
      if (ui.versushover && ui.versushover._uiintro) {
        ui.versushover._uiintro.delete();
        delete ui.versushover._uiintro;
      }
      ui.versushover = this;
      var uiintro = ui.create.dialog("hidden");
      uiintro.classList.add("popped");
      uiintro.classList.add("static");
      this._uiintro = uiintro;

      uiintro.add(ui.autoreplace);
      var players = [];
      for (var i = 0; i < game.players.length; i++) {
        if (game.players[i].side == game.me.side) {
          players.push(game.players[i]);
        }
      }
      uiintro.add(players, true);
      var buttons = uiintro.querySelectorAll(".button");
      for (var i = 0; i < buttons.length; i++) {
        buttons[i].addEventListener(lib.config.touchscreen ? "touchend" : "click", game.versusClickToSwap);
      }

      ui.window.appendChild(uiintro);
      uiintro.style.width = "330px";
      uiintro.style.height = Math.min(ui.window.offsetHeight - 260, uiintro.content.scrollHeight) + "px";
      uiintro.style.top = "50px";
      uiintro.style.left = (ui.versusreplace.parentNode.offsetLeft + ui.versusreplace.offsetLeft + ui.versusreplace.offsetWidth / 2 - 165) + "px";
      uiintro.addEventListener(lib.config.touchscreen ? "touchend" : "mouseleave", function() {
        if (_status.dragged) return;
        this.delete();
        setTimeout(function() {
          delete ui.versusreplace._uiintro;
        }, 500);
      });
    },
    versusHoverHandcards: function(e) {
      if (this._uiintro) {
        return;
      }
      if (ui.versushover && ui.versushover._uiintro) {
        ui.versushover._uiintro.delete();
        delete ui.versushover._uiintro;
      }
      ui.versushover = this;
      var uiintro = ui.create.dialog("hidden");
      uiintro.classList.add("popped");
      uiintro.classList.add("static");
      this._uiintro = uiintro;
      for (var i = 0; i < game.players.length; i++) {
        if (game.players[i].side == game.me.side && game.players[i] != game.me) {
          uiintro.add(get.translation(game.players[i]));
          var cards = game.players[i].get("h");
          if (cards.length) {
            uiintro.add(cards, true);
          } else {
            uiintro.add("（无）");
          }
        }
      }
      ui.window.appendChild(uiintro);
      uiintro.style.width = "330px";
      uiintro.style.height = Math.min(ui.window.offsetHeight - 260, uiintro.content.scrollHeight) + "px";
      uiintro.style.top = "50px";
      uiintro.style.left = (ui.versushs.parentNode.offsetLeft + ui.versushs.offsetLeft + ui.versushs.offsetWidth / 2 - 165) + "px";
      uiintro.addEventListener(lib.config.touchscreen ? "touchend" : "mouseleave", function() {
        if (_status.dragged) return;
        this.delete();
        setTimeout(function() {
          delete ui.versushs._uiintro;
        }, 500);
      });
    },
    versusCheckEnemy: function() {
      _status.clicked = true;
      var i, translation, intro, str;
      if (ui.intro) {
        ui.intro.close();
        if (ui.intro.source == "versusCheckEnemy") {
          delete ui.intro;
          ui.control.show();
          game.resume2();
          return;
        }
      }
      game.pause2();
      ui.control.hide();
      ui.intro = ui.create.dialog();
      ui.intro.source = "versusCheckEnemy";


      if (_status.enemyDied.length) {
        ui.intro.add("已阵亡");
        ui.intro.add([_status.enemyDied, "character"]);
      }

      ui.intro.add("未上场");
      if (_status.enemy.length) {
        ui.intro.add([_status.enemy, "character"]);
      } else {
        ui.intro.add("（无）");
      }
    },
    versusCheckFriend: function() {
      _status.clicked = true;
      var i, translation, intro, str;
      if (ui.intro) {
        ui.intro.close();
        if (ui.intro.source == "versusCheckFriend") {
          delete ui.intro;
          ui.control.show();
          game.resume2();
          return;
        }
      }
      game.pause2();
      ui.control.hide();
      ui.intro = ui.create.dialog();
      ui.intro.source = "versusCheckFriend";


      if (_status.friendDied.length) {
        ui.intro.add("已阵亡");
        ui.intro.add([_status.friendDied, "character"]);
      }

      ui.intro.add("未上场");
      if (_status.friend.length) {
        ui.intro.add([_status.friend, "character"]);
      } else {
        ui.intro.add("（无）");
      }
    },
    versusSwapPlayer: function() {
      if (ui.intro) {
        ui.intro.close();
        if (ui.intro.source == "versusSwapPlayer") {
          delete ui.intro;
          ui.control.show();
          game.resume2();
          return;
        }
      }
      if ((_status.event.player == game.me && _status.paused) || _status.paused2) {
        game.me.popup("请稍后再换人");
      } else {
        _status.clicked = true;
        var i, translation, intro, str;
        if (ui.intro) {
          ui.intro.close();
          if (ui.intro.source == this.parentNode) {
            delete ui.intro;
            ui.control.show();
            game.resume2();
            return;
          }
        }
        game.pause2();
        ui.control.hide();
        ui.intro = ui.create.dialog();
        ui.intro.source = "versusSwapPlayer";
        var players = [];
        for (var i = 0; i < game.players.length; i++) {
          if (game.players[i].side == game.me.side && game.players[i] != game.me) {
            players.push(game.players[i]);
          }
        }
        ui.intro.add(players, true);
        var buttons = ui.intro.querySelectorAll(".button");
        for (var i = 0; i < buttons.length; i++) {
          buttons[i].addEventListener(lib.config.touchscreen ? "touchend" : "click", game.versusClickToSwap);
        }
      }
    },
    switchAutoreplace: function(e) {
      e.stopPropagation();
      this.classList.toggle("on");
      game.save("autoreplaceinnerhtml", this.classList.contains("on"));
    },
    onSwapControl: function(e) {
      var name = game.me.name;
      if (ui.fakeme && ui.fakeme.current != name) {
        ui.fakeme.current = name;
        if (ui.versushighlight && ui.versushighlight != game.me) {
          ui.versushighlight.node.avatar.classList.remove("glow2");
        }
        ui.versushighlight = game.me;
        game.me.node.avatar.classList.add("glow2");
        game.me.line(ui.fakeme, { opacity: 0.5, dashed: true });

        var info = lib.character[name];
        if (lib.config.layout == "newlayout" && info[4] && info[4].contains("fullskin")) {
          ui.fakeme.classList.add("fullskin");
          ui.fakemebg.style.backgroundImage = "url(\"image/character/fullskin/" + name + ".jpg\")";
          ui.fakemebg.style.backgroundSize = "cover";
        } else {
          ui.fakeme.classList.remove("fullskin");
          ui.fakemebg.setBackground(name, "character");
        }
      }
    },
    versusSwapControl: function(player) {
      if (lib.storage.control_all) {
        game.swapControl(player);
      } else {
        game.swapPlayer(player);
      }
    },
    updateLineMe: function(opacity, player) {
      if (!player) {
        player = game.me;
      }
      ui.lineme.width = ui.window.offsetWidth;
      ui.lineme.height = ui.window.offsetHeight;

      var ctx = ui.linemectx;
      ctx.shadowBlur = 5;
      ctx.shadowColor = "rgba(0,0,0,0.3)";
      ctx.fillStyle = "white";
      if (typeof opacity != "number") {
        opacity = 0.5;
      }
      ctx.strokeStyle = "rgba(255,255,255," + opacity + ")";
      ctx.lineWidth = 3;
      ctx.setLineDash([8, 2]);

      ctx.beginPath();

      var startx, endx, pos;
      var endy = game.me.offsetHeight / 2 + game.me.offsetTop + ui.arena.offsetTop;
      var starty = ui.me.offsetTop + ui.arena.offsetTop + ui.me.offsetHeight / 2;
      if (game.me.offsetLeft + game.me.offsetWidth / 2 <= ui.arena.offsetWidth / 2) {
        startx = ui.me.offsetLeft + ui.arena.offsetLeft;
        endx = game.me.offsetLeft + ui.arena.offsetLeft;
        pos = -1;
      } else {
        startx = ui.me.offsetLeft + ui.arena.offsetLeft + ui.me.offsetWidth;
        endx = game.me.offsetWidth + game.me.offsetLeft + ui.arena.offsetLeft;
        pos = 1;
      }
      ctx.moveTo(startx, starty);
      startx += pos * ui.arena.offsetLeft / 2;
      ctx.quadraticCurveTo(startx, starty, startx, starty - (starty - endy) / 2);
      ctx.quadraticCurveTo(startx, endy, endx, endy);
      ctx.stroke();
    }
  },
  translate: {
    versus_mode: "对决",
    trueZhu: "帅",
    falseZhu: "将",
    trueZhong: "兵",
    falseZhong: "卒",
    trueColor: "zhu",
    falseColor: "wei",
    versus_zhu_config: "启用主将",
    versus_only_zhu_config: "只当主将",
    versus_die_stop_config: "死亡后终止结算",
    versus_main_zhu_config: "主将死亡后结束",
    versus_replace_config: "死亡后自动换人",
    versus_assign_enemy_config: "指定对手",
    versus_random_seat_config: "随机座位",
    versus_noreplace_end_config: "无替补时结束",
    versus_single_control_config: "单人控制",
    versus_control_all_config: "固定控制位置",
    versus_number_config: "对阵人数",
    replace_number_config: "替补人数",
    choice_config: "候选人数"
  },
  skill: {
    versus_swap: {
      trigger: {
        player: ["phaseBegin", "chooseToUseBegin", "chooseToRespondBegin", "chooseToDiscardBegin", "chooseToCompareBegin",
          "chooseButtonBegin", "chooseCardBegin", "chooseTargetBegin", "chooseCardTargetBegin", "chooseControlBegin",
          "chooseBoolBegin", "choosePlayerCardBegin", "discardPlayerCardBegin", "gainPlayerCardBegin"]
      },
      forced: true,
      priority: 100,
      popup: false,
      filter: function(event, player) {
        if (event.autochoose && event.autochoose()) return false;
        return !_status.auto && player != game.me && player.side == game.me.side;
      },
      content: function() {
        "step 0";
        if (ui.autoreplace.innerHTML == "询问切换") {
          game.me.chooseBool("是否切换到" + get.translation(player) + "？");
        } else {
          if (ui.autoreplace.classList.contains("on")) {
            if (trigger.name != "phase") {
              game.versusSwapControl(player);
              if (ui.dialog) {
                ui.dialog.style.display = "";
              }
            }
          } else if (trigger.name == "phase") {
            game.versusSwapControl(player);
          }
          event.finish();
        }
        "step 1";
        if (result.bool) {
          game.versusSwapControl(player);
          if (ui.dialog) {
            ui.dialog.style.display = "";
          }
        }
      }
    }
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
        }
      },
      dieAfter: function(source) {
        this.dieSpeak();
        if (this.side == game.me.side) {
          _status.friendDied.push(this.name);
        } else {
          _status.enemyDied.push(this.name);
        }
        _status.friendCount.innerHTML = "我方阵亡：" + get.cnNumber(_status.friendDied.length, true);
        _status.enemyCount.innerHTML = "敌方阵亡：" + get.cnNumber(_status.enemyDied.length, true);

        var list = (this.side == game.me.side) ? _status.friend : _status.enemy;
        if ((list.length == 0 && lib.storage.noreplace_end) ||
          (lib.storage.zhu && lib.storage.main_zhu && this.identity == "zhu")) {
          if (game.friend.contains(this)) {
            game.over(false);
          } else {
            game.over(true);
          }
        } else if (game.friend.length == 1 && this == game.friend[0] && _status.friend.length == 0) {
          game.over(false);
        } else if (game.enemy.length == 1 && this == game.enemy[0] && _status.enemy.length == 0) {
          game.over(true);
        } else {
          if (source) {
            if (source.side != this.side) {
              source.draw(2);
            } else {
              source.discard(source.get("he"));
            }
          } else {
            game.delay();
          }
          game.replacePlayer(this);
        }

      }
    }
  },
  ai: {
    get: {
      attitude: function(from, to) {
        if (from.side == to.side) {
          if (to.identity == "zhu" && lib.storage.main_zhu) return 10;
          return 6;
        }
        if (to.identity == "zhu" && lib.storage.main_zhu) return -10;
        return -6;
      }
    }
  },
  config: {
    change_choice: true,
    ban_weak: true
  }
};
