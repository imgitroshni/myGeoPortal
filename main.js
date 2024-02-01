var googleLayerHybrid = new ol.layer.Tile({
  title: "Google Satellite & Roads",
  source: new ol.source.TileImage({
    url: "http://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}",
  }),
});

var osm = new ol.layer.Tile({
  source: new ol.source.OSM(),
});
var view = new ol.View({
  center: ol.proj.transform([80.01, 20.05], "EPSG:4326", "EPSG:3857"),
  zoom: 4.8,
});
var map = new ol.Map({
  layers: [],
  target: "map",
  view: view,
});
map.addLayer(googleLayerHybrid);

function Get(yourUrl) {
  var Httpreq = new XMLHttpRequest();
  Httpreq.open("GET", yourUrl, false);
  Httpreq.send();
  return Httpreq.responseText;
}

map.on("click", function (evt) {
  var viewResolution = view.getResolution();
  var layers = map.getLayers();
  var url = "";
  layers.forEach(function (layer, i, layers) {
    if (layer.getVisible()) {
      if (osm == layer || googleLayerHybrid == layer) {
      } else {
        url = layer
          .getSource()
          .getGetFeatureInfoUrl(evt.coordinate, viewResolution, "EPSG:3857", {
            INFO_FORMAT: "application/json",
          });
        var res = encodeURIComponent(url);
        var xx = layer.get("name");

        var status = Get("./php/check_data.php?TYPE=" + res);

        if (status == "1") {
          PopupCenter(
            "./php/attribute.php?TYPE=" + res + "&NAME=" + xx,
            0,
            "200",
            "200"
          );
        }
      }
    }
  });
});

function PopupCenter(url, title, w, h) {
  // Fixes dual-screen position                         Most browsers      Firefox
  var dualScreenLeft =
    window.screenLeft != undefined ? window.screenLeft : window.screenX;
  var dualScreenTop =
    window.screenTop != undefined ? window.screenTop : window.screenY;

  var width = window.innerWidth
    ? window.innerWidth
    : document.documentElement.clientWidth
    ? document.documentElement.clientWidth
    : screen.width;
  var height = window.innerHeight
    ? window.innerHeight
    : document.documentElement.clientHeight
    ? document.documentElement.clientHeight
    : screen.height;

  var left = width / 2 - w / 2 + dualScreenLeft;
  var top = height / 2 - h / 2 + dualScreenTop + title * 30;
  window.open(
    url,
    title,
    "scrollbars=yes, width=" +
      w +
      ", height=" +
      h +
      ", top=" +
      top +
      ", left=" +
      left
  );
}

//LEGEND
function myFunctionLigend() {
  document.getElementById("infoLigend").innerHTML = "";
  var Div_Legend = document.getElementById("style_Legend");
  Div_Legend.style.display = "none";
  var lay = map.getLayers();

  var url = "";
  lay.forEach(function (layer, i, lay) {
    if (layer.getVisible()) {
      if (osm == layer || layer == googleLayerHybrid) {
      } else {
        Div_Legend.style.display = "block";
        var xx = layer.get("name");

        var opacity = layer.getOpacity();
        opacity = opacity.toFixed(1);
        var vvv = opacity / 0.1;

        // document.getElementById("infoLigend").innerHTML += checkNameLigendNew(layer)+"<br><img src='http://localhost:8080/geoserver/wms?Service=WMS&REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=10&HEIGHT=10&legend_options=fontName:Times%20New%20Roman;fontAntiAliasing:true;fontColor:0x000033;fontSize:10;bgColor:0xFFFFEE;dpi:180&LAYER=NBSS_GeoServer:"+xx+"'><br>";

        document.getElementById("infoLigend").innerHTML =
          checkNameLigendNew(layer) +
          "<br><input class='slider' type='range' min='1' max='10' value=" +
          vvv +
          " id = " +
          xx +
          " onclick='sliderLisner(this.value,this.id)'><br><img src='http://localhost:8080/geoserver/wms?Service=WMS&REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=10&HEIGHT=10&legend_options=fontName:Times%20New%20Roman;fontAntiAliasing:true;fontColor:0x000033;fontSize:9;bgColor:0xFFFFEE;dpi:180&LAYER=NBSS_GeoServer:" +
          xx +
          "'><br>" +
          document.getElementById("infoLigend").innerHTML;
      }
    }
  });
}

