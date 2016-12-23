/**
 * Sends over a single gaunlet game
 */
(function() {
  const gameData = GamesManager.getInstance().playerGames.models[0].attributes;

  const postData = {
    match: {
      _id: gameData.game_id,
      opponentUsername: gameData.opponent_username,
      opponentGeneralId: gameData.opponent_general_id,
      isDraw: gameData.is_draw,
      isWinner: gameData.is_winner,
      isPlayerOne: gameData.is_player_1,
      startTime: gameData.created_at,
      endTime: gameData.ended_at,
    },
    generalId: gameData.general_id,
    deck: gameData.deck_cards,
    apiKey: 'testkey',
  }

  $.post('http://localhost:3000/api/save-gauntlet', postData);
})()

/**
 * Sends over a single ranked game
 */
(function() {
  const gameData = GamesManager.getInstance().playerGames.models[0].attributes;

  if (gameData.game_type !== 'ranked' && gameData.status !== 'over') return;

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
    apiKey: 'api_1481995591719_z9Wk1wD8xm59p9Q',
  }

  $.post('http://localhost:3000/api/save-match', postData);
})()

/**
 * GAUNTLET TRACKER
 */
(function() {
  const sendDeck = function () {
    const gameData = GamesManager.getInstance().playerGames.models[0].attributes;
    if (gameData.game_type !== 'gauntlet') return;

    const postData = {
      match: {
        _id: gameData.game_id,
        opponentUsername: gameData.opponent_username,
        opponentGeneralId: gameData.opponent_general_id,
        isDraw: gameData.is_draw,
        isWinner: gameData.is_winner,
        isPlayerOne: gameData.is_player_1,
        startTime: gameData.created_at,
        endTime: gameData.ended_at,
      },
      generalId: gameData.general_id,
      deck: gameData.deck_cards,
      apiKey: 'testkey',
    }

    $.post('http://localhost:3000/api/save-gauntlet', postData);
    console.error('DECK SENT')
  }

  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutate) => {
      console.log(mutate);
      if (mutate.addedNodes === null) return;

      mutate.addedNodes.forEach((node) => {
        console.log(node);
        if ($(node).has('#app-arena').length > 0) {
          console.error('GAUNTLET PAGE LOADED');
          sendDeck();
        }
      })
    })
  })

  const config = { attributes: true, childList: true, characterData: true };
  observer.observe(document.querySelector('#app-content-region'), config);
})();


/*
  SERVER:
  Set up user accounts model
  Set up user account routes (passport)
  Set up a system for API keys
  Add user id to gauntlet data
  Find a way to trigger script on gauntlet page load (for use cases when they may crash out of a game and come back to it being finished)

  FRONT END:
  Set up login modal
  Set up user settings / api key modal
  Set up gauntlet overview page
  Set up individual gauntlet run page
*/