```javascript
/**
 * ==========================================================
 * HAKI CAFE SYSTEM
 * INVENTORY MODULE
 * ==========================================================
 *
 * Phase 1:
 * READ-ONLY INVENTORY
 *
 * No stock changes are performed by this module.
 *
 * ==========================================================
 */


/**
 * ==========================================================
 * INVENTORY DATA
 * ==========================================================
 */

let inventoryData = [];


/**
 * ==========================================================
 * FORMAT NUMBER
 * ==========================================================
 */

function formatNumber(value) {

  return Number(
    value || 0
  ).toLocaleString(
    BUSINESS_CONFIG.LOCALE,
    {
      maximumFractionDigits: 2
    }
  );

}


/**
 * ==========================================================
 * FORMAT CURRENCY
 * ==========================================================
 */

function formatCurrency(value) {

  return new Intl.NumberFormat(
    BUSINESS_CONFIG.LOCALE,
    {
      style: "currency",
      currency: BUSINESS_CONFIG.CURRENCY,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }
  ).format(
    Number(value || 0)
  );

}


/**
 * ==========================================================
 * LOAD INVENTORY
 * ==========================================================
 */

async function loadInventory() {

  const message =
    document.getElementById(
      "system-message"
    );


  const inventoryMessage =
    document.getElementById(
      "inventory-message"
    );


  try {

    // ------------------------------------------------------
    // API REQUEST
    // ------------------------------------------------------

    const result =
      await apiRequest(
        "inventory"
      );


    inventoryData =
      result.data || [];


    // ------------------------------------------------------
    // UPDATE SUMMARY
    // ------------------------------------------------------

    updateInventorySummary();


    // ------------------------------------------------------
    // RENDER TABLE
    // ------------------------------------------------------

    renderInventory(
      inventoryData
    );


    // ------------------------------------------------------
    // STATUS
    // ------------------------------------------------------

    if (
      message
    ) {

      message.textContent =
        "Connected to HAKI Cafe System API.";

    }


    if (
      inventoryMessage
    ) {

      inventoryMessage.textContent =
        inventoryData.length +
        " inventory items";

    }

  }


  catch (
    error
  ) {

    console.error(
      "Inventory loading error:",
      error
    );


    if (
      message
    ) {

      message.textContent =
        "Inventory Error: " +
        error.message;

    }


    if (
      inventoryMessage
    ) {

      inventoryMessage.textContent =
        "Unable to load inventory.";

    }

  }

}


/**
 * ==========================================================
 * UPDATE SUMMARY
 * ==========================================================
 */

function updateInventorySummary() {

  const totalItems =
    inventoryData.length;


  const outOfStock =
    inventoryData.filter(
      item =>
        String(
          item.stockStatus || ""
        ).toUpperCase() ===
        "OUT OF STOCK"
    ).length;


  const countRequired =
    inventoryData.filter(
      item =>
        String(
          item.stockStatus || ""
        ).toUpperCase() ===
        "COUNT REQUIRED"
    ).length;


  const stockValue =
    inventoryData.reduce(
      (
        total,
        item
      ) => {

        return (
          total +
          Number(
            item.stockValue || 0
          )
        );

      },
      0
    );


  document.getElementById(
    "inventory-count"
  ).textContent =
    totalItems.toLocaleString(
      BUSINESS_CONFIG.LOCALE
    );


  document.getElementById(
    "out-of-stock"
  ).textContent =
    outOfStock.toLocaleString(
      BUSINESS_CONFIG.LOCALE
    );


  document.getElementById(
    "count-required"
  ).textContent =
    countRequired.toLocaleString(
      BUSINESS_CONFIG.LOCALE
    );


  document.getElementById(
    "stock-value"
  ).textContent =
    formatCurrency(
      stockValue
    );

}


/**
 * ==========================================================
 * RENDER INVENTORY TABLE
 * ==========================================================
 */

function renderInventory(
  items
) {

  const tbody =
    document.getElementById(
      "inventory-table-body"
    );


  if (
    !tbody
  ) {

    return;

  }


  if (
    items.length === 0
  ) {

    tbody.innerHTML = `
      <tr>
        <td
          colspan="9"
          class="loading"
        >
          No inventory items found.
        </td>
      </tr>
    `;

    return;

  }


  tbody.innerHTML =
    items.map(
      item => {

        const status =
          String(
            item.stockStatus || ""
          );


        let statusClass =
          "status-neutral";


        if (
          status ===
          "OUT OF STOCK"
        ) {

          statusClass =
            "status-danger";

        }


        else if (
          status ===
          "COUNT REQUIRED"
        ) {

          statusClass =
            "status-warning";

        }


        else if (
          status ===
          "OK"
        ) {

          statusClass =
            "status-success";

        }


        return `

          <tr>

            <td>

              <div class="item-name">
                ${escapeHtml(
                  item.itemName
                )}
              </div>

              <div class="item-code">
                ${escapeHtml(
                  item.itemCode
                )}
              </div>

            </td>


            <td>
              ${escapeHtml(
                item.department
              )}
            </td>


            <td>
              ${escapeHtml(
                item.baseUom
              )}
            </td>


            <td>
              ${formatNumber(
                item.expectedStock
              )}
            </td>


            <td>
              ${formatNumber(
                item.physicalCount
              )}
            </td>


            <td>
              ${formatNumber(
                item.variance
              )}
            </td>


            <td>
              ${formatCurrency(
                item.unitCost
              )}
            </td>


            <td>
              ${formatCurrency(
                item.stockValue
              )}
            </td>


            <td>

              <span
                class="inventory-status ${statusClass}"
              >
                ${escapeHtml(
                  status
                )}
              </span>

            </td>

          </tr>

        `;

      }
    ).join("");

}


/**
 * ==========================================================
 * SEARCH INVENTORY
 * ==========================================================
 */

function searchInventory(
  searchTerm
) {

  const term =
    String(
      searchTerm || ""
    )
    .trim()
    .toLowerCase();


  if (
    !term
  ) {

    renderInventory(
      inventoryData
    );

    return;

  }


  const filtered =
    inventoryData.filter(
      item => {

        return (

          String(
            item.itemCode || ""
          )
          .toLowerCase()
          .includes(term)

          ||

          String(
            item.itemName || ""
          )
          .toLowerCase()
          .includes(term)

          ||

          String(
            item.department || ""
          )
          .toLowerCase()
          .includes(term)

        );

      }
    );


  renderInventory(
    filtered
  );

}


/**
 * ==========================================================
 * HTML ESCAPE
 * ==========================================================
 */

function escapeHtml(
  value
) {

  return String(
    value ?? ""
  )
  .replace(
    /&/g,
    "&amp;"
  )
  .replace(
    /</g,
    "&lt;"
  )
  .replace(
    />/g,
    "&gt;"
  )
  .replace(
    /"/g,
    "&quot;"
  )
  .replace(
    /'/g,
    "&#039;"
  );

}


/**
 * ==========================================================
 * SEARCH EVENT
 * ==========================================================
 */

document.addEventListener(
  "DOMContentLoaded",
  () => {

    const search =
      document.getElementById(
        "inventory-search"
      );


    if (
      search
    ) {

      search.addEventListener(
        "input",
        event => {

          searchInventory(
            event.target.value
          );

        }
      );

    }


    loadInventory();

  }
);
```