function checkNameLigendNew(layerName) {
  layerName = layerName.get("name");
  return layerName;
}

function sliderLisner(val, layerN) {
  var lay = map.getLayers();
  lay.forEach(function (layer, i, lay) {
    var xx = layer.get("name");
    if (layerN == xx) {
      layer.setOpacity(val * 0.1);
    }
  });
  myFunctionLigend();
}

//====== Legend Mouse Move =============
var mousePositionLegend;
var offsetLegend = [0, 0];
var divLegend;
var isDownLegend = false;

divLegend = document.getElementById("style_Legend");
divLegend.addEventListener(
  "mousedown",
  function (e) {
    isDownLegend = true;
    offsetLegend = [
      divLegend.offsetLeft - e.clientX,
      divLegend.offsetTop - e.clientY,
    ];
  },
  true
);

document.addEventListener(
  "mouseup",
  function () {
    isDownLegend = false;
  },
  true
);

document.addEventListener(
  "mousemove",
  function (event) {
    event.preventDefault();
    if (isDownLegend) {
      mousePositionLegend = {
        x: event.clientX,
        y: event.clientY,
      };
      divLegend.style.left =
        mousePositionLegend.x + offsetLegend[0] - 16 + "px";
      divLegend.style.top = mousePositionLegend.y + offsetLegend[1] + "px";
    }
  },
  true
);

var Gaya_TMU = new ol.layer.Tile({
  source: new ol.source.TileWMS({
    url: "http://localhost:8080/geoserver/wms",
    params: { LAYERS: "NBSS_GeoServer:Gaya_TMU" },
  }),
});
Gaya_TMU.set("name", "Gaya_TMU");

var Gaya_Landform = new ol.layer.Tile({
  source: new ol.source.TileWMS({
    url: "http://localhost:8080/geoserver/wms",
    params: { LAYERS: "NBSS_GeoServer:Gaya_Landform" },
  }),
});
Gaya_Landform.set("name", "Gaya_Landform");

var Gaya_Landuse = new ol.layer.Tile({
  source: new ol.source.TileWMS({
    url: "http://localhost:8080/geoserver/wms",
    params: { LAYERS: "NBSS_GeoServer:Gaya_Landuse" },
  }),
});
Gaya_Landuse.set("name", "Gaya_Landuse");

var Gaya_Slope = new ol.layer.Tile({
  source: new ol.source.TileWMS({
    url: "http://localhost:8080/geoserver/wms",
    params: { LAYERS: "NBSS_GeoServer:Gaya_Slope" },
  }),
});
Gaya_Slope.set("name", "Gaya_Slope");

//FUNCTIONS

function Fun_Gaya_TMU() {
  var checkBox = document.getElementById("myCheck_Gaya");
  if (checkBox.checked == true) {
    map.addLayer(Gaya_TMU);

    map
      .getView()
      .setCenter(ol.proj.transform([85.28, 24.56], "EPSG:4326", "EPSG:3857"));
    map.getView().setZoom(12);
  } else {
    map.removeLayer(Gaya_TMU);
  }
  myFunctionLigend();
}
function Fun_Gaya_Landform() {
  var checkBox = document.getElementById("myCheck_Gaya_Landform");
  if (checkBox.checked == true) {
    map.addLayer(Gaya_Landform);

    map
      .getView()
      .setCenter(ol.proj.transform([85.28, 24.56], "EPSG:4326", "EPSG:3857"));
    map.getView().setZoom(12);
  } else {
    map.removeLayer(Gaya_Landform);
  }
  myFunctionLigend();
}

function Fun_Gaya_Landuse() {
  var checkBox = document.getElementById("myCheck_Gaya_Landuse");
  if (checkBox.checked == true) {
    map.addLayer(Gaya_Landuse);

    map
      .getView()
      .setCenter(ol.proj.transform([85.28, 24.56], "EPSG:4326", "EPSG:3857"));
    map.getView().setZoom(12);
  } else {
    map.removeLayer(Gaya_Landuse);
  }
  myFunctionLigend();
}

