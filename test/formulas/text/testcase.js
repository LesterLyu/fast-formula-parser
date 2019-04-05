module.exports = {

    CONCAT: {
        'CONCAT("The"," ","sun"," ","will"," ","come"," ","up"," ","tomorrow.")': 'The sun will come up tomorrow.',
        'CONCAT({1,2,3}, "aaa", TRUE, 0, FALSE)': '123aaaTRUE0FALSE'
    },

    CONCATENATE: {
        'CONCATENATE({0,2,3}, 1, "A", TRUE, -12)': '01ATRUE-12',
    }

};
