var game = require('../../utils/game');

Page({
  data: {
    char: null,
    coins: 0,
    activeTab: 0,
    tabs: ['武器', '防具', '饰品'],
    tabIcons: ['🗡️', '🛡️', '💍'],
    items: [],
    equippedId: ''
  },

  onLoad: function () {
    this.loadCharacter();
  },

  onShow: function () {
    this.loadCharacter();
  },

  loadCharacter: function () {
    var char = game.loadGame();
    if (!char) {
      wx.showToast({ title: '未找到角色数据', icon: 'none' });
      return;
    }
    this.setData({ char: char, coins: char.coins || 0 });
    this.loadItems();
  },

  loadItems: function () {
    var char = this.data.char;
    if (!char) return;

    var tab = this.data.activeTab;
    var rawList, equippedId, statKey;

    if (tab === 0) {
      rawList = game.EQUIPMENT.weapons;
      equippedId = char.equipment.weapon || '';
      statKey = 'atk';
    } else if (tab === 1) {
      rawList = game.EQUIPMENT.armor;
      equippedId = char.equipment.armor || '';
      statKey = 'def';
    } else {
      rawList = game.EQUIPMENT.accessories;
      equippedId = char.equipment.accessory || '';
      statKey = 'bonus';
    }

    var inventory = char.inventory || [];
    var coins = char.coins || 0;
    var level = char.level || 1;

    var items = rawList.map(function (item) {
      var owned = inventory.indexOf(item.id) >= 0 || equippedId === item.id;
      var equipped = equippedId === item.id;
      var locked = level < item.unlockLevel;
      var canAfford = coins >= item.price;
      var rarityColor = game.RARITY_COLORS[item.rarity] || '#94a3b8';
      var rarityName = game.RARITY_NAMES[item.rarity] || '普通';

      // Build stat description
      var statText = '';
      if (statKey === 'atk') {
        statText = '+' + item.atk + ' ATK';
      } else if (statKey === 'def') {
        statText = '+' + item.def + ' DEF';
      } else if (item.bonus) {
        statText = item.desc;
      }

      return {
        id: item.id,
        name: item.name,
        emoji: item.emoji,
        desc: item.desc,
        price: item.price,
        rarity: item.rarity,
        rarityColor: rarityColor,
        rarityName: rarityName,
        unlockLevel: item.unlockLevel,
        statText: statText,
        owned: owned,
        equipped: equipped,
        locked: locked,
        canAfford: canAfford,
        isFree: item.price === 0
      };
    });

    this.setData({
      items: items,
      equippedId: equippedId
    });
  },

  switchTab: function (e) {
    var idx = e.currentTarget.dataset.idx;
    this.setData({ activeTab: idx });
    this.loadItems();
  },

  buyItem: function (e) {
    var itemId = e.currentTarget.dataset.id;
    var char = this.data.char;
    if (!char) return;

    var tab = this.data.activeTab;
    var rawList, category;
    if (tab === 0) {
      rawList = game.EQUIPMENT.weapons;
      category = 'weapons';
    } else if (tab === 1) {
      rawList = game.EQUIPMENT.armor;
      category = 'armor';
    } else {
      rawList = game.EQUIPMENT.accessories;
      category = 'accessories';
    }

    var item = game.findById(rawList, itemId);
    if (!item) return;

    // Check level
    if (char.level < item.unlockLevel) {
      wx.showToast({ title: '需要 ' + item.unlockLevel + ' 级解锁', icon: 'none' });
      return;
    }

    // Check coins
    if ((char.coins || 0) < item.price) {
      wx.showToast({ title: '金币不足！', icon: 'none' });
      return;
    }

    // Check already owned
    if (!char.inventory) char.inventory = [];
    if (char.inventory.indexOf(itemId) >= 0) {
      wx.showToast({ title: '已拥有此物品', icon: 'none' });
      return;
    }

    // Deduct coins and add to inventory
    char.coins -= item.price;
    char.inventory.push(itemId);
    game.saveGame(char);

    wx.showToast({ title: '购买成功！', icon: 'success' });
    this.setData({ char: char, coins: char.coins });
    this.loadItems();
  },

  equipItem: function (e) {
    var itemId = e.currentTarget.dataset.id;
    var char = this.data.char;
    if (!char) return;

    var tab = this.data.activeTab;
    var slotKey;
    if (tab === 0) {
      slotKey = 'weapon';
    } else if (tab === 1) {
      slotKey = 'armor';
    } else {
      slotKey = 'accessory';
    }

    // Check if already equipped
    if (char.equipment[slotKey] === itemId) {
      // Unequip
      char.equipment[slotKey] = '';
      game.saveGame(char);
      wx.showToast({ title: '已卸下装备', icon: 'none' });
    } else {
      // Equip
      char.equipment[slotKey] = itemId;
      game.saveGame(char);
      wx.showToast({ title: '装备成功！', icon: 'success' });
    }

    this.setData({ char: char });
    this.loadItems();
  }
});
