```javascript
/**
 * ==========================================================
 * HAKI CAFE SYSTEM
 * DASHBOARD
 * ==========================================================
 *
 * Business timezone and currency are controlled through
 * BUSINESS_CONFIG in config.js.
 *
 * Current HAKI configuration:
 *
 * Timezone: Asia/Manila
 * Currency: PHP
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
      currency:
        BUSINESS_CONFIG.CURRENCY,

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
 * Returns today's date according to the cafe's
 * configured business timezone.
 *
 * ==========================================================
 */

function getBusinessDate() {

  return new Intl.DateTimeFormat(
    "en-CA",
    {
      timeZone:
        BUSINESS_CONFIG.BUSINESS_TIMEZONE,

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
 * GET DATE IN BUSINESS TIMEZONE
 * ==========================================================
 */

function getBusinessDateFromValue(dateValue) {

  if (!dateValue) {

    return null;

  }


  const date =
    new Date(dateValue);


  if (
    isNaN(
      date.getTime()
    )
  ) {

    return null;

  }


  return new Intl.DateTimeFormat(
    "en-CA",
    {
      timeZone:
        BUSINESS_CONFIG.BUSINESS_TIMEZONE,

      year: "numeric",

      month: "2-digit",

      day: "2-digit"
    }
  ).format(
    date
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
    // BUSINESS DATE
    // ------------------------------------------------------

    const todayString =
      getBusinessDate();


    // ------------------------------------------------------
    // TODAY'S SALES
    // ------------------------------------------------------

    const todaysSales =
      sales.filter(
        item => {

          const saleDate =
            getBusinessDateFromValue(
              item.date
            );


          return (
            saleDate ===
            todayString
          );

        }
      );


    // ------------------------------------------------------
    // TOTAL SALES
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
    // ITEMS SOLD
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
    // SYSTEM STATUS
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


  catch (error) {

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
        "Dashboard data could not be loaded.";

    }

  }

}
```