function Fun_Gaya_Slope() {
  var checkBox = document.getElementById("myCheck_Gaya_Slope");
  if (checkBox.checked == true) {
    map.addLayer(Gaya_Slope);

    //Gaya_Slope.getSource().updateParams({'cql_filter':"Slope='2'"});alert(1);

    map
      .getView()
      .setCenter(ol.proj.transform([85.28, 24.56], "EPSG:4326", "EPSG:3857"));
    map.getView().setZoom(12);
  } else {
    map.removeLayer(Gaya_Slope);
  }
  myFunctionLigend();
}

function Fun_Hybrid() {
  map.addLayer(googleLayerHybrid);

  map
    .getView()
    .setCenter(ol.proj.transform([80.01, 20.05], "EPSG:4326", "EPSG:3857"));
  map.getView().setZoom(4.8);
}

function Fun_Street() {
  map.addLayer(osm);

  map
    .getView()
    .setCenter(ol.proj.transform([80.01, 20.05], "EPSG:4326", "EPSG:3857"));
  map.getView().setZoom(4.8);
}

//START single layer olptions
let layerOption = [
  "Select Layer",
  "Gaya TMU",
  "Gaya Landform",
  "Gaya Landuse",
  "Gaya Slope",
];
let tmuLegends = [
  "B",
  "Bf",
  "G2f",
  "G2m",
  "G2Os",
  "G2T",
  "G3f",
  "G3Os",
  "G3P",
  "G3Pf",
  "G3T",
  "G4f",
  "G4Os",
  "G4P",
  "H4f",
  "H4F",
  "H4Os",
  "H5a",
  "H5F",
  "H5Os",
  "H6a",
  "H6F",
  "Hc",
  "Hf4a",
  "Hf4f",
  "Hf4F",
  "Hf4Os",
  "Hf4P",
  "Ht4Os",
  "PeL2a",
  "PeL2Os",
  "PeL3a",
  "PeL3f",
  "PeL3m",
  "PeL3Os",
  "PeL3P",
  "PeL3Pf",
  "PeL3T",
  "PeL4a",
  "PeL4Os",
  "PeU2a",
  "PeU2f",
  "PeU2Os",
  "PeU3a",
  "PeU3f",
  "PeU3F",
  "PeU3m",
  "PeU3Os",
  "PeU3Pf",
  "PeU4a",
  "PeU4f",
  "PeU4F",
  "PeU4Os",
  "PeU4P",
  "PeU4Pf",
  "Pt3F",
  "Pt3Os",
  "Pt4Os",
  "R",
  "Rh5Os",
  "Rh6Os",
  "Rh6P",
  "UUn2a",
  "UUn3a",
  "UUn4a",
  "UUn4Os",
  "Vb1f",
  "Vb1F",
  "Vb1Os",
  "Vb2a",
  "Vb2F",
  "Vb2Os",
  "Vb2Pf",
  "Vb3a",
  "Vb3f",
  "Vb3F",
  "Vb3Os",
  "Vb3Pf",
  "Vb4a",
  "Vb4f",
  "Vb4F",
  "Vb4Os",
  "Vb4Pf",
  "Vf2a",
  "Vf2Pf",
  "Vh3a",
  "Vh4F",
  "Vh4Os",
  "W",
  "W_Seasonal",
];
let landFormLegends = [
  "B",
  "Bf",
  "G2",
  "G3",
  "G4",
  "H4",
  "H5",
  "H6",
  "Hc",
  "Hf4",
  "Ht4",
  "PeL2",
  "PeL3",
  "PeL4",
  "PeU2",
  "PeU3",
  "PeU4",
  "Pt3",
  "Pt4",
  "R",
  "Rh5",
  "Rh6",
  "UUn2",
  "UUn3",
  "UUn4",
  "Vb1",
  "Vb2",
  "Vb3",
  "Vb4",
  "Vf2",
  "Vh3",
  "Vh4",
  "W",
  "W_Seasonal",
];
let landUseLegends = [
  "a",
  "B",
  "Bf",
  "f",
  "F",
  "HC",
  "m",
  "Os",
  "P",
  "Pf",
  "R",
  "T",
  "W",
  "W_Seasonal",
];
let slopeLegends = [
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "B",
  "Hc",
  "R",
  "W",
  "W_Seasonal",
];

