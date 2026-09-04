// IrfanLLM Mobile Manga Controller - Touchless Front Camera Reader
(function() {
    if (window.__IRFANLLM_ACTIVE__) {
        if (typeof window.__IRFANLLM_STOP__ === "function") {
            window.__IRFANLLM_STOP__();
        }
        return;
    }
    window.__IRFANLLM_ACTIVE__ = true;

    const POSTURE_MODEL = {"classes": [1, 2], "n_estimators": 100, "trees": [[[6, 0.2117048278450966, 1, 2, [0.7002801120448179, 0.29971988795518206]], [-2, -2.0, -1, -1, [0.0, 1.0]], [-2, -2.0, -1, -1, [1.0, 0.0]]], [[12, 0.32540126889944077, 1, 2, [0.7366946778711485, 0.26330532212885155]], [-2, -2.0, -1, -1, [0.0, 1.0]], [-2, -2.0, -1, -1, [1.0, 0.0]]], [[57, -0.1231829971075058, 1, 2, [0.7058823529411765, 0.29411764705882354]], [-2, -2.0, -1, -1, [0.0, 1.0]], [-2, -2.0, -1, -1, [1.0, 0.0]]], [[9, 0.3154120668768883, 1, 2, [0.6694677871148459, 0.33053221288515405]], [-2, -2.0, -1, -1, [0.0, 1.0]], [-2, -2.0, -1, -1, [1.0, 0.0]]], [[60, -0.11060245335102081, 1, 2, [0.7030812324929971, 0.2969187675070028]], [-2, -2.0, -1, -1, [0.0, 1.0]], [-2, -2.0, -1, -1, [1.0, 0.0]]], [[51, -0.14192544773686677, 1, 2, [0.7058823529411765, 0.29411764705882354]], [-2, -2.0, -1, -1, [0.0, 1.0]], [-2, -2.0, -1, -1, [1.0, 0.0]]], [[9, 0.27739713340997696, 1, 2, [0.7282913165266106, 0.27170868347338933]], [-2, -2.0, -1, -1, [0.0, 1.0]], [-2, -2.0, -1, -1, [1.0, 0.0]]], [[42, -0.02841392159461975, 1, 2, [0.7170868347338936, 0.28291316526610644]], [-2, -2.0, -1, -1, [0.0, 1.0]], [-2, -2.0, -1, -1, [1.0, 0.0]]], [[69, 0.2394532710313797, 1, 2, [0.7338935574229691, 0.2661064425770308]], [-2, -2.0, -1, -1, [1.0, 0.0]], [-2, -2.0, -1, -1, [0.0, 1.0]]], [[24, 0.16385890543460846, 1, 2, [0.711484593837535, 0.28851540616246496]], [-2, -2.0, -1, -1, [0.0, 1.0]], [-2, -2.0, -1, -1, [1.0, 0.0]]], [[33, 0.06379610300064087, 1, 2, [0.7254901960784313, 0.27450980392156865]], [-2, -2.0, -1, -1, [0.0, 1.0]], [-2, -2.0, -1, -1, [1.0, 0.0]]], [[63, -1.594558596611023, 1, 2, [0.6862745098039216, 0.3137254901960784]], [-2, -2.0, -1, -1, [0.0, 1.0]], [-2, -2.0, -1, -1, [1.0, 0.0]]], [[42, -0.033954352140426636, 1, 2, [0.6946778711484594, 0.30532212885154064]], [-2, -2.0, -1, -1, [0.0, 1.0]], [-2, -2.0, -1, -1, [1.0, 0.0]]], [[6, 0.21403124183416367, 1, 2, [0.711484593837535, 0.28851540616246496]], [-2, -2.0, -1, -1, [0.0, 1.0]], [-2, -2.0, -1, -1, [1.0, 0.0]]], [[57, -0.1231829971075058, 1, 2, [0.7507002801120448, 0.24929971988795518]], [-2, -2.0, -1, -1, [0.0, 1.0]], [-2, -2.0, -1, -1, [1.0, 0.0]]], [[21, 0.17811377346515656, 1, 2, [0.7086834733893558, 0.2913165266106443]], [-2, -2.0, -1, -1, [0.0, 1.0]], [-2, -2.0, -1, -1, [1.0, 0.0]]], [[63, -1.594558596611023, 1, 2, [0.7338935574229691, 0.2661064425770308]], [-2, -2.0, -1, -1, [0.0, 1.0]], [-2, -2.0, -1, -1, [1.0, 0.0]]], [[19, -1.3285654783248901, 1, 2, [0.6918767507002801, 0.3081232492997199]], [-2, -2.0, -1, -1, [0.0, 1.0]], [36, -0.043511003255844116, 3, 4, [0.8458904109589042, 0.1541095890410959]], [-2, -2.0, -1, -1, [0.0, 1.0]], [-2, -2.0, -1, -1, [1.0, 0.0]]], [[33, 0.06379610300064087, 1, 2, [0.711484593837535, 0.28851540616246496]], [-2, -2.0, -1, -1, [0.0, 1.0]], [-2, -2.0, -1, -1, [1.0, 0.0]]], [[3, 0.12266664579510689, 1, 4, [0.7086834733893558, 0.2913165266106443]], [39, 0.16180984675884247, 2, 3, [0.15, 0.85]], [-2, -2.0, -1, -1, [0.0, 1.0]], [-2, -2.0, -1, -1, [1.0, 0.0]], [24, 0.17788336426019669, 5, 6, [0.9915611814345991, 0.008438818565400843]], [-2, -2.0, -1, -1, [0.0, 1.0]], [-2, -2.0, -1, -1, [1.0, 0.0]]], [[27, -0.016821548342704773, 1, 2, [0.7142857142857143, 0.2857142857142857]], [-2, -2.0, -1, -1, [0.0, 1.0]], [-2, -2.0, -1, -1, [1.0, 0.0]]], [[42, -0.02841392159461975, 1, 2, [0.7002801120448179, 0.29971988795518206]], [-2, -2.0, -1, -1, [0.0, 1.0]], [-2, -2.0, -1, -1, [1.0, 0.0]]], [[30, 0.051978349685668945, 1, 2, [0.6694677871148459, 0.33053221288515405]], [-2, -2.0, -1, -1, [0.0, 1.0]], [-2, -2.0, -1, -1, [1.0, 0.0]]], [[45, -0.03335833549499512, 1, 2, [0.7198879551820728, 0.2801120448179272]], [-2, -2.0, -1, -1, [0.0, 1.0]], [-2, -2.0, -1, -1, [1.0, 0.0]]], [[51, -0.16934220725670457, 1, 2, [0.7254901960784313, 0.27450980392156865]], [-2, -2.0, -1, -1, [0.0, 1.0]], [-2, -2.0, -1, -1, [1.0, 0.0]]], [[33, 0.07156530022621155, 1, 2, [0.6946778711484594, 0.30532212885154064]], [-2, -2.0, -1, -1, [0.0, 1.0]], [-2, -2.0, -1, -1, [1.0, 0.0]]], [[69, 0.23948025703430176, 1, 2, [0.6946778711484594, 0.30532212885154064]], [-2, -2.0, -1, -1, [1.0, 0.0]], [-2, -2.0, -1, -1, [0.0, 1.0]]], [[63, -1.594558596611023, 1, 2, [0.6862745098039216, 0.3137254901960784]], [-2, -2.0, -1, -1, [0.0, 1.0]], [-2, -2.0, -1, -1, [1.0, 0.0]]], [[69, 0.23791848123073578, 1, 2, [0.7254901960784313, 0.27450980392156865]], [-2, -2.0, -1, -1, [1.0, 0.0]], [-2, -2.0, -1, -1, [0.0, 1.0]]], [[30, 0.051978349685668945, 1, 2, [0.7198879551820728, 0.2801120448179272]], [-2, -2.0, -1, -1, [0.0, 1.0]], [-2, -2.0, -1, -1, [1.0, 0.0]]], [[9, 0.28122904151678085, 1, 2, [0.6666666666666666, 0.3333333333333333]], [-2, -2.0, -1, -1, [0.0, 1.0]], [-2, -2.0, -1, -1, [1.0, 0.0]]], [[54, -0.09222453832626343, 1, 2, [0.711484593837535, 0.28851540616246496]], [-2, -2.0, -1, -1, [0.0, 1.0]], [-2, -2.0, -1, -1, [1.0, 0.0]]], [[63, -1.594558596611023, 1, 2, [0.7030812324929971, 0.2969187675070028]], [-2, -2.0, -1, -1, [0.0, 1.0]], [-2, -2.0, -1, -1, [1.0, 0.0]]], [[27, -0.011853605508804321, 1, 2, [0.6862745098039216, 0.3137254901960784]], [-2, -2.0, -1, -1, [0.0, 1.0]], [-2, -2.0, -1, -1, [1.0, 0.0]]], [[9, 0.27739713340997696, 1, 2, [0.7058823529411765, 0.29411764705882354]], [-2, -2.0, -1, -1, [0.0, 1.0]], [-2, -2.0, -1, -1, [1.0, 0.0]]], [[30, 0.051978349685668945, 1, 2, [0.7310924369747899, 0.2689075630252101]], [-2, -2.0, -1, -1, [0.0, 1.0]], [-2, -2.0, -1, -1, [1.0, 0.0]]], [[33, 0.06379610300064087, 1, 2, [0.7366946778711485, 0.26330532212885155]], [-2, -2.0, -1, -1, [0.0, 1.0]], [-2, -2.0, -1, -1, [1.0, 0.0]]], [[9, 0.27739713340997696, 1, 2, [0.6862745098039216, 0.3137254901960784]], [-2, -2.0, -1, -1, [0.0, 1.0]], [-2, -2.0, -1, -1, [1.0, 0.0]]], [[63, -1.594558596611023, 1, 2, [0.7675070028011205, 0.23249299719887956]], [-2, -2.0, -1, -1, [0.0, 1.0]], [-2, -2.0, -1, -1, [1.0, 0.0]]], [[57, -0.1231829971075058, 1, 2, [0.7394957983193278, 0.2605042016806723]], [-2, -2.0, -1, -1, [0.0, 1.0]], [-2, -2.0, -1, -1, [1.0, 0.0]]], [[51, -0.1367844515480101, 1, 2, [0.7366946778711485, 0.26330532212885155]], [-2, -2.0, -1, -1, [0.0, 1.0]], [-2, -2.0, -1, -1, [1.0, 0.0]]], [[21, 0.17704735696315765, 1, 2, [0.7142857142857143, 0.2857142857142857]], [-2, -2.0, -1, -1, [0.0, 1.0]], [-2, -2.0, -1, -1, [1.0, 0.0]]], [[54, -0.09222453832626343, 1, 2, [0.7030812324929971, 0.2969187675070028]], [-2, -2.0, -1, -1, [0.0, 1.0]], [-2, -2.0, -1, -1, [1.0, 0.0]]], [[42, -0.02841392159461975, 1, 2, [0.6974789915966386, 0.3025210084033613]], [-2, -2.0, -1, -1, [0.0, 1.0]], [-2, -2.0, -1, -1, [1.0, 0.0]]], [[12, 0.29806550592184067, 1, 2, [0.7282913165266106, 0.27170868347338933]], [-2, -2.0, -1, -1, [0.0, 1.0]], [-2, -2.0, -1, -1, [1.0, 0.0]]], [[42, -0.04470545053482056, 1, 2, [0.6974789915966386, 0.3025210084033613]], [-2, -2.0, -1, -1, [0.0, 1.0]], [-2, -2.0, -1, -1, [1.0, 0.0]]], [[45, -0.03203010559082031, 1, 2, [0.7198879551820728, 0.2801120448179272]], [-2, -2.0, -1, -1, [0.0, 1.0]], [-2, -2.0, -1, -1, [1.0, 0.0]]], [[60, -0.10236608982086182, 1, 2, [0.7058823529411765, 0.29411764705882354]], [-2, -2.0, -1, -1, [0.0, 1.0]], [-2, -2.0, -1, -1, [1.0, 0.0]]], [[57, -0.1296275109052658, 1, 2, [0.6946778711484594, 0.30532212885154064]], [-2, -2.0, -1, -1, [0.0, 1.0]], [-2, -2.0, -1, -1, [1.0, 0.0]]], [[15, 0.1328301578760147, 1, 2, [0.7254901960784313, 0.27450980392156865]], [-2, -2.0, -1, -1, [0.0, 1.0]], [-2, -2.0, -1, -1, [1.0, 0.0]]], [[55, -0.4361068606376648, 1, 4, [0.6946778711484594, 0.30532212885154064]], [39, -0.06818988919258118, 2, 3, [0.10588235294117647, 0.8941176470588236]], [-2, -2.0, -1, -1, [0.0, 1.0]], [-2, -2.0, -1, -1, [1.0, 0.0]], [12, 0.2774081900715828, 5, 6, [0.8786764705882353, 0.1213235294117647]], [-2, -2.0, -1, -1, [0.0, 1.0]], [-2, -2.0, -1, -1, [1.0, 0.0]]], [[24, 0.16321305930614471, 1, 2, [0.680672268907563, 0.31932773109243695]], [-2, -2.0, -1, -1, [0.0, 1.0]], [-2, -2.0, -1, -1, [1.0, 0.0]]], [[63, -1.6019262671470642, 1, 2, [0.6946778711484594, 0.30532212885154064]], [-2, -2.0, -1, -1, [0.0, 1.0]], [-2, -2.0, -1, -1, [1.0, 0.0]]], [[12, 0.3175578936934471, 1, 2, [0.680672268907563, 0.31932773109243695]], [-2, -2.0, -1, -1, [0.0, 1.0]], [-2, -2.0, -1, -1, [1.0, 0.0]]], [[12, 0.32540126889944077, 1, 2, [0.7282913165266106, 0.27170868347338933]], [-2, -2.0, -1, -1, [0.0, 1.0]], [-2, -2.0, -1, -1, [1.0, 0.0]]], [[54, -0.06504480540752411, 1, 2, [0.7591036414565826, 0.24089635854341737]], [-2, -2.0, -1, -1, [0.0, 1.0]], [-2, -2.0, -1, -1, [1.0, 0.0]]], [[51, -0.10540267080068588, 1, 2, [0.7310924369747899, 0.2689075630252101]], [-2, -2.0, -1, -1, [0.0, 1.0]], [-2, -2.0, -1, -1, [1.0, 0.0]]], [[33, 0.06379610300064087, 1, 2, [0.7002801120448179, 0.29971988795518206]], [-2, -2.0, -1, -1, [0.0, 1.0]], [-2, -2.0, -1, -1, [1.0, 0.0]]], [[51, -0.14192544773686677, 1, 2, [0.711484593837535, 0.28851540616246496]], [-2, -2.0, -1, -1, [0.0, 1.0]], [-2, -2.0, -1, -1, [1.0, 0.0]]], [[6, 0.21270280331373215, 1, 2, [0.7086834733893558, 0.2913165266106443]], [-2, -2.0, -1, -1, [0.0, 1.0]], [-2, -2.0, -1, -1, [1.0, 0.0]]], [[51, -0.10540267080068588, 1, 2, [0.7198879551820728, 0.2801120448179272]], [-2, -2.0, -1, -1, [0.0, 1.0]], [-2, -2.0, -1, -1, [1.0, 0.0]]], [[6, 0.21270280331373215, 1, 2, [0.7394957983193278, 0.2605042016806723]], [-2, -2.0, -1, -1, [0.0, 1.0]], [-2, -2.0, -1, -1, [1.0, 0.0]]], [[18, 0.12842360138893127, 1, 2, [0.711484593837535, 0.28851540616246496]], [-2, -2.0, -1, -1, [0.0, 1.0]], [-2, -2.0, -1, -1, [1.0, 0.0]]], [[33, 0.05102206766605377, 1, 2, [0.711484593837535, 0.28851540616246496]], [-2, -2.0, -1, -1, [0.0, 1.0]], [-2, -2.0, -1, -1, [1.0, 0.0]]], [[21, 0.17704735696315765, 1, 2, [0.7591036414565826, 0.24089635854341737]], [-2, -2.0, -1, -1, [0.0, 1.0]], [-2, -2.0, -1, -1, [1.0, 0.0]]], [[27, -0.026275619864463806, 1, 2, [0.7198879551820728, 0.2801120448179272]], [-2, -2.0, -1, -1, [0.0, 1.0]], [-2, -2.0, -1, -1, [1.0, 0.0]]], [[45, -0.0434035062789917, 1, 2, [0.7198879551820728, 0.2801120448179272]], [-2, -2.0, -1, -1, [0.0, 1.0]], [-2, -2.0, -1, -1, [1.0, 0.0]]], [[51, -0.1367844515480101, 1, 2, [0.7254901960784313, 0.27450980392156865]], [-2, -2.0, -1, -1, [0.0, 1.0]], [-2, -2.0, -1, -1, [1.0, 0.0]]], [[18, 0.153352752327919, 1, 2, [0.680672268907563, 0.31932773109243695]], [-2, -2.0, -1, -1, [0.0, 1.0]], [-2, -2.0, -1, -1, [1.0, 0.0]]], [[18, 0.14957471191883087, 1, 2, [0.7030812324929971, 0.2969187675070028]], [-2, -2.0, -1, -1, [0.0, 1.0]], [-2, -2.0, -1, -1, [1.0, 0.0]]], [[12, 0.3261997401714325, 1, 2, [0.6946778711484594, 0.30532212885154064]], [-2, -2.0, -1, -1, [0.0, 1.0]], [-2, -2.0, -1, -1, [1.0, 0.0]]], [[42, -0.0519031286239624, 1, 2, [0.7086834733893558, 0.2913165266106443]], [-2, -2.0, -1, -1, [0.0, 1.0]], [-2, -2.0, -1, -1, [1.0, 0.0]]], [[69, 0.23764047026634216, 1, 2, [0.7198879551820728, 0.2801120448179272]], [-2, -2.0, -1, -1, [1.0, 0.0]], [-2, -2.0, -1, -1, [0.0, 1.0]]], [[58, -0.44819962978363037, 1, 4, [0.7394957983193278, 0.2605042016806723]], [59, -0.34223319590091705, 2, 3, [0.04838709677419355, 0.9516129032258065]], [-2, -2.0, -1, -1, [1.0, 0.0]], [-2, -2.0, -1, -1, [0.0, 1.0]], [63, -1.6205082535743713, 5, 6, [0.8847457627118644, 0.1152542372881356]], [-2, -2.0, -1, -1, [0.0, 1.0]], [-2, -2.0, -1, -1, [1.0, 0.0]]], [[57, -0.1326783448457718, 1, 2, [0.7170868347338936, 0.28291316526610644]], [-2, -2.0, -1, -1, [0.0, 1.0]], [-2, -2.0, -1, -1, [1.0, 0.0]]], [[12, 0.31835636496543884, 1, 2, [0.7254901960784313, 0.27450980392156865]], [-2, -2.0, -1, -1, [0.0, 1.0]], [-2, -2.0, -1, -1, [1.0, 0.0]]], [[9, 0.28040458261966705, 1, 2, [0.7338935574229691, 0.2661064425770308]], [-2, -2.0, -1, -1, [0.0, 1.0]], [-2, -2.0, -1, -1, [1.0, 0.0]]], [[18, 0.14957471191883087, 1, 2, [0.711484593837535, 0.28851540616246496]], [-2, -2.0, -1, -1, [0.0, 1.0]], [-2, -2.0, -1, -1, [1.0, 0.0]]], [[48, -0.06241104006767273, 1, 2, [0.6694677871148459, 0.33053221288515405]], [-2, -2.0, -1, -1, [0.0, 1.0]], [-2, -2.0, -1, -1, [1.0, 0.0]]], [[39, -0.12884938716888428, 1, 2, [0.7366946778711485, 0.26330532212885155]], [-2, -2.0, -1, -1, [0.0, 1.0]], [-2, -2.0, -1, -1, [1.0, 0.0]]], [[54, -0.11535938084125519, 1, 2, [0.711484593837535, 0.28851540616246496]], [-2, -2.0, -1, -1, [0.0, 1.0]], [-2, -2.0, -1, -1, [1.0, 0.0]]], [[57, -0.11423543095588684, 1, 2, [0.6890756302521008, 0.31092436974789917]], [-2, -2.0, -1, -1, [0.0, 1.0]], [-2, -2.0, -1, -1, [1.0, 0.0]]], [[54, -0.1425391137599945, 1, 2, [0.7198879551820728, 0.2801120448179272]], [-2, -2.0, -1, -1, [0.0, 1.0]], [-2, -2.0, -1, -1, [1.0, 0.0]]], [[15, 0.1015625, 1, 2, [0.742296918767507, 0.25770308123249297]], [-2, -2.0, -1, -1, [0.0, 1.0]], [-2, -2.0, -1, -1, [1.0, 0.0]]], [[15, 0.13484176993370056, 1, 2, [0.7282913165266106, 0.27170868347338933]], [-2, -2.0, -1, -1, [0.0, 1.0]], [-2, -2.0, -1, -1, [1.0, 0.0]]], [[57, -0.11423543095588684, 1, 2, [0.7254901960784313, 0.27450980392156865]], [-2, -2.0, -1, -1, [0.0, 1.0]], [-2, -2.0, -1, -1, [1.0, 0.0]]], [[48, -0.05067569017410278, 1, 2, [0.711484593837535, 0.28851540616246496]], [-2, -2.0, -1, -1, [0.0, 1.0]], [-2, -2.0, -1, -1, [1.0, 0.0]]], [[15, 0.11319451779127121, 1, 2, [0.7563025210084033, 0.24369747899159663]], [-2, -2.0, -1, -1, [0.0, 1.0]], [-2, -2.0, -1, -1, [1.0, 0.0]]], [[54, -0.09222453832626343, 1, 2, [0.6918767507002801, 0.3081232492997199]], [-2, -2.0, -1, -1, [0.0, 1.0]], [-2, -2.0, -1, -1, [1.0, 0.0]]], [[12, 0.3032892346382141, 1, 2, [0.711484593837535, 0.28851540616246496]], [-2, -2.0, -1, -1, [0.0, 1.0]], [-2, -2.0, -1, -1, [1.0, 0.0]]], [[12, 0.3032892346382141, 1, 2, [0.7226890756302521, 0.2773109243697479]], [-2, -2.0, -1, -1, [0.0, 1.0]], [-2, -2.0, -1, -1, [1.0, 0.0]]], [[30, 0.06341207027435303, 1, 2, [0.7030812324929971, 0.2969187675070028]], [-2, -2.0, -1, -1, [0.0, 1.0]], [-2, -2.0, -1, -1, [1.0, 0.0]]], [[21, 0.17811377346515656, 1, 2, [0.7058823529411765, 0.29411764705882354]], [-2, -2.0, -1, -1, [0.0, 1.0]], [-2, -2.0, -1, -1, [1.0, 0.0]]], [[21, 0.17811377346515656, 1, 2, [0.7310924369747899, 0.2689075630252101]], [-2, -2.0, -1, -1, [0.0, 1.0]], [-2, -2.0, -1, -1, [1.0, 0.0]]], [[69, 0.2381765991449356, 1, 2, [0.7086834733893558, 0.2913165266106443]], [-2, -2.0, -1, -1, [1.0, 0.0]], [-2, -2.0, -1, -1, [0.0, 1.0]]], [[24, 0.17788336426019669, 1, 2, [0.7058823529411765, 0.29411764705882354]], [-2, -2.0, -1, -1, [0.0, 1.0]], [-2, -2.0, -1, -1, [1.0, 0.0]]], [[24, 0.17788336426019669, 1, 2, [0.7198879551820728, 0.2801120448179272]], [-2, -2.0, -1, -1, [0.0, 1.0]], [-2, -2.0, -1, -1, [1.0, 0.0]]], [[51, -0.14192544773686677, 1, 2, [0.7086834733893558, 0.2913165266106443]], [-2, -2.0, -1, -1, [0.0, 1.0]], [-2, -2.0, -1, -1, [1.0, 0.0]]], [[12, 0.31835636496543884, 1, 2, [0.7983193277310925, 0.20168067226890757]], [-2, -2.0, -1, -1, [0.0, 1.0]], [-2, -2.0, -1, -1, [1.0, 0.0]]], [[18, 0.13813184201717377, 1, 2, [0.7198879551820728, 0.2801120448179272]], [-2, -2.0, -1, -1, [0.0, 1.0]], [-2, -2.0, -1, -1, [1.0, 0.0]]]]};
    const CONF_THRESHOLD = 0.82;
    const COOLDOWN_SCROLL = 300; // 0.3s
    const COOLDOWN_BUTTON = 700; // 0.7s
    const SCROLL_STEP = 420;

    let cooldownUntil = 0;
    let btnPrevHoverStart = null;
    let btnNextHoverStart = null;
    let activeStream = null;
    let isProcessing = false;
    let animFrameId = null;
    let handsInstance = null;

    // 1. Stop / Cleanup Function
    function stopController() {
        if (activeStream) {
            activeStream.getTracks().forEach(t => {
                try { t.stop(); } catch (e) {}
            });
            activeStream = null;
        }
        if (animFrameId) {
            cancelAnimationFrame(animFrameId);
            animFrameId = null;
        }
        if (video) {
            video.pause();
            video.srcObject = null;
        }
        if (handsInstance && typeof handsInstance.close === "function") {
            try { handsInstance.close(); } catch (e) {}
            handsInstance = null;
        }
        if (container && container.parentNode) {
            container.parentNode.removeChild(container);
        }
        window.__IRFANLLM_ACTIVE__ = false;
        window.__IRFANLLM_STOP__ = null;

        const pageBtn = document.getElementById("btn-camera");
        if (pageBtn) {
            pageBtn.innerText = "Activate Front Camera Demo";
            pageBtn.style.background = "";
            pageBtn.disabled = false;
        }
    }
    window.__IRFANLLM_STOP__ = stopController;

    // 2. Create Floating UI Overlay
    const container = document.createElement("div");
    container.id = "irfanllm-overlay";
    container.style.cssText = "position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:999999;font-family:sans-serif;";

    // Status Banner
    const banner = document.createElement("div");
    banner.style.cssText = "position:fixed;top:10px;left:50%;transform:translateX(-50%);background:rgba(0,0,0,0.88);color:#00ff99;padding:7px 16px;border-radius:20px;font-size:13px;font-weight:bold;border:1px solid #00ff99;box-shadow:0 2px 12px rgba(0,0,0,0.6);transition:all 0.2s;text-align:center;pointer-events:auto;display:flex;align-items:center;gap:10px;";
    
    const bannerText = document.createElement("span");
    bannerText.innerText = "IrfanLLM: Starting Camera...";
    banner.appendChild(bannerText);

    const bannerCloseBtn = document.createElement("button");
    bannerCloseBtn.innerText = "✕ Stop";
    bannerCloseBtn.title = "Turn Off Camera & Close Controller";
    bannerCloseBtn.style.cssText = "background:rgba(220,38,38,0.8);color:#fff;border:none;border-radius:10px;font-size:11px;padding:2px 8px;cursor:pointer;font-weight:bold;transition:background 0.2s;";
    bannerCloseBtn.onmouseenter = () => bannerCloseBtn.style.background = "#ef4444";
    bannerCloseBtn.onmouseleave = () => bannerCloseBtn.style.background = "rgba(220,38,38,0.8)";
    bannerCloseBtn.onclick = (e) => {
        e.stopPropagation();
        stopController();
    };
    banner.appendChild(bannerCloseBtn);
    container.appendChild(banner);

    // Camera Preview Pip
    const camBox = document.createElement("div");
    camBox.style.cssText = "position:fixed;bottom:15px;right:15px;width:115px;height:145px;background:#111;border-radius:12px;overflow:hidden;border:2px solid #00e5ff;box-shadow:0 4px 12px rgba(0,0,0,0.6);pointer-events:auto;";
    
    const video = document.createElement("video");
    video.style.cssText = "width:100%;height:100%;object-fit:cover;transform:scaleX(-1);";
    video.playsInline = true;
    video.muted = true;
    video.autoplay = true;
    video.setAttribute("playsinline", "");
    video.setAttribute("webkit-playsinline", "");
    video.setAttribute("muted", "");
    video.setAttribute("autoplay", "");
    camBox.appendChild(video);

    // Close Button on Camera PiP
    const pipCloseBtn = document.createElement("button");
    pipCloseBtn.innerText = "✕ Close";
    pipCloseBtn.title = "Stop Camera & Close Controller";
    pipCloseBtn.style.cssText = "position:absolute;top:3px;left:3px;background:rgba(220,38,38,0.85);color:#fff;border:none;border-radius:4px;font-size:10px;padding:2px 6px;cursor:pointer;font-weight:bold;z-index:2;";
    pipCloseBtn.onclick = () => stopController();
    camBox.appendChild(pipCloseBtn);

    // Hide/Show Toggle on Camera PiP
    const toggleBtn = document.createElement("button");
    toggleBtn.innerText = "Hide";
    toggleBtn.style.cssText = "position:absolute;top:3px;right:3px;background:rgba(0,0,0,0.65);color:#fff;border:none;border-radius:4px;font-size:10px;padding:2px 6px;cursor:pointer;z-index:2;";
    toggleBtn.onclick = () => {
        if (camBox.style.height === "26px") {
            camBox.style.height = "145px";
            camBox.style.width = "115px";
            toggleBtn.innerText = "Hide";
            pipCloseBtn.style.display = "block";
        } else {
            camBox.style.height = "26px";
            camBox.style.width = "105px";
            toggleBtn.innerText = "Show";
            pipCloseBtn.style.display = "none";
        }
    };
    camBox.appendChild(toggleBtn);
    container.appendChild(camBox);

    // Left Air Button (Prev)
    const btnPrev = document.createElement("div");
    btnPrev.style.cssText = "position:fixed;top:30%;left:8px;width:55px;height:160px;background:rgba(0,100,200,0.25);border:2px dashed #00b0ff;border-radius:12px;display:flex;align-items:center;justify-content:center;color:#00e5ff;font-size:13px;font-weight:bold;writing-mode:vertical-rl;text-orientation:mixed;transition:background 0.2s;";
    btnPrev.innerText = "< PREV";
    container.appendChild(btnPrev);

    // Right Air Button (Next)
    const btnNext = document.createElement("div");
    btnNext.style.cssText = "position:fixed;top:30%;right:8px;width:55px;height:160px;background:rgba(0,100,200,0.25);border:2px dashed #00b0ff;border-radius:12px;display:flex;align-items:center;justify-content:center;color:#00e5ff;font-size:13px;font-weight:bold;writing-mode:vertical-rl;text-orientation:mixed;transition:background 0.2s;";
    btnNext.innerText = "NEXT >";
    container.appendChild(btnNext);

    document.body.appendChild(container);

    // Dynamic Script Loader
    function loadScript(src) {
        return new Promise((resolve, reject) => {
            if (document.querySelector(`script[src="${src}"]`)) return resolve();
            const s = document.createElement("script");
            s.src = src;
            s.onload = resolve;
            s.onerror = () => reject(new Error("Failed to load: " + src));
            document.head.appendChild(s);
        });
    }

    // Decision Tree Evaluator
    function evaluateTree(nodes, features) {
        let nodeIdx = 0;
        while (true) {
            const [feat, thresh, left, right, val] = nodes[nodeIdx];
            if (feat === -2) {
                const total = val[0] + val[1];
                return [val[0] / total, val[1] / total];
            }
            if (features[feat] <= thresh) {
                nodeIdx = left;
            } else {
                nodeIdx = right;
            }
        }
    }

    function predictPosture(features) {
        let pDown = 0.0, pUp = 0.0;
        const trees = POSTURE_MODEL.trees;
        for (let i = 0; i < trees.length; i++) {
            const res = evaluateTree(trees[i], features);
            pDown += res[0];
            pUp += res[1];
        }
        return [pDown / trees.length, pUp / trees.length];
    }

    function extractFeatures(lm) {
        const wrist = lm[0];
        const palmScale = Math.hypot(lm[9].x - wrist.x, lm[9].y - wrist.y) || 1.0;
        const feats = [];
        for (let i = 0; i < lm.length; i++) {
            feats.push((lm[i].x - wrist.x) / palmScale);
            feats.push((lm[i].y - wrist.y) / palmScale);
            feats.push((lm[i].z - wrist.z) / palmScale);
        }
        const dxMid = lm[9].x - wrist.x;
        const dyMid = lm[9].y - wrist.y;
        const angleHand = Math.atan2(dyMid, dxMid);

        const dThumb = Math.hypot(lm[4].x - wrist.x, lm[4].y - wrist.y) / palmScale;
        const dIndex = Math.hypot(lm[8].x - wrist.x, lm[8].y - wrist.y) / palmScale;
        const dMid   = Math.hypot(lm[12].x - wrist.x, lm[12].y - wrist.y) / palmScale;
        const dRing  = Math.hypot(lm[16].x - wrist.x, lm[16].y - wrist.y) / palmScale;
        const dPinky = Math.hypot(lm[20].x - wrist.x, lm[20].y - wrist.y) / palmScale;

        feats.push(angleHand, dThumb, dIndex, dMid, dRing, dPinky, wrist.x, wrist.y);
        return { feats, dMid };
    }

    function executeScroll(step) {
        const demoArea = document.getElementById("webtoon-scroll-area");
        if (demoArea) {
            demoArea.style.borderColor = step > 0 ? "#00ff66" : "#00e5ff";
            demoArea.style.boxShadow = step > 0 ? "0 0 15px rgba(0,255,102,0.4)" : "0 0 15px rgba(0,229,255,0.4)";
            setTimeout(() => {
                demoArea.style.borderColor = "";
                demoArea.style.boxShadow = "";
            }, 280);

            const canScrollDown = step > 0 && (demoArea.scrollTop + demoArea.clientHeight < demoArea.scrollHeight - 10);
            const canScrollUp = step < 0 && (demoArea.scrollTop > 10);

            if (canScrollDown || canScrollUp) {
                demoArea.scrollBy({ top: step, behavior: 'smooth' });
            } else {
                window.scrollBy({ top: step, behavior: 'smooth' });
            }
        } else {
            window.scrollBy({ top: step, behavior: 'smooth' });
        }
    }

    // Resilient Camera Acquisition with multi-tier fallback
    async function acquireCameraStream() {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            throw new Error("getUserMedia is not supported on this browser context.");
        }

        // Check if Permissions-Policy is blocking camera on this document
        if (document.permissionsPolicy && typeof document.permissionsPolicy.allowsFeature === 'function') {
            if (!document.permissionsPolicy.allowsFeature('camera')) {
                const err = new Error("POLICY_BLOCKED");
                err.name = "PermissionsPolicyViolation";
                throw err;
            }
        }

        const constraintsList = [
            { video: { facingMode: { ideal: "user" }, width: { ideal: 640 }, height: { ideal: 480 } } },
            { video: { facingMode: "user" } },
            { video: true }
        ];

        let lastErr = null;
        for (const c of constraintsList) {
            try {
                const s = await navigator.mediaDevices.getUserMedia(c);
                if (s) return s;
            } catch (e) {
                lastErr = e;
                console.warn("[IrfanLLM] Constraint failed:", c, e);
            }
        }
        throw lastErr || new Error("Failed to acquire camera stream");
    }

    async function init() {
        try {
            bannerText.innerText = "Loading MediaPipe AI...";
            banner.style.color = "#00e5ff";
            banner.style.borderColor = "#00e5ff";
            
            await loadScript("https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js");

            handsInstance = new Hands({
                locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
            });

            handsInstance.setOptions({
                maxNumHands: 1,
                modelComplexity: 0,
                minDetectionConfidence: 0.35,
                minTrackingConfidence: 0.35
            });

            handsInstance.onResults((results) => {
                const now = Date.now();
                if (!results.multiHandLandmarks || results.multiHandLandmarks.length === 0) {
                    bannerText.innerText = "IrfanLLM: Ready (Waiting for Hand)";
                    banner.style.color = "#aaa";
                    btnPrev.style.background = "rgba(0,100,200,0.25)";
                    btnNext.style.background = "rgba(0,100,200,0.25)";
                    btnPrevHoverStart = null;
                    btnNextHoverStart = null;
                    return;
                }

                const lm = results.multiHandLandmarks[0];
                const indexTip = lm[8];
                const screenX = (1.0 - indexTip.x) * window.innerWidth;
                const screenY = indexTip.y * window.innerHeight;

                // 1. Air Button Checks
                const inLeft = (screenX <= 80 && screenY >= window.innerHeight * 0.25 && screenY <= window.innerHeight * 0.65);
                const inRight = (screenX >= window.innerWidth - 80 && screenY >= window.innerHeight * 0.25 && screenY <= window.innerHeight * 0.65);

                if (inLeft) {
                    btnPrev.style.background = "rgba(0,255,200,0.6)";
                    if (!btnPrevHoverStart) btnPrevHoverStart = now;
                    else if (now - btnPrevHoverStart > 220 && now > cooldownUntil) {
                        cooldownUntil = now + COOLDOWN_BUTTON;
                        const prevLink = document.querySelector("a[rel='prev'], .nav-prev, .prev-post, .prev_page, #prev-chapter");
                        if (prevLink) {
                            bannerText.innerText = "<< PREV CHAPTER <<";
                            banner.style.color = "#00ffea";
                            prevLink.click();
                        } else {
                            window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }));
                            if (document.getElementById("webtoon-scroll-area")) {
                                bannerText.innerText = "<< PREV (Active on Manga Sites) <<";
                                banner.style.color = "#fbbf24";
                            } else {
                                bannerText.innerText = "<< PREV CHAPTER <<";
                                banner.style.color = "#00ffea";
                            }
                        }
                    }
                    return;
                } else {
                    btnPrevHoverStart = null;
                    btnPrev.style.background = "rgba(0,100,200,0.25)";
                }

                if (inRight) {
                    btnNext.style.background = "rgba(0,255,200,0.6)";
                    if (!btnNextHoverStart) btnNextHoverStart = now;
                    else if (now - btnNextHoverStart > 220 && now > cooldownUntil) {
                        cooldownUntil = now + COOLDOWN_BUTTON;
                        const nextLink = document.querySelector("a[rel='next'], .nav-next, .next-post, .next_page, #next-chapter");
                        if (nextLink) {
                            bannerText.innerText = ">> NEXT CHAPTER >>";
                            banner.style.color = "#00ffea";
                            nextLink.click();
                        } else {
                            window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
                            if (document.getElementById("webtoon-scroll-area")) {
                                bannerText.innerText = ">> NEXT (Active on Manga Sites) >>";
                                banner.style.color = "#fbbf24";
                            } else {
                                bannerText.innerText = ">> NEXT CHAPTER >>";
                                banner.style.color = "#00ffea";
                            }
                        }
                    }
                    return;
                } else {
                    btnNextHoverStart = null;
                    btnNext.style.background = "rgba(0,100,200,0.25)";
                }

                // 2. Middle Zone AI Posture Classification
                const { feats, dMid } = extractFeatures(lm);
                if (dMid > 1.35) {
                    bannerText.innerText = "Relaxed / Open Hand (Idle)";
                    banner.style.color = "#ffea00";
                    return;
                }

                const [pDown, pUp] = predictPosture(feats);

                if (pDown >= CONF_THRESHOLD) {
                    bannerText.innerText = `vv SCROLL DOWN (${Math.round(pDown*100)}%) vv`;
                    banner.style.color = "#00ff66";
                    if (now >= cooldownUntil) {
                        executeScroll(SCROLL_STEP);
                        cooldownUntil = now + COOLDOWN_SCROLL;
                    }
                } else if (pUp >= CONF_THRESHOLD) {
                    bannerText.innerText = `^^ SCROLL UP (${Math.round(pUp*100)}%) ^^`;
                    banner.style.color = "#00ff66";
                    if (now >= cooldownUntil) {
                        executeScroll(-SCROLL_STEP);
                        cooldownUntil = now + COOLDOWN_SCROLL;
                    }
                } else {
                    bannerText.innerText = "Uncertain Posture (Idle)";
                    banner.style.color = "#aaa";
                }
            });

            bannerText.innerText = "Requesting Front Camera...";
            banner.style.color = "#00e5ff";

            activeStream = await acquireCameraStream();
            video.srcObject = activeStream;

            await new Promise((resolve) => {
                video.onloadedmetadata = () => {
                    video.play().then(resolve).catch(resolve);
                };
            });

            bannerText.innerText = "IrfanLLM Active! Hold gesture to scroll.";
            banner.style.color = "#00ff66";
            banner.style.borderColor = "#00ff66";

            // Update on-page trigger button to Stop state
            const pageBtn = document.getElementById("btn-camera");
            if (pageBtn) {
                pageBtn.innerText = "⏹️ Stop Camera Demo";
                pageBtn.style.background = "#dc2626";
                pageBtn.disabled = false;
            }

            // High-performance requestAnimationFrame loop with concurrency protection
            async function frameLoop() {
                if (!video.paused && !video.ended && video.readyState >= 2) {
                    if (!isProcessing && handsInstance) {
                        isProcessing = true;
                        try {
                            await handsInstance.send({ image: video });
                        } catch (err) {
                            console.warn("[IrfanLLM] Frame drop:", err);
                        } finally {
                            isProcessing = false;
                        }
                    }
                }
                animFrameId = requestAnimationFrame(frameLoop);
            }
            animFrameId = requestAnimationFrame(frameLoop);

        } catch (err) {
            console.error("[IrfanLLM] Initialization Error:", err);
            const pageBtn = document.getElementById("btn-camera");
            if (pageBtn) {
                pageBtn.innerText = "Activate Front Camera Demo";
                pageBtn.style.background = "";
                pageBtn.disabled = false;
            }

            const isPolicyBlocked = (err.name === "PermissionsPolicyViolation" || err.message === "POLICY_BLOCKED" || (err.message && err.message.toLowerCase().includes("permissions policy")));

            banner.style.cursor = "pointer";
            banner.style.background = "rgba(180,0,0,0.92)";
            banner.style.borderColor = "#ff4444";
            banner.style.color = "#ffffff";

            if (isPolicyBlocked) {
                bannerText.innerText = "Domain Header Blocked Camera (Tap for Guide)";
                const showPolicyHelp = () => {
                    alert(
                        "CAMERA BLOCKED BY CLOUDFLARE / GITHUB PAGES HEADER:\n\n" +
                        "GitHub Pages enforces 'Permissions-Policy: camera=()' on all custom domains by default.\n\n" +
                        "2 WAYS TO RESOLVE:\n" +
                        "1. DEMONICSCANS BOOKMARKLET (Immediate):\n" +
                        "Use the 1-line bookmarklet on demonicscans.org (or any manga site). DemonicScans does NOT have this header, so the camera opens immediately!\n\n" +
                        "2. CLOUDFLARE DASHBOARD FIX (2 Minutes):\n" +
                        "Open dash.cloudflare.com -> Select irfanfahmi.com -> Rules -> Transform Rules -> Modify Response Header.\n" +
                        "Rule: URI Path starts with '/manga' -> Action: Remove response header 'Permissions-Policy' (or set camera=*)."
                    );
                };
                banner.onclick = showPolicyHelp;
            } else if (err.name === "NotAllowedError" || (err.message && err.message.includes("Permission denied"))) {
                bannerText.innerText = "Camera Permission Denied (Tap for Help)";
                const showPermHelp = () => {
                    alert(
                        "CAMERA PERMISSION DENIED:\n\n" +
                        "1. Tap the Tune / Lock icon in your browser's address bar.\n" +
                        "2. Go to 'Site settings' -> 'Permissions' -> 'Camera'.\n" +
                        "3. Change to 'Allow' and refresh the page."
                    );
                };
                banner.onclick = showPermHelp;
            } else {
                bannerText.innerText = "Camera Error: " + (err.name || err.message);
                banner.onclick = () => alert("Camera Error:\n" + (err.stack || err.message || err));
            }
        }
    }

    init();
})();
