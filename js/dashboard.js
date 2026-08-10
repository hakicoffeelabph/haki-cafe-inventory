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
 * Business date is supplied by the backend API.
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
     * ======================================================
     * LOAD SALES
     * ======================================================
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
     * ======================================================
     * GET BUSINESS DATE FROM BACKEND
     * ======================================================
     *
     * The API now returns:
     *
     *   businessDate: "YYYY-MM-DD"
     *
     * This is the official HAKI business date.
     *
     * We do NOT calculate the date in the browser.
     *
     * ======================================================
     */

    const businessDate =
      String(
        salesResult.businessDate || ""
      )
        .trim()
        .substring(
          0,
          10
        );


    /**
     * ======================================================
     * LOAD INVENTORY
     * ======================================================
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
     * ======================================================
     * LOAD MENU COSTING
     * ======================================================
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
     * FILTER TODAY'S SALES
     * ======================================================
     *
     * IMPORTANT:
     *
     * We compare every sale's businessDate against the
     * businessDate supplied by the backend.
     *
     * ======================================================
     */

    const todaysSales =
      sales.filter(
        sale => {

          const saleBusinessDate =
            String(
              sale.businessDate || ""
            )
              .trim()
              .substring(
                0,
                10
              );


          return (
            saleBusinessDate ===
            businessDate
          );

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
      "=========================================="
    );

    console.log(
      "HAKI CAFE SYSTEM DASHBOARD"
    );

    console.log(
      "Backend Business Date:",
      businessDate
    );

    console.log(
      "Sales API Records:",
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
      "=========================================="
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

