import React from 'react';

const ReshuffleButtons: React.FC = () => {
  const sendReshuffle = async (value: number) => {
    try {
      const response = await fetch('/reshuffle', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ value }),
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      const data = await response.json();
      console.log('Response data:', data);
    } catch (error) {
      console.error('Failed to reshuffle:', error);
    }
  };

  return (
    <div>
      <button onClick={() => sendReshuffle(-1)}>Bad</button>
      <button onClick={() => sendReshuffle(0)}>Neutral</button>
      <button onClick={() => sendReshuffle(1)}>Good</button>
    </div>
  );
};

export default ReshuffleButtons;
