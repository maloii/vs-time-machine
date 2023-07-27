const replaceDoubleBraces = (str, result) => {
    return str.replace(/{{(.+?)}}/g, (_, g1) => result[g1] || g1);
};

module.exports = {
    replaceDoubleBraces
};
