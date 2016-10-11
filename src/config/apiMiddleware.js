module.exports = {
    max: process.env.API_MAX || 300,
    duration: process.env.API_DURATION_MIN || 10,
    perSecond: process.env.API_PER_SECOND || 10
};
