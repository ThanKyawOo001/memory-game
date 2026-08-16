import React, { useState, useEffect } from 'react';
import './MemoryMatchingGame.css';

const TOTAL_CARDS = 20;
const START_LIVE = 10;

export default function MemoryMatchingGame() {
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [matchCount, setMatchCount] = useState(0);
  const [live, setLive] = useState(START_LIVE);
  const [gameWon, setGameWon] = useState(false);
  const [gameLost, setGameLost] = useState(false);

  useEffect(() => {
    initializeGame();
  }, []);

  useEffect(() => {
    if (matched.length === TOTAL_CARDS) {
      setGameWon(true);
    } else if (live === 0) {
      setGameLost(true);
    }
  }, [matched, live]);

  const initializeGame = () => {
    // 2 cards per number, 1 to 10 => 20 cards
    const newCards = [];
    for (let i = 1; i <= 10; i++) {
      newCards.push({ id: `${i}-a`, number: i });
      newCards.push({ id: `${i}-b`, number: i });
    }

    // shuffle
    for (let i = newCards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newCards[i], newCards[j]] = [newCards[j], newCards[i]];
    }

    setCards(newCards);
    setFlipped([]);
    setMatched([]);
    setMatchCount(0);
    setLive(START_LIVE);
    setGameWon(false);
    setGameLost(false);
  };

  // Clicking anywhere else hides the unmatched pair
  const hideUnmatched = () => {
    if (flipped.length === 2) {
      setFlipped([]);
    }
  };

  const handleCardClick = (index) => {
    if (gameWon || gameLost) return;

    // If two unmatched cards are showing, hide them first
    let current = flipped.length === 2 ? [] : flipped;

    if (matched.includes(index) || current.includes(index)) {
      setFlipped(current);
      return;
    }

    const newFlipped = [...current, index];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      const [first, second] = newFlipped;

      if (cards[first].number === cards[second].number) {
        // matched: keep numbers displayed, increase Match
        setMatched([...matched, first, second]);
        setMatchCount(matchCount + 1);
        setFlipped([]);
      } else {
        // unmatched: reduce Live, cards stay visible until next click
        setLive(live - 1);
      }
    }
  };

  return (
    <div className="game-wrapper" onClick={hideUnmatched}>
      <div className="game-container">
        <h1 className="game-title">Memory Matching</h1>

        <div className="cards-grid">
          {cards.map((card, index) => {
            const isShown = flipped.includes(index) || matched.includes(index);
            return (
              <div
                key={card.id}
                className={`card ${isShown ? 'flipped' : ''} ${
                  matched.includes(index) ? 'matched' : ''
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleCardClick(index);
                }}
              >
                <div className="card-inner">
                  <div className="card-front"></div>
                  <div className="card-back">{card.number}</div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="game-stats-bottom">
          <div className="stat-item">Match: {matchCount}</div>
          <div className="stat-item">Live: {live}</div>
          {gameWon && <div className="stat-item win-text">You WIN</div>}
          {gameLost && <div className="stat-item lose-text">You LOSE</div>}
        </div>
      </div>
    </div>
  );
}
