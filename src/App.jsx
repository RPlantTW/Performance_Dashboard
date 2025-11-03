import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart, ReferenceLine, ScatterChart, Scatter, ZAxis, AreaChart, Area } from 'recharts';

// ====================================================================
// BATTLE OF THE AREAS DATA (October Snapshot)
// ====================================================================

// Data provided for S1, S2, S3 and Overall South comparison
const battleOfTheAreasSourceData = [
    { region: 'South 1', revenueVsTarget: 92.50, atv: 17.44, ncVsTGT: 57.00, raf: 7.30, vltz: 73.30, wrc: 56.70, unregisteredTransations: 6.20, appAdoption: 53.30, ncAppAdoption: 43.40, retention: 36.50 },
    { region: 'South 2', revenueVsTarget: 89.30, atv: 19.26, ncVsTGT: 53.10, raf: 9.00, vltz: 57.00, wrc: 62.50, unregisteredTransations: 9.40, appAdoption: 45.50, ncAppAdoption: 50.20, retention: 40.40 },
    { region: 'South 3', revenueVsTarget: 85.10, atv: 18.08, ncVsTGT: 41.80, raf: 2.50, vltz: 67.90, wrc: 54.80, unregisteredTransations: 7.50, appAdoption: 50.40, ncAppAdoption: 46.50, retention: 38.50 },
    { region: 'South', revenueVsTarget: 89.10, atv: 18.18, ncVsTGT: 51.70, raf: 6.60, vltz: 66.70, wrc: 57.50, unregisteredTransations: 7.60, appAdoption: 50.20, ncAppAdoption: 45.70, retention: 37.80 },
];

// Definition of KPIs and whether higher values are better (NC App Adoption added)
const Kpis = [
    { key: 'revenueVsTarget', label: 'Rev vs TGT', format: (v) => v.toFixed(1) + '%', higherIsBetter: true },
    { key: 'atv', label: 'ATV (£)', format: (v) => '£' + v.toFixed(2), higherIsBetter: true },
    { key: 'ncVsTGT', label: 'NC vs TGT %', format: (v) => v.toFixed(1) + '%', higherIsBetter: true },
    { key: 'raf', label: 'RAF %', format: (v) => v.toFixed(1) + '%', higherIsBetter: true },
    { key: 'vltz', label: 'VLTZ %', format: (v) => v.toFixed(1) + '%', higherIsBetter: true },
    { key: 'wrc', label: 'WRC %', format: (v) => v.toFixed(1) + '%', higherIsBetter: true },
    { key: 'unregisteredTransations', label: 'Unreg %', format: (v) => v.toFixed(1) + '%', higherIsBetter: false }, // LOWER IS BETTER
    { key: 'appAdoption', label: 'App Adop %', format: (v) => v.toFixed(1) + '%', higherIsBetter: true },
    { key: 'ncAppAdoption', label: 'NC App Adop %', format: (v) => v.toFixed(1) + '%', higherIsBetter: true }, // NEW KPI
    { key: 'retention', label: 'RET %', format: (v) => v.toFixed(1) + '%', higherIsBetter: true },
];

// Helper function to calculate ranks for S1, S2, S3
const calculateBattleRanks = (data) => {
    const regionalData = data.filter(d => d.region !== 'South');
    const rankedData = data.map(d => ({ ...d }));

    Kpis.forEach(kpi => {
        const values = regionalData.map(d => d[kpi.key]);
        
        // Sort values to determine ranks (higherIsBetter toggles sorting order)
        const sortedValues = [...values].sort((a, b) => kpi.higherIsBetter ? b - a : a - b);
        
        // Assign rank to each region (1-indexed)
        rankedData.forEach(item => {
            if (item.region === 'South') {
                item[`${kpi.key}Rank`] = null; // Overall row has no rank
                return;
            }
            // Find the rank (1-indexed)
            const rank = sortedValues.indexOf(item[kpi.key]) + 1;
            item[`${kpi.key}Rank`] = rank;
        });
    });
    return rankedData;
};

const battleOfTheAreasData = calculateBattleRanks(battleOfTheAreasSourceData);


// ====================================================================
// OCTOBER DATA - FULL REPLACEMENT with new values
// ====================================================================

