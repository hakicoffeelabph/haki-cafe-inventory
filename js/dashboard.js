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
 * Uses Manila time regardless of the user's browser timezone.
 *
 * ==========================================================
 */

function getDashboardBusinessDate() {

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

  const systemMessage =
    document.getElementById(
      "system-message"
    );


  try {

    /**
     * ------------------------------------------------------
     * BUSINESS DATE
     * ------------------------------------------------------
     */

    const today =
      getDashboardBusinessDate();


    /**
     * ------------------------------------------------------
     * SALES
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
     * INVENTORY
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
     * MENU COSTING
     * ------------------------------------------------------
     *
     * IMPORTANT:
     * The API action is menuCosting, not menu.
     *
     * ------------------------------------------------------
     */

    const menuResult =
      await apiRequest(
        "menuCosting"
      );

    const menu =
      menuResult.data || [];


    /**
     * ------------------------------------------------------
     * FILTER TODAY'S SALES
     * ------------------------------------------------------
     *
     * Prefer businessDate supplied by the API.
     *
     * Fallback to converting the raw date using
     * Asia/Manila timezone.
     *
     * ------------------------------------------------------
     */

    const todaysSales =
      sales.filter(
        sale => {

          if (
            sale.businessDate
          ) {

            return (
              sale.businessDate ===
              today
            );

          }


          if (
            sale.date
          ) {

            const saleDate =
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
              saleDate ===
              today
            );

          }


          return false;

        }
      );


    /**
     * ------------------------------------------------------
     * TODAY'S SALES
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
     * ITEMS SOLD
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
     * UPDATE DASHBOARD
     * ------------------------------------------------------
     */

    const todaySalesElement =
      document.getElementById(
        "today-sales"
      );


    const itemsSoldElement =
      document.getElementById(
        "items-sold"
      );


    const inventoryItemsElement =
      document.getElementById(
        "inventory-items"
      );


    const menuItemsElement =
      document.getElementById(
        "menu-items"
      );


    if (
      todaySalesElement
    ) {

      todaySalesElement.textContent =
        dashboardCurrency(
          todaySales
        );

    }


    if (
      itemsSoldElement
    ) {

      itemsSoldElement.textContent =
        itemsSold.toLocaleString(
          "en-PH"
        );

    }


    if (
      inventoryItemsElement
    ) {

      inventoryItemsElement.textContent =
        inventory.length.toLocaleString(
          "en-PH"
        );

    }


    if (
      menuItemsElement
    ) {

      menuItemsElement.textContent =
        menu.length.toLocaleString(
          "en-PH"
        );

    }


    /**
     * ------------------------------------------------------
     * SYSTEM STATUS
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
     * DEBUG INFORMATION
     * ------------------------------------------------------
     */

    console.log(
      "HAKI Dashboard loaded successfully."
    );

    console.log(
      "Business Date:",
      today
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


  catch (error) {

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

