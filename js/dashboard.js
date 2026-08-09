/**
 * ==========================================================
 * HAKI CAFE SYSTEM
 * DASHBOARD
 * ==========================================================
 *
 * Purpose:
 * Loads and displays live dashboard information from the
 * HAKI Cafe System Apps Script API.
 *
 * Current HAKI configuration:
 *
 * Business Timezone: Asia/Manila
 * Currency: PHP
 *
 * IMPORTANT:
 * Sales "businessDate" is calculated by the backend.
 * The frontend uses that value as the authoritative
 * business date.
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
      style:
        "currency",

      currency:
        BUSINESS_CONFIG.CURRENCY,

      minimumFractionDigits:
        2,

      maximumFractionDigits:
        2

    }
  ).format(
    Number(
      amount || 0
    )
  );

}


/**
 * ==========================================================
 * GET TODAY'S BUSINESS DATE
 * ==========================================================
 *
 * Uses the configured HAKI business timezone.
 *
 * Current timezone:
 * Asia/Manila
 *
 * Example:
 * 2026-08-09
 *
 * ==========================================================
 */

function getBusinessDate() {

  return new Intl.DateTimeFormat(
    "en-CA",
    {
      timeZone:
        BUSINESS_CONFIG.BUSINESS_TIMEZONE,

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

  try {

    // ------------------------------------------------------
    // LOAD SALES
    // ------------------------------------------------------

    const salesResult =
      await apiRequest(
        "sales"
      );


    const sales =
      salesResult.data || [];


    // ------------------------------------------------------
    // LOAD INVENTORY
    // ------------------------------------------------------

    const inventoryResult =
      await apiRequest(
        "inventory"
      );


    const inventory =
      inventoryResult.data || [];


    // ------------------------------------------------------
    // LOAD MENU COSTING
    // ------------------------------------------------------

    const menuResult =
      await apiRequest(
        "menu-costing"
      );


    const menu =
      menuResult.data || [];


    // ------------------------------------------------------
    // GET TODAY'S BUSINESS DATE
    // ------------------------------------------------------

    const todayString =
      getBusinessDate();


    // ------------------------------------------------------
    // FILTER TODAY'S SALES
    //
    // IMPORTANT:
    // The backend now supplies businessDate.
    // We do NOT recalculate the raw timestamp here.
    // ------------------------------------------------------

    const todaysSales =
      sales.filter(
        item => {

          return (
            item.businessDate ===
            todayString
          );

        }
      );


    // ------------------------------------------------------
    // CALCULATE TODAY'S SALES
    // ------------------------------------------------------

    const totalSales =
      todaysSales.reduce(
        (
          sum,
          item
        ) => {

          return (
            sum +
            Number(
              item.netSales || 0
            )
          );

        },
        0
      );


    // ------------------------------------------------------
    // CALCULATE ITEMS SOLD
    // ------------------------------------------------------

    const itemsSold =
      todaysSales.reduce(
        (
          sum,
          item
        ) => {

          return (
            sum +
            Number(
              item.qtySold || 0
            )
          );

        },
        0
      );


    // ------------------------------------------------------
    // UPDATE TODAY'S SALES
    // ------------------------------------------------------

    const todaySalesElement =
      document.getElementById(
        "today-sales"
      );


    if (
      todaySalesElement
    ) {

      todaySalesElement.textContent =
        formatCurrency(
          totalSales
        );

    }


    // ------------------------------------------------------
    // UPDATE ITEMS SOLD
    // ------------------------------------------------------

    const itemsSoldElement =
      document.getElementById(
        "items-sold"
      );


    if (
      itemsSoldElement
    ) {

      itemsSoldElement.textContent =
        itemsSold.toLocaleString(
          BUSINESS_CONFIG.LOCALE
        );

    }


    // ------------------------------------------------------
    // UPDATE INVENTORY ITEMS
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
    // UPDATE MENU ITEMS
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
    // UPDATE SYSTEM MESSAGE
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


    // ------------------------------------------------------
    // DISPLAY ERROR
    // ------------------------------------------------------

    const message =
      document.getElementById(
        "system-message"
      );


    if (
      message
    ) {

      message.textContent =
        "Dashboard data could not be loaded.";

    }

  }

}

