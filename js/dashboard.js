/**
 * ==========================================================
 * HAKI CAFE SYSTEM
 * DASHBOARD MODULE
 * ==========================================================
 *
 * TEMPORARY SALES VERIFICATION VERSION
 *
 * This version intentionally does NOT filter sales by date.
 *
 * Purpose:
 * Confirm that the Dashboard is receiving the same
 * Sales API data that we tested directly.
 *
 * ==========================================================
 */


/**
 * ==========================================================
 * FORMAT PHP CURRENCY
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
     * SALES
     * ------------------------------------------------------
     */

    const salesResult =
      await apiRequest(
        "sales"
      );


    const sales =
      Array.isArray(
        salesResult.data
      )
        ? salesResult.data
        : [];


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
      Array.isArray(
        inventoryResult.data
      )
        ? inventoryResult.data
        : [];


    /**
     * ------------------------------------------------------
     * MENU COSTING
     * ------------------------------------------------------
     */

    const menuResult =
      await apiRequest(
        "menu-costing"
      );


    const menu =
      Array.isArray(
        menuResult.data
      )
        ? menuResult.data
        : [];


    /**
     * ======================================================
     * TEMPORARY TEST
     * ======================================================
     *
     * DO NOT FILTER BY DATE.
     *
     * Every record returned by the Sales API is included.
     *
     * If the API contains:
     *
     *   netSales = 63.98
     *   qtySold  = 1
     *
     * the Dashboard should show:
     *
     *   ₱63.98
     *   1
     *
     * ======================================================
     */

    const todaysSales =
      sales;


    /**
     * ======================================================
     * CALCULATE SALES
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
     * UPDATE SALES
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
     * UPDATE INVENTORY
     * ======================================================
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


    /**
     * ======================================================
     * UPDATE MENU
     * ======================================================
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


    /**
     * ======================================================
     * STATUS
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
     * CONSOLE INFORMATION
     * ======================================================
     */

    console.log(
      "======================================"
    );

    console.log(
      "HAKI CAFE DASHBOARD TEST"
    );

    console.log(
      "Sales API records:",
      sales.length
    );

    console.log(
      "Sales API response:",
      salesResult
    );

    console.log(
      "Calculated sales:",
      todaySales
    );

    console.log(
      "Calculated items:",
      itemsSold
    );

    console.log(
      "Inventory:",
      inventory.length
    );

    console.log(
      "Menu:",
      menu.length
    );

    console.log(
      "======================================"
    );

  }


  /**
   * ========================================================
   * ERROR
   * ========================================================
   */

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
  loadDashboard
);

