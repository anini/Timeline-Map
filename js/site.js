function generateBarChart(id,data){

    var margin = {top: 0, right: 80, bottom: 30, left: 30},
        width = $(id).width() - margin.left - margin.right,
        height =  $(id).height() - margin.top - margin.bottom;

    var chart = d3.select(".chart")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var x = d3.scale.ordinal()
        .rangeRoundBands([0, width], .1);

    var y = d3.scale.linear()
        .range([height, 0]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .ticks(5);

    var yGrid = d3.svg.axis()
        .scale(y)
        .orient("left")
        .tickSize(-width, 0, 0)
        .tickFormat("")
        .ticks(5);

    var svg = d3.select(id).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
    var max = d3.max(data, function(d) { return d.refugee; });
    
    x.domain(data.map(function(d) {return formatDate(d.Date); }));
    y.domain([0, max]);
    xAxis.tickValues(["31 Mar","14 Apr", "28 Apr", "12 May","26 May","09 Jun","23 Jun","07 Jul","21 Jul","04 Aug","18 Aug","01 Sep","15 Sep","29 Sep","13 Oct","27 Oct","10 Nov","24 Nov","08 Dec","22 Dec","05 Jan","19 Jan","02 Feb","16 Feb"]);
    
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);
       
    svg.append("g")
        .attr("class", "grid")
        .call(yGrid);       

    svg.selectAll(".refugeebar")
        .data(data)
    .enter().append("rect")
        .attr("class", "refugeebar")
        .attr("x", function(d) { return x(formatDate(d.Date)); })
        .attr("width", x.rangeBand()/2)
        .attr("y", function(d) { return y(d.refugee); })
        .attr("height", function(d) {
           return height - y(d.refugee);});
           
    svg.selectAll(".idpbar")
        .data(data)
    .enter().append("rect")
        .attr("class", "idpbar")
        .attr("x", function(d) { return x(formatDate(d.Date))+x.rangeBand()/2; })
        .attr("width", x.rangeBand()/2)
        .attr("y", function(d) { return y(d.idp); })
        .attr("height", function(d) {
           return height - y(d.idp);});
          
    svg.selectAll(".current")
        .data(data)
    .enter().append("rect")
        .attr("class", "current")
        .attr("x", function(d) { return x(formatDate(d.Date)); })
        .attr("width", x.rangeBand())
        .attr("y", function(d) { return y(max); })
        .attr("height", function(d) {
           return height - y(max);})
        .attr("opacity",0)
        .attr("id",function(d,i){return "barSelect"+i;})
        .on("click",function(d,i){
            d3.select("#barSelect"+currentWeek).attr("opacity",0);
            currentWeek=i;
            d3.select("#barSelect"+currentWeek).attr("opacity",0.15);
            transitionMap();
        });
        
    var g = svg.append("g");
        
    g.append("rect")
        .attr("x", width-70)
        .attr("y", 10)
        .attr("width", 10)
        .attr("height", 10)
        .attr("fill","steelblue");

    g.append("rect")
        .attr("x", width-70)
        .attr("y", 30)
        .attr("width", 10)
        .attr("height", 10)
        .attr("fill","red");

    g.append("text")
        .attr("x",width-55)
        .attr("y",18)
        .text("Refugees")
        .attr("font-size","10px");

    g.append("text")
        .attr("x",width-55)
        .attr("y",38)
        .text("Internally Displaced Persons")
        .attr("font-size","10px");


}

