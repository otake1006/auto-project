export function evaluateCondition(condition, context) {
    const { conditionType, value } = condition;

    if (!condition) return true;

    switch (conditionType) {
        case 'HP_ABOVE':
            return context.hp > value;
        case 'HP_BELOW':
            return context.hp < value;
        case 'MP_ABOVE':
            return context.mp > value;
        // 追加条件にも対応可能
        default:
            return false;
    }
}

export function evaluateAllConditions(conditions, context) {
    return conditions.every((cond) => evaluateCondition(cond, context));
}
