define(['game'], function (game) {
  var tip = $("<div/>").addClass('tip');

  var parent = $('#click-overlay');

  var currentSprite = null;

  var setTipText = function (sprite) {
    sprite = sprite || currentSprite;
    var tipText = sprite.tip && sprite.tip();
    if (tipText) {
      tip.html(tipText);
      var pos = sprite.pos;
      pos = game.map.canvasCoordinatesFromWorld(pos.x, pos.y);
      parent.append(tip);
      var offset = tip.outerWidth() * 0.3 + 10; // magic numbers from CSS
      tip.css({left:pos.x - offset,
               top:pos.y - tip.outerHeight() - sprite.tileHeight});
      return true;
    }
    return false;
  };

  var removeTip = function () {
    tip.detach();
    currentSprite.unsubscribe('tip data change', setTipText);
    currentSprite = null;
  };

  game.events.subscribe('started touching', function (sprite) {
    if (setTipText(sprite)) {
      currentSprite = sprite;
      sprite.subscribe('tip data change', setTipText);
    }
  }).subscribe('stopped touching', function (sprite) {
    if (currentSprite === sprite) {
      removeTip();
    }
  }).subscribe('mousedown', function (vec) {
    tip.detach();
  }).subscribe('map scroll', function (vec) {
    var pos = tip.position();
    tip.css({left:pos.left - vec.x, top:pos.top - vec.y});
  });
});