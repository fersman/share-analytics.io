function animateValue(id, start, end, duration) {
	var range = end - start;
	var current = start;
	var increment = end > start? 1 : -1;
	var stepTime = Math.abs(Math.floor(duration / range));
	var obj = document.getElementById(id);
	var timer = setInterval(function() {
		if (current == end) {
			clearInterval(timer);
			obj.innerHTML = current;
			return
		}
		current += increment;
		obj.innerHTML = current;
	}, stepTime);
}
