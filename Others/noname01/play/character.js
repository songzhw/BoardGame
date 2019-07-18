play.character = {
  init: function() {
    var list = [], list2 = [];
    var i, j, name;
    for (i in lib.character) {
      if (lib.config.forbidai.contains(i)) continue;
      if (lib.config.forbidall.contains(i)) continue;
      if (!get.config("double_character") && get.config("ban_weak") && lib.config.forbidsingle.contains(i)) continue;
      if (get.config("double_character") && lib.config.forbiddouble.contains(i)) continue;
      list.push(i);
    }
    list.sort(lib.sort.random);
    list = list.splice(0, Math.ceil(lib.card.list.length / 20));
    var suit = ["heart", "diamond", "club", "spade"];
    for (i = 0; i < list.length; i++) {
      name = list[i] + "_charactercard";
      lib.card[name] = {
        enable: true,
        type: "character",
        image: "character/default/" + list[i],
        color: "white",
        opacity: 1,
        textShadow: "black 0 0 2px",
        chongzhu: true,
        filterTarget: function(card, player, target) {
          return player == target;
        },
        selectTarget: -1,
        content: function() {
          var name = card.name.slice(0, card.name.indexOf("_charactercard"));
          target.$gain2(card);
          var skills = lib.character[name][3];
          var list = [];
          for (var j = 0; j < skills.length; j++) {
            if (lib.translate[skills[j] + "_info"] && lib.skill[skills[j]] &&
              !lib.skill[skills[j]].unique &&
              !target.skills.contains(skills[j])) {
              list.push(skills[j]);
            }
          }
          target.removeSkill("charactercard");
          if (list.length) {
            var skill = list.randomGet();
            target.popup(skill);
            game.log(get.translation(target) + "获得技能" + get.translation(skill));
            target.addSkill(skill);
            target.skills.remove(skill);
            target.additionalSkills.charactercard = skill;
            target.checkMarks();
            target.storage.charactercard = card;
            target.addSkill("charactercard");
          } else {
            target.draw(2);
          }
        },
        ai: {
          order: 9,
          result: {
            target: (function(name) {
              return function(player, target) {
                if (target.additionalSkills.charactercard) return 0;
                return lib.character[name][2] <= 4 ? 1 : 0;
              };
            }(list[i]))
          }
        }
      };
      lib.translate[name] = get.translation(list[i]);
      lib.translate[name + "_info"] = get.skillintro(list[i], true, true);
      list2.push([suit.randomGet(), Math.ceil(Math.random() * 13), name]);
    }
    lib.card.list = lib.card.list.concat(list2);
  },
  help: {
    "角色卡牌": "<ul><li>牌堆中随机加入5%的角色牌<li>出牌阶段对自己使用，" +
      "随机获得卡牌对应角色的一项技能直到使用者的下一个出牌阶段开始" +
      "<li>一个角色最多只能通过角色卡牌获得一个技能，新获得技能后将失去之前以此法获得的技能" +
      "<li>不能获得主公技、限定技、觉醒技等特殊技能，以及场上只能唯一存在的技能" +
      "<li>若卡牌对应角色没有可获得的技能，目标摸两张牌"
  },
  skill: {
    charactercard: {
      trigger: { player: "phaseUseBegin" },
      forced: true,
      popup: false,
      mark: "card",
      intro: {
        name: function(storage, player) {
          return get.translation(player.additionalSkills.charactercard);
        },
        content: function(storage, player) {
          return lib.translate[player.additionalSkills.charactercard + "_info"];
        },
        onunmark: function(storage, player) {
          delete player.additionalSkills.charactercard;
          delete player.storage.charactercard;
        }
      },
      content: function() {
        player.removeSkill("charactercard");
      }
    }
  }
};
