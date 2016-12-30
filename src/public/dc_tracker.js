(function() {
  const sendDeck = function () {
    const gameData = GamesManager.getInstance().playerGames.models[0].attributes;

    if (gameData.game_type !== 'ranked' || gameData.status !== 'over') return;

    const postData = {
      _id: gameData.game_id,
      opponentUsername: gameData.opponent_username,
      opponentGeneralId: gameData.opponent_general_id,
      opponentFactionId: gameData.opponent_faction_id,
      isDraw: gameData.is_draw,
      isWinner: gameData.is_winner,
      isPlayerOne: gameData.is_player_1,
      startTime: gameData.created_at,
      endTime: gameData.ended_at,
      generalId: gameData.general_id,
      factionId: gameData.faction_id,
      cards: gameData.deck_cards,
      rankBefore: gameData.rank_before,
      rankDelta: gameData.rank_delta,
      rankStarsBefore: gameData.rank_stars_before,
      rankStarsDelta: gameData.rank_stars_delta,
      apiKey: DC_API_KEY,
    }

    showNotification('Syncing with duelystcards.com');
    $.post('https://duelyst.cards/api/save-match', postData).then((res) => {
      showNotification('Syncing successful');
      $('#dc_notification').html(res)
      setTimeout(() => {
        hideNotification();
      }, 4000);
    });
  }

  // Sends the match data over on app load
  setTimeout(sendDeck, 6000);

  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutate) => {
      if (mutate.addedNodes === null) return;

      mutate.addedNodes.forEach((node) => {
        if ($(node).is('#app-play')) {
          sendDeck();
        }
      })
    })
  });

  const notification = document.createElement('div');
  notification.setAttribute('id', 'dc_notification');
  notification.style.zIndex = 100;
  notification.style.backgroundColor = 'rgba(255, 255, 255, .7)';
  notification.style.position = 'absolute';
  notification.style.display = 'none';
  notification.style.top = '20px';
  notification.style.width = '200px';
  notification.style.left = 0;
  notification.style.right = 0;
  notification.style.padding = '10px';
  notification.style.borderRadius = '25px';
  notification.style.textAlign = 'center';
  notification.style.margin = '0 auto';
  setTimeout(() => {
    document.querySelector('body').appendChild(notification);
  }, 5000);

  const config = { attributes: true, childList: true, characterData: true };
  observer.observe(document.querySelector('#app-content-region'), config);

  const showNotification = function (text = '') {
    $('#dc_notification').html(text);
    $('#dc_notification').show();
  }

  const hideNotification = function () {
    $('#dc_notification').hide();
  }
})();