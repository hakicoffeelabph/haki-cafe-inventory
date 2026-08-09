/**
 * ==========================================================
 * HAKI CAFE SYSTEM
 * DASHBOARD
 * ==========================================================
 *
 * Dashboard reads live data from the Apps Script API.
 *
 * Business date is supplied by the backend using:
 * Asia/Manila
 *
 * ==========================================================
 */


/**
 * ==========================================================
 * FORMAT CURRENCY
 * ==========================================================
 */

function formatCurrency(amount) {

  return new Intl.NumberFormat(
    BUSINESS_CONFIG.LOCALE,
    {
      style: "currency",
      currency: BUSINESS_CONFIG.CURRENCY,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }
  ).format(
    Number(amount || 0)
  );

}


/**
 * ==========================================================
 * GET BUSINESS DATE
 * ==========================================================
 *
 * Returns today's date in Asia/Manila.
 *
 * Format:
 * YYYY-MM-DD
 *
 * ==========================================================
 */

function getBusinessDate() {

  const parts =
    new Intl.DateTimeFormat(
      "en-CA",
      {
        timeZone:
          BUSINESS_CONFIG.BUSINESS_TIMEZONE,

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

  try {

    // ------------------------------------------------------
    // LOAD DATA
    // ------------------------------------------------------

    const salesResult =
      await apiRequest(
        "sales"
      );


    const inventoryResult =
      await apiRequest(
        "inventory"
      );


    const menuResult =
      await apiRequest(
        "menu-costing"
      );


    const sales =
      salesResult.data || [];


    const inventory =
      inventoryResult.data || [];


    const menu =
      menuResult.data || [];


    // ------------------------------------------------------
    // TODAY'S BUSINESS DATE
    // ------------------------------------------------------

    const today =
      getBusinessDate();


    console.log(
      "Dashboard business date:",
      today
    );


    console.log(
      "Sales received:",
      sales
    );


    // ------------------------------------------------------
    // TODAY'S SALES
    // ------------------------------------------------------

    const todaysSales =
  sales.filter(
    item => {

      console.log(
        "SALE BUSINESS DATE:",
        item.businessDate
      );

      console.log(
        "DASHBOARD TODAY:",
        today
      );

      return true;

    }
  );


    // ------------------------------------------------------
    // TOTAL SALES
    // ------------------------------------------------------

    const totalSales =
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


    // ------------------------------------------------------
    // ITEMS SOLD
    // ------------------------------------------------------

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


    // ------------------------------------------------------
    // UPDATE TODAY'S SALES
    // ------------------------------------------------------

    const salesElement =
      document.getElementById(
        "today-sales"
      );


    if (
      salesElement
    ) {

      salesElement.textContent =
        formatCurrency(
          totalSales
        );

    }


    // ------------------------------------------------------
    // UPDATE ITEMS SOLD
    // ------------------------------------------------------

    const itemsElement =
      document.getElementById(
        "items-sold"
      );


    if (
      itemsElement
    ) {

      itemsElement.textContent =
        itemsSold.toLocaleString(
          BUSINESS_CONFIG.LOCALE
        );

    }


    // ------------------------------------------------------
    // UPDATE INVENTORY COUNT
    // ------------------------------------------------------

    const inventoryElement =
      document.getElementById(
        "inventory-items"
      );


    if (
      inventoryElement
    ) {

      inventoryElement.textContent =
        inventory.length.toLocaleString(
          BUSINESS_CONFIG.LOCALE
        );

    }


    // ------------------------------------------------------
    // UPDATE MENU COUNT
    // ------------------------------------------------------

    const menuElement =
      document.getElementById(
        "menu-items"
      );


    if (
      menuElement
    ) {

      menuElement.textContent =
        menu.length.toLocaleString(
          BUSINESS_CONFIG.LOCALE
        );

    }


    // ------------------------------------------------------
    // CONNECTION STATUS
    // ------------------------------------------------------

    const message =
      document.getElementById(
        "system-message"
      );


    if (
      message
    ) {

      message.textContent =
        "Connected to HAKI Cafe System API.";

    }

  }


  catch (
    error
  ) {

    console.error(
      "Dashboard loading error:",
      error
    );


    const message =
      document.getElementById(
        "system-message"
      );


    if (
      message
    ) {

      message.textContent =
        "Dashboard Error: " +
        error.message;

    }

  }

}