function generateMap(){
    var margin = {top: 10, right: 10, bottom: 10, left: 10},
    width = $('#map').width() - margin.left - margin.right,
    height = 425;
   
    var projection = d3.geo.mercator()
        .center([40,34.4])
        .scale(3900);

    var svg = d3.select('#map').append("svg")
        .attr("width", width)
        .attr("height", height);

    var path = d3.geo.path()
        .projection(projection);

    var g = svg.append("g");    

    g.selectAll("path")
        .data(regions.features)
        .enter()
        .append("path")
        .attr("d", path)
        .attr("stroke",'#cccccc')
        .attr("fill",'#ffffff')
        .attr("opacity",1)
        .attr("id",function(d){
            return d.properties.PCODE;
        })
        .attr("class","region");


    var g = svg.append("g");
    
    g.selectAll("path")
        .data(syria.features)
        .enter()
        .append("path")
        .attr("d", path)
        .attr("stroke",'#aaaaaa')
        .attr("fill",'none')
        .attr("class","country");    
    
    var g = svg.append("g"); 
    /*
    g.selectAll("circles")
        .data(medical_centres_geo.features)
        .enter()
        .append("circle")
        .attr('cx',function(d){
                    var point = projection([ d.geometry.coordinates[0], d.geometry.coordinates[1] ]);
                    return point[0];
                })
        .attr('cy',function(d){
                    var point = projection([ d.geometry.coordinates[0], d.geometry.coordinates[1] ]);
                    return point[1];
                })
        .attr("r", 5)
        .attr("id",function(d){
                    return d.properties.ID;
        })
        .attr("class","medical_centres")
        .attr("fill",function(d){
            if(d.properties.Type1=="Transit Centre" || d.properties.Type1=="Holding Centre" ){
                return "green";
            }else{
                return "blue";
            }
                })
        .attr("opacity",0.7);        
    */
    
    
    var g = svg.append("g");
    /*
    g.append("text")
        .attr("x",0)
        .attr("y",30)
        .text("Relative importance of displacement")
        .attr("font-size","26px")
        .attr("font-weight","300")
        .attr("line-height","1.1");
    */
    g.append("rect")
        .attr("x", 1)
        .attr("y", 220)
        .attr("width", 10)
        .attr("height", 10)
        .attr("fill","#ffffff")
        .attr("stroke","#000000")
        .attr("stroke-width",1);

    g.append("text")
        .attr("x",15)
        .attr("y",228)
        .text("No reported displacement")
        .attr("font-size","10px");    
        
    g.append("rect")
        .attr("x", 0)
        .attr("y", 240)
        .attr("width", 10)
        .attr("height", 10)
        .attr("fill","#ffe082");

    g.append("text")
        .attr("x",15)
        .attr("y",248)
        .text(" % of population who left")
        .attr("font-size","10px");

    g.append("rect")
        .attr("x", 0)
        .attr("y", 260)
        .attr("width", 10)
        .attr("height", 10)
        .attr("fill","#ffbd13");

    g.append("text")
        .attr("x",15)
        .attr("y",268)
        .text("% of population who left")
        .attr("font-size","10px");

    g.append("rect")
        .attr("x", 0)
        .attr("y", 280)
        .attr("width", 10)
        .attr("height", 10)
        .attr("fill","#ff8053");

    g.append("text")
        .attr("x",15)
        .attr("y",288)
        .text("% of population who left")
        .attr("font-size","10px");

    g.append("rect")
        .attr("x", 0)
        .attr("y", 300)
        .attr("width", 10)
        .attr("height", 10)
        .attr("fill","#ff493d");

    g.append("text")
        .attr("x",15)
        .attr("y",308)
        .text("% of population who left")
        .attr("font-size","10px");
    /*
    g.append("circle")
        .attr("cx",5)
        .attr("cy",365)
        .attr("r",5)
        .attr("fill","green");

    g.append("text")
        .attr("x",15)
        .attr("y",368)
        .text("Referral Centre")
        .attr("font-size","10px");

    g.append("circle")
        .attr("cx",5)
        .attr("cy",345)
        .attr("r",5)
        .attr("fill","blue");

    g.append("text")
        .attr("x",15)
        .attr("y",348)
        .text("Treatment")
        .attr("font-size","10px");
    */
    var mapLabels = svg.append("g");    

    mapLabels.selectAll('text')
      .data(syria.features)
         .enter()
         .append("text")
         .attr("x", function(d,i){
                     return path.centroid(d)[0]-20;})
         .attr("y", function(d,i){
                     return path.centroid(d)[1];})
         .attr("dy", ".55em")
         .attr("class","maplabel")
         .style("font-size","15px")
         .attr("opacity",0.85)
         .text(function(d,i){
                      return d.properties.NAME_EN;
                  });

}

