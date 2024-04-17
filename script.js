const Stocks=['AAPL','MSFT','GOOGL','AMZN','PYPL','TSLA','JPM','NVDA','NFLX','DIS'];
let stocksstats;
let stockslistdiv=document.querySelector('#stockslistdiv');
let activeele='';
fetch('https://stocks3.onrender.com/api/stocks/getstockstatsdata')
.then((response)=>{
    if(!response.ok)
    {
        throw new Error('some error occured');
    }
    return response.json();
})
.then((result)=>{
    stocksstats=result['stocksStatsData'][0];
    console.log(stocksstats);
for(k of Stocks)
{
    let bookval=stocksstats[k]['bookValue'];
    let profit=stocksstats[k]['profit'];
    let color='red';
    if(profit>0)
    {
        color='green';
    }
    let html=`<div class="stocksrow">
        <button onclick="btnrenderdata(this.id)" id="${k}" class="buttonstyle" >${k}</button>
            &nbsp
            <span>$${bookval} </span>
            &nbsp&nbsp
            <span style="color:${color}">${profit}%</span>
        </div>`;
    stockslistdiv.insertAdjacentHTML('beforeEnd',html);
}
})
.catch((err)=>{
    console.log(err);
});
btnrenderdata('AAPL');
let y;
let x;
let xaxis;
let yaxis;
let l;
let t;
let maxIndex;
let maxDate;
let maxValue;
function btnrenderdata(ele)
{
    activeele=ele;
    fetch('https://stocks3.onrender.com/api/stocks/getstockstatsdata')
    .then((response)=>{
        if(!response.ok)
        {
            throw new Error('some error');
        }
        return response.json();
    })
    .then((res)=>{
        console.log(res);
        console.log('after res');
        let stocksdata=res['stocksStatsData'][0];
        document.querySelector('#stockbookvalue').innerHTML='$'+stocksdata[activeele]['bookValue'];
        document.querySelector('#stockprofit').innerHTML=stocksdata[activeele]['profit']+'%';
        document.querySelector('#stockcode').innerHTML=activeele;
    })
    .catch((error)=>{
        console.log(error);
    });

    fetch('https://stocks3.onrender.com/api/stocks/getstocksprofiledata')
    .then((response)=>{
        if(!response.ok)
        {
            throw new Error('get description error');
        }

        return response.json();
    })
    .then((res)=>{
        document.querySelector('#stockdescription').innerHTML=res['stocksProfileData'][0][activeele]['summary'];
    })
    .catch((error)=>{
        console.log(error);
    })

    fetch('https://stocks3.onrender.com/api/stocks/getstocksdata')
    .then((response)=>{
        if(!response.ok)
        {
            throw new Error('graph data error');
        }
        return response.json();
    })
    .then((res)=>{
        console.log('somewhere');
        console.log(res);
        y=res['stocksData'][0][activeele]['5y']['value'];
        x=res['stocksData'][0][activeele]['5y']['timeStamp'];
        console.log(y);
        console.log(x);
        var trace = {
            x: x,
            y: y,
            mode: 'lines',
            type: 'scatter',
            line:{
              color:'#00ff0c'
            }
          };

        var data = [trace];
        var config = {
            displayModeBar: false
          };
        var layout = {
            plot_bgcolor:'#2a33cf',
            paper_bgcolor:'#2a33cf',
            hovermode: 'x',
            xaxis: {
              showgrid: false,
              showticklabels:false,
              showline:false,
            },
            yaxis: {
              showgrid: false,
              showticklabels:false,
              showline:false
            }
        };
          
        Plotly.newPlot('graph', data,layout,config);

        maxIndex = y.indexOf(Math.max(...y));
        maxDate = x[maxIndex];
        maxValue = y[maxIndex];

        let gd=document.getElementById('graph');
//gd.update_xaxes(showgrid=False);
//gd.update_yaxes(visible=False, showticklabels=False);
        xaxis = gd._fullLayout.xaxis;
        yaxis = gd._fullLayout.yaxis;
        l = gd._fullLayout.margin.l;
        t = gd._fullLayout.margin.t;
    })
    .catch((error)=>{
        console.log(error);
    })
}

function rerendergraph(ele)
{
    fetch('https://stocks3.onrender.com/api/stocks/getstocksdata')
    .then((response)=>{
        if(!response.ok)
        {
            throw new Error('graph data error');
        }
        return response.json();
    })
    .then((res)=>{
        console.log('somewhere');
        console.log(res);
        y=res['stocksData'][0][activeele][ele.id]['value'];
        x=res['stocksData'][0][activeele][ele.id]['timeStamp'];
        console.log(y);
        console.log(x);
        var trace = {
            x: x,
            y: y,
            mode: 'lines',
            type: 'scatter',
            line:{
              color:'#00ff0c'
            }
          };

        var data = [trace];
        var config = {
            displayModeBar: false
          };
        var layout = {
            plot_bgcolor:'#2a33cf',
            paper_bgcolor:'#2a33cf',
            hovermode: 'x',
            xaxis: {
              showgrid: false,
              showticklabels:false,
              showline:false,
            },
            yaxis: {
              showgrid: false,
              showticklabels:false,
              showline:false
            }
        };
          
        Plotly.newPlot('graph', data,layout,config);

        maxIndex = y.indexOf(Math.max(...y));
        maxDate = x[maxIndex];
        maxValue = y[maxIndex];

        let gd=document.getElementById('graph');
//gd.update_xaxes(showgrid=False);
//gd.update_yaxes(visible=False, showticklabels=False);
        xaxis = gd._fullLayout.xaxis;
        yaxis = gd._fullLayout.yaxis;
        l = gd._fullLayout.margin.l;
        t = gd._fullLayout.margin.t;
    })
    .catch((error)=>{
        console.log(error);
    })   
}
let gd=document.getElementById('graph');
  gd.addEventListener('mousemove', function(evt) {
    var xInDataCoord = xaxis.p2c(evt.x - l);
    var yInDataCoord = yaxis.p2c(evt.y - t);
    let xValue=xInDataCoord;
    let yValue=yInDataCoord;
    var update = {
    shapes: [{
      type: 'line',
      x0: xValue,
      y0: 0,
      x1: xValue,
      y1: maxValue,
      line: {
        color: 'black',
        width: 1,
        dash: 'solid'
      }
    }]
  };

    //console.log(new Date(xValue * 1000).toLocaleDateString("en-US"));
  var annotation = {
    x: xValue,
    y: yValue,
    xref: 'x',
    yref: 'y',
    text:  activeele+' ' + yValue,
    font:{
        color:'white',
    },
    showarrow: false,
  };

  var annotation2 = {
    x: xValue,
    y: 0,
    xref: 'x',
    yref: 'y',
    text: new Date(xValue * 1000).toLocaleDateString("en-US"),
    font:{
    color:'white',
    },
    showarrow: false,
  };

    //Plotly.relayout(gd, 'title', ['x: ' + xInDataCoord, 'y : ' + yInDataCoord].join('<br>'));
    Plotly.relayout('graph', update);
    Plotly.relayout('graph', {annotations: [annotation,annotation2]});
  });