let selectLayer = document.getElementById("selectLayer");
let selectAttribute = document.getElementById("selectAttribute");

layerOption.forEach(function addLayerOption(item) {
  let option = document.createElement("option");
  option.text = item;
  option.value = item;
  selectLayer.appendChild(option);
});

selectLayer.onchange = function () {
  selectAttribute.innerHTML = "<option></option>";
  if (this.value == "Gaya TMU") {
    addToSelectAttribute(tmuLegends);
  }
  if (this.value == "Gaya Landform") {
    addToSelectAttribute(landFormLegends);
  }
  if (this.value == "Gaya Landuse") {
    addToSelectAttribute(landUseLegends);
  }
  if (this.value == "Gaya Slope") {
    addToSelectAttribute(slopeLegends);
  }
};

function addToSelectAttribute(arr) {
  arr.forEach(function (item) {
    let option = document.createElement("option");
    option.text = item;
    option.value = item;
    selectAttribute.appendChild(option);
  });
}

//END single layer olptions

//START multi layer olptions
let selectLayer2 = document.getElementById("selectLayer2");
let selectAttribute2 = document.getElementById("selectAttribute2");

layerOption.forEach(function addLayerOption(item) {
  let option = document.createElement("option");
  option.text = item;
  option.value = item;
  selectLayer2.appendChild(option);
});

selectLayer2.onchange = function () {
  selectAttribute2.innerHTML = "<option></option>";
  if (this.value == "Gaya TMU") {
    addToSelectAttribute2(tmuLegends);
  }
  if (this.value == "Gaya Landform") {
    addToSelectAttribute2(landFormLegends);
  }
  if (this.value == "Gaya Landuse") {
    addToSelectAttribute2(landUseLegends);
  }
  if (this.value == "Gaya Slope") {
    addToSelectAttribute2(slopeLegends);
  }
};

function addToSelectAttribute2(arr) {
  arr.forEach(function (item) {
    let option = document.createElement("option");
    option.text = item;
    option.value = item;
    selectAttribute2.appendChild(option);
  });
}
//END multi layer olptions

//START SINGLE LAYER QUERY

function singleQueryRun() {
  if (selectLayer.value == "Gaya TMU") {
    clearLayers();
    map.addLayer(Gaya_TMU);

    Gaya_TMU.getSource().updateParams({
      cql_filter: "TMUEdit2='" + selectAttribute.value + "'",
    });

    map
      .getView()
      .setCenter(ol.proj.transform([85.28, 24.56], "EPSG:4326", "EPSG:3857"));
    map.getView().setZoom(12);

    myFunctionLigend();
  }
  if (selectLayer.value == "Gaya Landform") {
    clearLayers();
    map.addLayer(Gaya_Landform);

    Gaya_Landform.getSource().updateParams({
      cql_filter: "Landform='" + selectAttribute.value + "'",
    });

    map
      .getView()
      .setCenter(ol.proj.transform([85.28, 24.56], "EPSG:4326", "EPSG:3857"));
    map.getView().setZoom(12);

    myFunctionLigend();
  }
  if (selectLayer.value == "Gaya Landuse") {
    clearLayers();
    map.addLayer(Gaya_Landuse);

    Gaya_Landuse.getSource().updateParams({
      cql_filter: "Landuse='" + selectAttribute.value + "'",
    });

    map
      .getView()
      .setCenter(ol.proj.transform([85.28, 24.56], "EPSG:4326", "EPSG:3857"));
    map.getView().setZoom(12);

    myFunctionLigend();
  }

  if (selectLayer.value == "Gaya Slope") {
    clearLayers();
    map.addLayer(Gaya_Slope);

    Gaya_Slope.getSource().updateParams({
      cql_filter: "Slope='" + selectAttribute.value + "'",
    });

    map
      .getView()
      .setCenter(ol.proj.transform([85.28, 24.56], "EPSG:4326", "EPSG:3857"));
    map.getView().setZoom(12);

    myFunctionLigend();
  }
}

