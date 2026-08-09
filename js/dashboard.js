/**
 * ==========================================================
 * HAKI CAFE SYSTEM
 * DASHBOARD MODULE
 * ==========================================================
 *
 * Dashboard reads:
 *
 *   SALES          -> ?action=sales
 *   INVENTORY      -> ?action=inventory
 *   MENU COSTING   -> ?action=menu-costing
 *
 * The Sales API provides `businessDate`.
 *
 * The Dashboard uses that value directly.
 * This keeps the business-date logic centralized in Apps Script
 * and avoids browser timezone/date conversion problems.
 *
 * ==========================================================
 */


/**
 * ==========================================================
 * FORMAT PHP
 * ==========================================================
 */

function formatPHP(value) {

  return new Intl.NumberFormat(
    "en-PH",
    {
      style: "currency",
      currency: "PHP",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }
  ).format(
    Number(value) || 0
  );

}


/**
 * ==========================================================
 * GET TODAY'S BUSINESS DATE
 * ==========================================================
 *
 * Uses Manila timezone.
 *
 * This is only used as a fallback.
 *
 * Normally the API's businessDate should be used.
 *
 * ==========================================================
 */

function getTodayBusinessDate() {

  const parts =
    new Intl.DateTimeFormat(
      "en-US",
      {
        timeZone: "Asia/Manila",
        year: "numeric",
        month: "2-digit",
        day: "2-digit"
      }
    ).formatToParts(
      new Date()
    );

  const values = {};

  parts.forEach(
    part => {

      if (
        part.type !== "literal"
      ) {

        values[part.type] =
          part.value;

      }

    }
  );

  return (
    values.year +
    "-" +
    values.month +
    "-" +
    values.day
  );

}


/**
 * ==========================================================
 * LOAD DASHBOARD
 * ==========================================================
 */

async function loadDashboard() {

  const systemMessage =
    document.getElementById(
      "system-message"
    );


  try {

    /**
     * ------------------------------------------------------
     * GET TODAY'S BUSINESS DATE
     * ------------------------------------------------------
     */

    const today =
      getTodayBusinessDate();


    /**
     * ------------------------------------------------------
     * SALES
     * ------------------------------------------------------
     */

    const salesResponse =
      await apiRequest(
        "sales"
      );


    const sales =
      Array.isArray(
        salesResponse.data
      )
        ? salesResponse.data
        : [];


    /**
     * ------------------------------------------------------
     * INVENTORY
     * ------------------------------------------------------
     */

    const inventoryResponse =
      await apiRequest(
        "inventory"
      );


    const inventory =
      Array.isArray(
        inventoryResponse.data
      )
        ? inventoryResponse.data
        : [];


    /**
     * ------------------------------------------------------
     * MENU COSTING
     * ------------------------------------------------------
     */

    const menuResponse =
      await apiRequest(
        "menu-costing"
      );


    const menu =
      Array.isArray(
        menuResponse.data
      )
        ? menuResponse.data
        : [];


    /**
     * ------------------------------------------------------
     * TODAY'S SALES
     * ------------------------------------------------------
     *
     * IMPORTANT:
     *
     * The Sales API already provides:
     *
     *   businessDate
     *
     * Example:
     *
     *   businessDate: "2026-08-09"
     *
     * We use that first.
     *
     * ------------------------------------------------------
     */

    const todaysSales =
      sales.filter(
        sale => {

          /*
           * PRIMARY METHOD
           *
           * Trust the API business date.
           */

          if (
            sale.businessDate
          ) {

          const saleBusinessDate =
  String(
    sale.businessDate
  )
    .trim()
    .substring(0, 10);

return (
  saleBusinessDate ===
  today
);  

          }


          /*
           * FALLBACK
           *
           * Only used for older records that don't
           * contain businessDate.
           */

          if (
            sale.date
          ) {

            const fallbackDate =
              new Intl.DateTimeFormat(
                "en-CA",
                {
                  timeZone:
                    "Asia/Manila",

                  year:
                    "numeric",

                  month:
                    "2-digit",

                  day:
                    "2-digit"
                }
              ).format(
                new Date(
                  sale.date
                )
              );


            return (
              fallbackDate ===
              today
            );

          }


          return false;

        }
      );


    /**
     * ------------------------------------------------------
     * CALCULATE TODAY'S SALES
     * ------------------------------------------------------
     */

    const todaySales =
      todaysSales.reduce(
        (
          total,
          sale
        ) => {

          return (
            total +
            Number(
              sale.netSales || 0
            )
          );

        },
        0
      );


    /**
     * ------------------------------------------------------
     * CALCULATE ITEMS SOLD
     * ------------------------------------------------------
     */

    const itemsSold =
      todaysSales.reduce(
        (
          total,
          sale
        ) => {

          return (
            total +
            Number(
              sale.qtySold || 0
            )
          );

        },
        0
      );


    /**
     * ------------------------------------------------------
     * UPDATE SALES
     * ------------------------------------------------------
     */

    document.getElementById(
      "today-sales"
    ).textContent =
      formatPHP(
        todaySales
      );


    /**
     * ------------------------------------------------------
     * UPDATE ITEMS SOLD
     * ------------------------------------------------------
     */

    document.getElementById(
      "items-sold"
    ).textContent =
      itemsSold.toLocaleString(
        "en-PH"
      );


    /**
     * ------------------------------------------------------
     * UPDATE INVENTORY
     * ------------------------------------------------------
     */

    document.getElementById(
      "inventory-items"
    ).textContent =
      inventory.length.toLocaleString(
        "en-PH"
      );


    /**
     * ------------------------------------------------------
     * UPDATE MENU
     * ------------------------------------------------------
     */

    document.getElementById(
      "menu-items"
    ).textContent =
      menu.length.toLocaleString(
        "en-PH"
      );


    /**
     * ------------------------------------------------------
     * CONNECTION STATUS
     * ------------------------------------------------------
     */

    if (
      systemMessage
    ) {

      systemMessage.textContent =
        "Connected to HAKI Cafe System API.";

    }


    /**
     * ------------------------------------------------------
     * DEBUG
     * ------------------------------------------------------
     */

    console.log(
      "HAKI Dashboard loaded."
    );

    console.log(
      "Dashboard Business Date:",
      today
    );

    console.log(
      "Sales Records:",
      sales.length
    );

    console.log(
      "Today's Sales Records:",
      todaysSales.length
    );

    console.log(
      "Today's Sales:",
      todaySales
    );

    console.log(
      "Items Sold:",
      itemsSold
    );

    console.log(
      "Inventory Items:",
      inventory.length
    );

    console.log(
      "Menu Items:",
      menu.length
    );

  }


  catch (
    error
  ) {

    console.error(
      "Dashboard Error:",
      error
    );


    if (
      systemMessage
    ) {

      systemMessage.textContent =
        "API Error: " +
        error.message;

    }

  }

}


/**
 * ==========================================================
 * INITIALIZE
 * ==========================================================
 */

document.addEventListener(
  "DOMContentLoaded",
  () => {

    loadDashboard();

  }
);

