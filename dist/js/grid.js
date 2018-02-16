// Bespoke grid function, as a helper to brands when determining the component grid number.

function grid() {

	var gridSlct = document.getElementById("grid-select");
	var offsetSlct = document.getElementById("offset-select");
	var gridHelpOff = document.getElementById("grid-help-modal-offset");
	var gridHelpCol = document.getElementById("grid-help-modal-col");
	var gridHelpOption = document.getElementById("please-select");
	var gridOptions = 12;
	var gridCol;
	var gridOff;

	this.getColumnsSelected = function() {
		gridCol = gridSlct.options[gridSlct.selectedIndex].value;
	}

	this.getOffsetSelected = function() {
		gridOff = offsetSlct.options[offsetSlct.selectedIndex].value;
	}

	this.removeHelperOption = function() {
		gridHelpOption.remove();
	}

	this.setHelperClasses = function() {
		gridHelpOff.className = "h-offset-0";
		gridHelpCol.className = "h-col-12";

		getColumnsSelected();
		getOffsetSelected();

		gridHelpOff.className = "h-offset-" + gridOff;
		gridHelpCol.className = "h-col-" + gridCol;
	}

	this.setOffset = function() {
		num = gridOptions - gridCol;
		offsetSlct.options[0].selected = true;

		for (i = 0; i < offsetSlct.options.length; i++) {
			if (i <= num) {
				offsetSlct.options[i].disabled = false;
			}
			else {
				offsetSlct.options[i].disabled = true;
			}
        }
	}

	gridSlct.addEventListener("change", function() {
		getColumnsSelected();
		setOffset();
		setHelperClasses();
		removeHelperOption();
	});

	offsetSlct.addEventListener("change", function() {
		setHelperClasses();
	});

	return setHelperClasses();

}

grid();