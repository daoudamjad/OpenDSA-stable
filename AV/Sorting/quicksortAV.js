"use strict";
/*global alert: true, initArraySize, processArrayValues, reset */
(function ($) {
  var jsav;   // for JSAV library object

  // create a new settings panel and specify the link to show it
  var settings = new JSAV.utils.Settings($(".jsavsettings"));

  // Initialize the arraysize dropdown list
  initArraySize(5, 12, 8);

  // Process About button: Pop up a message with an Alert
  function about() {
    var mystring = "Quicksort Algorithm Visualization\nWritten by Daniel Breakiron\nCreated as part of the OpenDSA hypertextbook project.\nFor more information, see http://algoviz.org/OpenDSA\nWritten during Summer, 2012\nLast update: July, 2012\nJSAV library version " + JSAV.version();
    alert(mystring);
  }

  // Execute the "Run" button function
  function runIt() {
    var arrValues = processArrayValues();
    
    // If arrValues is null, the user gave us junk which they need to fix
    if (arrValues) {
      reset(true);
      jsav = new JSAV($('.avcontainer'));
      
      // Initialize the original array
      var arr = jsav.ds.array(arrValues, {indexed: true});
      jsav.displayInit();
      // BEGIN QUICKSORT IMPLEMENTATION

      // Save the left edge of the original array so sublists can be positioned relative to it
      leftEdge = parseFloat(arr.element.css("left"));

      var level = 1;
      var leftOffset = 0;
      quicksort(arr, level, leftOffset);

      // END QUICKSORT IMPLEMENTATION

      jsav.umsg("Done sorting!");
      jsav.recorded(); // mark the end
    }
  }

  // The space required for each row to be displayed
  var leftEdge = 0;

  function quicksort(arr, level, leftOffset)
  {
    var left = 0;
    var right = arr.size() - 1;

    // Correctly position the array
    setPosition(arr, level, leftOffset);

    jsav.umsg("Select the pivot");
    var pivotIndex = Math.floor((left + right) / 2);
    arr.highlightBlue(pivotIndex);
    jsav.step();

    jsav.umsg("Move the pivot to the end");
    arr.toggleArrow(right);
    jsav.step();
    arr.swap(pivotIndex, right);
    jsav.step();
    arr.toggleArrow(right);

    jsav.umsg("Partition the array");
    jsav.step();
    // finalPivotIndex will be the final position of the pivot
    var finalPivotIndex = partition(arr, left, right - 1, arr.value(right));

    arr.toggleArrow(finalPivotIndex);
    jsav.umsg("When the right bound is less than or equal to the left bound, all elements to the right of this element are less than the pivot and all elements to the right are greater than or equal to the pivot");
    jsav.step();
    arr.toggleArrow(finalPivotIndex);

    jsav.umsg("Move the pivot to its final location");
    arr.swap(finalPivotIndex, right);
    arr.markSorted(finalPivotIndex);
    jsav.step();

    // Create and display sub-arrays

    // Sort left partition
    var subArr1 = arr.slice(left, finalPivotIndex);
    if (subArr1.length === 1) {
      jsav.umsg("Left sublist contains a single element which means it is sorted");
      jsav.step();
      arr.markSorted(left);
    }
    else if (subArr1.length > 1) {
      var avSubArr1 = jsav.ds.array(subArr1, {indexed: true, center: false});
      jsav.umsg("Call quicksort on the left sublist");
      jsav.step();
      quicksort(avSubArr1, level + 1, leftOffset);
    }

    // Sort right partition
    var subArr2 = arr.slice(finalPivotIndex + 1, right + 1);
    if (subArr2.length === 1) {
      jsav.umsg("Right sublist contains a single element which means it is sorted");
      jsav.step();
      arr.markSorted(finalPivotIndex + 1);
    }
    else if (subArr2.length > 1) {
      var avSubArr2 = jsav.ds.array(subArr2, {indexed: true, center: false});
      jsav.umsg("Call quicksort on the right sublist");
      jsav.step();
      quicksort(avSubArr2, level + 1, leftOffset + finalPivotIndex + 1);
    }
  }

  function partition(arr, left, right, pivot) {
    var pivotIndex = right + 1;
    arr.setRightArrow(right);

    while (left <= right) {
      // Move the left bound inwards
      jsav.umsg("Move the left bound to the right until it reaches a value greater than or equal to the pivot");
      while (arr.value(left) < pivot) {
        arr.setLeftArrow(left);
        jsav.step();
        arr.clearLeftArrow(left);
        left++;
      }

      // Only highlight element at index left if it isn't the pivot
      if (left < pivotIndex) {
        arr.highlight(left);
      }
      arr.setLeftArrow(left);
      jsav.step();

      // Move the right bound inwards
      jsav.umsg("Move the right bound to the left until it reaches a value less than the pivot");
      arr.clearRightArrow(right);
      while ((right >= left) && (arr.value(right) >= pivot)) {
        arr.setRightArrow(right);
        jsav.step();
        arr.clearRightArrow(right);
        right--;
      }

      // Stop when all elements have been appropriately swapped
      if (left >= right) {
        if (left < pivotIndex) {
          arr.unhighlight(left);
        }
        arr.clearLeftArrow(left);
        break;
      }

      arr.highlight(right);
      arr.setRightArrow(right);
      jsav.step();

      // Swap highlighted elements
      jsav.umsg("Swap the selected values");
      arr.swap(left, right);
      jsav.step();
      arr.unhighlight([left, right]);
      arr.clearLeftArrow(left);
    }

    // Return first position in right partition
    return left;
  }

  /**
   * Calculates and sets the appropriate 'top' and 'left' CSS values based
   * on the specified array's level of recursion and number of blocks the array should be offset from the left
   *
   * arr - the JSAV array to set the 'top' and 'left' values for
   * level - the level of recursion, the full-size array is level 1
   * leftOffset - the number of blocks from the left the array should be positioned
   */
  function setPosition(arr, level, leftOffset) {
    var blockWidth = 46;
    var rowHeight = 80;
    var left = leftEdge + leftOffset * blockWidth;
    var top = rowHeight * (level - 1);

    // Set the top and left values so that all arrays are spaced properly
    arr.element.css({"left": left, "top": top});
  }

  // Connect action callbacks to the HTML entities
  $('#about').click(about);
  $('#run').click(runIt);
  $('#reset').click(reset);
}(jQuery));