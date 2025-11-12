document.addEventListener("DOMContentLoaded", function () {
    var likertDropdowns = document.querySelectorAll(".likert-scale");
    var submitBtn = document.getElementById("submit-btn");

    // Disable all rows except the first one (keep this if you want step-by-step input)
    likertDropdowns.forEach((dropdown, index) => {
        if (index > 0) {
            dropdown.style.pointerEvents = "none";  // visually disabled but still submitted
            dropdown.style.opacity = "0.5";
        }
    });

    function updateLikertOptions() {
        let maxAllowed = 10; // Maximum possible score

        likertDropdowns.forEach((dropdown, index) => {
            let prevValue = index > 0 ? parseInt(likertDropdowns[index - 1].value) || maxAllowed : maxAllowed;

            // Restrict available choices based on the previous row’s selection
            dropdown.querySelectorAll("option").forEach(option => {
            if (option.value !== "") {
                const optionVal = parseInt(option.value);
                const currentVal = parseInt(dropdown.value);
                // Disable only values higher than previous, except if currently selected
                if (optionVal > prevValue && optionVal !== currentVal) {
                    option.disabled = true;
                } else {
                    option.disabled = false;
                }
            }
            });

            // Enable the next row only if the current one is selected
            if (dropdown.value) {
                if (index + 1 < likertDropdowns.length) {
                    likertDropdowns[index + 1].style.pointerEvents = "auto";
                    likertDropdowns[index + 1].style.opacity = "1";
                }
            } else {
                // If a row is unselected, visually disable lower rows but keep them enabled for form submission
                for (let i = index + 1; i < likertDropdowns.length; i++) {
                    likertDropdowns[i].style.pointerEvents = "none";
                    likertDropdowns[i].style.opacity = "0.5";
                    // DO NOT clear likertDropdowns[i].value
                }
            }
        });

        checkIfAllSelected();
    }

    function checkIfAllSelected() {
        let allFilled = [...likertDropdowns].every(dropdown => dropdown.value !== "");
        submitBtn.disabled = !allFilled;
    }

    // Attach event listener to each dropdown
    likertDropdowns.forEach(dropdown => {
        dropdown.addEventListener("change", updateLikertOptions);
    });

    updateLikertOptions(); // Initialize correct state
});
