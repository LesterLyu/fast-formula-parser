module.exports = {

    'CEILING.MATH': {
        'CEILING.MATH(24.3,5)': 25,
        'CEILING.MATH(6.7)': 7,
        'CEILING.MATH(-6.7)': -7,
        'CEILING.MATH(-8.1,2)': -8,
        'CEILING.MATH(-5.5,2,-1)': -6
    },

    FLOOR: {
        'FLOOR(0,)': 0,
        'FLOOR(12,0)': 0,
        'FLOOR(3.7,2)': 2,
        'FLOOR(-2.5,-2)': -2,
        'FLOOR(-2.5,2)': -4,
        'FLOOR(2.5,-2)': '#NUM!',
        'FLOOR(1.58,0.1)': 1.5,
        'FLOOR(0.234,0.01)': 0.23,
        'FLOOR(-8.1,2)': -10,
    },
    'FLOOR.MATH': {
        'FLOOR.MATH(0)': 0,
        'FLOOR.MATH(12, 0)': 0,
        'FLOOR.MATH(24.3,5)': 20,
        'FLOOR.MATH(6.7)': 6,
        'FLOOR.MATH(-8.1,2)': -10,
        'FLOOR.MATH(-5.5,2,-1)': -4,
        'FLOOR.MATH(-5.5,2,1)': -4,
        'FLOOR.MATH(-5.5,2,)': -6,
        'FLOOR.MATH(-5.5,2)': -6,
        'FLOOR.MATH(-5.5,-2)': -6,
        'FLOOR.MATH(5.5,2)': 4,
        'FLOOR.MATH(5.5,-2)': 4,
        'FLOOR.MATH(24.3,-5)': 20,
        'FLOOR.MATH(-8.1,-2)': -10,
    },

    'FLOOR.PRECISE': {
        'FLOOR.PRECISE(-3.2,-1)': -4,
        'FLOOR.PRECISE(3.2, 1)': 3,
        'FLOOR.PRECISE(-3.2, 1)': -4,
        'FLOOR.PRECISE(3.2,-1)': 3,
        'FLOOR.PRECISE(3.2)': 3,
        'FLOOR.PRECISE(0)': 0,
        'FLOOR.PRECISE(3.2, 0)': 0,
    },
};
