/**
 * ==========================================================
 * HAKI CAFE SYSTEM
 * DASHBOARD MODULE
 * ==========================================================
 */

async function loadDashboard() {

  const systemMessage =
    document.getElementById("system-message");

  try {

    /*
     * ======================================================
     * SALES
     * ======================================================
     */

    const salesResult =
      await apiRequest("sales");

    const sales =
      Array.isArray(salesResult.data)
        ? salesResult.data
        : [];


    /*
     * ======================================================
     * INVENTORY
     * ======================================================
     */

    const inventoryResult =
      await apiRequest("inventory");

    const inventory =
      Array.isArray(inventoryResult.data)
        ? inventoryResult.data
        : [];


    /*
     * ======================================================
     * MENU COSTING
     * ======================================================
     */

    const menuResult =
      await apiRequest("menu-costing");

    const menu =
      Array.isArray(menuResult.data)
        ? menuResult.data
        : [];


    /*
     * ======================================================
     * FIND BUSINESS DATE FROM SALES API
     * ======================================================
     */

    let businessDate = "";

    if (sales.length > 0) {

      businessDate =
        String(
          sales[0].businessDate || ""
        )
          .trim()
          .substring(0, 10);

    }


    /*
     * ======================================================
     * FILTER SALES
     * ======================================================
     */

    const todaysSales =
      sales.filter(
        sale => {

          const saleDate =
            String(
              sale.businessDate || ""
            )
              .trim()
              .substring(0, 10);

          return (
            saleDate ===
            businessDate
          );

        }
      );


    /*
     * ======================================================
     * TODAY'S SALES
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


    /*
     * ======================================================
     * ITEMS SOLD
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


    /*
     * ======================================================
     * FORMAT PHP
     * ======================================================
     */

    const formattedSales =
      new Intl.NumberFormat(
        "en-PH",
        {
          style: "currency",
          currency: "PHP",
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        }
      ).format(
        todaySales
      );


    /*
     * ======================================================
     * UPDATE DASHBOARD
     * ======================================================
     */

    document.getElementById(
      "today-sales"
    ).textContent =
      formattedSales;


    document.getElementById(
      "items-sold"
    ).textContent =
      itemsSold.toLocaleString(
        "en-PH"
      );


    document.getElementById(
      "inventory-items"
    ).textContent =
      inventory.length.toLocaleString(
        "en-PH"
      );


    document.getElementById(
      "menu-items"
    ).textContent =
      menu.length.toLocaleString(
        "en-PH"
      );


    /*
     * ======================================================
     * STATUS
     * ======================================================
     */

    if (systemMessage) {

      systemMessage.textContent =
        "Connected to HAKI Cafe System API.";

    }


    /*
     * ======================================================
     * DEBUG
     * ======================================================
     */

    console.log(
      "HAKI DASHBOARD"
    );

    console.log(
      "API BUSINESS DATE:",
      businessDate
    );

    console.log(
      "SALES RECORDS:",
      sales.length
    );

    console.log(
      "TODAY SALES RECORDS:",
      todaysSales.length
    );

    console.log(
      "TODAY SALES:",
      todaySales
    );

    console.log(
      "ITEMS SOLD:",
      itemsSold
    );

  }

  catch (error) {

    console.error(
      "Dashboard Error:",
      error
    );

    if (systemMessage) {

      systemMessage.textContent =
        "API Error: " +
        error.message;

    }

  }

}


/*
 * ==========================================================
 * INITIALIZE
 * ==========================================================
 */

document.addEventListener(
  "DOMContentLoaded",
  loadDashboard
);

