export const MOCK_ROUND_CARDS = {
  1: [3,4,5,6,5,4,5,2,2],
  2: [3,4,2,4,5,6,5,5,2,3,4,2,4,5,6,5,5,2]
};

export const MOCK_ROUNDS = [
  {
    id: 1,
    name: 'Paloheinä',
    time: 1477753740,
    score: 39,
    putts: 19
  },
  {
    id: 2,
    name: 'Kytäjä',
    time: 1476630540,
    score: 105,
    putts: 43
  }
];

export const MOCK_PLAYER = {
  name: "Juuso Haikonen",
  hcp: 19.2,
  club: 'Helsinki City Golf',
}


/**
* Paloheinä
* 1 (par 4) - A 284 m, B 229 m, C 194 m
* 2 (par 3) - A 154 m, B 131 m, C 119 m
* 3 (par 5) - A 477 m, B 381 m, C 332 m
* 4 (par 5) - A 447 m, B 384 m, C 311 m
* 5 (par 3) - A 110 m, B 102 m, C 78 m
* 6 (par 5) - A 448 m, B 362 m, C 362 m
* 7 (par 4) - A 339 m, B 282 m, C 237 m
* 8 (par 3) - A 141 m, B 105 m, C 95 m
* 9 (par 4) - A 345 m, B 300 m, C 267 m
**/

export const MOCK_COURSES = [
  {
    id: 25664,
    name: "Paloheinä",
    tees: [
      {name:"yellow", metre: 2745},
      {name:"blue", metre: 2276},
      {name:"red", metre: 1995}
    ],
    par: 36,
    holes: [
      {
        hole: 1,
        par: 4,
        distances: {
          yellow: 284,
          blue: 229,
          red: 194
        }
      },
      {
        hole: 2,
        par: 3,
        distances: {
          yellow: 154,
          blue: 131,
          red: 119
        }
      },
      {
        hole: 3,
        par: 5,
        distances: {
          yellow: 477,
          blue: 381,
          red: 332
        }
      },
      {
        hole: 4,
        par: 5,
        distances: {
          yellow: 447,
          blue: 384,
          red: 311
        }
      },
      {
        hole: 5,
        par: 3,
        distances: {
          yellow: 110,
          blue: 102,
          red: 78
        }
      },
      {
        hole: 6,
        par: 5,
        distances: {
          yellow: 448,
          blue: 362,
          red: 362
        }
      },
      {
        hole: 7,
        par: 4,
        distances: {
          yellow: 339,
          blue: 282,
          red: 237
        }
      },
      {
        hole: 8,
        par: 3,
        distances: {
          yellow: 141,
          blue: 105,
          red: 95
        }
      },
      {
        hole: 9,
        par: 4,
        distances: {
          yellow: 345,
          blue: 300,
          red: 267
        }
      }
      // {
      //   hole: 10,
      //   par: 4,
      //   distances: {
      //     yellow: 284,
      //     blue: 229,
      //     red: 194
      //   }
      // },
      // {
      //   hole: 11,
      //   par: 3,
      //   distances: {
      //     yellow: 154,
      //     blue: 131,
      //     red: 119
      //   }
      // },
      // {
      //   hole: 12,
      //   par: 5,
      //   distances: {
      //     yellow: 477,
      //     blue: 381,
      //     red: 332
      //   }
      // },
      // {
      //   hole: 13,
      //   par: 5,
      //   distances: {
      //     yellow: 447,
      //     blue: 384,
      //     red: 311
      //   }
      // },
      // {
      //   hole: 14,
      //   par: 3,
      //   distances: {
      //     yellow: 110,
      //     blue: 102,
      //     red: 78
      //   }
      // },
      // {
      //   hole: 15,
      //   par: 5,
      //   distances: {
      //     yellow: 448,
      //     blue: 362,
      //     red: 362
      //   }
      // },
      // {
      //   hole: 16,
      //   par: 4,
      //   distances: {
      //     yellow: 339,
      //     blue: 282,
      //     red: 237
      //   }
      // },
      // {
      //   hole: 17,
      //   par: 3,
      //   distances: {
      //     yellow: 141,
      //     blue: 105,
      //     red: 95
      //   }
      // },
      // {
      //   hole: 18,
      //   par: 4,
      //   distances: {
      //     yellow: 345,
      //     blue: 300,
      //     red: 267
      //   }
      // }
    ]
  },
  {
    id: 24664,
    name: "Kytäjä",
    tees: ["yellow","blue","red"],
    holes: [
      {
        hole: 1,
        par: 4,
        distances: {
          yellow: 284,
          blue: 229,
          red: 194
        }
      },
      {
        hole: 2,
        par: 3,
        distances: {
          yellow: 154,
          blue: 131,
          red: 119
        }
      },
      {
        hole: 3,
        par: 5,
        distances: {
          yellow: 477,
          blue: 381,
          red: 332
        }
      },
      {
        hole: 4,
        par: 5,
        distances: {
          yellow: 447,
          blue: 384,
          red: 311
        }
      },
      {
        hole: 5,
        par: 3,
        distances: {
          yellow: 110,
          blue: 102,
          red: 78
        }
      },
      {
        hole: 6,
        par: 5,
        distances: {
          yellow: 448,
          blue: 362,
          red: 362
        }
      },
      {
        hole: 7,
        par: 4,
        distances: {
          yellow: 339,
          blue: 282,
          red: 237
        }
      },
      {
        hole: 8,
        par: 3,
        distances: {
          yellow: 141,
          blue: 105,
          red: 95
        }
      },
      {
        hole: 9,
        par: 4,
        distances: {
          yellow: 345,
          blue: 300,
          red: 267
        }
      }
    ]
  }
];
