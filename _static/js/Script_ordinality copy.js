document.addEventListener("DOMContentLoaded", function () {
    var leftList = document.getElementById("left-list");
    var rightSlots = document.querySelectorAll(".sortable-slot");
    var submitBtn = document.getElementById("submit-btn");

    const fieldName = js_vars.field_name;

    // Wait briefly to ensure oTree injected its hidden input
    setTimeout(() => {
        var hiddenInput = document.querySelector(`input[name="${fieldName}"]`);
        if (!hiddenInput) {
            console.error(`Input field '${fieldName}' not found`);
            return;
        }

        console.log('Found hidden input:', fieldName);

        // --- Sortable for left list ---
        new Sortable(leftList, {
            group: "shared",
            animation: 150,
            onSort: updateRankingOrder
        });

        // --- Sortable for right slots ---
        rightSlots.forEach(slot => {
            new Sortable(slot, {
                group: "shared",
                animation: 150,
                swapThreshold: 1,

                onAdd(evt) {
                    const incoming = evt.item;
                    const itemsInSlot = slot.querySelectorAll('.sortable-item');
                    const placeholder = slot.querySelector('.placeholder');
                    if (placeholder) placeholder.remove();

                    if (itemsInSlot.length > 1) {
                        const toReturn = Array.from(itemsInSlot).find(el => el !== incoming);
                        leftList.appendChild(toReturn);
                    }
                    updateRankingOrder();
                },

                onRemove(evt) {
                    if (!slot.querySelector('.sortable-item')) {
                        const placeholderSpan = document.createElement("span");
                        placeholderSpan.classList.add("placeholder");
                        placeholderSpan.textContent = "[Drag & Drop here]";
                        slot.appendChild(placeholderSpan);
                    }
                    updateRankingOrder();
                },

                onUpdate() {
                    updateRankingOrder();
                }
            });
        });

        // --- Update ranking order in hidden input ---
        function updateRankingOrder() {
            var order = [];
            rightSlots.forEach(slot => {
                let item = slot.querySelector(".sortable-item");
                order.push(item ? item.dataset.value : null);
            });
            hiddenInput.value = JSON.stringify(order);
            submitBtn.disabled = order.includes(null);
        }

        // --- Custom submit behavior using oTree’s Next button ---
        submitBtn.addEventListener("click", function(event) {
          console.log("Submit button clicked");
          // event.preventDefault();  // stop normal oTree form submit
          // trigger the normal next button (the hidden one oTree adds)
          document.querySelector(".otree-btn-next").click();
      });
    }, 100); // ensures oTree’s input exists
});
