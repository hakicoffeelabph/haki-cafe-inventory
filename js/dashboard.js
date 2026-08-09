/**
 * ==========================================================
 * HAKI CAFE SYSTEM
 * DASHBOARD
 * ==========================================================
 *
 * Data sources:
 *
 *   SALES          -> ?action=sales
 *   INVENTORY      -> ?action=inventory
 *   MENU COSTING   -> ?action=menu-costing
 *
 * Business timezone:
 *   Asia/Manila
 *
 * ==========================================================
 */


/**
 * ==========================================================
 * CONFIGURATION
 * ==========================================================
 */

const DASHBOARD_TIMEZONE = "Asia/Manila";


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
 * GET MANILA BUSINESS DATE
 * ==========================================================
 */

function getBusinessDate() {

  return new Intl.DateTimeFormat(
    "en-CA",
    {
      timeZone: DASHBOARD_TIMEZONE,
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    }
  ).format(
    new Date()
  );

}


/**
 * ==========================================================
 * LOAD DASHBOARD
 * ==========================================================
 */

async function loadDashboard() {

  const message =
    document.getElementById(
      "system-message"
    );


  try {

    /*
     * ------------------------------------------------------
     * BUSINESS DATE
     * ------------------------------------------------------
     */

    const today =
      getBusinessDate();


    /*
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


    /*
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


    /*
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


    /*
     * ------------------------------------------------------
     * FILTER TODAY'S SALES
     * ------------------------------------------------------
     */

    const todaysSales =
      sales.filter(
        sale => {

          /*
           * Preferred:
           * API already provides businessDate.
           */

          if (
            sale.businessDate
          ) {

            return (
              sale.businessDate ===
              today
            );

          }


          /*
           * Fallback:
           * Convert API date to Manila.
           */

          if (
            sale.date
          ) {

            const convertedDate =
              new Intl.DateTimeFormat(
                "en-CA",
                {
                  timeZone:
                    DASHBOARD_TIMEZONE,

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
              convertedDate ===
              today
            );

          }


          return false;

        }
      );


    /*
     * ------------------------------------------------------
     * CALCULATE SALES
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


    /*
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


    /*
     * ------------------------------------------------------
     * UPDATE TODAY'S SALES
     * ------------------------------------------------------
     */

    const salesElement =
      document.getElementById(
        "today-sales"
      );


    if (
      salesElement
    ) {

      salesElement.textContent =
        formatPHP(
          todaySales
        );

    }


    /*
     * ------------------------------------------------------
     * UPDATE ITEMS SOLD
     * ------------------------------------------------------
     */

    const itemsElement =
      document.getElementById(
        "items-sold"
      );


    if (
      itemsElement
    ) {

      itemsElement.textContent =
        itemsSold.toLocaleString(
          "en-PH"
        );

    }


    /*
     * ------------------------------------------------------
     * UPDATE INVENTORY COUNT
     * ------------------------------------------------------
     */

    const inventoryElement =
      document.getElementById(
        "inventory-items"
      );


    if (
      inventoryElement
    ) {

      inventoryElement.textContent =
        inventory.length.toLocaleString(
          "en-PH"
        );

    }


    /*
     * ------------------------------------------------------
     * UPDATE MENU COUNT
     * ------------------------------------------------------
     */

    const menuElement =
      document.getElementById(
        "menu-items"
      );


    if (
      menuElement
    ) {

      menuElement.textContent =
        menu.length.toLocaleString(
          "en-PH"
        );

    }


    /*
     * ------------------------------------------------------
     * SYSTEM STATUS
     * ------------------------------------------------------
     */

    if (
      message
    ) {

      message.textContent =
        "Connected to HAKI Cafe System API.";

    }


    /*
     * ------------------------------------------------------
     * DEBUG
     * ------------------------------------------------------
     */

    console.log(
      "========================================"
    );

    console.log(
      "HAKI CAFE DASHBOARD"
    );

    console.log(
      "Business Date:",
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

    console.log(
      "========================================"
    );

  }


  catch (
    error
  ) {

    console.error(
      "HAKI Dashboard Error:",
      error
    );


    if (
      message
    ) {

      message.textContent =
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
  function () {

    loadDashboard();

  }
);