// Raw OCTOBER KPI Data (Store Level) - Used for Cluster Aggregation and Detail Table
// Data has been updated based on the user's latest provided table
const rawOctoberKpiData = [
    { store: 'Bristol', cluster: 'S1-1-B', Sales: 22208.84, SalesTarget: 23600.00, SalesVsTGT: 94.10, Transacrions: 1481, ATV: 15.00, NC: 235, NCTGT: 367, NCVsTGT: 64.00, NCS_BUYING_LIQUID: 135, NCS_Buying_LIQUID_non_eligible: 0, NCS_BUYING_LIQUID_WRC_FIRST: 8, WRC: 65.20, NC_Emails_Captured: 225, NC_Email_Capture_percent: 95.70, NC_Phone_Numbers_captured: 198, NC_Phone_Number_capture_percent: 84.30, Unresgistered_Transactions: 111, Unregistered_percent: 7.50, NCs_from_RAF: 14, RAF_percent: 6.00, TOTAL_NUBER_OF_TRADE_IN_KITS: 34, Trade_in_Revenue_Kits_and_Flex_Pro_batteries: 438.84, Open_Tank_Kits_Sales_inc_Flex_pro_batteries: 1988.67, Trade_in_Vs_Kit_Sales: 22.10, TOTAL_3rd_Party_and_VLTZ_Revenue: 14900.83, TOTAL_3rd_Party_and_VLTZ_R_of_TOTAL_REVENUES: 67.10, Party_pound: 3060.24, VLTZ_pound: 11840.58, VLTZ_percent: 79.50, Sales_This_Year_if_LFL_store: 22208.84, Last_Year_Full_Month: 27127.04, percent_currently_achieved_of_LY: 81.90, Prev_Months_NCs: 276, Number_of_One_offs: 191, Number_of_Returning_Customers: 853, Retention: 30.80 },
    { store: 'Gloucester', cluster: 'S1-1-G', Sales: 14112.80, SalesTarget: 15500.00, SalesVsTGT: 91.10, Transacrions: 726, ATV: 19.44, NC: 29, NCTGT: 63, NCVsTGT: 45.80, NCS_BUYING_LIQUID: 18, NCS_Buying_LIQUID_non_eligible: 0, NCS_BUYING_LIQUID_WRC_FIRST: 16, WRC: 88.90, NC_Emails_Captured: 29, NC_Email_Capture_percent: 100.00, NC_Phone_Numbers_captured: 28, NC_Phone_Number_capture_percent: 96.60, Unresgistered_Transactions: 20, Unregistered_percent: 2.80, NCs_from_RAF: 5, RAF_percent: 17.20, TOTAL_NUBER_OF_TRADE_IN_KITS: 8, Trade_in_Revenue_Kits_and_Flex_Pro_batteries: 169.72, Open_Tank_Kits_Sales_inc_Flex_pro_batteries: 1200.14, Trade_in_Vs_Kit_Sales: 14.10, TOTAL_3rd_Party_and_VLTZ_Revenue: 7891.82, TOTAL_3rd_Party_and_VLTZ_R_of_TOTAL_REVENUES: 55.90, Party_pound: 1582.18, VLTZ_pound: 6309.64, VLTZ_percent: 80.00, Sales_This_Year_if_LFL_store: 14112.80, Last_Year_Full_Month: 13706.35, percent_currently_achieved_of_LY: 103.00, Prev_Months_NCs: 28, Number_of_One_offs: 19, Number_of_Returning_Customers: 93, Retention: 32.10 },
    { store: 'Nottingham', cluster: 'S1-1-N', Sales: 10102.59, SalesTarget: 15100.00, SalesVsTGT: 66.90, Transacrions: 656, ATV: 15.40, NC: 56, NCTGT: 134, NCVsTGT: 41.80, NCS_BUYING_LIQUID: 39, NCS_Buying_LIQUID_non_eligible: 0, NCS_BUYING_LIQUID_WRC_FIRST: 17, WRC: 43.60, NC_Emails_Captured: 51, NC_Email_Capture_percent: 91.10, NC_Phone_Numbers_captured: 10, NC_Phone_Number_capture_percent: 17.90, Unresgistered_Transactions: 78, Unregistered_percent: 11.90, NCs_from_RAF: 7, RAF_percent: 12.50, TOTAL_NUBER_OF_TRADE_IN_KITS: 7, Trade_in_Revenue_Kits_and_Flex_Pro_batteries: 140.73, Open_Tank_Kits_Sales_inc_Flex_pro_batteries: 784.31, Trade_in_Vs_Kit_Sales: 17.90, TOTAL_3rd_Party_and_VLTZ_Revenue: 5996.20, TOTAL_3rd_Party_and_VLTZ_R_of_TOTAL_REVENUES: 59.40, Party_pound: 2439.11, VLTZ_pound: 3557.09, VLTZ_percent: 59.30, Sales_This_Year_if_LFL_store: 10102.59, Last_Year_Full_Month: 17871.54, percent_currently_achieved_of_LY: 56.50, Prev_Months_NCs: 75, Number_of_One_offs: 56, Number_of_Returning_Customers: 192, Retention: 25.30 },
    { store: 'Rugby', cluster: 'S1-1-R', Sales: 10121.19, SalesTarget: 10400.00, SalesVsTGT: 97.30, Transacrions: 489, ATV: 20.70, NC: 34, NCTGT: 69, NCVsTGT: 49.30, NCS_BUYING_LIQUID: 19, NCS_Buying_LIQUID_non_eligible: 0, NCS_BUYING_LIQUID_WRC_FIRST: 14, WRC: 73.70, NC_Emails_Captured: 31, NC_Email_Capture_percent: 91.20, NC_Phone_Numbers_captured: 29, NC_Phone_Number_capture_percent: 85.30, Unresgistered_Transactions: 7, Unregistered_percent: 1.40, NCs_from_RAF: 8, RAF_percent: 23.50, TOTAL_NUBER_OF_TRADE_IN_KITS: 8, Trade_in_Revenue_Kits_and_Flex_Pro_batteries: 186.13, Open_Tank_Kits_Sales_inc_Flex_pro_batteries: 1016.05, Trade_in_Vs_Kit_Sales: 18.30, TOTAL_3rd_Party_and_VLTZ_Revenue: 5173.41, TOTAL_3rd_Party_and_VLTZ_R_of_TOTAL_REVENUES: 51.10, Party_pound: 1928.15, VLTZ_pound: 3245.26, VLTZ_percent: 62.70, Sales_This_Year_if_LFL_store: 10121.19, Last_Year_Full_Month: 9944.41, percent_currently_achieved_of_LY: 101.80, Prev_Months_NCs: 35, Number_of_One_offs: 25, Number_of_Returning_Customers: 102, Retention: 28.60 },
    { store: 'Barnstaple', cluster: 'S1-2-BE', Sales: 15962.41, SalesTarget: 16200.00, SalesVsTGT: 98.50, Transacrions: 871, ATV: 18.33, NC: 20, NCTGT: 51, NCVsTGT: 38.90, NCS_BUYING_LIQUID: 14, NCS_Buying_LIQUID_non_eligible: 0, NCS_BUYING_LIQUID_WRC_FIRST: 6, WRC: 70.00, NC_Emails_Captured: 20, NC_Email_Capture_percent: 100.00, NC_Phone_Numbers_captured: 20, NC_Phone_Number_capture_percent: 100.00, Unresgistered_Transactions: 78, Unregistered_percent: 9.00, NCs_from_RAF: 2, RAF_percent: 10.00, TOTAL_NUBER_OF_TRADE_IN_KITS: 11, Trade_in_Revenue_Kits_and_Flex_Pro_batteries: 258.36, Open_Tank_Kits_Sales_inc_Flex_pro_batteries: 1666.39, Trade_in_Vs_Kit_Sales: 15.50, TOTAL_3rd_Party_and_VLTZ_Revenue: 9426.84, TOTAL_3rd_Party_and_VLTZ_R_of_TOTAL_REVENUES: 59.10, Party_pound: 2810.84, VLTZ_pound: 6616.00, VLTZ_percent: 70.20, Sales_This_Year_if_LFL_store: 15962.41, Last_Year_Full_Month: 16072.55, percent_currently_achieved_of_LY: 99.30, Prev_Months_NCs: 38, Number_of_One_offs: 18, Number_of_Returning_Customers: 205, Retention: 52.60 },
    { store: 'Exeter', cluster: 'S1-2-BE', Sales: 22331.33, SalesTarget: 27800.00, SalesVsTGT: 80.30, Transacrions: 1557, ATV: 14.34, NC: 194, NCTGT: 228, NCVsTGT: 85.00, NCS_BUYING_LIQUID: 123, NCS_Buying_LIQUID_non_eligible: 0, NCS_BUYING_LIQUID_WRC_FIRST: 36, WRC: 63.40, NC_Emails_Captured: 162, NC_Email_Capture_percent: 83.50, NC_Phone_Numbers_captured: 147, NC_Phone_Number_capture_percent: 75.80, Unresgistered_Transactions: 171, Unregistered_percent: 11.00, NCs_from_RAF: 12, RAF_percent: 6.20, TOTAL_NUBER_OF_TRADE_IN_KITS: 12, Trade_in_Revenue_Kits_and_Flex_Pro_batteries: 298.19, Open_Tank_Kits_Sales_inc_Flex_pro_batteries: 2018.34, Trade_in_Vs_Kit_Sales: 14.80, TOTAL_3rd_Party_and_VLTZ_Revenue: 14628.84, TOTAL_3rd_Party_and_VLTZ_R_of_TOTAL_REVENUES: 65.50, Party_pound: 5997.95, VLTZ_pound: 8630.88, VLTZ_percent: 59.00, Sales_This_Year_if_LFL_store: 22331.33, Last_Year_Full_Month: 29977.53, percent_currently_achieved_of_LY: 74.50, Prev_Months_NCs: 194, Number_of_One_offs: 86, Number_of_Returning_Customers: 764, Retention: 46.90 },
    { store: 'Birmingham', cluster: 'S1-2-BT', Sales: 7866.79, SalesTarget: 11100.00, SalesVsTGT: 70.90, Transacrions: 559, ATV: 14.07, NC: 44, NCTGT: 71, NCVsTGT: 62.30, NCS_BUYING_LIQUID: 29, NCS_Buying_LIQUID_non_eligible: 0, NCS_BUYING_LIQUID_WRC_FIRST: 8, WRC: 65.90, NC_Emails_Captured: 39, NC_Email_Capture_percent: 88.60, NC_Phone_Numbers_captured: 34, NC_Phone_Number_capture_percent: 77.30, Unresgistered_Transactions: 91, Unregistered_percent: 16.30, NCs_from_RAF: 5, RAF_percent: 11.40, TOTAL_NUBER_OF_TRADE_IN_KITS: 5, Trade_in_Revenue_Kits_and_Flex_Pro_batteries: 107.20, Open_Tank_Kits_Sales_inc_Flex_pro_batteries: 883.19, Trade_in_Vs_Kit_Sales: 12.10, TOTAL_3rd_Party_and_VLTZ_Revenue: 5302.36, TOTAL_3rd_Party_and_VLTZ_R_of_TOTAL_REVENUES: 67.40, Party_pound: 2338.74, VLTZ_pound: 2963.63, VLTZ_percent: 55.90, Sales_This_Year_if_LFL_store: 7866.79, Last_Year_Full_Month: 12860.38, percent_currently_achieved_of_LY: 61.20, Prev_Months_NCs: 58, Number_of_One_offs: 41, Number_of_Returning_Customers: 172, Retention: 29.30 },
    { store: 'Tyburn', cluster: 'S1-2-BT', Sales: 10431.48, SalesTarget: 10900.00, SalesVsTGT: 95.70, Transacrions: 447, ATV: 23.34, NC: 18, NCTGT: 31, NCVsTGT: 58.10, NCS_BUYING_LIQUID: 9, NCS_Buying_LIQUID_non_eligible: 0, NCS_BUYING_LIQUID_WRC_FIRST: 9, WRC: 100.00, NC_Emails_Captured: 9, NC_Email_Capture_percent: 50.00, NC_Phone_Numbers_captured: 14, NC_Phone_Number_capture_percent: 77.80, Unresgistered_Transactions: 33, Unregistered_percent: 7.40, NCs_from_RAF: 3, RAF_percent: 16.70, TOTAL_NUBER_OF_TRADE_IN_KITS: 13, Trade_in_Revenue_Kits_and_Flex_Pro_batteries: 342.35, Open_Tank_Kits_Sales_inc_Flex_pro_batteries: 969.80, Trade_in_Vs_Kit_Sales: 35.30, TOTAL_3rd_Party_and_VLTZ_Revenue: 3506.91, TOTAL_3rd_Party_and_VLTZ_R_of_TOTAL_REVENUES: 33.60, Party_pound: 1506.58, VLTZ_pound: 2000.32, VLTZ_percent: 57.00, Sales_This_Year_if_LFL_store: 10431.48, Last_Year_Full_Month: 10637.57, percent_currently_achieved_of_LY: 98.10, Prev_Months_NCs: 18, Number_of_One_offs: 5, Number_of_Returning_Customers: 57, Retention: 58.30 },
    { store: 'Wolves Chapel Ash', cluster: 'S1-2-CP', Sales: 10078.05, SalesTarget: 10700.00, SalesVsTGT: 94.20, Transacrions: 511, ATV: 19.72, NC: 14, NCTGT: 34, NCVsTGT: 40.80, NCS_BUYING_LIQUID: 14, NCS_Buying_LIQUID_non_eligible: 0, NCS_BUYING_LIQUID_WRC_FIRST: 8, WRC: 73.70, NC_Emails_Captured: 19, NC_Email_Capture_percent: 90.50, NC_Phone_Numbers_captured: 14, NC_Phone_Number_capture_percent: 66.70, Unresgistered_Transactions: 22, Unregistered_percent: 4.30, NCs_from_RAF: 3, RAF_percent: 14.30, TOTAL_NUBER_OF_TRADE_IN_KITS: 4, Trade_in_Revenue_Kits_and_Flex_Pro_batteries: 107.16, Open_Tank_Kits_Sales_inc_Flex_pro_batteries: 874.98, Trade_in_Vs_Kit_Sales: 12.20, TOTAL_3rd_Party_and_VLTZ_Revenue: 3687.19, TOTAL_3rd_Party_and_VLTZ_R_of_TOTAL_REVENUES: 36.60, Party_pound: 875.53, VLTZ_pound: 2811.66, VLTZ_percent: 76.30, Sales_This_Year_if_LFL_store: 10078.05, Last_Year_Full_Month: 11705.51, percent_currently_achieved_of_LY: 86.10, Prev_Months_NCs: 22, Number_of_One_offs: 10, Number_of_Returning_Customers: 125, Retention: 54.50 },
    { store: 'Wolves Penn Road', cluster: 'S1-2-CP', Sales: 8486.99, SalesTarget: 8500.00, SalesVsTGT: 99.80, Transacrions: 427, ATV: 19.88, NC: 16, NCTGT: 53, NCVsTGT: 30.00, NCS_BUYING_LIQUID: 12, NCS_Buying_LIQUID_non_eligible: 0, NCS_BUYING_LIQUID_WRC_FIRST: 9, WRC: 75.00, NC_Emails_Captured: 15, NC_Email_Capture_percent: 93.80, NC_Phone_Numbers_captured: 15, NC_Phone_Number_capture_percent: 93.80, Unresgistered_Transactions: 29, Unregistered_percent: 6.80, NCs_from_RAF: 4, RAF_percent: 25.00, TOTAL_NUBER_OF_TRADE_IN_KITS: 8, Trade_in_Revenue_Kits_and_Flex_Pro_batteries: 205.37, Open_Tank_Kits_Sales_inc_Flex_pro_batteries: 774.84, Trade_in_Vs_Kit_Sales: 26.50, TOTAL_3rd_Party_and_VLTZ_Revenue: 4105.63, TOTAL_3rd_Party_and_VLTZ_R_of_TOTAL_REVENUES: 48.40, Party_pound: 1280.43, VLTZ_pound: 2825.20, VLTZ_percent: 68.80, Sales_This_Year_if_LFL_store: 8486.99, Last_Year_Full_Month: 9556.24, percent_currently_achieved_of_LY: 88.80, Prev_Months_NCs: 21, Number_of_One_offs: 14, Number_of_Returning_Customers: 73, Retention: 33.30 },
    { store: 'Bridgend', cluster: 'S1-3-BMR', Sales: 15806.51, SalesTarget: 15100.00, SalesVsTGT: 104.70, Transacrions: 948, ATV: 16.67, NC: 45, NCTGT: 98, NCVsTGT: 45.90, NCS_BUYING_LIQUID: 29, NCS_Buying_LIQUID_non_eligible: 0, NCS_BUYING_LIQUID_WRC_FIRST: 8, WRC: 64.40, NC_Emails_Captured: 36, NC_Email_Capture_percent: 80.00, NC_Phone_Numbers_captured: 24, NC_Phone_Number_capture_percent: 53.30, Unresgistered_Transactions: 58, Unregistered_percent: 6.10, NCs_from_RAF: 6, RAF_percent: 13.30, TOTAL_NUBER_OF_TRADE_IN_KITS: 3, Trade_in_Revenue_Kits_and_Flex_Pro_batteries: 105.08, Open_Tank_Kits_Sales_inc_Flex_pro_batteries: 1771.43, Trade_in_Vs_Kit_Sales: 5.90, TOTAL_3rd_Party_and_VLTZ_Revenue: 11382.62, TOTAL_3rd_Party_and_VLTZ_R_of_TOTAL_REVENUES: 72.00, Party_pound: 2798.91, VLTZ_pound: 8583.71, VLTZ_percent: 75.40, Sales_This_Year_if_LFL_store: 15806.51, Last_Year_Full_Month: 14065.78, percent_currently_achieved_of_LY: 112.40, Prev_Months_NCs: 67, Number_of_One_offs: 39, Number_of_Returning_Customers: 284, Retention: 41.80 },
    { store: 'Merthyr', cluster: 'S1-3-BMR', Sales: 13731.43, SalesTarget: 16600.00, SalesVsTGT: 82.70, Transacrions: 877, ATV: 15.66, NC: 53, NCTGT: 111, NCVsTGT: 47.70, NCS_BUYING_LIQUID: 34, NCS_Buying_LIQUID_non_eligible: 0, NCS_BUYING_LIQUID_WRC_FIRST: 10, WRC: 64.20, NC_Emails_Captured: 45, NC_Email_Capture_percent: 84.90, NC_Phone_Numbers_captured: 50, NC_Phone_Number_capture_percent: 94.30, Unresgistered_Transactions: 40, Unregistered_percent: 4.60, NCs_from_RAF: 4, RAF_percent: 7.50, TOTAL_NUBER_OF_TRADE_IN_KITS: 5, Trade_in_Revenue_Kits_and_Flex_Pro_batteries: 128.55, Open_Tank_Kits_Sales_inc_Flex_pro_batteries: 1258.18, Trade_in_Vs_Kit_Sales: 10.20, TOTAL_3rd_Party_and_VLTZ_Revenue: 10842.85, TOTAL_3rd_Party_and_VLTZ_R_of_TOTAL_REVENUES: 79.00, Party_pound: 2543.87, VLTZ_pound: 8298.98, VLTZ_percent: 76.50, Sales_This_Year_if_LFL_store: 13731.43, Last_Year_Full_Month: 17668.58, percent_currently_achieved_of_LY: 77.70, Prev_Months_NCs: 53, Number_of_One_offs: 36, Number_of_Returning_Customers: 223, Retention: 37.90 },
    { store: 'Rumney', cluster: 'S1-3-BMR', Sales: 20215.31, SalesTarget: 24800.00, SalesVsTGT: 81.50, Transacrions: 1163, ATV: 17.38, NC: 49, NCTGT: 78, NCVsTGT: 62.80, NCS_BUYING_LIQUID: 33, NCS_Buying_LIQUID_non_eligible: 0, NCS_BUYING_LIQUID_WRC_FIRST: 8, WRC: 67.30, NC_Emails_Captured: 44, NC_Email_Capture_percent: 89.80, NC_Phone_Numbers_captured: 45, NC_Phone_Number_capture_percent: 91.80, Unresgistered_Transactions: 71, Unregistered_percent: 6.10, NCs_from_RAF: 4, RAF_percent: 8.20, TOTAL_NUBER_OF_TRADE_IN_KITS: 15, Trade_in_Revenue_Kits_and_Flex_Pro_batteries: 333.58, Open_Tank_Kits_Sales_inc_Flex_pro_batteries: 2015.00, Trade_in_Vs_Kit_Sales: 16.60, TOTAL_3rd_Party_and_VLTZ_Revenue: 11479.74, TOTAL_3rd_Party_and_VLTZ_R_of_TOTAL_REVENUES: 56.80, Party_pound: 1830.70, VLTZ_pound: 9649.05, VLTZ_percent: 84.10, Sales_This_Year_if_LFL_store: 20215.31, Last_Year_Full_Month: 25718.56, percent_currently_achieved_of_LY: 78.60, Prev_Months_NCs: 51, Number_of_One_offs: 31, Number_of_Returning_Customers: 120, Retention: 39.20 },
    { store: 'Madeley', cluster: 'S1-3-MSW', Sales: 25465.00, SalesTarget: 22600.00, SalesVsTGT: 112.70, Transacrions: 1313, ATV: 19.39, NC: 74, NCTGT: 166, NCVsTGT: 44.50, NCS_BUYING_LIQUID: 47, NCS_Buying_LIQUID_non_eligible: 0, NCS_BUYING_LIQUID_WRC_FIRST: 10, WRC: 63.50, NC_Emails_Captured: 66, NC_Email_Capture_percent: 89.20, NC_Phone_Numbers_captured: 65, NC_Phone_Number_capture_percent: 87.80, Unresgistered_Transactions: 9, Unregistered_percent: 0.70, NCs_from_RAF: 10, RAF_percent: 13.50, TOTAL_NUBER_OF_TRADE_IN_KITS: 15, Trade_in_Revenue_Kits_and_Flex_Pro_batteries: 343.47, Open_Tank_Kits_Sales_inc_Flex_pro_batteries: 2550.79, Trade_in_Vs_Kit_Sales: 13.50, TOTAL_3rd_Party_and_VLTZ_Revenue: 12671.25, TOTAL_3rd_Party_and_VLTZ_R_of_TOTAL_REVENUES: 49.80, Party_pound: 1384.54, VLTZ_pound: 11286.71, VLTZ_percent: 89.10, Sales_This_Year_if_LFL_store: 25465.00, Last_Year_Full_Month: 23631.27, percent_currently_achieved_of_LY: 107.80, Prev_Months_NCs: 104, Number_of_One_offs: 62, Number_of_Returning_Customers: 424, Retention: 40.40 },
    { store: 'Shrewsbury', cluster: 'S1-3-MSW', Sales: 16607.76, SalesTarget: 15400.00, SalesVsTGT: 107.80, Transacrions: 835, ATV: 19.89, NC: 86, NCTGT: 125, NCVsTGT: 69.00, NCS_BUYING_LIQUID: 49, NCS_Buying_LIQUID_non_eligible: 0, NCS_BUYING_LIQUID_WRC_FIRST: 17, WRC: 56.90, NC_Emails_Captured: 69, NC_Email_Capture_percent: 80.20, NC_Phone_Numbers_captured: 63, NC_Phone_Number_capture_percent: 73.30, Unresgistered_Transactions: 20, Unregistered_percent: 2.40, NCs_from_RAF: 4, RAF_percent: 4.70, TOTAL_NUBER_OF_TRADE_IN_KITS: 15, Trade_in_Revenue_Kits_and_Flex_Pro_batteries: 406.24, Open_Tank_Kits_Sales_inc_Flex_pro_batteries: 2112.98, Trade_in_Vs_Kit_Sales: 19.20, TOTAL_3rd_Party_and_VLTZ_Revenue: 6263.56, TOTAL_3rd_Party_and_VLTZ_R_of_TOTAL_REVENUES: 37.70, Party_pound: 1764.97, VLTZ_pound: 4498.59, VLTZ_percent: 71.80, Sales_This_Year_if_LFL_store: 16607.76, Last_Year_Full_Month: 17196.98, percent_currently_achieved_of_LY: 96.60, Prev_Months_NCs: 84, Number_of_One_offs: 59, Number_of_Returning_Customers: 252, Retention: 29.80 },
    { store: 'Wellington', cluster: 'S1-3-MSW', Sales: 12178.54, SalesTarget: 10500.00, SalesVsTGT: 116.00, Transacrions: 655, ATV: 18.59, NC: 43, NCTGT: 92, NCVsTGT: 46.70, NCS_BUYING_LIQUID: 29, NCS_Buying_LIQUID_non_eligible: 0, NCS_BUYING_LIQUID_WRC_FIRST: 14, WRC: 67.40, NC_Emails_Captured: 40, NC_Email_Capture_percent: 93.00, NC_Phone_Numbers_captured: 38, NC_Phone_Number_capture_percent: 88.40, Unresgistered_Transactions: 6, Unregistered_percent: 0.90, NCs_from_RAF: 9, RAF_percent: 20.90, TOTAL_NUBER_OF_TRADE_IN_KITS: 10, Trade_in_Revenue_Kits_and_Flex_Pro_batteries: 332.70, Open_Tank_Kits_Sales_inc_Flex_pro_batteries: 1385.84, Trade_in_Vs_Kit_Sales: 24.00, TOTAL_3rd_Party_and_VLTZ_Revenue: 5117.92, TOTAL_3rd_Party_and_VLTZ_R_of_TOTAL_REVENUES: 42.00, Party_pound: 1183.29, VLTZ_pound: 3934.63, VLTZ_percent: 76.90, Sales_This_Year_if_LFL_store: 12178.54, Last_Year_Full_Month: 7009.03, percent_currently_achieved_of_LY: 173.80, Prev_Months_NCs: 70, Number_of_One_offs: 45, Number_of_Returning_Customers: 252, Retention: 35.70 },
];

