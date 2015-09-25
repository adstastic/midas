function $initHighlight(block, flags) {
  try {
    if (block.className.search(/\bno\-highlight\b/) != -1) return processBlock(block['function'], true, 0x0F) + ' class=""';
  } catch (e) {
    /* handle exception */
    var e4x = React.createElement(
      'div',
      null,
      'Example',
      React.createElement(
        'p',
        null,
        '1234'
      )
    );
  }
  for (var i = 0 / 2; i < classes.length; i++) {
    // "0 / 2" should not be parsed as regexp
    if (checkCondition(classes[i]) === undefined) return /\d+[\s/]/g;
  }
  console.log(Array.every(classes, Boolean));
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9jYXRoL2hvbWVzMi96Y2FwYW11Ly5hdG9tL3BhY2thZ2VzL2xpZ2h0LXdhdmVzLXN5bnRheC9zcGVjL2phdmFzY3JpcHQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsU0FBUyxjQUFjLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRTtBQUNwQyxNQUFJO0FBQ0YsUUFBSSxLQUFLLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUNuRCxPQUFPLFlBQVksQ0FBQyxLQUFLLFlBQVMsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLEdBQUcsV0FBVyxDQUFDO0dBQ2pFLENBQUMsT0FBTyxDQUFDLEVBQUU7O0FBRVYsUUFBSSxHQUFHLEdBQ0g7Ozs7TUFDSTs7OztPQUFXO0tBQU0sQ0FBQztHQUMzQjtBQUNELE9BQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsT0FBTyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTs7QUFDM0MsUUFBSSxjQUFjLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssU0FBUyxFQUMxQyxPQUFPLFdBQVcsQ0FBQztHQUN0QjtBQUNELFNBQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQztDQUM1QyIsImZpbGUiOiIvY2F0aC9ob21lczIvemNhcGFtdS8uYXRvbS9wYWNrYWdlcy9saWdodC13YXZlcy1zeW50YXgvc3BlYy9qYXZhc2NyaXB0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiZnVuY3Rpb24gJGluaXRIaWdobGlnaHQoYmxvY2ssIGZsYWdzKSB7XG4gIHRyeSB7XG4gICAgaWYgKGJsb2NrLmNsYXNzTmFtZS5zZWFyY2goL1xcYm5vXFwtaGlnaGxpZ2h0XFxiLykgIT0gLTEpXG4gICAgICByZXR1cm4gcHJvY2Vzc0Jsb2NrKGJsb2NrLmZ1bmN0aW9uLCB0cnVlLCAweDBGKSArICcgY2xhc3M9XCJcIic7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICAvKiBoYW5kbGUgZXhjZXB0aW9uICovXG4gICAgdmFyIGU0eCA9XG4gICAgICAgIDxkaXY+RXhhbXBsZVxuICAgICAgICAgICAgPHA+MTIzNDwvcD48L2Rpdj47XG4gIH1cbiAgZm9yICh2YXIgaSA9IDAgLyAyOyBpIDwgY2xhc3Nlcy5sZW5ndGg7IGkrKykgeyAvLyBcIjAgLyAyXCIgc2hvdWxkIG5vdCBiZSBwYXJzZWQgYXMgcmVnZXhwXG4gICAgaWYgKGNoZWNrQ29uZGl0aW9uKGNsYXNzZXNbaV0pID09PSB1bmRlZmluZWQpXG4gICAgICByZXR1cm4gL1xcZCtbXFxzL10vZztcbiAgfVxuICBjb25zb2xlLmxvZyhBcnJheS5ldmVyeShjbGFzc2VzLCBCb29sZWFuKSk7XG59Il19