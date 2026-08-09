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
 * The Sales API provides the official businessDate.
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
     * ======================================================
     * BUSINESS DATE
     * ======================================================
     *
     * IMPORTANT:
     *
     * We are NOT calculating the date in the browser.
     *
     * We use the businessDate supplied by the Sales API.
     *
     * This avoids all browser timezone issues.
     *
     * ======================================================
     */

    let businessDate = null;


    for (
      const sale of sales
    ) {

      if (
        sale.businessDate
      ) {

        businessDate =
          String(
            sale.businessDate
          )
            .trim()
            .substring(
              0,
              10
            );

        break;

      }

    }


    /**
     * ------------------------------------------------------
     * FILTER TODAY'S SALES
     * ------------------------------------------------------
     */

    const todaysSales =
      businessDate
        ? sales.filter(
            sale => {

              return (
                String(
                  sale.businessDate || ""
                )
                  .trim()
                  .substring(
                    0,
                    10
                  ) ===
                businessDate
              );

            }
          )
        : [];


    /**
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
     * UPDATE DASHBOARD
     * ------------------------------------------------------
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
     * DEBUG
     * ------------------------------------------------------
     */

    console.log(
      "HAKI Dashboard loaded."
    );

    console.log(
      "API Business Date:",
      businessDate
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

