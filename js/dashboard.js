/**
 * ==========================================================
 * HAKI CAFE SYSTEM
 * DASHBOARD
 * ==========================================================
 */

async function loadDashboard() {

  try {

    // ------------------------------------------------------
    // LOAD SALES
    // ------------------------------------------------------

    const salesResult =
      await apiRequest("sales");

    const sales =
      salesResult.data || [];


    // ------------------------------------------------------
    // LOAD INVENTORY
    // ------------------------------------------------------

    const inventoryResult =
      await apiRequest("inventory");

    const inventory =
      inventoryResult.data || [];


    // ------------------------------------------------------
    // LOAD MENU COSTING
    // ------------------------------------------------------

    const menuResult =
      await apiRequest("menu-costing");

    const menu =
      menuResult.data || [];


    // ------------------------------------------------------
    // TODAY'S SALES
    // ------------------------------------------------------

    const today =
      new Date();

    const todayString =
      today.toISOString().slice(0, 10);


    const todaysSales =
      sales.filter(item => {

        if (!item.date) {
          return false;
        }

        const saleDate =
          new Date(item.date)
            .toISOString()
            .slice(0, 10);

        return saleDate === todayString;

      });


    const totalSales =
      todaysSales.reduce(
        (sum, item) =>
          sum +
          Number(item.netSales || 0),
        0
      );


    // ------------------------------------------------------
    // ITEMS SOLD
    // ------------------------------------------------------

    const itemsSold =
      todaysSales.reduce(
        (sum, item) =>
          sum +
          Number(item.qtySold || 0),
        0
      );


    // ------------------------------------------------------
    // UPDATE CARDS
    // ------------------------------------------------------

    document.getElementById(
      "today-sales"
    ).textContent =
      "₱" +
      totalSales.toLocaleString(
        "en-PH",
        {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        }
      );


    document.getElementById(
      "items-sold"
    ).textContent =
      itemsSold.toLocaleString();


    document.getElementById(
      "inventory-items"
    ).textContent =
      inventory.length.toLocaleString();


    document.getElementById(
      "menu-items"
    ).textContent =
      menu.length.toLocaleString();


    // ------------------------------------------------------
    // SYSTEM STATUS
    // ------------------------------------------------------

    document.getElementById(
      "system-message"
    ).textContent =
      "Connected to HAKI Cafe System API.";

  }


  catch (error) {

    console.error(
      "Dashboard loading error:",
      error
    );


    document.getElementById(
      "system-message"
    ).textContent =
      "Dashboard data could not be loaded.";

  }

}
