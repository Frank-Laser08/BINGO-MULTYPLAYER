// File: App.tsx
import { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000');

const generateCard = () => {
  const card: (number | 'FREE')[][] = [];
  const ranges = [
    [1, 15],
    [16, 30],
    [31, 45],
    [46, 60],
    [61, 75],
  ];

  for (let col = 0; col < 5; col++) {
    const [min, max] = ranges[col];
    const nums = new Set<number>();
    while (nums.size < 5) nums.add(Math.floor(Math.random() * (max - min + 1)) + min);
    card.push(Array.from(nums));
  }

  card[2][2] = 'FREE';
  return card;
};

export default function App() {
  const [card, setCard] = useState<(number | 'FREE')[][]>(generateCard());
  const [calledNumbers, setCalledNumbers] = useState<number[]>([]);

  useEffect(() => {
    socket.on('number-called', (num: number) => {
      setCalledNumbers((prev) => [...prev, num]);
    });
    return () => {
      socket.off('number-called');
    };
  }, []);

  return (
    <div className="p-4 text-center">
      <h1 className="text-2xl font-bold mb-4">Bingo Online</h1>
      <div className="grid grid-cols-5 gap-1 w-fit mx-auto">
        {['B', 'I', 'N', 'G', 'O'].map((h, i) => (
          <div key={i} className="font-bold bg-blue-300 p-2">{h}</div>
        ))}
        {card[0].map((_, row) =>
          card.map((col, colIndex) => {
            const value = col[row];
            const isMarked = value !== 'FREE' && calledNumbers.includes(value);
            return (
              <div
                key={`${row}-${colIndex}`}
                className={`p-2 border ${
                  value === 'FREE' ? 'bg-green-300' : isMarked ? 'bg-yellow-300' : 'bg-white'
                }`}
              >
                {value}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