//END SINGLE LAYER QUERY

//START MULTi LAYER QUERY

function multiQueryRun() {
  if (selectLayer2.value == "Gaya TMU") {
    map.removeLayer(Gaya_TMU);
    map.addLayer(Gaya_TMU);

    Gaya_TMU.getSource().updateParams({
      cql_filter: "TMUEdit2='" + selectAttribute2.value + "'",
    });

    map
      .getView()
      .setCenter(ol.proj.transform([85.28, 24.56], "EPSG:4326", "EPSG:3857"));
    map.getView().setZoom(12);

    myFunctionLigend();
  }
  if (selectLayer2.value == "Gaya Landform") {
    map.removeLayer(Gaya_Landform);
    map.addLayer(Gaya_Landform);

    Gaya_Landform.getSource().updateParams({
      cql_filter: "Landform='" + selectAttribute2.value + "'",
    });

    map
      .getView()
      .setCenter(ol.proj.transform([85.28, 24.56], "EPSG:4326", "EPSG:3857"));
    map.getView().setZoom(12);

    myFunctionLigend();
  }
  if (selectLayer2.value == "Gaya Landuse") {
    map.removeLayer(Gaya_Landuse);

    map.addLayer(Gaya_Landuse);

    Gaya_Landuse.getSource().updateParams({
      cql_filter: "Landuse='" + selectAttribute2.value + "'",
    });

    map
      .getView()
      .setCenter(ol.proj.transform([85.28, 24.56], "EPSG:4326", "EPSG:3857"));
    map.getView().setZoom(12);

    myFunctionLigend();
  }

  if (selectLayer2.value == "Gaya Slope") {
    map.removeLayer(Gaya_Slope);
    map.addLayer(Gaya_Slope);

    Gaya_Slope.getSource().updateParams({
      cql_filter: "Slope='" + selectAttribute2.value + "'",
    });

    map
      .getView()
      .setCenter(ol.proj.transform([85.28, 24.56], "EPSG:4326", "EPSG:3857"));
    map.getView().setZoom(12);

    myFunctionLigend();
  }
}

//END MULTi LAYER QUERY

function clearLayers() {
  map.removeLayer(Gaya_TMU);
  map.removeLayer(Gaya_Landform);
  map.removeLayer(Gaya_Landuse);
  map.removeLayer(Gaya_Slope);
  map.removeLayer(myFunctionLigend());

  Gaya_TMU.getSource().updateParams({ cql_filter: null });
}

const singleQueryContainer = document.querySelector("#attQueryDiv");
const multiQueryContainer = document.querySelector("#multiAttQueryDiv");
let isClick = true;
/* function singleQueryBoxShowOrHide(){
  if(isClick){
     singleQueryContainer.style.display = 'block';
     isClick = false;
  }
  else{
    singleQueryContainer.style.display = 'none';
    isClick = true;
  }
 
}

function MultiQueryBoxShowOrHide(){
  if(isClick){
     multiQueryContainer.style.display = 'block';
     
     isClick = false;
  }
  else{
    multiQueryContainer.style.display = 'none';
    isClick = true;
  }
 
} */

function singleQueryBoxShowOrHide() {
  if (isClick) {
    singleQueryContainer.style.display = "block";
    multiQueryContainer.style.display = "none";
    isClick = false;
  } else {
    singleQueryContainer.style.display = "none";
    isClick = true;
  }
}

function MultiQueryBoxShowOrHide() {
  if (isClick) {
    singleQueryContainer.style.display = "none";
    multiQueryContainer.style.display = "block";

    isClick = false;
  } else {
    multiQueryContainer.style.display = "none";
    isClick = true;
  }
}


const navbarContainer = document.querySelector("#navbar");

function navbarShowOrHide() {
  if (isClick) {
    navbarContainer.style.display = "none";

    isClick = false;
  } else {
    navbarContainer.style.display = "block";
    
    isClick = true;
  }
}