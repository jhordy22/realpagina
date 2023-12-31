;(function ($) {
  "use strict";

  var BASICSTAR = "<?xml version=\"1.0\" encoding=\"utf-8\"?>"+
                  "<svg version=\"1.1\""+
                        "xmlns=\"http://www.w3.org/2000/svg\""+
                        "viewBox=\"0 12.705 512 486.59\""+
                        "x=\"0px\" y=\"0px\""+
                        "xml:space=\"preserve\">"+
                    "<polygon "+
                              "points=\"256.814,12.705 317.205,198.566"+
                                      " 512.631,198.566 354.529,313.435 "+
                                      "414.918,499.295 256.814,384.427 "+
                                      "98.713,499.295 159.102,313.435 "+
                                      "1,198.566 196.426,198.566 \"/>"+
                  "</svg>";

  var DEFAULTS = {

    starWidth : "32px",
    normalFill: "gray",
    ratedFill : "#f39c12",
    numStars  : 5,
    maxValue  : 5,
    precision : 1,
    rating    : 0,
    fullStar  : false,
    halfStar  : false,
    readOnly  : false,
    spacing   : "0px",
    rtl       : false,
    multiColor: null,
    onInit    : null,
    onChange  : null,
    onSet     : null,
    starSvg   : null
  };

  var MULTICOLOR_OPTIONS = {

    startColor: "#c0392b", 
    endColor  : "#f1c40f"  
  };

  function isMobileBrowser () {
    var check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))check = true})(navigator.userAgent||navigator.vendor||window.opera);

    return check;
  }

  function checkPrecision (value, minValue, maxValue) {

    if (value === minValue) {

      value = minValue;
    }
    else if(value === maxValue) {

      value = maxValue;
    }

    return value;
  }

  function checkBounds (value, minValue, maxValue) {

    var isValid = value >= minValue && value <= maxValue;

    if(!isValid){

        throw Error("Invalid Rating, expected value between "+ minValue +
                    " and " + maxValue);
    }

    return value;
  }

  function isDefined(value) {

    return typeof value !== "undefined";
  }

  var hexRegex = /^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i;

  var hexToRGB = function (hex) {

    if (!hexRegex.test(hex)) {

      return null;
    }

    var hexValues = hexRegex.exec(hex),
        r = parseInt(hexValues[1], 16),
        g = parseInt(hexValues[2], 16),
        b = parseInt(hexValues[3], 16);

    return {r:r, g:g, b:b};
  };

  function getChannelValue(startVal, endVal, percent) {

    var newVal = (endVal - startVal)*(percent/100);

    newVal = Math.round(startVal + newVal).toString(16);

    if (newVal.length === 1) {

        newVal = "0" + newVal;
    }

    return newVal;
  }

  function getColor (startColor, endColor, percent) {

    if (!startColor || !endColor) {

      return null;
    }

    percent = isDefined(percent)? percent : 0;

    startColor = hexToRGB(startColor);
    endColor = hexToRGB(endColor);

    var r = getChannelValue(startColor.r, endColor.r, percent),
        b = getChannelValue(startColor.b, endColor.b, percent),
        g = getChannelValue(startColor.g, endColor.g, percent);

    return "#" + r + g + b;
  }

  function RateYo ($node, options) {

    this.node = $node.get(0);

    var that = this;

    $node.empty().addClass("jq-ry-container");

    var $groupWrapper = $("<div/>").addClass("jq-ry-group-wrapper")
                                   .appendTo($node);

    var $normalGroup = $("<div/>").addClass("jq-ry-normal-group")
                                  .addClass("jq-ry-group")
                                  .appendTo($groupWrapper);

    var $ratedGroup = $("<div/>").addClass("jq-ry-rated-group")
                                 .addClass("jq-ry-group")
                                 .appendTo($groupWrapper);
    var step, starWidth, percentOfStar, spacing,
        percentOfSpacing, containerWidth, minValue = 0;
    var currentRating = options.rating;

    var isInitialized = false;

    function showRating (ratingVal) {

      if (!isDefined(ratingVal)) {

        ratingVal = options.rating;
      }

      currentRating = ratingVal;

      var numStarsToShow = ratingVal/step;

      var percent = numStarsToShow*percentOfStar;

      if (numStarsToShow > 1) {

        percent += (Math.ceil(numStarsToShow) - 1)*percentOfSpacing;
      }

      setRatedFill(options.ratedFill);

      percent = options.rtl ? 100 - percent : percent;

      if (percent < 0) {

        percent = 0;
      } else if (percent > 100) {

        percent = 100;
      }

      $ratedGroup.css("width", percent + "%");
    }

    function setContainerWidth () {

      containerWidth = starWidth*options.numStars + spacing*(options.numStars - 1);

      percentOfStar = (starWidth/containerWidth)*100;

      percentOfSpacing = (spacing/containerWidth)*100;

      $node.width(containerWidth);

      showRating();
    }

    function setStarWidth (newWidth) {

      var starHeight = options.starWidth = newWidth;

      starWidth = window.parseFloat(options.starWidth.replace("px", ""));

      $normalGroup.find("svg")
                  .attr({width : options.starWidth,
                         height: starHeight});

      $ratedGroup.find("svg")
                 .attr({width : options.starWidth,
                        height: starHeight});

      setContainerWidth();

      return $node;
    }

    function setSpacing (newSpacing) {

      options.spacing = newSpacing;

      spacing = parseFloat(options.spacing.replace("px", ""));

      $normalGroup.find("svg:not(:first-child)")
                  .css({"margin-left": newSpacing});

      $ratedGroup.find("svg:not(:first-child)")
                 .css({"margin-left": newSpacing});

      setContainerWidth();

      return $node;
    }

    function setNormalFill (newFill) {

      options.normalFill = newFill;

      var $svgs = (options.rtl ? $ratedGroup : $normalGroup).find("svg");

      $svgs.attr({fill: options.normalFill});

      return $node;
    }

    var ratedFill = options.ratedFill;

    function setRatedFill (newFill) {

      if (options.multiColor) {

        var ratingDiff = currentRating - minValue,
            percentCovered = (ratingDiff/options.maxValue)*100;

        var colorOpts  = options.multiColor || {},
            startColor = colorOpts.startColor || MULTICOLOR_OPTIONS.startColor,
            endColor   = colorOpts.endColor || MULTICOLOR_OPTIONS.endColor;

        newFill = getColor(startColor, endColor, percentCovered);
      } else {

        ratedFill = newFill;
      }

      options.ratedFill = newFill;

      var $svgs = (options.rtl ? $normalGroup : $ratedGroup).find("svg");

      $svgs.attr({fill: options.ratedFill});

      return $node;
    }

    function setRtl (newValue) {

      newValue = !!newValue;

      options.rtl = newValue;

      setNormalFill(options.normalFill);
      showRating();
    }

    function setMultiColor (colorOptions) {

      options.multiColor = colorOptions;

      setRatedFill(colorOptions ? colorOptions : ratedFill);
    }

    function setNumStars (newValue) {

      options.numStars = newValue;

      step = options.maxValue/options.numStars;

      $normalGroup.empty();
      $ratedGroup.empty();

      for (var i=0; i<options.numStars; i++) {

        $normalGroup.append($(options.starSvg || BASICSTAR));
        $ratedGroup.append($(options.starSvg || BASICSTAR));
      }

      setStarWidth(options.starWidth);
      setNormalFill(options.normalFill);
      setSpacing(options.spacing);

      showRating();

      return $node;
    }

    function setMaxValue (newValue) {

      options.maxValue = newValue;

      step = options.maxValue/options.numStars;

      if (options.rating > newValue) {

        setRating(newValue);
      }

      showRating();

      return $node;
    }

    function setPrecision (newValue) {

      options.precision = newValue;

      setRating(options.rating);

      return $node;
    }

    function setHalfStar (newValue) {

      options.halfStar = newValue;

      return $node;
    }

    function setFullStar (newValue) {

      options.fullStar = newValue;

      return $node;
    }

    function round (value) {

      var remainder = value%step,
          halfStep = step/2,
          isHalfStar = options.halfStar,
          isFullStar = options.fullStar;

      if (!isFullStar && !isHalfStar) {

        return value;
      }

      if (isFullStar || (isHalfStar && remainder > halfStep)) {

        value += step - remainder;
      } else {

        value = value - remainder;

        if (remainder > 0) {

          value += halfStep;
        }
      }

      return value;
    }

    function calculateRating (e) {

      var position = $normalGroup.offset(),
          nodeStartX = position.left,
          nodeEndX = nodeStartX + $normalGroup.width();

      var maxValue = options.maxValue;

      var pageX = e.pageX;

      var calculatedRating = 0;

      if(pageX < nodeStartX) {

        calculatedRating = minValue;
      }else if (pageX > nodeEndX) { 

        calculatedRating = maxValue;
      }else { 

        var calcPrcnt = ((pageX - nodeStartX)/(nodeEndX - nodeStartX));

        if (spacing > 0) {

          calcPrcnt *= 100;

          var remPrcnt = calcPrcnt;

          while (remPrcnt > 0) {

            if (remPrcnt > percentOfStar) {

              calculatedRating += step;
              remPrcnt -= (percentOfStar + percentOfSpacing);
            } else {

              calculatedRating += remPrcnt/percentOfStar*step;
              remPrcnt = 0;
            }
          }
        } else {

          calculatedRating = calcPrcnt * (options.maxValue);
        }

        calculatedRating = round(calculatedRating);
      }

      if (options.rtl) {

        calculatedRating = maxValue - calculatedRating;
      }

      return parseFloat(calculatedRating);
    }

    function setReadOnly (newValue) {

      options.readOnly = newValue;

      $node.attr("readonly", true);

      unbindEvents();

      if (!newValue) {

        $node.removeAttr("readonly");

        bindEvents();
      }

      return $node;
    }

    function setRating (newValue) {

      var rating = newValue;

      var maxValue = options.maxValue;

      if (typeof rating === "string") {

        if (rating[rating.length - 1] === "%") {

          rating = rating.substr(0, rating.length - 1);
          maxValue = 100;

          setMaxValue(maxValue);
        }

        rating = parseFloat(rating);
      }

      checkBounds(rating, minValue, maxValue);

      rating = parseFloat(rating.toFixed(options.precision));

      checkPrecision(parseFloat(rating), minValue, maxValue);

      options.rating = rating;

      showRating();

      if (isInitialized) {

        $node.trigger("rateyo.set", {rating: rating});
      }

      return $node;
    }

    function setOnInit (method) {

      options.onInit = method;

      return $node;
    }

    function setOnSet (method) {

      options.onSet = method;

      return $node;
    }

    function setOnChange (method) {

      options.onChange = method;

      return $node;
    }

    this.rating = function (newValue) {

      if (!isDefined(newValue)) {

        return options.rating;
      }

      setRating(newValue);

      return $node;
    };

    this.destroy = function () {

      if (!options.readOnly) {

        unbindEvents();
      }

      RateYo.prototype.collection = deleteInstance($node.get(0),
                                                   this.collection);

      $node.removeClass("jq-ry-container").children().remove();

      return $node;
    };

    this.method = function (methodName) {

      if (!methodName) {

        throw Error("Method name not specified!");
      }

      if (!isDefined(this[methodName])) {

        throw Error("Method " + methodName + " doesn't exist!");
      }

      var args = Array.prototype.slice.apply(arguments, []),
          params = args.slice(1),
          method = this[methodName];

      return method.apply(this, params);
    };

    this.option = function (optionName, param) {

      if (!isDefined(optionName)) {

        return options;
      }

      var method;

      switch (optionName) {

        case "starWidth":

          method = setStarWidth;
          break;
        case "numStars":

          method = setNumStars;
          break;
        case "normalFill":

          method = setNormalFill;
          break;
        case "ratedFill":

          method = setRatedFill;
          break;
        case "multiColor":

          method = setMultiColor;
          break;
        case "maxValue":

          method = setMaxValue;
          break;
        case "precision":

          method = setPrecision;
          break;
        case "rating":

          method = setRating;
          break;
        case "halfStar":

          method = setHalfStar;
          break;
        case "fullStar":

          method = setFullStar;
          break;
        case "readOnly":

          method = setReadOnly;
          break;
        case "spacing":

          method = setSpacing;
          break;
        case "rtl":

          method = setRtl;
          break;
        case "onInit":

          method = setOnInit;
          break;
        case "onSet":

          method = setOnSet;
          break;
        case "onChange":

          method = setOnChange;
          break;
        default:

          throw Error("No such option as " + optionName);
      }

      return isDefined(param) ? method(param) : options[optionName];
    };

    function onMouseEnter (e) {

      var rating = calculateRating(e).toFixed(options.precision);

      var maxValue = options.maxValue;

      rating = checkPrecision(parseFloat(rating), minValue, maxValue);

      showRating(rating);

      $node.trigger("rateyo.change", {rating: rating});
    }

    function onMouseLeave () {
      if (isMobileBrowser()) {
        return;
      }

      showRating();

      $node.trigger("rateyo.change", {rating: options.rating});
    }

    function onMouseClick (e) {

      var resultantRating = calculateRating(e).toFixed(options.precision);
      resultantRating = parseFloat(resultantRating);

      that.rating(resultantRating);
    }

    function onInit(e, data) {

      if(options.onInit && typeof options.onInit === "function") {

        options.onInit.apply(this, [data.rating, that]);
      }
    }

    function onChange (e, data) {

      if(options.onChange && typeof options.onChange === "function") {

        options.onChange.apply(this, [data.rating, that]);
      }
    }

    function onSet (e, data) {

      if(options.onSet && typeof options.onSet === "function") {

        options.onSet.apply(this, [data.rating, that]);
      }
    }

    function bindEvents () {

      $node.on("mousemove", onMouseEnter)
           .on("mouseenter", onMouseEnter)
           .on("mouseleave", onMouseLeave)
           .on("click", onMouseClick)
           .on("rateyo.init", onInit)
           .on("rateyo.change", onChange)
           .on("rateyo.set", onSet);
    }

    function unbindEvents () {

      $node.off("mousemove", onMouseEnter)
           .off("mouseenter", onMouseEnter)
           .off("mouseleave", onMouseLeave)
           .off("click", onMouseClick)
           .off("rateyo.init", onInit)
           .off("rateyo.change", onChange)
           .off("rateyo.set", onSet);
    }

    setNumStars(options.numStars);
    setReadOnly(options.readOnly);

    if (options.rtl) {

      setRtl(options.rtl);
    }

    this.collection.push(this);
    this.rating(options.rating, true);

    isInitialized = true;
    $node.trigger("rateyo.init", {rating: options.rating});
  }

  RateYo.prototype.collection = [];

  function getInstance (node, collection) {

    var instance;

    $.each(collection, function () {

      if(node === this.node){

        instance = this;
        return false;
      }
    });

    return instance;
  }

  function deleteInstance (node, collection) {

    $.each(collection, function (index) {

      if (node === this.node) {

        var firstPart = collection.slice(0, index),
            secondPart = collection.slice(index+1, collection.length);

        collection = firstPart.concat(secondPart);

        return false;
      }
    });

    return collection;
  }

  function _rateYo (options) {

    var rateYoInstances = RateYo.prototype.collection;

    var $nodes = $(this);

    if($nodes.length === 0) {

      return $nodes;
    }

    var args = Array.prototype.slice.apply(arguments, []);

    if (args.length === 0) {

      options = args[0] = {};
    }else if (args.length === 1 && typeof args[0] === "object") {

      options = args[0];
    }else if (args.length >= 1 && typeof args[0] === "string") {

      var methodName = args[0],
          params = args.slice(1);

      var result = [];

      $.each($nodes, function (i, node) {

        var existingInstance = getInstance(node, rateYoInstances);

        if(!existingInstance) {

          throw Error("Trying to set options before even initialization");
        }

        var method = existingInstance[methodName];

        if (!method) {

          throw Error("Method " + methodName + " does not exist!");
        }

        var returnVal = method.apply(existingInstance, params);

        result.push(returnVal);
      });

      result = result.length === 1? result[0]: result;

      return result;
    }else {

      throw Error("Invalid Arguments");
    }

    options = $.extend({}, DEFAULTS, options);

    return $.each($nodes, function () {

               var existingInstance = getInstance(this, rateYoInstances);

               if (existingInstance) {

                 return existingInstance;
               }

               var $node = $(this),
                   dataAttrs = {},
                   optionsCopy = $.extend({}, options);

               $.each($node.data(), function (key, value) {

                 if (key.indexOf("rateyo") !== 0) {

                   return;
                 }

                 var optionName = key.replace(/^rateyo/, "");

                 optionName = optionName[0].toLowerCase() + optionName.slice(1);

                 dataAttrs[optionName] = value;

                 delete optionsCopy[optionName];
               });

               return new RateYo($(this), $.extend({}, dataAttrs, optionsCopy));
           });
  }

  function rateYo () {

    return _rateYo.apply(this, Array.prototype.slice.apply(arguments, []));
  }

  window.RateYo = RateYo;
  $.fn.rateYo = rateYo;

}(window.jQuery));
