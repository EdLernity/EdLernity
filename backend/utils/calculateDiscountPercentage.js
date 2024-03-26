function calculateDiscountPercentage(initialPrice, offeredPrice) {
    if (typeof initialPrice !== 'number' || typeof offeredPrice !== 'number' || initialPrice <= 0 || offeredPrice <= 0) {
        throw new Error('Prices must be positive numbers');
    }

    if (offeredPrice >= initialPrice) {
        return 0; // No discount if offered price is greater than or equal to initial price
    }

    const discountAmount = initialPrice - offeredPrice;
    const discountPercentage = ((discountAmount / initialPrice) * 100).toFixed(2); // rounding off to 2 decimal places

    return parseFloat(discountPercentage); // converting back to a float
}

module.exports = {
    calculateDiscountPercentage
};
