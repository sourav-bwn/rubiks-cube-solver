export const COLORS = {
  U: '#FFFFFF',
  D: '#FFFF00',
  F: '#00FF00',
  B: '#0000FF',
  R: '#FF0000',
  L: '#FFA500'
};

export const FACE_NAMES = ['U', 'D', 'F', 'B', 'R', 'L'];

export const MOVES = ['U', 'U\'', 'U2', 'D', 'D\'', 'D2', 'L', 'L\'', 'L2', 'R', 'R\'', 'R2', 'F', 'F\'', 'F2', 'B', 'B\'', 'B2'];

export function createSolvedCube() {
  const cube = {};
  FACE_NAMES.forEach(face => {
    cube[face] = Array(9).fill(face);
  });
  return cube;
}

export function applyMove(cube, move) {
  const newCube = JSON.parse(JSON.stringify(cube));
  const base = move.replace(/['2]/g, '');
  const isPrime = move.includes('\'');
  const isDouble = move.includes('2');

  const rotations = isDouble ? 2 : 1;
  for (let i = 0; i < rotations; i++) {
    rotateFace(newCube, base, isPrime);
  }
  return newCube;
}

function rotateFace(cube, face, counterClockwise) {
  const f = cube[face];
  const rotated = counterClockwise
    ? [f[6], f[3], f[0], f[7], f[4], f[1], f[8], f[5], f[2]]
    : [f[2], f[5], f[8], f[1], f[4], f[7], f[0], f[3], f[6]];
  cube[face] = rotated;

  const temp = [];
  switch (face) {
    case 'U':
      if (counterClockwise) {
        temp[0] = cube.F[0]; temp[1] = cube.F[1]; temp[2] = cube.F[2];
        cube.F[0] = cube.R[0]; cube.F[1] = cube.R[1]; cube.F[2] = cube.R[2];
        cube.R[0] = cube.B[0]; cube.R[1] = cube.B[1]; cube.R[2] = cube.B[2];
        cube.B[0] = cube.L[0]; cube.B[1] = cube.L[1]; cube.B[2] = cube.L[2];
        cube.L[0] = temp[0]; cube.L[1] = temp[1]; cube.L[2] = temp[2];
      } else {
        temp[0] = cube.F[0]; temp[1] = cube.F[1]; temp[2] = cube.F[2];
        cube.F[0] = cube.L[0]; cube.F[1] = cube.L[1]; cube.F[2] = cube.L[2];
        cube.L[0] = cube.B[0]; cube.L[1] = cube.B[1]; cube.L[2] = cube.B[2];
        cube.B[0] = cube.R[0]; cube.B[1] = cube.R[1]; cube.B[2] = cube.R[2];
        cube.R[0] = temp[0]; cube.R[1] = temp[1]; cube.R[2] = temp[2];
      }
      break;
    case 'D':
      if (counterClockwise) {
        temp[0] = cube.F[6]; temp[1] = cube.F[7]; temp[2] = cube.F[8];
        cube.F[6] = cube.L[6]; cube.F[7] = cube.L[7]; cube.F[8] = cube.L[8];
        cube.L[6] = cube.B[6]; cube.L[7] = cube.B[7]; cube.L[8] = cube.B[8];
        cube.B[6] = cube.R[6]; cube.B[7] = cube.R[7]; cube.B[8] = cube.R[8];
        cube.R[6] = temp[0]; cube.R[7] = temp[1]; cube.R[8] = temp[2];
      } else {
        temp[0] = cube.F[6]; temp[1] = cube.F[7]; temp[2] = cube.F[8];
        cube.F[6] = cube.R[6]; cube.F[7] = cube.R[7]; cube.F[8] = cube.R[8];
        cube.R[6] = cube.B[6]; cube.R[7] = cube.B[7]; cube.R[8] = cube.B[8];
        cube.B[6] = cube.L[6]; cube.B[7] = cube.L[7]; cube.B[8] = cube.L[8];
        cube.L[6] = temp[0]; cube.L[7] = temp[1]; cube.L[8] = temp[2];
      }
      break;
    case 'F':
      if (counterClockwise) {
        temp[0] = cube.U[6]; temp[1] = cube.U[7]; temp[2] = cube.U[8];
        cube.U[6] = cube.L[8]; cube.U[7] = cube.L[5]; cube.U[8] = cube.L[2];
        cube.L[2] = cube.D[0]; cube.L[5] = cube.D[1]; cube.L[8] = cube.D[2];
        cube.D[0] = cube.R[6]; cube.D[1] = cube.R[3]; cube.D[2] = cube.R[0];
        cube.R[0] = temp[0]; cube.R[3] = temp[1]; cube.R[6] = temp[2];
      } else {
        temp[0] = cube.U[6]; temp[1] = cube.U[7]; temp[2] = cube.U[8];
        cube.U[6] = cube.R[0]; cube.U[7] = cube.R[3]; cube.U[8] = cube.R[6];
        cube.R[0] = cube.D[2]; cube.R[3] = cube.D[1]; cube.R[6] = cube.D[0];
        cube.D[0] = cube.L[2]; cube.D[1] = cube.L[5]; cube.D[2] = cube.L[8];
        cube.L[2] = temp[2]; cube.L[5] = temp[1]; cube.L[8] = temp[0];
      }
      break;
    case 'B':
      if (counterClockwise) {
        temp[0] = cube.U[0]; temp[1] = cube.U[1]; temp[2] = cube.U[2];
        cube.U[0] = cube.R[2]; cube.U[1] = cube.R[5]; cube.U[2] = cube.R[8];
        cube.R[2] = cube.D[8]; cube.R[5] = cube.D[7]; cube.R[8] = cube.D[6];
        cube.D[6] = cube.L[0]; cube.D[7] = cube.L[3]; cube.D[8] = cube.L[6];
        cube.L[0] = temp[2]; cube.L[3] = temp[1]; cube.L[6] = temp[0];
      } else {
        temp[0] = cube.U[0]; temp[1] = cube.U[1]; temp[2] = cube.U[2];
        cube.U[0] = cube.L[6]; cube.U[1] = cube.L[3]; cube.U[2] = cube.L[0];
        cube.L[0] = cube.D[6]; cube.L[3] = cube.D[7]; cube.L[6] = cube.D[8];
        cube.D[6] = cube.R[8]; cube.D[7] = cube.R[5]; cube.D[8] = cube.R[2];
        cube.R[2] = temp[0]; cube.R[5] = temp[1]; cube.R[8] = temp[2];
      }
      break;
    case 'R':
      if (counterClockwise) {
        temp[0] = cube.U[2]; temp[1] = cube.U[5]; temp[2] = cube.U[8];
        cube.U[2] = cube.F[2]; cube.U[5] = cube.F[5]; cube.U[8] = cube.F[8];
        cube.F[2] = cube.D[2]; cube.F[5] = cube.D[5]; cube.F[8] = cube.D[8];
        cube.D[2] = cube.B[6]; cube.D[5] = cube.B[3]; cube.D[8] = cube.B[0];
        cube.B[0] = temp[2]; cube.B[3] = temp[1]; cube.B[6] = temp[0];
      } else {
        temp[0] = cube.U[2]; temp[1] = cube.U[5]; temp[2] = cube.U[8];
        cube.U[2] = cube.B[6]; cube.U[5] = cube.B[3]; cube.U[8] = cube.B[0];
        cube.B[0] = cube.D[8]; cube.B[3] = cube.D[5]; cube.B[6] = cube.D[2];
        cube.D[2] = cube.F[2]; cube.D[5] = cube.F[5]; cube.D[8] = cube.F[8];
        cube.F[2] = temp[0]; cube.F[5] = temp[1]; cube.F[8] = temp[2];
      }
      break;
    case 'L':
      if (counterClockwise) {
        temp[0] = cube.U[0]; temp[1] = cube.U[3]; temp[2] = cube.U[6];
        cube.U[0] = cube.B[8]; cube.U[3] = cube.B[5]; cube.U[6] = cube.B[2];
        cube.B[2] = cube.D[6]; cube.B[5] = cube.D[3]; cube.B[8] = cube.D[0];
        cube.D[0] = cube.F[0]; cube.D[3] = cube.F[3]; cube.D[6] = cube.F[6];
        cube.F[0] = temp[0]; cube.F[3] = temp[1]; cube.F[6] = temp[2];
      } else {
        temp[0] = cube.U[0]; temp[1] = cube.U[3]; temp[2] = cube.U[6];
        cube.U[0] = cube.F[0]; cube.U[3] = cube.F[3]; cube.U[6] = cube.F[6];
        cube.F[0] = cube.D[0]; cube.F[3] = cube.D[3]; cube.F[6] = cube.D[6];
        cube.D[0] = cube.B[8]; cube.D[3] = cube.B[5]; cube.D[6] = cube.B[2];
        cube.B[2] = temp[2]; cube.B[5] = temp[1]; cube.B[8] = temp[0];
      }
      break;
  }
}

export function scrambleCube(moves = 20) {
  let cube = createSolvedCube();
  const lastMoves = [];
  const scrambleMoves = [];
  
  for (let i = 0; i < moves; i++) {
    let move;
    do {
      const base = MOVES[Math.floor(Math.random() * MOVES.length)].replace(/['2]/g, '');
      const modifier = Math.random() < 0.5 
        ? (Math.random() < 0.5 ? '' : '\'')
        : '2';
      move = base + modifier;
    } while (lastMoves.includes(move[0]));
    
    lastMoves.push(move[0]);
    if (lastMoves.length > 2) lastMoves.shift();
    
    cube = applyMove(cube, move);
    scrambleMoves.push(move);
  }
  
  return { cube, scramble: scrambleMoves.join(' ') };
}

export function cubeToString(cube) {
  const toKociemba = (face, indices) => {
    const faceColors = indices.map(i => cube[face][i]);
    const centerColor = cube[face][4];
    return faceColors.map(c => {
      const colorToLetter = { 'U': 'U', 'D': 'D', 'F': 'F', 'B': 'B', 'R': 'R', 'L': 'L' };
      return colorToLetter[c] || centerColor;
    }).join('');
  };

  const order = 'URFDLB';
  return order.split('').map(face => {
    switch(face) {
      case 'U': return toKociemba(face, [0,1,2,3,4,5,6,7,8]);
      case 'R': return toKociemba(face, [2,5,8,2,5,8,2,5,8]);
      case 'F': return toKociemba(face, [6,3,0,7,4,1,8,5,2]);
      case 'D': return toKociemba(face, [8,7,6,5,4,3,2,1,0]);
      case 'L': return toKociemba(face, [0,3,6,0,3,6,0,3,6]);
      case 'B': return toKociemba(face, [2,5,8,1,4,7,0,3,6]);
      default: return '';
    }
  }).join('');
}

export function parseSolution(solution) {
  if (!solution) return [];
  return solution.trim().split(/\s+/).filter(m => m);
}