// Define which KPIs are used in the detailed table and whether high is good
const detailedKpiDefinitions = [
    { key: 'store', label: 'Store', format: (v) => v, higherIsBetter: true },
    { key: 'cluster', label: 'Cluster', format: (v) => v, higherIsBetter: true },

    { key: 'SalesVsTGT', label: 'Sales vs TGT %', format: (v) => v.toFixed(1) + '%', higherIsBetter: true },
    { key: 'NCVsTGT', label: 'NC vs TGT %', format: (v) => v.toFixed(1) + '%', higherIsBetter: true },
    { key: 'ATV', label: 'ATV', format: (v) => '£' + v.toFixed(2), higherIsBetter: true },
    { key: 'Retention', label: 'RET %', format: (v) => v.toFixed(1) + '%', higherIsBetter: true },
    { key: 'WRC', label: 'WRC %', format: (v) => v.toFixed(1) + '%', higherIsBetter: true },
    { key: 'VLTZ_percent', label: 'VLTZ %', format: (v) => v.toFixed(1) + '%', higherIsBetter: true },
    { key: 'Unregistered_percent', label: 'Unreg %', format: (v) => v.toFixed(1) + '%', higherIsBetter: false }, // LOWER IS BETTER
    { key: 'Trade_in_Vs_Kit_Sales', label: 'Trade-In %', format: (v) => v.toFixed(1) + '%', higherIsBetter: true },
    { key: 'RAF_percent', label: 'RAF %', format: (v) => v.toFixed(1) + '%', higherIsBetter: true },
    { key: 'NC_Email_Capture_percent', label: 'Email Cap %', format: (v) => v.toFixed(1) + '%', higherIsBetter: true },
    { key: 'NC_Phone_Number_capture_percent', label: 'Phone Cap %', format: (v) => v.toFixed(1) + '%', higherIsBetter: true },
];

function calculateSouthAreaAverages(data) {
    const totals = {};
    let count = 0;

    data.forEach(store => {
        count++;
        detailedKpiDefinitions.filter(kpi => kpi.key !== 'store' && kpi.key !== 'cluster').forEach(kpi => {
            const value = store[kpi.key];
            if (!totals[kpi.key]) {
                totals[kpi.key] = 0;
            }
            totals[kpi.key] += value;
        });
    });

    const averages = {};
    detailedKpiDefinitions.filter(kpi => kpi.key !== 'store' && kpi.key !== 'cluster').forEach(kpi => {
        averages[kpi.key] = totals[kpi.key] / count;
    });

    return averages;
}

const southAreaAverages = calculateSouthAreaAverages(rawOctoberKpiData);

function aggregateDataByCluster(data) {
    const aggregated = {};

    data.forEach(store => {
        const cluster = store.cluster;
        if (!aggregated[cluster]) {
            aggregated[cluster] = {
                count: 0,
                SalesSum: 0,
                SalesTargetSum: 0,
                NCSum: 0,
                NCTargetSum: 0,
                WRCSum: 0,
                UnregisteredSum: 0,
                TradeInSum: 0,
                VLTZSum: 0,
                RetentionSum: 0,
            };
        }

        aggregated[cluster].count++;
        aggregated[cluster].SalesSum += store.Sales;
        aggregated[cluster].SalesTargetSum += store.SalesTarget;
        aggregated[cluster].NCSum += store.NC;
        aggregated[cluster].NCTargetSum += store.NCTGT;
        
        // Use direct percentages for averaging metrics
        aggregated[cluster].WRCSum += store.WRC;
        aggregated[cluster].UnregisteredSum += store.Unregistered_percent;
        aggregated[cluster].VLTZSum += store.VLTZ_percent;
        aggregated[cluster].TradeInSum += store.Trade_in_Vs_Kit_Sales;
        aggregated[cluster].RetentionSum += store.Retention; // October Retention
    });

    const result = [];
    for (const cluster in aggregated) {
        const agg = aggregated[cluster];
        const salesVsTarget = (agg.SalesSum / agg.SalesTargetSum) * 100;
        const ncVsTarget = (agg.NCSum / agg.NCTargetSum) * 100;
        
        result.push({
            cluster,
            // Sales/NC Totals (for first two charts)
            salesQ3: agg.SalesSum,
            salesTargetQ3: agg.SalesTargetSum,
            salesVsTarget: salesVsTarget,
            ncQ3: agg.NCSum,
            ncTargetQ3: agg.NCTargetSum,
            ncVsTarget: ncVsTarget,
            
            // Key Metric Snapshot (October - for highlights/correlation)
            salesVsTargetOct: salesVsTarget, // Renamed from Sep to Oct
            ncVsTargetOct: ncVsTarget, // Renamed from Sep to Oct
            wrc: agg.WRCSum / agg.count, // Average WRC %
            unregisteredTransaction: agg.UnregisteredSum / agg.count, // Average Unregistered %
            tradeInVsKitSales: agg.TradeInSum / agg.count, // Average Trade In %
            vltz: agg.VLTZSum / agg.count, // Average VLTZ %
            octoberRetention: agg.RetentionSum / agg.count, // Renamed from September to October Retention
        });
    }

    return result;
}

const clusterKpiMetrics = aggregateDataByCluster(rawOctoberKpiData);


// 1. CLUSTER SALES / NC DATA (October)
const q3SalesNcData = clusterKpiMetrics.map(item => ({
    cluster: item.cluster,
    salesQ3: item.salesQ3,
    salesTargetQ3: item.salesTargetQ3,
    salesVsTarget: item.salesVsTarget,
    ncQ3: item.ncQ3,
    ncTargetQ3: item.ncTargetQ3,
    ncVsTarget: item.ncVsTarget,
}));

// 2. CLUSTER KEY METRICS SNAPSHOT (October)
const newQ3KeyMetricsWithRetention = clusterKpiMetrics.map(item => ({
    cluster: item.cluster,
    salesVsTargetOct: item.salesVsTargetOct, // Used new Oct name
    ncVsTargetOct: item.ncVsTargetOct, // Used new Oct name
    wrc: item.wrc,
    unregisteredTransaction: item.unregisteredTransaction,
    tradeInVsKitSales: item.tradeInVsKitSales,
    vltz: item.vltz,
    octoberRetention: item.octoberRetention, // Used new Oct name
}));


// Q2 Monthly Retention Data (July, Aug, Sep, Oct) - Data is correct as per user
const storeRetentionData = [
    { store: 'Bristol', cluster: 'S1-1-B', July: 34.10, August: 37.60, September: 24.00, October: 30.80 },
    { store: 'Gloucester', cluster: 'S1-1-G', July: 40.00, August: 44.40, September: 30.80, October: 32.10 },
    { store: 'Nottingham', cluster: 'S1-1-N', July: 28.60, August: 22.60, September: 15.80, October: 25.30 },
    { store: 'Rugby', cluster: 'S1-1-R', July: 30.00, August: 38.20, September: 45.50, October: 28.60 },
    { store: 'Barnstaple', cluster: 'S1-2-BE', July: 39.50, August: 56.10, September: 48.80, October: 52.60 },
    { store: 'Exeter', cluster: 'S1-2-BE', July: 37.50, August: 28.50, September: 33.30, October: 46.90 },
    { store: 'Birmingham', cluster: 'S1-2-BT', July: 50.00, August: 43.60, September: 27.30, October: 29.30 },
    { store: 'Tyburn', cluster: 'S1-2-BT', July: 41.20, August: 30.80, September: 46.70, October: 58.30 },
    { store: 'Wolves Chapel Ash', cluster: 'S1-2-CP', July: 38.10, August: 35.70, September: 16.70, October: 54.50 },
    { store: 'Wolves Penn Road', cluster: 'S1-2-CP', July: 43.20, August: 53.30, September: 37.00, October: 33.30 },
    { store: 'Bridgend', cluster: 'S1-3-BMR', July: 55.90, August: 40.90, September: 40.00, October: 41.80 },
    { store: 'Merthyr', cluster: 'S1-3-BMR', July: 39.10, August: 40.60, September: 26.70, October: 37.90 },
    { store: 'Rumney', cluster: 'S1-3-BMR', July: 42.40, August: 40.00, September: 36.40, October: 39.20 },
    { store: 'Madeley', cluster: 'S1-3-MSW', July: 48.80, August: 33.80, September: 42.40, October: 40.40 },
    { store: 'Shrewsbury', cluster: 'S1-3-MSW', July: 40.50, August: 32.20, September: 30.60, October: 29.80 },
    { store: 'Wellington', cluster: 'S1-3-MSW', July: 35.10, August: 37.10, September: 34.90, October: 35.70 },
];

const calculateClusterRetention = (month) => {
    const clusterValues = {};
    const clusterCounts = {};
    storeRetentionData.forEach(item => {
        const cluster = item.cluster;
        const value = item[month];
        if (!clusterValues[cluster]) {
            clusterValues[cluster] = 0;
            clusterCounts[cluster] = 0;
        }
        clusterValues[cluster] += value;
        clusterCounts[cluster] += 1;
    });

    const clusterAverages = {};
    for (const cluster in clusterValues) {
        clusterAverages[cluster] = clusterValues[cluster] / clusterCounts[cluster];
    }
    return clusterAverages;
};

const q2RetentionData = clusterKpiMetrics.map(item => ({
    cluster: item.cluster,
    julyRetention: calculateClusterRetention('July')[item.cluster] || 0,
    augustRetention: calculateClusterRetention('August')[item.cluster] || 0,
    septemberRetention: calculateClusterRetention('September')[item.cluster] || 0,
    octoberRetention: calculateClusterRetention('October')[item.cluster] || 0,
}));


// Q2 Monthly ACB Data (July, Aug, Sep, Oct) - Data is correct as per user
const storeAcbData = [
    { store: 'Bristol', cluster: 'S1-1-B', July: 944, August: 894, September: 963, October: 932 },
    { store: 'Gloucester', cluster: 'S1-1-G', July: 388, August: 375, September: 367, October: 365 },
    { store: 'Nottingham', cluster: 'S1-1-N', July: 403, August: 433, September: 407, October: 350 },
    { store: 'Rugby', cluster: 'S1-1-R', July: 280, August: 285, September: 284, October: 267 },
    { store: 'Barnstaple', cluster: 'S1-2-BE', July: 450, August: 430, September: 438, October: 395 },
    { store: 'Exeter', cluster: 'S1-2-BE', July: 847, August: 872, September: 951, October: 902 },
    { store: 'Birmingham', cluster: 'S1-2-BT', July: 321, August: 313, September: 332, October: 314 },
    { store: 'Tyburn', cluster: 'S1-2-BT', July: 240, August: 221, September: 235, October: 230 },
    { store: 'Wolves Chapel Ash', cluster: 'S1-2-CP', July: 286, August: 295, September: 273, October: 291 },
    { store: 'Wolves Penn Road', cluster: 'S1-2-CP', July: 251, August: 241, September: 232, October: 221 },
    { store: 'Bridgend', cluster: 'S1-3-BMR', July: 409, August: 422, September: 448, October: 440 },
    { store: 'Merthyr', cluster: 'S1-3-BMR', July: 451, August: 445, September: 433, October: 416 },
    { store: 'Rumney', cluster: 'S1-3-BMR', July: 609, August: 584, September: 569, October: 570 },
    { store: 'Madeley', cluster: 'S1-3-MSW', July: 723, August: 690, September: 680, October: 668 },
    { store: 'Shrewsbury', cluster: 'S1-3-MSW', July: 492, August: 552, September: 496, October: 470 },
    { store: 'Wellington', cluster: 'S1-3-MSW', July: 393, August: 411, September: 388, October: 359 },
];

