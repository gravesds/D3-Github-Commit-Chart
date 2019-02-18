var chart_data = [];

d3.csv("http://localhost:8000/commits.csv", function(d,i) { 
        return { row: i,
                 comm_date: new Date(d.date),
                 commits: +d.commits};
})
    .then( function(data) { 
        var rolledup = d3.nest()
                        .key( function(d) { 
                            var result = new Date(d.comm_date);
                            result.setDate(result.getDate() - d.comm_date.getDay());
                            return result; })
                        .key( function(d) { return d.comm_date.getDay(); })
                        //.key( function(d) { return d.comm_date; })
                        .rollup( function (v) { return d3.sum(v, function(d) { return d.commits; }); })
                        .entries(data);
        //rolledup.trythis = 1;
        chart_data = rolledup;

    })
    .catch( function(err) { console.log(err); });