function transitionMap(){
    
    
    $('#week').html("<h3>As of " + mapSettings[currentWeek].Date + "</h3>");
    
    var projection = d3.geo.mercator()
        .center([mapSettings[currentWeek].lng,mapSettings[currentWeek].lat])
        .scale(mapSettings[currentWeek].scale);

    var path = d3.geo.path()
        .projection(projection);

    d3.selectAll('.country')
            .attr('d', path);
    
    d3.selectAll('.maplabel')
        .attr("x", function(d,i){
                     return path.centroid(d)[0]-20;})
        .attr("y", function(d,i){
                     return path.centroid(d)[1];});  
         
    d3.selectAll('.region').attr('d', path);
    
    var data = regionCases[currentWeek].Cases;
    data.forEach(function(element){
            d3.select("#"+element.Region.replace(/\s/g, ''))
                        .attr("fill",convertCasesToColor(element.Cases));
            });
}

function convertCasesToColor(cases){
    
    var colors = ["#ffffff","#ffe082","#ffbd13","#ff8053","#ff493d"];

    if(cases==0){
        c=0;
    } else if(cases<10){
        c=1;
    } else if(cases<100){
        c=2;
    } else if(cases<200){
        c=3;
    } else {
        c=4;
    };
    return colors[c];
}

function convertMedicalCentresToOpacity(open){
    if(open==1){
        return 0.75;
    } else {
        return 0;
    }
}

function formatDate(date){
    var month=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    return date.substring(0,2) + " " + month[parseInt((date.substring(3,5))-1)];
}

function formatDateYear(date){
    return date.substring(5,2) ;
}

function generatePyramid(){

     var margin = {top: 10, right: 10, bottom: 10, left: 10},
        width = $('#pyramid').width() - margin.left - margin.right,
        height = 425,
        barWidth = Math.floor(width / 19) - 1;
    
    var x = d3.scale.linear()
        .range([barWidth / 2, width - barWidth / 2]);

    var y = d3.scale.linear()
        .range([height, 0]);

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("right")
        .tickSize(-width)
        .tickFormat(function(d) { return Math.round(d / 1e6) + "M"; });

    // An SVG element with a bottom-right origin.
    var svg = d3.select("body").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // A sliding container to hold the bars by birthyear.
    var birthyears = svg.append("g")
        .attr("class", "birthyears");

    // A label for the current year.
    var title = svg.append("text")
        .attr("class", "title")
        .attr("dy", ".71em")
        .text(2000);

    d3.csv("./data/population.csv", function(error, data) {

      // Convert strings to numbers.
      data.forEach(function(d) {
        d.people = +d.people;
        d.date = +d.Date;
        d.age = +d.age;
      });

      // Compute the extent of the data set in age and years.
      var age1 = d3.max(data, function(d) { return d.age; }),
          year0 = d3.min(data, function(d) { return formatDateYear(d.Date); }),
          year1 = d3.max(data, function(d) { return formatDateYear(d.Date); }),
          year = year1;

      // Update the scale domains.
      x.domain([year1 - age1, year1]);
      y.domain([0, d3.max(data, function(d) { return d.people; })]);

      // Produce a map from year and birthyear to [male, female].
      data = d3.nest()
          .key(function(d) { return formatDateYear(d.Date); })
          .key(function(d) { return formatDateYear(d.Date) - d.age; })
          .rollup(function(v) { return v.map(function(d) { return d.people; }); })
          .map(data);

      // Add an axis to show the population values.
      svg.append("g")
          .attr("class", "y axis")
          .attr("transform", "translate(" + width + ",0)")
          .call(yAxis)
        .selectAll("g")
        .filter(function(value) { return !value; })
          .classed("zero", true);

      // Add labeled rects for each birthyear (so that no enter or exit is required).
      var birthyear = birthyears.selectAll(".birthyear")
          .data(d3.range(year0 - age1, year1 + 1, 5))
        .enter().append("g")
          .attr("class", "birthyear")
          .attr("transform", function(birthyear) { return "translate(" + x(birthyear) + ",0)"; });

      birthyear.selectAll("rect")
          .data(function(birthyear) { return data[year][birthyear] || [0, 0]; })
        .enter().append("rect")
          .attr("x", -barWidth / 2)
          .attr("width", barWidth)
          .attr("y", y)
          .attr("height", function(value) { return height - y(value); });

      // Add labels to show birthyear.
      birthyear.append("text")
          .attr("y", height - 4)
          .text(function(birthyear) { return birthyear; });

      // Add labels to show age (separate; not animated).
      svg.selectAll(".age")
          .data(d3.range(0, age1 + 1, 5))
        .enter().append("text")
          .attr("class", "age")
          .attr("x", function(age) { return x(year - age); })
          .attr("y", height + 4)
          .attr("dy", ".71em")
          .text(function(age) { return age; });
          
          
      function transitionPyramid() {
                if (!(year in data)) return;
                title.text(year);

                birthyears.transition()
                    .duration(750)
                    .attr("transform", "translate(" + (x(year1) - x(year)) + ",0)");

                birthyear.selectAll("rect")
                    .data(function(birthyear) { return data[year][birthyear] || [0, 0]; })
                  .transition()
                    .duration(750)
                    .attr("y", y)
                    .attr("height", function(value) { return height - y(value); });
        };

    });

} 