const calculateClusterAcb = (month) => {
    const clusterTotals = {};
    storeAcbData.forEach(item => {
        const cluster = item.cluster;
        const value = item[month];
        if (!clusterTotals[cluster]) {
            clusterTotals[cluster] = 0;
        }
        clusterTotals[cluster] += value;
    });
    return clusterTotals;
};

const julyAcbTotals = calculateClusterAcb('July');
const augustAcbTotals = calculateClusterAcb('August');
const septemberAcbTotals = calculateClusterAcb('September');
const octoberAcbTotals = calculateClusterAcb('October');

const q2AcbData = q3SalesNcData.map(item => ({
    cluster: item.cluster,
    julyACB: julyAcbTotals[item.cluster] || 0,
    augustACB: augustAcbTotals[item.cluster] || 0,
    septemberACB: septemberAcbTotals[item.cluster] || 0,
    octoberACB: octoberAcbTotals[item.cluster] || 0,
}));

// NEW DATA: H1 Audit Results (MWW and Compliance) - Remains defined but section hidden
const storeAuditData = [
    { store: 'Bristol', cluster: 'S1-1-B', MWW: 98.00, Compliance: 93.72 },
    { store: 'Gloucester', cluster: 'S1-1-G', MWW: 88.00, Compliance: 95.71 },
    { store: 'Nottingham', cluster: 'S1-1-N', MWW: 90.00, Compliance: 94.95 },
    { store: 'Rugby', cluster: 'S1-1-R', MWW: 100.00, Compliance: 98.99 },
    { store: 'Barnstaple', cluster: 'S1-2-BE', MWW: 96.00, Compliance: 96.44 },
    { store: 'Exeter', cluster: 'S1-2-BE', MWW: 99.00, Compliance: 93.04 },
    { store: 'Birmingham', cluster: 'S1-2-BT', MWW: 84.00, Compliance: 96.63 },
    { store: 'Tyburn', cluster: 'S1-2-BT', MWW: 90.00, Compliance: 99.50 },
    { store: 'Wolves Chapel Ash', cluster: 'S1-2-CP', MWW: 97.00, Compliance: 97.96 },
    { store: 'Wolves Penn Road', cluster: 'S1-2-CP', MWW: 100.00, Compliance: 97.96 },
    { store: 'Bridgend', cluster: 'S1-3-BMR', MWW: 83.00, Compliance: 94.28 },
    { store: 'Merthyr', cluster: 'S1-3-BMR', MWW: 98.00, Compliance: 97.14 },
    { store: 'Rumney', cluster: 'S1-3-BMR', MWW: 97.00, Compliance: 90.15 },
    { store: 'Madeley', cluster: 'S1-3-MSW', MWW: 98.00, Compliance: 94.57 },
    { store: 'Shrewsbury', cluster: 'S1-3-MSW', MWW: 79.00, Compliance: 96.94 },
    { store: 'Wellington', cluster: 'S1-3-MSW', MWW: 100.00, Compliance: 99.15 },
];

function aggregateAuditData(data) {
    const aggregated = {};

    data.forEach(store => {
        const cluster = store.cluster;
        if (!aggregated[cluster]) {
            aggregated[cluster] = {
                count: 0,
                MWWSum: 0,
                ComplianceSum: 0,
            };
        }
        aggregated[cluster].count++;
        aggregated[cluster].MWWSum += store.MWW;
        aggregated[cluster].ComplianceSum += store.Compliance;
    });

    const mwwResults = [];
    const complianceResults = [];

    for (const cluster in aggregated) {
        mwwResults.push({
            cluster,
            result: aggregated[cluster].MWWSum / aggregated[cluster].count,
        });
        complianceResults.push({
            cluster,
            result: aggregated[cluster].ComplianceSum / aggregated[cluster].count,
        });
    }

    return { mwwResults, complianceResults };
}

const { mwwResults: q3MwwAuditData, complianceResults: q3ComplianceAuditData } = aggregateAuditData(storeAuditData);

// Updated Google Reviews Data (REPLACED)
const q3GoogleReviewsData = [
    { store: 'Barnstaple', reviews: 2, lastRank: 2, currentRank: 2, change: 0 },
    { store: 'Birmingham', reviews: 3, lastRank: 4, currentRank: 6, change: -2 },
    { store: 'Bridgend', reviews: 0, lastRank: 5, currentRank: 6, change: -1 },
    { store: 'Bristol', reviews: 21, lastRank: 5, currentRank: 3, change: 2 },
    { store: 'Exeter', reviews: 3, lastRank: 3, currentRank: 5, change: -2 },
    { store: 'Gloucester', reviews: 2, lastRank: 6, currentRank: 8, change: -2 },
    { store: 'Madeley', reviews: 40, lastRank: 1, currentRank: 1, change: 0 },
    { store: 'Merthyr Tydfil', reviews: 0, lastRank: 3, currentRank: 3, change: 0 },
    { store: 'Nottingham', reviews: 3, lastRank: 4, currentRank: 5, change: -1 },
    { store: 'Rugby', reviews: 1, lastRank: 6, currentRank: 4, change: 2 },
    { store: 'Rumney', reviews: 0, lastRank: 1, currentRank: 2, change: -1 },
    { store: 'Shrewsbury', reviews: 6, lastRank: 2, currentRank: 4, change: -2 },
    { store: 'Tyburn', reviews: 0, lastRank: 2, currentRank: 2, change: 0 },
    { store: 'Wellington', reviews: 35, lastRank: 2, currentRank: 2, change: 0 },
    { store: 'Wolves Chapel Ash', reviews: 10, lastRank: 6, currentRank: 1, change: 5 },
    { store: 'Wolves Penn Road', reviews: 3, lastRank: 1, currentRank: 1, change: 0 },
];

// TW App Signups - Restructured for monthly progress visualisation (Bristol Oct updated)
const appAdoptionProgressData = [
    { store: 'Bristol', cluster: 'S1-1-B', July: 36.70, August: 50.60, September: 53.40, October: 65.40 }, // Updated Bristol Oct value
    { store: 'Gloucester', cluster: 'S1-1-G', July: 22.00, August: 29.90, September: 40.20, October: 59.10 },
    { store: 'Nottingham', cluster: 'S1-1-N', July: 16.90, August: 19.50, September: 19.20, October: 49.50 },
    { store: 'Rugby', cluster: 'S1-1-R', July: 22.70, August: 33.20, September: 36.50, October: 51.60 },
    { store: 'Barnstaple', cluster: 'S1-2-BE', July: 11.10, August: 17.10, September: 27.50, October: 43.20 },
    { store: 'Exeter', cluster: 'S1-2-BE', July: 11.20, August: 17.60, September: 27.70, October: 42.10 },
    { store: 'Birmingham', cluster: 'S1-2-BT', July: 17.50, August: 19.30, September: 23.50, October: 42.70 },
    { store: 'Tyburn', cluster: 'S1-2-BT', July: 19.20, August: 21.90, September: 23.70, October: 33.50 },
    { store: 'Wolves Chapel Ash', cluster: 'S1-2-CP', July: 18.10, August: 29.90, September: 41.50, October: 54.90 },
    { store: 'Wolves Penn Road', cluster: 'S1-2-CP', July: 21.30, August: 32.00, September: 38.20, October: 54.50 },
    { store: 'Bridgend', cluster: 'S1-3-BMR', July: 17.50, August: 28.70, September: 33.90, October: 48.50 },
    { store: 'Merthyr', cluster: 'S1-3-BMR', July: 16.80, August: 33.00, September: 47.60, October: 59.60 }, 
    { store: 'Rumney', cluster: 'S1-3-BMR', July: 9.60, August: 22.80, September: 29.20, October: 35.30 },
    { store: 'Madeley', cluster: 'S1-3-MSW', July: 20.80, August: 45.60, September: 58.10, October: 76.00 },
    { store: 'Shrewsbury', cluster: 'S1-3-MSW', July: 13.30, August: 32.10, September: 30.50, October: 49.00 },
    { store: 'Wellington', cluster: 'S1-3-MSW', July: 20.20, August: 33.50, September: 46.00, October: 65.50 },
];

// Data for October App Adoption Snapshot (derived from monthly data)
const twAppSignupOctData = appAdoptionProgressData.map(d => ({
    store: d.store,
    cluster: d.cluster,
    percentHaveApp: d.October,
}));

// Area Average for App Adoption 
const octoberAreaAverage = 50.2; 

// NEW NC APP ADOPTION DATA (REPLACED)
const ncAppAdoptionData = [
    { store: 'Bristol', cluster: 'S1-1-B', ncAppAdoption: 47.20, missedOpportunity: 124 },
    { store: 'Gloucester', cluster: 'S1-1-G', ncAppAdoption: 79.30, missedOpportunity: 6 },
    { store: 'Nottingham', cluster: 'S1-1-N', ncAppAdoption: 28.60, missedOpportunity: 40 },
    { store: 'Rugby', cluster: 'S1-1-R', ncAppAdoption: 55.90, missedOpportunity: 15 },
    { store: 'Barnstaple', cluster: 'S1-2-BE', ncAppAdoption: 63.60, missedOpportunity: 8 },
    { store: 'Exeter', cluster: 'S1-2-BE', ncAppAdoption: 34.00, missedOpportunity: 128 },
    { store: 'Birmingham', cluster: 'S1-2-BT', ncAppAdoption: 40.90, missedOpportunity: 26 },
    { store: 'Tyburn', cluster: 'S1-2-BT', ncAppAdoption: 21.10, missedOpportunity: 15 },
    { store: 'Wolves Chapel Ash', cluster: 'S1-2-CP', ncAppAdoption: 60.00, missedOpportunity: 6 },
    { store: 'Wolves Penn Road', cluster: 'S1-2-CP', ncAppAdoption: 70.60, missedOpportunity: 5 },
    { store: 'Bridgend', cluster: 'S1-3-BMR', ncAppAdoption: 40.00, missedOpportunity: 27 },
    { store: 'Merthyr', cluster: 'S1-3-BMR', ncAppAdoption: 34.00, missedOpportunity: 35 },
    { store: 'Rumney', cluster: 'S1-3-BMR', ncAppAdoption: 28.60, missedOpportunity: 35 },
    { store: 'Madeley', cluster: 'S1-3-MSW', ncAppAdoption: 54.10, missedOpportunity: 34 },
    { store: 'Shrewsbury', cluster: 'S1-3-MSW', ncAppAdoption: 34.90, missedOpportunity: 56 },
    { store: 'Wellington', cluster: 'S1-3-MSW', ncAppAdoption: 67.40, missedOpportunity: 14 },
];

// Area Average NC App Adoption %
const averageNcAppAdoption = ncAppAdoptionData.reduce((sum, d) => sum + d.ncAppAdoption, 0) / ncAppAdoptionData.length;

// NC App Adoption Target (New Constant)
const NC_APP_ADOPTION_TARGET = 80;


// NEW DATA: November Targets - FULL REPLACEMENT with new values
const novemberTargetsData = [
    { store: 'Bristol', cluster: 'S1-1-B', monthTarget: '£23,700.00', clusterSalesTarget: '£23,700.00', ncTarget: 378, clusterNCTarget: 378 },
    { store: 'Gloucester', cluster: 'S1-1-G', monthTarget: '£15,600.00', clusterSalesTarget: '£15,600.00', ncTarget: 56, clusterNCTarget: 56 },
    { store: 'Nottingham', cluster: 'S1-1-N', monthTarget: '£15,200.00', clusterSalesTarget: '£15,200.00', ncTarget: 123, clusterNCTarget: 123 },
    { store: 'Rugby', cluster: 'S1-1-R', monthTarget: '£10,500.00', clusterSalesTarget: '£10,500.00', ncTarget: 62, clusterNCTarget: 62 },
    { store: 'Barnstaple', cluster: 'S1-2-BE', monthTarget: '£16,300.00', clusterSalesTarget: '£44,300.00', ncTarget: 68, clusterNCTarget: 302 },
    { store: 'Exeter', cluster: 'S1-2-BE', monthTarget: '£28,000.00', clusterSalesTarget: '£44,300.00', ncTarget: 234, clusterNCTarget: 302 },
    { store: 'Birmingham', cluster: 'S1-2-BT', monthTarget: '£11,200.00', clusterSalesTarget: '£22,200.00', ncTarget: 77, clusterNCTarget: 107 },
    { store: 'Tyburn', cluster: 'S1-2-BT', monthTarget: '£11,000.00', clusterSalesTarget: '£22,200.00', ncTarget: 30, clusterNCTarget: 107 },
    { store: 'Wolves Chapel Ash', cluster: 'S1-2-CP', monthTarget: '£10,800.00', clusterSalesTarget: '£19,400.00', ncTarget: 39, clusterNCTarget: 84 },
    { store: 'Wolves Penn Road', cluster: 'S1-2-CP', monthTarget: '£8,600.00', clusterSalesTarget: '£19,400.00', ncTarget: 45, clusterNCTarget: 84 },
    { store: 'Bridgend', cluster: 'S1-3-BMR', monthTarget: '£15,300.00', clusterSalesTarget: '£57,000.00', ncTarget: 75, clusterNCTarget: 252 },
    { store: 'Merthyr', cluster: 'S1-3-BMR', monthTarget: '£16,700.00', clusterSalesTarget: '£57,000.00', ncTarget: 100, clusterNCTarget: 252 },
    { store: 'Rumney', cluster: 'S1-3-BMR', monthTarget: '£25,000.00', clusterSalesTarget: '£57,000.00', ncTarget: 77, clusterNCTarget: 252 },
    { store: 'Madeley', cluster: 'S1-3-MSW', monthTarget: '£22,700.00', clusterSalesTarget: '£48,900.00', ncTarget: 158, clusterNCTarget: 376 },
    { store: 'Shrewsbury', cluster: 'S1-3-MSW', monthTarget: '£15,600.00', clusterSalesTarget: '£48,900.00', ncTarget: 125, clusterNCTarget: 376 },
    { store: 'Wellington', cluster: 'S1-3-MSW', monthTarget: '£10,600.00', clusterSalesTarget: '£48,900.00', ncTarget: 93, clusterNCTarget: 376 },
];

