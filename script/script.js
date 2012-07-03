$(document).ready(function() {
	var htmlSelector = "html";
	var containerSelector = "#container";
	var categorySelector = "div.category";
	var categoryNameSelector = "div.category-name";
	var groupSelector = "div.group";
	var groupDescriptionSelector = "div.group-description";
	var itemSelector = "img.item";
	var aboutSelector = "#about";
	var modalBackgroundSelector = "#modal-background";
	var modalWindowSelector = "#modal-window";
	var modalClose = "#modal-close";

	var grabCursor = "grab";
	var grabbingCursor = "grabbing";

	var isMobile = navigator.userAgent.match(/(iPhone|iPod|iPad|BlackBerry|Android)/);
	
	// Function to set cursor icon.
	var setCursor = function(category, cursor) {
		category.removeClass(grabCursor);
		category.removeClass(grabbingCursor);
		if(cursor) {
			category.addClass(cursor);
		}
	};

	// Function to focus or blur a category.
	var setFocus = function(category, focused) {
		var opacity = 1.0;
		var height = "500px";
		var speed = 400;
		var cursor = grabCursor;
		if(focused) {
			category.children(categoryNameSelector).hide();
			category.find(groupDescriptionSelector).show();
		}
		else {
			opacity = 0.20;
			height = "300px";
			speed = 200;
			cursor = null;

			category.scrollLeft(0);
			category.children(categoryNameSelector).show();
			category.find(groupDescriptionSelector).hide();

			// Toggle opacity.
			category.children(categoryNameSelector).css("opacity", opacity);
			category.mouseenter(function() {
				$(this).children(categoryNameSelector).css("opacity", 1.0);
			});
			category.mouseleave(function() {
				$(this).children(categoryNameSelector).css("opacity", opacity);
			});
		}

		category.children(groupSelector).animate({ opacity: opacity }, speed, function() {
			$(this).find(itemSelector).animate({ height: height }, speed);
		});

		// Do not set grab cursors if mobile.
		if(isMobile) {
			category.css("cursor", "default");
		}
		else {
			setCursor(category, cursor);
		}
	};

	// Function to toggle modal window.
	var toggleModal = function(isVisible) {
		var visibility = "visible";
		if(!isVisible) {
			visibility = "collapse";
		}

		var modalBackground = $(modalBackgroundSelector);
		modalBackground.css("visibility", visibility);
		modalBackground.height($(document).height());
		$(modalWindowSelector).css("visibility", visibility); 
	};

	// Disable selection in order to support grab scrolling.
	$(groupSelector).each(function() {
		var stop = function() {
			return false;
		};

		this.onselectstart = stop; 
		this.onmousedown = stop; 
	});

	// Focus only the selected category.
	$(categorySelector).bind("mousedown touchstart", function(mde) {
		setFocus($(categorySelector).not(this), false);
		setFocus($(this), true);

		// Enable grab scrolling on desktop web browsers. 
		if(!isMobile) {
			var lastX = mde.pageX;
			$(this).mousemove(function(mme) {
				setCursor($(this), grabbingCursor);

				// Determine grab direction.
				var i = 30;
				if(mme.pageX > lastX) {
					i *= -1;
				}

				// Move the scroller.
				$(this).scrollLeft($(this).scrollLeft() + i); 
			
				// Remember last position.
				lastX = mme.pageX;
			});
		
			// Disable grab scrolling.
			$(this).bind("mouseup mouseleave", function() {
				setCursor($(this), grabCursor);
				$(this).unbind("mousemove");
			});
		}
	});

	// Show modal.
	$(aboutSelector).click(function(e) {
		// Prevent default link behaviour.
		e.preventDefault();
		toggleModal(true);
	});

	// Hide modal.
	$(modalClose).click(function(e) {
		toggleModal(false);
	});


	// Configuration on load. 
	$(groupDescriptionSelector).hide();
	$(categorySelector).scrollLeft(0);

	// Configuration for mobile web browsers.
	if(isMobile) {
		$(containerSelector).width("100%");
	}
});
