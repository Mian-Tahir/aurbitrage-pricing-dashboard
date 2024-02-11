const GBQ = require("../models");


exports.getUnmappedSKUs = () => {
    sqlQuery=
    `Select SKU, Dealer
    from(
    SELECT
        l.*,
        r.Aurbitrage_SKU,
        r.Category,
        r.Sub_Category,
    FROM
        \`<DATASET>.cleaned_pricelist\` AS l
    Left JOIN
        \`<DATASET>.sku_relations_distinct\` AS r
    ON
        TRIM(LOWER(r.Dealer_SKU)) = TRIM(LOWER(l.SKU))
        AND TRIM(LOWER(r.Dealer)) = TRIM(LOWER(l.Dealer))
    WHERE r.Aurbitrage_SKU is NULL
    ) a
    group by SKU, Dealer, Date`
    return GBQ.Query(sqlQuery);
}

exports.getDistinctAurbitrageSKUs = () => {
    sqlQuery=
    `SELECT DISTINCT(Aurbitrage_SKU) FROM \`<DATASET>.sku_relations_distinct\``
    return GBQ.Query(sqlQuery);
}

exports.getSkuRelation = (aurbitrageSku) => {
    sqlQuery=
    `SELECT Aurbitrage_SKU, Equivalent_Oz, Price_Display, Category, Sub_Category 
    FROM \`<DATASET>.sku_relations\` 
    where Aurbitrage_SKU = "${aurbitrageSku}"
    ORDER BY updated_at DESC
    LIMIT 1`

    return GBQ.Query(sqlQuery)
}

exports.insertSkuRelation = (row) => {
    const table = "sku_relations"
    return GBQ.Insert(table,row)   
}