var apiRecipe = '/api/labfnp/recipe/';
var recipeId = $('input[name="id"]').val();
var pieHeader = {
  "title": {
    "text": "",
    "fontSize": 24,
    "font": "open sans"
  },
  "subtitle": {
    "text": "",
    "color": "#999999",
    "fontSize": 12,
    "font": "open sans"
  },
  "titleSubtitlePadding": 9
};
var pieFooter = {
  "color": "#999999",
  "fontSize": 10,
  "font": "open sans",
  "location": "bottom-left"
};
var pieWidth = $('.col.col-md-12').width()*0.7 > 230 ? $('.col.col-md-12').width()*0.7 : 230;
var pieSize = {
  "canvasWidth": pieWidth,//230,
  "canvasHeight": pieWidth,//230,
  "pieOuterRadius": "75%"
};
var pieDate = {
  "sortOrder": "value-desc",
  "content": [],
  "labels": {
    "outer": {
      "pieDistance": 32
    },
    "inner": {
      "hideWhenLessThanPercentage": 3
    },
    "mainLabel": {
      "fontSize": 11
    },
    "percentage": {
      "color": "#ffffff",
      "decimalPlaces": 0
    },
    "value": {
      "color": "#adadad",
      "fontSize": 11
    },
    "lines": {
      "enabled": true
    },
    "truncation": {
      "enabled": true
    },
  },
  "effects": {
    "pullOutSegmentOnClick": {
      "effect": "elastic",
      "speed": 400,
      "size": 8
    }
  },
  "misc": {
    "gradient": {
      "enabled": true,
      "percentage": 100
    }
  },
};
var ajaxSuccess = function (result) {
  for (var i=0; i<result.data.formula.length; i++) {
    pieDate.content.push({
      label: result.data.formula[i].scent,
      value: parseInt(result.data.formula[i].drops),
      color: result.data.formula[i].color,
    });
  }
	var pie = new d3pie("pieChart", {
		"header": pieHeader,
		"footer": pieFooter,
		"size": pieSize,
		"data": pieDate,
	});
}; // end ajaxSuccess
var ajaxError = function (requestObject, error, errorThrown) {
  sweetAlert("錯誤", "目前無法取得此配方成份！", "error");
  console.log('[requestObject]=>', requestObject);
  console.log('[error]=>', errorThrown);
  console.log('[errorThrown]=>', error);
} // end ajaxError
$.get(apiRecipe + recipeId).done(ajaxSuccess).fail(ajaxError);
