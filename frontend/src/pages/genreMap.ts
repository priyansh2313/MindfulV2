export const genreMap = {
    happy: {
      genre: "Pop",
      scale: ["C4", "D4", "E4", "G4", "A4"],
      tempo: 110,
      instruments: ["piano", "pad", "drums", "guitar"],
      moodChords: [["C4", "E4", "G4"], ["A3", "D4", "F4"], ["F4", "A4", "C5"]],
    },
    sad: {
      genre: "Ambient",
      scale: ["C4", "Eb4", "G4", "Ab4", "Bb4"],
      tempo: 70,
      instruments: ["pad", "piano"],
      moodChords: [["C4", "Eb4", "G4"], ["A3", "C4", "F4"]],
    },
    calm: {
      genre: "Lo-Fi",
      scale: ["C3", "D3", "E3", "G3", "A3"],
      tempo: 85,
      instruments: ["pad", "guitar"],
      moodChords: [["Cmaj7"], ["Gmaj7"], ["Am7"]],
    },
    energetic: {
      genre: "EDM",
      scale: ["C4", "E4", "G4", "B4", "D5"],
      tempo: 128,
      instruments: ["drums", "piano", "pad"],
      moodChords: [["C4", "G4", "B4"], ["E4", "G4", "C5"]],
    },
  };
  