// QUIZ DATA REFRESHED
const QUIZ_DATA = [
    {
        question: "Based on the Battle of the Areas table, which region secured the strongest RET % (Retention) in October?",
        options: ["South 1", "South 2", "South 3"],
        correctAnswer: "South 2",
    },
    {
        question: "Based on the New Customer App Adoption & Missed Opportunity chart, which store had the highest raw Missed Opportunity count in October?",
        options: ["Bristol", "Exeter", "Shrewsbury"],
        correctAnswer: "Exeter", // 128
    },
    {
        question: "Based on the New Customer App Adoption & Missed Opportunity chart, which store achieved the highest NC App Adoption % in October?",
        options: ["Madeley", "Gloucester", "Wolves Penn Road"],
        correctAnswer: "Gloucester", // 79.30%
    },
    {
        question: "Looking at the Google Local Ranking Performance table, which store achieved the largest positive improvement in rank position (largest 'change' figure)?",
        options: ["Bristol (+2)", "Rugby (+2)", "Wolves Chapel Ash (+5)"],
        correctAnswer: "Wolves Chapel Ash (+5)", 
    },
    {
        question: "The narrative on the Retention Strategy suggests that the primary focus to improve retention should be:",
        options: [
            "Stopping the conversation once a customer accepts a single incentive.",
            "Providing layered, comprehensive value through multiple relevant incentives.",
            "Increasing product discounts across all transactions.",
        ],
        correctAnswer: "Providing layered, comprehensive value through multiple relevant incentives.",
    },
];


// ====================================================================
// MAIN APP COMPONENT
// ====================================================================

