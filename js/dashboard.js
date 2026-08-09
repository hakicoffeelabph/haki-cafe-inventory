/**
 * ==========================================================
 * HAKI CAFE SYSTEM
 * DASHBOARD MODULE
 * ==========================================================
 *
 * Data sources:
 *
 *   SALES          -> ?action=sales
 *   INVENTORY      -> ?action=inventory
 *   MENU COSTING   -> ?action=menu-costing
 *
 * Business date is supplied by the Sales API.
 *
 * ==========================================================
 */


/**
 * ==========================================================
 * FORMAT PHP CURRENCY
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
     * LOAD SALES
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
     * LOAD INVENTORY
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
     * LOAD MENU COSTING
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
     * ======================================================
     * DETERMINE BUSINESS DATE
     * ======================================================
     *
     * The Sales API already provides:
     *
     *   businessDate
     *
     * Example:
     *
     *   "2026-08-09"
     *
     * We use the first valid businessDate returned
     * by the API.
     *
     * ======================================================
     */

    const validSales =
      sales.filter(
        sale =>
          sale &&
          sale.businessDate
      );


    const businessDate =
      validSales.length
        ? String(
            validSales[0].businessDate
          )
            .trim()
            .substring(
              0,
              10
            )
        : null;


    /**
     * ======================================================
     * FILTER TODAY'S SALES
     * ======================================================
     */

    const todaysSales =
      businessDate
        ? validSales.filter(
            sale => {

              const saleBusinessDate =
                String(
                  sale.businessDate
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
          )
        : [];


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
        formatPHP(
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
     * UPDATE MENU ITEMS
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
      "HAKI Cafe Dashboard loaded."
    );

    console.log(
      "Business Date:",
      businessDate
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

