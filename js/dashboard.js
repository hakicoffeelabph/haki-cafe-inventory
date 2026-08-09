/**
 * ==========================================================
 * HAKI CAFE SYSTEM
 * DASHBOARD MODULE
 * ==========================================================
 *
 * Reads:
 *
 *   - Sales API
 *   - Inventory API
 *   - Menu Costing API
 *
 * Business timezone:
 *   Asia/Manila
 *
 * Currency:
 *   PHP
 *
 * ==========================================================
 */


/**
 * ==========================================================
 * CONFIGURATION
 * ==========================================================
 */

const DASHBOARD_TIMEZONE =
  "Asia/Manila";


/**
 * ==========================================================
 * FORMAT CURRENCY
 * ==========================================================
 */

function dashboardCurrency(value) {

  return new Intl.NumberFormat(
    "en-PH",
    {
      style: "currency",
      currency: "PHP",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }
  ).format(
    Number(value || 0)
  );

}


/**
 * ==========================================================
 * GET TODAY'S BUSINESS DATE
 * ==========================================================
 *
 * IMPORTANT:
 *
 * The Dashboard uses Manila time regardless of the
 * user's computer/browser timezone.
 *
 * Example:
 *
 * UAE browser time:
 *     2026-08-09
 *
 * Manila business date:
 *     2026-08-09
 *
 * ==========================================================
 */

function getDashboardBusinessDate() {

  return new Intl.DateTimeFormat(
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
    new Date()
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
      getDashboardBusinessDate();


    /**
     * ------------------------------------------------------
     * LOAD SALES
     * ------------------------------------------------------
     */

    const salesResult =
      await apiRequest(
        "sales"
      );


    const sales =
      salesResult.data || [];


    /**
     * ------------------------------------------------------
     * LOAD INVENTORY
     * ------------------------------------------------------
     */

    const inventoryResult =
      await apiRequest(
        "inventory"
      );


    const inventory =
      inventoryResult.data || [];


    /**
     * ------------------------------------------------------
     * LOAD MENU COSTING
     * ------------------------------------------------------
     */

    const menuResult =
      await apiRequest(
        "menu-costing"
      );


    const menu =
      menuResult.data || [];


    /**
     * ======================================================
     * FILTER TODAY'S SALES
     * ======================================================
     *
     * The Sales API provides businessDate.
     *
     * Example:
     *
     *     businessDate: "2026-08-09"
     *
     * The Dashboard compares that directly against
     * today's Manila business date.
     *
     * ======================================================
     */

    const todaysSales =
      sales.filter(
        sale => {

          if (
            sale.businessDate
          ) {

            return (
              String(
                sale.businessDate
              ).trim() ===
              today
            );

          }


          /*
           * Older records without businessDate
           * are ignored.
           */

          return false;

        }
      );


    /**
     * ======================================================
     * CALCULATE TODAY'S SALES
     * ======================================================
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
     * ======================================================
     * CALCULATE ITEMS SOLD
     * ======================================================
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
     * ======================================================
     * UPDATE TODAY'S SALES
     * ======================================================
     */

    const todaySalesElement =
      document.getElementById(
        "today-sales"
      );


    if (
      todaySalesElement
    ) {

      todaySalesElement.textContent =
        dashboardCurrency(
          todaySales
        );

    }


    /**
     * ======================================================
     * UPDATE ITEMS SOLD
     * ======================================================
     */

    const itemsSoldElement =
      document.getElementById(
        "items-sold"
      );


    if (
      itemsSoldElement
    ) {

      itemsSoldElement.textContent =
        itemsSold.toLocaleString(
          "en-PH"
        );

    }


    /**
     * ======================================================
     * UPDATE INVENTORY ITEMS
     * ======================================================
     */

    const inventoryItemsElement =
      document.getElementById(
        "inventory-items"
      );


    if (
      inventoryItemsElement
    ) {

      inventoryItemsElement.textContent =
        inventory.length.toLocaleString(
          "en-PH"
        );

    }


    /**
     * ======================================================
     * UPDATE MENU ITEMS
     * ======================================================
     */

    const menuItemsElement =
      document.getElementById(
        "menu-items"
      );


    if (
      menuItemsElement
    ) {

      menuItemsElement.textContent =
        menu.length.toLocaleString(
          "en-PH"
        );

    }


    /**
     * ======================================================
     * SYSTEM STATUS
     * ======================================================
     */

    if (
      systemMessage
    ) {

      systemMessage.textContent =
        "Connected to HAKI Cafe System API.";

    }


    /**
     * ======================================================
     * DEBUG INFORMATION
     * ======================================================
     */

    console.log(
      "========================================"
    );

    console.log(
      "HAKI CAFE SYSTEM DASHBOARD"
    );

    console.log(
      "Business Timezone:",
      DASHBOARD_TIMEZONE
    );

    console.log(
      "Business Date:",
      today
    );

    console.log(
      "Total Sales Records:",
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


  /**
   * ========================================================
   * ERROR HANDLING
   * ========================================================
   */

  catch (
    error
  ) {

    console.error(
      "HAKI Dashboard Error:",
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
 * INITIALIZE DASHBOARD
 * ==========================================================
 */

document.addEventListener(
  "DOMContentLoaded",
  () => {

    loadDashboard();

  }
);