const App = () => {
    // State for interactive cluster selection
    const allClusters = [...new Set(q3SalesNcData.map(d => d.cluster))];
    const [selectedCluster, setSelectedCluster] = useState('All'); // Default to 'All'
    
    // State for the Quiz
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [userAnswers, setUserAnswers] = useState(Array(QUIZ_DATA.length).fill(null));
    const [quizPassed, setQuizPassed] = useState(false);
    const [message, setMessage] = useState('');
    
    // State for KPI Detail Table Hovering
    const [hoveredStore, setHoveredStore] = useState(null); 

    // Colours and constants (UK spelling for consistency)
    const barColors = ['#4A90E2', '#8BC34A', '#FFC107', '#E91E63', '#9C27B0', '#00BCD4', '#FF9800', '#795548', '#607D8B'];
    const lineColors = ['#0077B6', '#FCA311', '#5B5F97', '#E91E63']; // Dark Blue, Orange, Muted Purple, Pink/Red (for Oct)
    const appBarColor = '#8BC34A'; // Green for "App Adoption" bars
    const averageLineColor = '#E91E63'; // Pink/Red for Average Reference Line
    const ncAppAdoptionColor = '#10B981'; // Green for NC App Adoption %
    const missedOpportunityColor = '#EF4444'; // Red for Missed Opportunity Count


    // --- QUIZ LOGIC FUNCTIONS ---
    
    const handleAnswerSelect = (answer) => {
        const newAnswers = [...userAnswers];
        newAnswers[currentQuestionIndex] = answer;
        setUserAnswers(newAnswers);
    };

    const handleQuizNavigation = (direction) => {
        if (direction === 'next') {
            const nextIndex = currentQuestionIndex + 1;
            if (nextIndex < QUIZ_DATA.length) {
                setCurrentQuestionIndex(nextIndex);
            }
        } else if (direction === 'prev') {
            const prevIndex = currentQuestionIndex - 1;
            if (prevIndex >= 0) {
                setCurrentQuestionIndex(prevIndex);
            }
        }
        setMessage(''); // Clear message on navigation
    };
    
    const handleSubmitQuiz = () => {
        // 1. Check if all questions have an answer
        if (userAnswers.includes(null)) {
            setMessage('Please answer all questions before submitting.');
            return;
        }

        // 2. Check all answers for correctness
        let correctCount = 0;
        let allCorrect = true;
        for (let i = 0; i < QUIZ_DATA.length; i++) {
            if (userAnswers[i] !== QUIZ_DATA[i].correctAnswer) {
                allCorrect = false;
                break;
            } else {
                correctCount++;
            }
        }

        if (allCorrect) {
            setQuizPassed(true);
            setMessage('Congratulations! All answers are correct. Your targets are now unlocked!');
        } else {
            setMessage(`Incorrect answers detected. You got ${correctCount} out of ${QUIZ_DATA.length} correct. Please review the report and try again.`);
            // Reset quiz on incorrect submission
            setTimeout(() => {
                setCurrentQuestionIndex(0);
                setUserAnswers(Array(QUIZ_DATA.length).fill(null));
                setMessage('Quiz reset. Start from the beginning to review your answers!');
            }, 3000); // Give user time to read the failure message
        }
    };


    // --- Data Mapping & Preparation (Placed inside App component for functional updates) ---

    // 1. Build a map for easy store-to-cluster lookup (handling naming discrepancies)
    const storeClusterMap = novemberTargetsData.reduce((acc, item) => {
        acc[item.store] = item.cluster;
        return acc;
    }, {});
    storeClusterMap['Merthyr Tydfil'] = 'S1-3-BMR'; // For Google Reviews data
    storeClusterMap['Merthyr'] = 'S1-3-BMR';

    // 2. Enrich Google Reviews data with the Cluster
    const q3GoogleReviewsDataEnriched = q3GoogleReviewsData.map(d => ({
        ...d,
        cluster: storeClusterMap[d.store] || 'Unknown',
    }));
    
    // 3. Filter Audit data for charts
    // These remain even though the component isn't rendered, in case you need them later.
    const filteredMwwAuditData = selectedCluster === 'All'
        ? q3MwwAuditData
        : q3MwwAuditData.filter(d => d.cluster === selectedCluster);

    const filteredComplianceAuditData = selectedCluster === 'All'
        ? q3ComplianceAuditData
        : q3ComplianceAuditData.filter(d => d.cluster === selectedCluster);


    // --- Data Filtering based on Selection ---
    
    // 1. Filter main cluster data for charts
    const filteredData = selectedCluster === 'All'
        ? q3SalesNcData
        : q3SalesNcData.filter(d => d.cluster === selectedCluster);

    const filteredRetentionData = selectedCluster === 'All'
        ? q2RetentionData
        : q2RetentionData.filter(d => d.cluster === selectedCluster);

    const filteredAcbData = selectedCluster === 'All'
        ? q2AcbData
        : q2AcbData.filter(d => d.cluster === selectedCluster);
    
    // 2. Filter Store-level data for charts/tables

    const filteredGoogleReviews = selectedCluster === 'All'
        ? q3GoogleReviewsDataEnriched
        : q3GoogleReviewsDataEnriched.filter(d => d.cluster === selectedCluster);

    const filteredTwAppSignupOctData = selectedCluster === 'All'
        ? twAppSignupOctData
        : twAppSignupOctData.filter(d => d.cluster === selectedCluster);

    const filteredAppAdoptionProgressData = selectedCluster === 'All'
        ? appAdoptionProgressData
        : appAdoptionProgressData.filter(d => d.cluster === selectedCluster);
        
    const filteredNcAppAdoptionData = selectedCluster === 'All'
        ? ncAppAdoptionData
        : ncAppAdoptionData.filter(d => d.cluster === selectedCluster);

    // 3. Combine all relevant data for deeper analysis blocks (e.g. Highlights)
    const combinedData = q3SalesNcData.map(q3 => {
        const retention = q2RetentionData.find(r => r.cluster === q3.cluster);
        const acb = q2AcbData.find(a => a.cluster === q3.cluster);
        const additional = newQ3KeyMetricsWithRetention.find(ad => ad.cluster === q3.cluster);
        return { ...q3, ...retention, ...acb, ...additional };
    });

    // Determine the focus data for the Trade-in box
    const tradeInFocusData = selectedCluster === 'All'
        ? combinedData.sort((a, b) => b.tradeInVsKitSales - a.tradeInVsKitSales).slice(0, 2)
        : combinedData.filter(d => d.cluster === selectedCluster); // Show only the selected cluster

 // Calculate October highlights with criteria and limit to 5
  const octoberHighlights = combinedData
    .filter(d =>
      d.salesVsTargetOct > 100 || 
      d.ncVsTargetOct > 100 || 
      d.octoberRetention > 40 || 
      d.vltz > 70 ||
      d.wrc > 70 ||
      d.unregisteredTransaction < 5
    )
    .sort((a, b) => {
      // Scoring logic for highlights (using October data)
      let aScore = 0;
      if (a.salesVsTargetOct > 100) aScore += (a.salesVsTargetOct - 100);
      if (a.ncVsTargetOct > 100) aScore += (a.ncVsTargetOct - 100);
      if (a.octoberRetention > 40) aScore += (a.octoberRetention - 40);
      if (a.vltz > 70) aScore += (a.vltz - 70);
      if (a.wrc > 70) aScore += (a.wrc - 70);
      if (a.unregisteredTransaction < 5) aScore += (5 - a.unregisteredTransaction) * 10;

      let bScore = 0;
      if (b.salesVsTargetOct > 100) bScore += (b.salesVsTargetOct - 100);
      if (b.ncVsTargetOct > 100) bScore += (b.ncVsTargetOct - 100);
      if (b.octoberRetention > 40) bScore += (b.octoberRetention - 40);
      if (b.vltz > 70) bScore += (b.vltz - 70);
      if (b.wrc > 70) bScore += (b.wrc - 70);
      if (b.unregisteredTransaction < 5) bScore += (5 - b.unregisteredTransaction) * 10;

      return bScore - aScore;
    })
    .slice(0, 5); // Limit to a maximum of 5 shout-outs


    // Sort Google Reviews by Current Rank (lowest is best)
    // NOTE: Sorting applied to the filtered data source
    const sortedGoogleReviews = filteredGoogleReviews.sort((a, b) => a.currentRank - b.currentRank);


    // --- HELPER COMPONENTS (Defined inside App component for state access) ---

    // Component for the Quiz Interface
    const QuizComponent = () => {
        if (quizPassed) {
            return (
                <div className="text-centre p-6 bg-green-100 rounded-xl shadow-lg border-2 border-green-500">
                    <h3 className="text-3xl font-extrabold text-green-700 mb-4">Knowledge Check Complete!</h3>
                    <p className="text-xl text-green-800">You've demonstrated a strong understanding of the October performance review.</p>
                    <p className="text-xl mt-4 font-bold text-green-900">Your November Targets are now visible below!</p>
                </div>
            );
        }

        const questionData = QUIZ_DATA[currentQuestionIndex];
        const selectedAnswer = userAnswers[currentQuestionIndex];

        // Check if the current question has been answered to enable navigation/submission
        const isAnswered = selectedAnswer !== null;
        
        // Determine if this is the final question
        const isFinalQuestion = currentQuestionIndex === QUIZ_DATA.length - 1;
        const allQuestionsAnswered = !userAnswers.includes(null);


        return (
            <div className="p-6 bg-white rounded-xl shadow-lg border-2 border-indigo-300">
                <h3 className="text-2xl font-bold text-indigo-700 mb-4">Question {currentQuestionIndex + 1} of {QUIZ_DATA.length}</h3>
                
                <p className="text-xl text-gray-800 mb-6 font-medium">{questionData.question}</p>
                
                <div className="space-y-3">
                    {questionData.options.map((option, index) => (
                        <button
                            key={index}
                            onClick={() => handleAnswerSelect(option)}
                            className={`w-full text-left p-3 rounded-lg border-2 transition duration-200 
                                ${selectedAnswer === option
                                    ? 'bg-indigo-500 text-white border-indigo-600 shadow-md'
                                    : 'bg-gray-100 text-gray-800 border-gray-300 hover:bg-indigo-100'
                                }`}
                        >
                            {option}
                        </button>
                    ))}
                </div>

                <div className="mt-6 flex justify-between items-centre">
                    
                    {/* Previous Button */}
                    <button
                        onClick={() => handleQuizNavigation('prev')}
                        className="px-4 py-3 bg-gray-500 text-white font-bold rounded-lg shadow-md hover:bg-gray-600 transition duration-200 disabled:opacity-50"
                        disabled={currentQuestionIndex === 0}
                    >
                        Previous
                    </button>
                    
                    {/* Submit or Next Button */}
                    {isFinalQuestion ? (
                        <button
                            onClick={handleSubmitQuiz}
                            className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-lg shadow-md hover:bg-indigo-700 transition duration-200 disabled:opacity-50"
                            disabled={!allQuestionsAnswered}
                        >
                            Submit Quiz & Reveal Targets
                        </button>
                    ) : (
                        <button
                            onClick={() => handleQuizNavigation('next')}
                            className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-lg shadow-md hover:bg-indigo-700 transition duration-200 disabled:opacity-50"
                            disabled={!isAnswered}
                        >
                            Next Question
                        </button>
                    )}
                    
                    {message && (
                        <p className={`text-sm font-semibold p-2 rounded self-centre ${message.includes('Correct') || message.includes('reset') ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'}`}>
                            {message}
                        </p>
                    )}
                </div>
            </div>
        );
    };


    // Helper component for rank change display
    const RankChangeIcon = ({ change }) => {
        if (change > 0) return <span className="text-green-600 font-bold ml-1">▲ {change}</span>;
        if (change < 0) return <span className="text-red-600 font-bold ml-1">▼ {Math.abs(change)}</span>;
        return <span className="text-gray-500 ml-1">—</span>;
    };

    // Component for the Google Review Ranking Table
    const GoogleReviewTable = () => (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 shadow-md rounded-lg">
                <thead className="bg-teal-700 text-white">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider rounded-tl-lg">Store</th>
                        <th className="px-6 py-3 text-centre text-xs font-medium uppercase tracking-wider">Current Rank</th>
                        <th className="px-6 py-3 text-centre text-xs font-medium uppercase tracking-wider">Change (vs. Last Month)</th>
                        <th className="px-6 py-3 text-centre text-xs font-medium uppercase tracking-wider rounded-tr-lg">New Reviews (Sept)</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {sortedGoogleReviews.map((data, index) => (
                        <tr key={data.store} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{data.store}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-centre font-bold text-teal-800">{data.currentRank}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-centre">
                                <RankChangeIcon change={data.change} />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-centre text-indigo-600 font-semibold">{data.reviews}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
    
    // Component for the New Customer App Adoption & Missed Opportunity Chart
    const NcAppAdoptionChart = () => (
        <div className="mb-8 p-6 bg-red-50 rounded-lg shadow-sm">
            <h3 className="text-2xl font-semibold text-red-800 mb-4">New Customer App Adoption vs. Missed Opportunity (October) {selectedCluster !== 'All' ? `— ${selectedCluster}` : ''}</h3>
            <p className="text-sm text-gray-600 mb-4">
                This chart shows the **NC App Adoption Rate** (Green Bars, Left Axis) against the raw **Missed Opportunity Count** (Red Line, Right Axis). A high bar is good, but a high red line means high potential missed revenue. Stores should focus on dropping the red line!
            </p>
            <ResponsiveContainer width="100%" height={400}>
                <ComposedChart data={filteredNcAppAdoptionData} margin={{ top: 10, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                    <XAxis dataKey="store" angle={-45} textAnchor="end" height={100} interval={0} tick={{ fill: '#4a5568', fontSize: 12 }} />
                    <YAxis yAxisId="left" orientation="left" stroke={ncAppAdoptionColor} tickFormatter={(value) => `${value.toFixed(0)}%`} domain={[0, 100]} label={{ value: 'NC App Adoption %', angle: -90, position: 'left', fill: ncAppAdoptionColor }} />
                    <YAxis yAxisId="right" orientation="right" stroke={missedOpportunityColor} label={{ value: 'Missed Opportunity (NC Count)', angle: 90, position: 'right', fill: missedOpportunityColor }} />
                    <Tooltip formatter={(value, name, props) => {
                        if (name.includes('Rate')) return [`${value.toFixed(1)}%`, 'NC App Adoption Rate'];
                        return [value, 'Missed Opportunity (Count)'];
                    }} />
                    <Legend wrapperStyle={{ paddingTop: '20px' }} />
                    
                    <Bar yAxisId="left" dataKey="ncAppAdoption" name="NC App Adoption Rate" fill={ncAppAdoptionColor} radius={[8, 8, 0, 0]} />
                    <Line yAxisId="right" type="monotone" dataKey="missedOpportunity" name="Missed Opportunity" stroke={missedOpportunityColor} strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 8 }} />
                    
                    {/* Reference Line for NC App Adoption TARGET (New) */}
                    <ReferenceLine 
                        yAxisId="left" 
                        y={NC_APP_ADOPTION_TARGET} 
                        stroke="#FF8C00" 
                        strokeDasharray="5 5" 
                        label={{ 
                            value: `Target: ${NC_APP_ADOPTION_TARGET.toFixed(0)}%`, 
                            position: 'top', 
                            fill: '#FF8C00' 
                        }} 
                    />
                    
                    {/* Reference Line for Area Average NC App Adoption (Existing) */}
                    <ReferenceLine yAxisId="left" y={averageNcAppAdoption} stroke="#7C3AED" strokeDasharray="3 3" label={{ value: `Area Avg: ${averageNcAppAdoption.toFixed(1)}%`, position: 'bottom', fill: '#7C3AED' }} />
                </ComposedChart>
            </ResponsiveContainer>
        </div>
    );


    // Component for the Battle of the Areas Table
    const BattleOfTheAreasTable = () => {
        // New function to get the class for background fill (Green=1, Yellow=2, Red=3)
        const getRankColourClass = (rank) => {
            if (rank === 1) return 'bg-green-200'; // Light green for first place
            if (rank === 2) return 'bg-yellow-200'; // Light yellow for second place
            if (rank === 3) return 'bg-red-200'; // Light red for third place
            return 'bg-white'; // Default background for unranked (like 'South')
        };
        
        // Content is just the formatted value
        const getCellContent = (item, kpi) => {
            const value = item[kpi.key];
            return <span className="text-gray-900 font-semibold">{kpi.format(value)}</span>;
        };

        return (
            <section className="mb-12">
                <div className="p-6 bg-white rounded-xl shadow-xl overflow-x-auto border-4 border-indigo-200">
                    <h2 className="text-3xl font-bold text-indigo-800 mb-6 border-b-2 border-indigo-200 pb-2">Battle of the Areas (Southern Region)</h2>
                    
                    <div className="mb-6 p-4 bg-indigo-50 rounded-lg">
                        <h4 className="text-xl font-semibold text-indigo-700 mb-2">Overview</h4>
                        {/* REVISED COMMENTARY - ADDED <br /> TAGS */}
                        <p className="text-lg text-gray-700 leading-relaxed">
                            The Battle of October concludes in a dramatic <strong> stalemate!</strong> Both South 1 and South 2 walk out of the arena topping <strong>five out of the ten key metrics</strong> each this month. It was truly a back-and-forth contest, and with both areas having three distinct areas of focus for November, the deadlock remains unbroken.
                            <br />
                            <br />
                            For South 1, the immediate focus must be on <strong>NC App Adoption</strong> to break this tie and tip the balance back into their favour. Likewise, South 2 has secured the strongest <strong>Retention</strong> figures in the region, providing solid foundations to build upon.
                            <br />
                            <br />
                            Now, while the limelight may be on the dogfight between S1 and S2, let's not underestimate South 3. With plenty of opportunity to attack these metrics and a renewed focus, I expect them to come back fighting this month and could very well cause an upset when the dust settles in November.
                            <br />
                            <br />
                            <span className="text-lg text-gray-700 font-bold mt-4">
                                Regardless of the size and pace of your store or cluster, your focused performance within these key metrics will be the deciding factor this month.
                            </span>
                        </p>
                    </div>

                    {/* NEW KEY: Colour Key explanation */}
                    <div className="text-centre text-sm font-semibold mb-4 flex justify-centre space-x-4">
                        <div className="flex items-centre">
                            <span className="w-4 h-4 bg-green-200 border border-green-500 mr-2 rounded"></span>
                            <span>1st Place</span>
                        </div>
                        <div className="flex items-centre">
                            <span className="w-4 h-4 bg-yellow-200 border border-yellow-500 mr-2 rounded"></span>
                            <span>2nd Place</span>
                        </div>
                        <div className="flex items-centre">
                            <span className="w-4 h-4 bg-red-200 border border-red-500 mr-2 rounded"></span>
                            <span>3rd Place</span>
                        </div>
                        <div className="flex items-centre">
                            <span className="w-4 h-4 bg-indigo-100 border border-gray-500 mr-2 rounded"></span>
                            <span>Regional Total (South)</span>
                        </div>
                    </div>
                    
                    {/* FIX: Apply explicit sizing to table columns to remove the gap */}
                    <table className="min-w-full divide-y divide-gray-200 border border-gray-300 rounded-lg table-fixed">
                        <thead className="bg-gray-800 text-white">
                            <tr>
                                <th className="w-[10%] px-2 py-3 text-left text-xs font-medium uppercase tracking-wider sticky left-0 z-10 bg-gray-800 min-w-[100px] rounded-tl-lg">Region</th>
                                {Kpis.map(kpi => (
                                    <th key={kpi.key} className="w-[9%] px-2 py-3 text-centre text-xs font-medium uppercase tracking-wider">
                                        {kpi.label}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {battleOfTheAreasData.map((item, index) => (
                                <tr key={item.region} className={item.region === 'South' ? 'bg-indigo-100 font-bold' : (index % 2 === 0 ? 'bg-white' : 'bg-gray-50')}>
                                    <td className={`w-[10%] px-2 py-3 whitespace-nowrap text-sm font-medium sticky left-0 z-10 ${item.region === 'South' ? 'bg-indigo-100 text-indigo-900' : 'bg-inherit text-gray-900'}`}>{item.region}</td>
                                    {Kpis.map(kpi => {
                                        const rank = item[`${kpi.key}Rank`];
                                        const rankClass = getRankColourClass(rank);
                                        const isRegionalTotal = item.region === 'South';

                                        return (
                                            <td key={kpi.key} className={`w-[9%] px-2 py-3 whitespace-nowrap text-sm text-centre ${isRegionalTotal ? 'bg-indigo-100' : rankClass}`}>
                                                {getCellContent(item, kpi)}
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
        );
    };

    // Component for the new September Raw KPI Data Table
    const SeptemberKpiDetailTable = () => {
        
        // Filter raw data by cluster
        const filteredRawData = selectedCluster === 'All'
            ? rawOctoberKpiData
            : rawOctoberKpiData.filter(d => d.cluster === selectedCluster);

        // Helper function to determine cell background colour
        const getKpiCellClass = (kpi, value, store) => {
            if (store !== hoveredStore) return ''; // Only highlight on hover

            // We only apply colour formatting to the numerical KPI columns, not 'store' or 'cluster'
            if (kpi.key === 'store' || kpi.key === 'cluster') return ''; 

            const average = southAreaAverages[kpi.key];
            if (average === undefined) return '';

            let isBetter;
            if (kpi.higherIsBetter) {
                isBetter = value >= average;
            } else {
                isBetter = value <= average; // Lower is better
            }

            return isBetter ? 'bg-green-200/70' : 'bg-red-200/70';
        };

        return (
            <>
                <div className="mb-4 p-3 bg-indigo-100 rounded-lg shadow-inner">
                    <h4 className="text-xl font-semibold text-indigo-700 mb-1">Interactive Diagnostic Tool:</h4>
                    <p className="text-lg text-gray-700">
                        Hover over any store row to instantly highlight performance against the South Area Average: 
                        <span className="font-bold text-green-700 ml-2">Green = Above Average</span> and 
                        <span className="font-bold text-red-700 ml-2">Red = Below Average</span>.
                    </p>
                </div>
                <div className="overflow-x-auto border border-gray-300 rounded-xl shadow-inner bg-white">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-100 sticky top-0 z-20">
                            <tr>
                                {detailedKpiDefinitions.map(col => (
                                    <th 
                                        key={col.key} 
                                        className={`px-3 py-3 text-xs font-bold uppercase tracking-wider text-gray-700 text-centre 
                                            ${col.key === 'store' ? 'sticky left-0 bg-gray-100 z-10 text-left' : ''}
                                            ${col.key === 'cluster' ? 'sticky left-0 bg-gray-100 z-10 text-centre' : ''}`}
                                    >
                                        {col.label}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredRawData.map((data, index) => (
                                <tr 
                                    key={data.store} 
                                    className={`transition duration-100 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                                    onMouseEnter={() => setHoveredStore(data.store)}
                                    onMouseLeave={() => setHoveredStore(null)}
                                >
                                    {detailedKpiDefinitions.map(col => {
                                        const value = data[col.key];
                                        const cellClass = getKpiCellClass(col, value, data.store);

                                        return (
                                            <td 
                                                key={col.key} 
                                                className={`px-3 py-3 whitespace-nowrap text-sm text-centre ${cellClass}
                                                    ${col.key === 'store' ? 'font-semibold sticky left-0 z-10 text-left' : (col.key === 'cluster' ? 'sticky left-0 z-10 text-centre' : '')}
                                                    ${index % 2 === 0 && col.key === 'store' ? 'bg-white' : (index % 2 !== 0 && col.key === 'store' ? 'bg-gray-50' : '')}
                                                    ${index % 2 === 0 && col.key === 'cluster' ? 'bg-white' : (index % 2 !== 0 && col.key === 'cluster' ? 'bg-gray-50' : '')}
                                                    `}
                                            >
                                                {col.format(value)}
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </>
        );
    };


    // Component for November Targets Table (Conditionally Rendered)
    const NovemberTargetsTable = () => ( 
        <div className="overflow-x-auto mt-12 p-6 bg-green-50 rounded-xl shadow-lg border-t-4 border-green-600">
            <h2 className="text-3xl font-bold text-green-700 mb-6 border-b-2 border-green-200 pb-2 text-centre">Your NOVEMBER Targets: Driving Q4 Success</h2>
            <table className="min-w-full divide-y divide-gray-200 shadow-md rounded-lg">
                <thead className="bg-green-600 text-white">
                    <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider rounded-tl-lg">Store</th>
                        <th className="px-4 py-3 text-centre text-xs font-medium uppercase tracking-wider">Cluster</th>
                        <th className="px-4 py-3 text-centre text-xs font-medium uppercase tracking-wider">Sales Target (Store)</th>
                        <th className="px-4 py-3 text-centre text-xs font-medium uppercase tracking-wider">Sales Target (Cluster)</th>
                        <th className="px-4 py-3 text-centre text-xs font-medium uppercase tracking-wider">NC Target (Store)</th>
                        <th className="px-4 py-3 text-centre text-xs font-medium uppercase tracking-wider rounded-tr-lg">NC Target (Cluster)</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {novemberTargetsData.map((data, index) => ( 
                        <tr key={data.store} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                            <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{data.store}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-centre text-gray-600">{data.cluster}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-centre font-bold text-indigo-700">{data.monthTarget}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-centre">{data.clusterSalesTarget}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-centre font-bold text-indigo-700">{data.ncTarget}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-centre">{data.clusterNCTarget}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
    
    // Custom Tooltip component for the Scatter Chart
    const CustomScatterTooltip = ({ active, payload }) => {
      if (active && payload && payload.length) {
        const data = payload[0].payload;
        return (
          <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-300 text-sm font-medium">
            <p className="text-indigo-700 font-bold mb-1">{data.store}</p>
            <p className="text-gray-600">NC vs TGT: <span className="font-semibold text-pink-600">{data.ncVsTGT.toFixed(1)}%</span></p>
            <p className="text-gray-600">Retention: <span className="font-semibold text-pink-600">{data.retention.toFixed(1)}%</span></p>
            <p className="text-gray-600">Raw NC Count: <span className="font-semibold text-pink-600">{data.size}</span></p>
          </div>
        );
      }
      return null;
    };


    // Data for Scatter Plot (NC vs Retention)
    // NOTE: This data pulls from the raw store level KPI data for NC and Retention
    const storeKpiDataForScatter = rawOctoberKpiData.map(d => ({
        store: d.store,
        cluster: d.cluster,
        // New Y-Axis: Retention %
        retention: d.Retention, 
        // New X-Axis: NC vs TGT %
        ncVsTGT: d.NCVsTGT,
        // Size of the dot based on raw NC count
        size: d.NC, 
    }));
    
    // Filter scatter data
    const filteredScatterData = selectedCluster === 'All'
        ? storeKpiDataForScatter
        : storeKpiDataForScatter.filter(d => d.cluster === selectedCluster);


    // --- Custom Highlights Data Structure (based on image design) ---
    // NOTE: Reworking this structure to fit the new card design exactly.
    const HighlightCard = ({ title, content, isAchievement }) => (
        <div className={`p-4 rounded-lg shadow-md mb-3 ${isAchievement ? 'bg-yellow-100 border border-yellow-300' : 'bg-green-50 border border-green-200'}`}>
            <h4 className={`text-lg font-bold mb-2 ${isAchievement ? 'text-yellow-700' : 'text-green-700'}`}>
                {isAchievement ? (
                    <span className="text-yellow-600 font-semibold mr-2">&#9733;</span>
                ) : (
                    <span className="text-green-600 font-semibold mr-2">✓</span>
                )}
                {title}
            </h4>
            <p className="text-base text-gray-700 leading-relaxed pl-6">{content}</p>
        </div>
    );

    // Consolidated Highlight Data for easier rendering - Using Oct-prefixed variables
    const highlightsData = [
        // --- Q2 Achievements (IsAchievement = true) ---
        { 
            title: "H1 MWW Audit Excellence", 
            content: "Huge credit to Rugby, Wolves Penn Road, and Wellington for achieving a perfect 100% score in their Mr Wicked Way (MWW) Audits.", 
            isAchievement: true 
        },
        { 
            title: "H1 Compliance Leader", 
            content: "Shout-out to Tyburn for delivering the highest Compliance Audit score in the area (99.50%).", 
            isAchievement: true 
        },
        { 
            title: "Sustainable LFL Growth", 
            content: "The Telford cluster (S1-3-MSW: Madeley, Shrewsbury, Wellington) leads the area in Like-for-Like (LFL) growth, with all stores in the cluster seeing positive growth in September.", 
            isAchievement: true 
        },
        
        // --- October Performance Highlights (IsAchievement = false / Default) ---
        { 
            title: "S1-3-MSW Cluster Dominance", 
            content: `Exceeded Sales Target (${clusterKpiMetrics.find(c => c.cluster === 'S1-3-MSW').salesVsTargetOct.toFixed(2)}%), Exceeded NC Target (${clusterKpiMetrics.find(c => c.cluster === 'S1-3-MSW').ncVsTargetOct.toFixed(2)}%), Achieved High VLTZ (${clusterKpiMetrics.find(c => c.cluster === 'S1-3-MSW').vltz.toFixed(2)}%), and maintained the Lowest Unregistered Transactions (${clusterKpiMetrics.find(c => c.cluster === 'S1-3-MSW').unregisteredTransaction.toFixed(2)}%).`,
            isAchievement: false
        },
        { 
            title: "S1-2-CP Sales & Trade-in Strength", 
            content: `Wolves Chapel Ash Exceeded Sales Target (101.90%). The cluster achieved the Highest Trade-in % (${clusterKpiMetrics.find(c => c.cluster === 'S1-2-CP').tradeInVsKitSales.toFixed(2)}%) and strong NC Email Capture (Wolves Chapel Ash: 100.00%).`,
            isAchievement: false
        },
        {
            title: "S1-2-BE High Retention & NC Volume",
            content: `Barnstaple Exceeded Sales Target (100.60%) and achieved the Highest Area Retention (48.80%). Exeter drove High NC volume (162 NCs).`,
            isAchievement: false
        },
        {
            title: "S1-1-B Acquisition & WRC Leader",
            content: `Bristol drove the Highest Area NC Acquisition (276 NCs) and achieved the Highest WRC % (71.00%).`,
            isAchievement: false
        }
    ];

    
 return (
    <div className="min-h-screen bg-gray-100 p-6 font-inter text-gray-800">
      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-lg p-8">
        
        {/* Main Title updated for Q2 Review and Sept Month End */}
        <h1 className="text-4xl font-extrabold text-centre text-indigo-800 mb-6">Performance Review: October Month-End & Q4 Planning</h1>
        
        {/* INTERACTIVE CLUSTER FILTER */}
        <div className="flex justify-centre items-centre mb-10 p-4 bg-indigo-100 rounded-lg shadow-inner">
            <label htmlFor="cluster-filter" className="text-lg font-semibold text-indigo-800 mr-4">
                View Performance For:
            </label>
            <select
                id="cluster-filter"
                value={selectedCluster}
                onChange={(e) => setSelectedCluster(e.target.value)}
                className="p-2 border border-indigo-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 bg-white transition duration-150 ease-in-out font-bold text-indigo-700"
            >
                <option value="All">All Clusters (Overview)</option>
                {allClusters.map(cluster => (
                    <option key={cluster} value={cluster}>{cluster}</option>
                ))}
            </select>
        </div>

        {/* ========================================================= */}
        {/* 1. NARRATIVE FLOW START */}
        {/* ========================================================= */}
        
        {/* NEW INTRODUCTORY SECTION - COMBINED CONTEXT & CALL TO ACTION */}
        <section className="mb-12 p-8 bg-gray-100 rounded-xl shadow-inner border-l-4 border-indigo-500">
            <h2 className="text-3xl font-bold text-indigo-700 mb-4">Welcome to Your Performance Dashboard</h2>
            <p className="text-lg text-gray-700 leading-relaxed">
                This report provides a complete, interactive breakdown of our <strong>Octobers performance and monthly trend data</strong>. Whether you are a long-standing manager or new to the team, this dashboard is designed to be your primary coaching and planning tool. Use the filters, tables, and infographics to quickly identify <strong>Areas of Excellence</strong> to celebrate and <strong>Areas for Focus</strong> where a strategic change in approach is needed.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed mt-4 font-bold">
                Reviewing the final results for October is a key initial step in gaining an understanding of where your approach may need to differ or be maintained based on the results.
            </p>
        </section>


        {/* NEW SECTION: Battle of the Areas */}
        {selectedCluster === 'All' && <BattleOfTheAreasTable />}


        {/* Section 1: October Cluster Performance */}
        <section className="mb-12">
            <h2 className="text-3xl font-bold text-indigo-700 mb-6 border-b-2 border-indigo-200 pb-2">October Cluster Performance Trends</h2>
            
            {/* Sales vs Target - NOW LABELLED CORRECTLY */}
            <div className="mb-8 p-6 bg-blue-50 rounded-lg shadow-sm">
              <h3 className="text-2xl font-semibold text-blue-800 mb-4">Sales vs Target (October Total) {selectedCluster !== 'All' ? `— ${selectedCluster}` : ''}</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={filteredData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis dataKey="cluster" tick={{ fill: '#4a5568' }} />
                  <YAxis
                    tickFormatter={(value) => `${value}%`}
                    tick={{ fill: '#4a5568' }}
                    ticks={[0, 25, 50, 75, 100, 125, 150]}
                  />
                  {/* TARGET LINE ADDED */}
                  <ReferenceLine y={100} stroke="#E91E63" strokeDasharray="3 3" label={{ value: 'Target', position: 'top', fill: '#E91E63' }} />
                  <Tooltip formatter={(value) => `${value.toFixed(2)}%`} />
                  <Legend />
                  <Bar dataKey="salesVsTarget" name="Sales vs Target %" fill={barColors[0]} radius={[10, 10, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
              <p className="text-sm text-gray-600 mt-4">This chart displays the percentage of sales achieved against the target for each cluster in October. The red line at 100% represents the target achievement line.</p>
            </div>

            {/* NC vs Target - NOW LABELLED CORRECTLY */}
            <div className="mb-8 p-6 bg-green-50 rounded-lg shadow-sm">
              <h3 className="text-2xl font-semibold text-green-800 mb-4">New Customers (NC) vs Target (October Total) {selectedCluster !== 'All' ? `— ${selectedCluster}` : ''}</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={filteredData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis dataKey="cluster" tick={{ fill: '#4a5568' }} />
                  <YAxis
                    tickFormatter={(value) => `${value}%`}
                    tick={{ fill: '#4a5568' }}
                    ticks={[0, 25, 50, 75, 100, 125, 150]}
                  />
                  {/* TARGET LINE ADDED */}
                  <ReferenceLine y={100} stroke="#E91E63" strokeDasharray="3 3" label={{ value: 'Target', position: 'top', fill: '#E91E63' }} />
                  <Tooltip formatter={(value) => `${value.toFixed(2)}%`} />
                  <Legend />
                  <Bar dataKey="ncVsTarget" name="NC vs Target %" fill={barColors[1]} radius={[10, 10, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
              <p className="text-sm text-gray-600 mt-4">This chart illustrates the percentage of New Customer (NC) acquisition achieved against target for each cluster in October. The target line is set at 100%.</p>
            </div>
            
            {/* ACB Trends (Q2 + Oct) */}
            <div className="mb-8 p-6 bg-purple-50 rounded-lg shadow-sm">
              <h3 className="text-2xl font-semibold text-purple-800 mb-4">Active Customer Base (ACB) Trends (July - October) {selectedCluster !== 'All' ? `— ${selectedCluster}` : ''}</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={filteredAcbData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis dataKey="cluster" tick={{ fill: '#4a5568' }} />
                  <YAxis tick={{ fill: '#4a5568' }} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="julyACB" stroke="#0077B6" name="July ACB" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 8 }} />
                  <Line type="monotone" dataKey="augustACB" stroke="#FCA311" name="August ACB" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 8 }} />
                  <Line type="monotone" dataKey="septemberACB" stroke="#5B5F97" name="September ACB" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 8 }} />
                  <Line type="monotone" dataKey="octoberACB" stroke="#E91E63" name="October ACB" strokeWidth={3} dot={{ r: 5 }} activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
              <p className="text-sm text-gray-600 mt-4">This line chart tracks the combined total number of Active Customer Base (ACB) for each cluster across the months, including the latest October results.</p>
            </div>

            {/* Retention Trends (Q2 + Oct) */}
            <div className="mb-8 p-6 bg-red-50 rounded-lg shadow-sm">
              <h3 className="text-2xl font-semibold text-red-800 mb-4">Retention Trends (July - October) {selectedCluster !== 'All' ? `— ${selectedCluster}` : ''}</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={filteredRetentionData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis dataKey="cluster" tick={{ fill: '#4a5568' }} />
                  <YAxis tickFormatter={(value) => `${value}%`} domain={[0, 60]} tick={{ fill: '#4a5568' }} />
                  <Tooltip formatter={(value) => `${value.toFixed(2)}%`} />
                  <Legend />
                  <Line type="monotone" dataKey="julyRetention" stroke="#0077B6" name="July Retention" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 8 }} />
                  <Line type="monotone" dataKey="augustRetention" stroke="#FCA311" name="August Retention" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 8 }} />
                  <Line type="monotone" dataKey="septemberRetention" stroke="#5B5F97" name="September Retention" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 8 }} />
                  <Line type="monotone" dataKey="octoberRetention" stroke="#E91E63" name="October Retention" strokeWidth={3} dot={{ r: 5 }} activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
              <p className="text-sm text-gray-600 mt-4">This chart tracks the average customer retention percentage across clusters for each month of Q2 and October.</p>
            </div>
        </section>


        {/* ========================================================= */}
        {/* 2. DEEP DIVE & RAW DETAIL (INCLUDING SCATTER CHART) */}
        {/* ========================================================= */}


        {/* Section 2: October Highlights (HIDDEN) */}
        {/* {selectedCluster === 'All' && (
            <section className="mb-12 p-8 bg-yellow-50 rounded-xl shadow-lg">
                <h2 className="3xl font-bold text-yellow-800 mb-6 border-b-2 border-yellow-300 pb-2">Q2 Achievements and October Highlights</h2>
                // ... Content removed as per user request
            </section>
        )} */}


        {/* Section 3: Reworked Retention Deep Dive & Incentives Strategy */}
        <section className="mb-12 p-8 bg-gray-50 rounded-xl shadow-lg">
            <h2 className="text-3xl font-bold text-gray-700 mb-6 border-b-2 border-gray-200 pb-2">Retention & ATV Strategy: The Power of Layered Value</h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
                Our overall retention rate still indicates a gap compared to our southern counterparts. This is not a deficiency in effort; it is an opportunity to <strong>optimise</strong> our sales approach to <strong>maximise</strong> long-term customer value.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
                We have consistently seen that customers who accept <strong>more than one relevant incentive</strong> during their onboarding process show significantly higher retention rates. This is not about giving away more discounts, but about providing layered, comprehensive value that locks them into the ecosystem.
            </p>
            <div className="bg-white p-5 rounded-lg shadow-inner border border-indigo-200 mb-6">
                <h4 className="text-xl font-semibold text-indigo-700 mb-3">Think Beyond the Single Incentive: Layered Examples</h4>
                <ul className="list-disc list-inside text-lg text-gray-700 space-y-2 ml-4">
                    <li><strong>App Welcome Offer + Refer a Friend + WRC:</strong> Introducing the App's welcome offer with a Refer-a-Friend incentive and a Wicked Reward Card (WRC) delivers outstanding value and gives the customer the "wow factor" within their initial transaction.</li>
                    <li><strong>Trade-In + WRC:</strong> The Trade-In solves their immediate need, and the Reward Card creates the incentive for their next purchase.</li>
                    </ul>
            </div>
            <p className="text-lg text-gray-700 leading-relaxed mb-6 font-bold text-indigo-600">
                Do not stop the conversation after one accepted incentive. Listen for secondary needs, and layer value where it makes sense. This smarter, consultative approach is how we close the retention gap.
            </p>

            <div className="bg-blue-100 p-5 rounded-lg shadow-inner mt-8">
                <h3 className="text-2xl font-semibold text-blue-800 mb-3">Incentive Consistency in Turbulent Times</h3>
                <p className="text-lg text-blue-700 leading-relaxed mb-4">
                    We observe that the clusters and stores seeing the best results in this turbulent time for our industry are the ones who are consistently performing well across <strong>multiple incentives</strong>. This dedication to driving both acquisition and loyalty through incentives is the single most reliable predictor of success.
                </p>
            </div>
        </section>

        {/* New Section: NC Acquisition vs Retention Deep Dive (Chart + Narrative) */}
        <section className="mb-12 p-8 bg-pink-50 rounded-xl shadow-lg">
            <h2 className="text-3xl font-bold text-pink-700 mb-6 border-b-2 border-pink-200 pb-2">NC Acquisition vs. Retention: The Core of Sustainable Growth</h2>
            <div className="p-6 bg-white rounded-lg shadow-inner">
                <p className="text-lg text-gray-700 leading-relaxed mb-4">
                    The Active Customer Base (ACB) represents a store's true growth trajectory: if ACB is consistently increasing, the store is in a growth phase; conversely, a decline signals a critical loss of customer momentum. Outside of reducing churn, the main two fundamental ways of positively influencing the ACB are <strong>New Customer Acquisition (NC)</strong> and <strong>Retention</strong>, with both being reliant on the other for meaningful growth.
                </p>
                <p className="text-lg text-gray-700 leading-relaxed mb-6">
                    A flaw in one area severely limits the potential of the other. For example, executing a flawless local initiative that generates 100+ new customers is excellent, but if only 10 of them return (poor retention), that effort is largely wasted. Likewise, if we achieve high retention rates but are only attracting a minimal number of new customers, our growth is stagnant. Sustainable success requires high performance in <strong>both acquisition and retention</strong>—a balance where efforts in one area amplify the results in the other.
                </p>
                
                {/* SCATTER CHART INTEGRATION - Adjusting Margins for better display */}
                <h4 className="text-2xl font-bold text-pink-800 mt-6 pt-4 border-t border-pink-200">Visual Diagnostic Tool (Store-Level)</h4>
                <p className="text-sm text-gray-600 mb-6">
                    This chart plots every store's NC Acquisition (X-axis) against its Retention (Y-axis). The size of the bubble reflects the absolute NC count. Stores should aim to move their performance bubble into the <strong>Top Right Quadrant</strong> (High Acquisition & High Retention). Hover over a bubble to see the store name.
                </p>
                <ResponsiveContainer width="100%" height={400}>
                    <ScatterChart margin={{ top: 30, right: 30, bottom: 50, left: 30 }}> {/* Increased margin for axes */}
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                            type="number"
                            dataKey="ncVsTGT"
                            name="NC vs TGT %"
                            unit="%"
                            domain={[30, 85]} // Reduced domain for better fit
                            label={{ value: 'NC vs TGT %', position: 'bottom', offset: 30, fill: '#4a5568' }}
                            tick={{ fill: '#4a5568' }}
                        />
                        <YAxis
                            type="number"
                            dataKey="retention"
                            name="RET %"
                            unit="%"
                            domain={[15, 55]} // Reduced domain for better fit
                            label={{ value: 'RET %', position: 'left', angle: -90, offset: -20, fill: '#4a5568' }}
                            tick={{ fill: '#4a5568' }}
                        />
                        <ZAxis dataKey="size" name="NC Count" range={[100, 800]} />
                        <Tooltip cursor={{ strokeDasharray: '3 3' }} content={<CustomScatterTooltip/>} /> 
                        <Legend />
                        {/* Target lines adjusted */}
                        <ReferenceLine y={50} stroke="#E91E63" strokeDasharray="3 3" label={{ value: 'Target Retention (50%)', position: 'left', fill: '#E91E63' }}/>
                        <Scatter data={filteredScatterData} fill="#E91E63" name="Store Performance" line shape="circle" />
                    </ScatterChart>
                </ResponsiveContainer>


                <h4 className="text-2xl font-bold text-pink-800 mt-6 pt-4 border-t border-pink-200">Driving New Customer Traffic</h4>
                <p className="text-lg text-gray-700 leading-relaxed mt-3">
                    Our data clearly identifies the challenge: we need more new customers coming through the door. This isn't just a marketing problem—it's a local engagement opportunity.
                </p>
                <p className="text-xl font-extrabold text-pink-700 mt-4">
                    What local, non-traditional ideas can your store and cluster start brainstorming now to dramatically increase the footfall of first-time customers this month?
                </p>
            </div>
        </section>


        {/* Raw Data Table Section - NOW INTERACTIVE ON HOVER */}
        <section className="mb-12 p-8 bg-gray-50 rounded-xl shadow-lg">
            <h2 className="text-3xl font-bold text-gray-700 mb-6 border-b-2 border-gray-200 pb-2">October Store-Level KPI Detail</h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-6 font-semibold">
                <strong>For Your Action Plan:</strong> This table provides the full, store-specific KPI breakdown required to drive your individual coaching and improvement plans for November. Use the Cluster filter above to focus on your team's numbers.
            </p>
            <SeptemberKpiDetailTable />
        </section>


        {/* ========================================================= */}
        {/* 3. ENGAGEMENT & COMPLIANCE */}
        {/* ========================================================= */}


        {/* Section 5: Google Reviews & TW App Signups */}
        <section className="mb-12 p-8 bg-teal-50 rounded-xl shadow-lg">
          <h2 className="text-3xl font-bold text-teal-700 mb-6 border-b-2 border-teal-200 pb-2">Customer Engagement: Google Reviews Ranking & TW App Adoption {selectedCluster !== 'All' ? `— ${selectedCluster}` : ''}</h2>

          {/* Google Reviews - NOW A RANKING TABLE */}
          <div className="mb-8 p-6 bg-white rounded-lg shadow-xl">
            <h3 className="text-2xl font-semibold text-teal-800 mb-4">Google Local Ranking Performance (September)</h3>
                <GoogleReviewTable />
            {/* UPDATED TEXT: Focus on Rank 1 performers */}
            <p className="text-sm text-gray-600 mt-4">
                Shout-outs to <strong>Madeley</strong>, <strong>Wolves Chapel Ash</strong>, and <strong>Wolves Penn Road</strong> for achieving Rank 1 status this month! 
                Maintaining Rank 1 is key to being seen by local searchers. Focus on stores with falling ranks (red arrows), especially **Gloucester** (Rank 8), to implement immediate recovery strategies.
            </p>
            {/* UPDATED TEXT: Highlight top reviewers */}
            <p className="text-sm text-gray-600 mt-2">
                Special commendation goes to <strong>Madeley</strong> (40 reviews), <strong>Wellington</strong> (35 reviews), and <strong>Bristol</strong> (21 reviews) for their tremendous focus and performance in obtaining a high volume of new Google reviews this month.
            </p>
          </div>

            {/* New Section on Google Ranking Importance */}
            <div className="mb-8 p-6 bg-teal-100 rounded-lg shadow-inner">
                <h3 className="text-2xl font-semibold text-teal-800 mb-4">Why Google Ranking Matters (Local SEO)</h3>
                <p className="text-lg text-gray-700 leading-relaxed mb-4">
                    Your Google ranking determines whether your store appears in the <strong>Google Map Pack</strong>—the top 3 local businesses shown when a customer searches for "vape shop near me." These top 3 spots receive approximately <strong>80% of all local search clicks and calls.</strong> Achieving and maintaining Rank 1 is crucial because it makes your store the default choice for new, nearby customers.
                </p>
                <h4 className="text-xl font-semibold text-teal-700 mt-6 mb-3">Best Ways to Influence Your Ranking:</h4>
                <ul className="list-disc list-inside text-lg text-gray-700 space-y-2 ml-4">
                    <li><strong>Review Volume & Velocity:</strong> Consistently asking every satisfied customer for a review is the single biggest factor. The more new reviews you get <strong>each month</strong>, the better.</li>
                    <li><strong>Keyword Optimisation:</strong> Ensure your Google Business Profile describes what you do (e.g., include "vape shop" or "ecigarette store").</li>
                    <li><strong>Profile Completeness:</strong> Keep hours, address, and contact details 100% accurate and up to date.</li>
                    <li><strong>Review Responses:</strong> Always respond to <strong>every</strong> review (good and bad). This shows Google you are an active, engaged business.</li>
                </ul>
                <p className="text-lg text-gray-800 leading-relaxed mt-4 font-semibold">
                    With the other three areas largely managed and maintained for you by <strong>Head Office</strong>, your primary focus should be on obtaining frequent, quality customer reviews!
                </p>
            </div>

          {/* NEW: NC App Adoption vs Missed Opportunity Chart (MOVED UP) */}
          <NcAppAdoptionChart />

          {/* TW App Signups - ACTUAL DATA (Oct Snapshot vs Average) - NOW FILTERED */}
          <div className="mb-8 p-6 bg-white rounded-lg shadow-sm">
            <h3 className="text-2xl font-semibold text-teal-800 mb-4">TW App Adoption: October Snapshot vs Area Average</h3>
            <p className="text-sm text-gray-600 mb-4">This chart compares each store's October <strong>App Adoption Rate</strong> against the Area Average of <strong>{octoberAreaAverage.toFixed(1)}%</strong>. Stores exceeding the red line are leading the way in digital engagement.</p>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={filteredTwAppSignupOctData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis dataKey="store" angle={-45} textAnchor="end" height={100} interval={0} tick={{ fill: '#4a5568', fontSize: 12 }} />
                <YAxis tickFormatter={(value) => `${value}%`} domain={[0, 80]} tick={{ fill: '#4a5568' }} />
                <Tooltip formatter={(value) => `${value.toFixed(2)}%`} />
                <Legend wrapperStyle={{ paddingTop: '20px' }} />
                <Bar dataKey="percentHaveApp" name="% Customer App Adoption (Oct)" fill={appBarColor} radius={[8, 8, 0, 0]} />
                {/* Reference Line for Area Average */}
                <ReferenceLine y={octoberAreaAverage} stroke={averageLineColor} strokeDasharray="3 3" label={{ value: `Area Average: ${octoberAreaAverage.toFixed(1)}%`, position: 'top', fill: averageLineColor }} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          
            {/* TW App Signups - PROGRESS OVER TIME - NOW FILTERED (MOVED DOWN) */}
          <div className="mb-8 p-6 bg-indigo-50 rounded-lg shadow-sm">
            <h3 className="text-2xl font-semibold text-indigo-800 mb-4">App Adoption Rate Over Time (July - October Progress by Store)</h3>
            <p className="text-sm text-gray-600 mb-4">This Line Chart tracks the <strong>App Adoption</strong> rate progress for all stores from July through October. Look for steep upward trends to identify stores with the most momentum!</p>
            <ResponsiveContainer width="100%" height={450}>
              <LineChart data={filteredAppAdoptionProgressData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis dataKey="store" angle={-45} textAnchor="end" height={100} interval={0} tick={{ fill: '#4a5568', fontSize: 12 }} />
                <YAxis tickFormatter={(value) => `${value}%`} domain={[0, 80]} tick={{ fill: '#4a5568' }} />
                <Tooltip formatter={(value) => `${value.toFixed(2)}%`} />
                <Legend wrapperStyle={{ paddingTop: '20px' }} />
                
                {/* Lines for the three months */}
                <Line type="monotone" dataKey="July" stroke="#4A90E2" strokeWidth={2} dot={false} name="July Adoption %" />
                <Line type="monotone" dataKey="August" stroke="#FFC107" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 8 }} name="August Adoption %" />
                <Line type="monotone" dataKey="September" stroke="#5B5F97" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 8 }} name="September Adoption %" />
                <Line type="monotone" dataKey="October" stroke="#E91E63" strokeWidth={3} dot={{ r: 5 }} activeDot={{ r: 8 }} name="October Adoption %" />
              </LineChart>
            </ResponsiveContainer>
            <p className="text-lg text-gray-800 leading-relaxed mt-4 font-semibold text-centre">
                <strong>Key to Success:</strong> The App Adoption rate is most heavily influenced by successful sign-ups with new customers (NC). Using the App as the standard approach for every NC conversation is the fastest way to drive this metric up!
            </p>
          </div>
          
        </section>


        {/* ========================================================= */}
        {/* 4. AUDIT RESULTS (REMOVED AS REQUESTED) */}
        {/* ========================================================= */}


        {/* ========================================================= */}
        {/* 5. TARGETS (HIDDEN BY QUIZ) */}
        {/* ========================================================= */}

        
        {/* Section 6: Knowledge Check / November Targets (CONDITIONAL) */}
        <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b-2 border-gray-400 pb-2 text-centre">Knowledge Check: Unlock November Targets</h2>
            
            <div className="flex justify-centre mb-8">
                <QuizComponent />
            </div>

            {/* November Targets are only rendered if the quiz is passed */}
            {quizPassed ? (
                <NovemberTargetsTable />
            ) : (
                <div className="mt-12 p-6 bg-red-50 rounded-xl shadow-lg border-t-4 border-red-600 text-centre">
                    <h3 className="text-2xl font-bold text-red-700">November Targets Hidden</h3>
                    <p className="text-lg text-red-800 mt-2">Complete the Knowledge Check above to review your forward-looking goals!</p>
                </div>
            )}
        </section>

      </div>
        </div>
    );
};

export default App;