var currentWeek=0;
generateBarChart('#bar_chart',totalRefugeeIDP);
d3.select("#barSelect"+currentWeek).attr("opacity",0.15);
generateMap();
transitionMap();
generatePyramid();
transitionPyramid();

$(document).keydown(function(e) {
    switch(e.which) {
        case 37:
            d3.select("#barSelect"+currentWeek).attr("opacity",0);    
            currentWeek=currentWeek-1;
            if(currentWeek<0){currentWeek=0;}
            d3.select("#barSelect"+currentWeek).attr("opacity",0.15);
            transitionMap();
            transitionPyramid();
            break;

        case 39:
            d3.select("#barSelect"+currentWeek).attr("opacity",0);    
            currentWeek=currentWeek+1;
            if(currentWeek>totalRefugeeIDP.length-1){
                currentWeek=totalRefugeeIDP.length-1;
            }
            d3.select("#barSelect"+currentWeek).attr("opacity",0.15); 
            transitionMap();
            transitionPyramid();
            break;

        default: return; // exit this handler for other keys
    }
    e.preventDefault(); // prevent the default action (scroll / move caret)
});

      // Allow the arrow keys to change the displayed year.
      /*
      window.focus();
      d3.select(window).on("keydown", function() {
        switch (d3.event.keyCode) {
          case 37: year = Math.max(year0, year - 10); break;
          case 39: year = Math.min(year1, year + 10); break;
        }
        update();
      });
      */


function autoAdvance(){
    d3.select("#barSelect"+currentWeek).attr("opacity",0);
    currentWeek=currentWeek+1;  
    if(currentWeek>totalRefugeeIDP.length-1){
        currentWeek=0;
     }
    d3.select("#barSelect"+currentWeek).attr("opacity",0.15); 
    transitionMap();
    transitionPyramid();
}

var playTimer;

$(".playPause").click(function(){  
    if($(".playPause").hasClass("paused")){
        playTimer = setInterval(function(){autoAdvance()}, 1000);
        $(".playPause").removeClass("paused");
        $(".playPause").addClass("playing");
    } else {
    clearInterval(playTimer);
        $(".playPause").removeClass("playing");
        $(".playPause").addClass("paused");
    }
})

// initiate autoplay on page load
$( document ).ready(function(){
    $(".playPause").trigger("click");
});